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
import { useChromeStorage, useSemiPersistentState } from "./hooks";
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
import { getVersion } from "./utils/chromeUtils";

// const getClientIp = async () =>
//   await publicIp.v4({
//     fallbackUrls: ["https://ifconfig.co/ip"],
//   });

// window.matchMedia("(prefers-color-scheme: dark)");

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

  // console.log(
  //   "Quotes meta data is",
  //   quotesMetaData.then((r) => console.log("Result is", r))
  // );

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
    today.setMinutes(today.getMinutes() - 165);
    /*toISOString() automatically takes care of converting time to UTC. 165 (2h45m) is subtracted since every day quotes are added at 2:45UTC
    This will make sure that the client asks for the latest quote only when it is the right time for it. Otherwise, if anyone would install in those 2:45 mins span would
    unnecessarily trigger this autoAdd api since the client would not have accounted for these 165 mins, although it takes care of converting time to UTC.*/
    function triggerAutoAddOnServer() {
      console.log("< Triggered auto add >");
      authAxios
        .post("/api/quotes/autoAdd", null, { params: { last: 1 } })
        .catch((e) => {
          if (e.response && e.response.status === 409) {
            console.log(
              "< Auto add was not performed since latest quote had already been added > "
            );
          } else {
            notifyError(
              `[${ErrorCodes.SERVER_ERROR_AUTO_ADD}] Server Error. If issue persists please contact us.`
            );
            console.error("Error occurred", e);
          }
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
    // getClientIp().then((result) => console.log(`< Ip is ${result} >`));
    (async () => {
      let { version } = await getVersion();
      setQuotesMetaData((prev) => {
        return { ...prev, version };
      });
    })();
    const today = new Date();
    if (quotesData.today.publishedDate) {
      const nextTriggerDate = new Date(quotesData.today.publishedDate);
      nextTriggerDate.setMinutes(
        nextTriggerDate.getMinutes() + config.ADD_MINS_TO_TRIGGER
      );
      if (today.valueOf() <= nextTriggerDate.valueOf()) {
        triggerDispatch();
        return;
      }
    } else console.log("< Local cache is empty / has invalid data >");

    triggerFetchFromServer();
  }, []);

  useEffect(() => {
    if (quote.isLoading) {
      async function fetchQuotes() {
        try {
          const latestQuote = authAxios.get("/api/quotes/latest");
          console.log("< Fetching latest quote and random quotes from db >");
          const quotesList = authAxios.get("/api/quotes/many", {
            params: { count: 200 },
          });
          const [today, list] = await Promise.all([latestQuote, quotesList]);
          console.log(
            "< Updated local cache with latest quote and random quotes >"
          );
          setQuotesData({
            today: today.data.data,
            list: list.data.data,
          });

          dispatchQuotes({ type: "SUCCESS", payload: today.data.data });
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

  const handleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
  }, [setIsDrawerOpen]);

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
            "Something unpleasant occurred. Hold tight while I make it pleasant"}
        </QuoteCard>

        <Controls
          randomQuoteDate={quote.publishedDate}
          onTodaysQuoteClick={handleTodaysQuoteClick}
          onRandomClick={handleRandomClick}
          metaData={quotesMetaData}
        />
        <SideDrawer
          version={quotesMetaData.version}
          isOpen={isDrawerOpen}
          handleDrawer={handleDrawer}
        />
        <Toast />
      </div>
    </div>
  );
}

export default App;
