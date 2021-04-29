/*global chrome*/
import React, { useCallback, useEffect, useReducer, useState } from "react";
import "./App.css";
import QuoteCard from "./components/QuoteCard";
import ordinal from "date-and-time/plugin/ordinal";
import date from "date-and-time";
import authAxios from "./utils/auth";
import Controls from "./components/Controls";
import publicIp from "public-ip";
import SideDrawer from "./components/SideDrawer";
import classNames from "classnames";
import ToggleSwitch from "./components/ToggleSwitch";
import { useSemiPersistentState } from "./hooks";
import keys from "./utils/keys";
import CryptoJS from "crypto-js";
import config from "./config";
import ErrorCodes from "./utils/errorCodes";
import { Toast, notifySuccess, notifyError } from "./components/Toast";
import "react-toastify/dist/ReactToastify.css";
import { quoteReducer } from "./reducers";
import {
  quoteInitSeedData,
  quotesDataSeedData,
  quotesMetaDataSeedData,
} from "./utils/seedData";
import { readData } from "./test";

// const getClientIp = async () =>
//   await publicIp.v4({
//     fallbackUrls: ["https://ifconfig.co/ip"],
//   });

date.plugin(ordinal);
const datePattern = date.compile("MMMM DDD, YYYY");

function App() {
  const [quote, dispatchQuotes] = useReducer(quoteReducer, quoteInitSeedData);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [quotesData, setQuotesData] = useSemiPersistentState(
    keys.SG_QUOTES_DATA_KEY,
    quotesDataSeedData
  );
  const [quotesMetaData, setQuotesMetaData] = useSemiPersistentState(
    keys.SG_QUOTES_METADATA_KEY,
    quotesMetaDataSeedData
  );

  const decryptQuotesList = useCallback((quotesList) => {
    const encryptedQuotes = quotesList;
    try {
      const bytes = CryptoJS.AES.decrypt(
        encryptedQuotes,
        config.SG_PRIVATE_KEY
      );
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch {
      console.log("< Check if a valid key is used >");
      console.log("< Triggering fetch from server >");
      triggerFetchFromServer();
      notifyError(
        `[${ErrorCodes.INVALID_KEY}] Try again in sometime. If issue persists please contact us.`
      );
      throw new Error("< Could not decrypt quotes >");
    }
  }, []);

  const getRandomQuote = (quotesList) => {
    const length = quotesList.length;
    const random = Math.floor(Math.random() * length);
    return quotesList[random];
  };

  const decryptAndDispatchRandomQuote = useCallback(() => {
    try {
      const quotes = decryptQuotesList(quotesData.list);
      const randomQuote = getRandomQuote(quotes);
      dispatchQuotes({ type: "SUCCESS", payload: randomQuote });
    } catch (e) {
      console.error("< Error while triggering disptach -> ", e);
    }
  }, [decryptQuotesList, quotesData.list]);

  const triggerDispatch = useCallback(() => {
    if (quotesMetaData.showRandomQuote) {
      console.log("< Retrieving a random quote from cache >");
      decryptAndDispatchRandomQuote();
    } else {
      console.log("< Retrieving latest quote from cache >");
      dispatchQuotes({ type: "SUCCESS", payload: quotesData.today });
    }
  }, [
    quotesMetaData.showRandomQuote,
    decryptAndDispatchRandomQuote,
    quotesData.today,
  ]);

  const handleToggleSwitch = useCallback(
    (value) => {
      setQuotesMetaData((prev) => {
        return { ...prev, showRandomQuote: value };
      });
    },
    [setQuotesMetaData]
  );

  function triggerFetchFromServer() {
    dispatchQuotes({ type: "INIT_FETCH" });
  }

  useEffect(() => {
    // getClientIp().then((result) => console.log(`< Ip is ${result} >`));
    const today = new Date();
    if (quotesData.today.publishedDate) {
      const nextTriggerDate = new Date(quotesData.today.publishedDate);
      nextTriggerDate.setMinutes(nextTriggerDate.getMinutes() + 1455); //24hr = 1440 + 15min(buffer)
      //Tweets are posted exactly at 2:45 GMT everyday, so we triggger an api call only after 2:45GMT the next day
      if (today.valueOf() <= nextTriggerDate.valueOf()) {
        console.log("Next trigger date is", nextTriggerDate);
        triggerDispatch();
        return;
      }
    } else console.log("< Local cache is empty / has invalid data >");

    console.log("triggering fetch from server");
    triggerFetchFromServer();
  }, []);

  useEffect(() => {
    if (quote.isLoading) {
      async function fetchQuotes() {
        try {
          console.log("< Fetching latest quote and random quotes from db >");
          console.time("dynamo");
          const response = await readData(11111);
          console.timeEnd("dynamo");
          const data = response.Items[0];
          const today = {
            imageLink: data.imageLink,
            twitterLink: data.twitterLink,
            quote: data.quote,
            publishedDate: data.publishedDate,
          };
          const random = data.randomQuotesList;
          console.log(
            "< Updated local cache with latest quote and random quotes >"
          );
          setQuotesData({
            today,
            list: random,
          });
          dispatchQuotes({ type: "SUCCESS", payload: today });
          notifySuccess("* New quote added *");
        } catch (e) {
          notifyError(
            `[${ErrorCodes.FETCH_ERROR}] Server Error. If issue persists please contact us.`
          );
          console.error("Error is", e);
          dispatchQuotes({ type: "FAILED" });
        }
      }
      fetchQuotes();
    }
  }, [quote.isLoading, setQuotesData]);

  // useEffect(() => {
  //   chrome && chrome.topSites.get((r) => console.log(r));
  // }, []);

  const handleRandomClick = () => {
    setQuotesMetaData((prev) => {
      return {
        ...prev,
        clicks: { today: prev.clicks.today, random: prev.clicks.random + 1 },
      };
    });
    decryptAndDispatchRandomQuote();
  };

  const handleTodaysQuoteClick = () => {
    setQuotesMetaData((prev) => {
      return {
        ...prev,
        clicks: { today: prev.clicks.today + 1, random: prev.clicks.random },
      };
    });
    dispatchQuotes({ type: "SUCCESS", payload: quotesData.today });
  };

  const getPublishdedDate = () => {
    if (quote.isError) return "Infinity";
    if (quote.isLoading || !quote.publishedDate) return "Please wait...";
    const publishedDate = new Date(quote.publishedDate);
    const offset = publishedDate.getTimezoneOffset() / 60;
    publishedDate.setHours(publishedDate.getHours() + offset);
    return `${date.format(publishedDate, datePattern)}`;
  };

  const handleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  return (
    <div className="container">
      <ToggleSwitch
        callback={handleToggleSwitch}
        initState={quotesMetaData.showRandomQuote}
      />
      <div className={classNames("app", { shrink: isDrawerOpen })}>
        <QuoteCard
          key={quote.quote}
          publishedDate={getPublishdedDate()}
          quoteImage={quote.imageLink}
        >
          {(quote.isLoading || !quote.quote) && !quote.isError
            ? "Loading..."
            : quote.quote}
          {quote.isError &&
            "There is nothing wrong or right. It's just something pleasant or unplesant that has occurred. Hold tight while I make it pleasant"}
        </QuoteCard>

        <Controls
          randomQuoteDate={quote.publishedDate}
          onTodaysQuoteClick={handleTodaysQuoteClick}
          onRandomClick={handleRandomClick}
          metaData={quotesMetaData}
        />
        <SideDrawer isOpen={isDrawerOpen} handleDrawer={handleDrawer} />
        <Toast />
      </div>
    </div>
  );
}

export default App;
