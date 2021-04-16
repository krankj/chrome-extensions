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

const getClientIp = async () =>
  await publicIp.v4({
    fallbackUrls: ["https://ifconfig.co/ip"],
  });

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
    const today = new Date();
    function triggerAutoAddOnServer() {
      console.log("< Triggered auto add >");
      authAxios
        .post("/api/quotes/autoAdd", null, { params: { last: 1 } })
        .catch((e) => {
          notifyError(
            `[${ErrorCodes.SERVER_ERROR_AUTO_ADD}] Server Error. If issue persists please contact us.`
          );
          console.error("Error occurred", e);
        })
        .finally(() => dispatchQuotes({ type: "INIT_FETCH" }));
    }
    authAxios
      .get("/api/quotes/exists", {
        params: { date: today.toISOString().split("T")[0] },
      })
      .then(() => {
        console.log("< Latest quote already exists in db >");
        dispatchQuotes({ type: "INIT_FETCH" });
      })
      .catch((e) => {
        if (e.response && e.response.status === 404) triggerAutoAddOnServer();
        else
          notifyError(
            `[${ErrorCodes.SERVER_ERROR_CHECK_IF_EXISTS}] Server Error. If issue persists please contact us.`
          );
      });
  }

  useEffect(() => {
    if (quotesData.today) triggerDispatch();
  }, [quotesData.today]);

  useEffect(() => {
    // getClientIp().then((result) => console.log(`< Ip is ${result} >`));
    const today = new Date();
    if (quotesData.today.publishedDate) {
      const nextTriggerDate = new Date(quotesData.today.publishedDate);
      nextTriggerDate.setHours(nextTriggerDate.getHours() + 24);
      //Tweets are posted exactly at 2:45 GMT everyday, so we triggger an api call only after 2:45GMT the next day
      if (today.valueOf() <= nextTriggerDate.valueOf()) {
        return;
      }
    } else {
      console.log("< Local cache is empty / has invalid data >");
    }
    triggerFetchFromServer();
  }, [quotesData.today.publishedDate]);

  useEffect(() => {
    if (quote.isLoading) {
      async function fetchQuotes() {
        try {
          const latestQuote = authAxios.get("/api/quotes/latest");
          console.log("< Fetching latest quote and random quotes from db >");
          const quotesList = authAxios.get("/api/quotes/many?version=1.3");
          const [today, list] = await Promise.all([latestQuote, quotesList]);
          console.log(
            "< Updated local cache with latest quote and random quotes >"
          );
          setQuotesData({
            today: today.data.data,
            list: list.data.data,
          });
          notifySuccess("* New quote added *");
        } catch (e) {
          notifyError(
            `[${ErrorCodes.SERVER_ERROR_FETCH}] Server Error. If issue persists please contact us.`
          );
          console.error("Error is", e);
          dispatchQuotes({ type: "FAILED" });
        }
      }
      fetchQuotes();
    }
  }, [quote.isLoading, setQuotesData]);

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
