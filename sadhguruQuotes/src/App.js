import React, { useEffect, useReducer, useRef, useState } from "react";
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
import { getFromLocalCache, setToLocalCache } from "./utils/localstorage";

const getClientIp = async () =>
  await publicIp.v4({
    fallbackUrls: ["https://ifconfig.co/ip"],
  });

date.plugin(ordinal);
const datePattern = date.compile("MMMM DDD, YYYY");

const quoteInit = {
  quote: "",
  publishedDate: "",
  imageLink: "",
  isLoading: false,
  isError: false,
};

const quoteReducer = (state, action) => {
  switch (action.type) {
    case "INIT_FETCH":
      return { ...state, isLoading: true };
    case "SAVE":
      return { ...state, isLoading: false };
    case "SUCCESS":
      return {
        ...state,
        quote: action.payload.quote,
        publishedDate: action.payload.publishedDate,
        imageLink: action.payload.imageLink,
        isLoading: false,
      };
    case "FAILED":
      return { ...state, isLoading: false, isError: true };
    default:
      throw new Error("Invalid / No action type received");
  }
};

const QUOTE_KEY = "sg-quote";
const QUOTES_ARRAY_KEY = "sg-quotes-array";
const FETCH_RANDOM_QUOTE_KEY = "sg-fetch-random-quote";

const checkRandomQuotesCacheKey = () => {
  const key = getFromLocalCache(FETCH_RANDOM_QUOTE_KEY);
  if (key !== undefined) {
    return key;
  } else {
    localStorage.setItem(FETCH_RANDOM_QUOTE_KEY, false);
    return false;
  }
};

function App() {
  const storedQuote = () => getFromLocalCache(QUOTE_KEY);
  const storedRandomQuote = () => {
    let storedQuotes = getFromLocalCache(QUOTES_ARRAY_KEY);
    if (storedQuotes) {
      let lengthOfQuotesArray = storedQuotes.length;
      let random = Math.floor(Math.random() * lengthOfQuotesArray);
      return storedQuotes[random];
    } else {
      return storedQuote();
    }
  };
  const storedQuoteObj = storedQuote();
  const storedRandomQuoteVar = storedRandomQuote();
  const [quote, dispatchQuotes] = useReducer(quoteReducer, quoteInit);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showNewQuoteOnEveryLoad, setShowNewQuoteOnEveryLoad] = useState(() =>
    checkRandomQuotesCacheKey()
  );
  const fetchNewQuote = useRef(true);

  const handleToggleSwitch = (value) => {
    setShowNewQuoteOnEveryLoad(value);
    if (value) {
      dispatchQuotes({ type: "SUCCESS", payload: storedRandomQuoteVar });
    } else {
      dispatchQuotes({ type: "SUCCESS", payload: storedQuoteObj });
    }
  };

  useEffect(() => {
    getClientIp().then((result) => console.log(`< Ip is ${result} >`));

    //check if quote is outdated and if there exists new quote for today

    const today = new Date();
    function validateAndTriggerAutoAdd(today) {
      authAxios
        .get("/api/quotes/exists", {
          params: { date: today.toISOString().split("T")[0] },
        })
        .then(() => {
          console.log("< Latest quote already exists in db >");
          dispatchQuotes({ type: "INIT_FETCH" });
        })
        .catch((e) => {
          console.log("< Triggered auto add >");
          authAxios
            .post("/api/quotes/autoAdd", null, { params: { last: 1 } })
            .catch((e) => {
              console.error("Error occurred", e);
            })
            .finally(() => dispatchQuotes({ type: "INIT_FETCH" }));
        });
    }
    if (storedQuoteObj) {
      const nextTriggerDate = new Date(storedQuote().publishedDate);
      nextTriggerDate.setHours(nextTriggerDate.getHours() + 24); // 24 is added so that 1 day post the previous published date, we start triggering the auto add api
      //Tweets are posted exactly at 2:45 GMT. 2nd March 2:45 GMT tweet posted. Now it is, 2nd March 2:00 GMT ( or 6PM PST ). Current recorded tweet is 1st March 2:45 GMT.
      if (nextTriggerDate) {
        if (today.valueOf() <= nextTriggerDate.valueOf()) {
          if (showNewQuoteOnEveryLoad) {
            if (storedRandomQuote) {
              console.log("< Retrieving a random quote from cache >");
              dispatchQuotes({
                type: "SUCCESS",
                payload: storedRandomQuoteVar,
              });
            } else {
              dispatchQuotes({ type: "SUCCESS", payload: storedQuoteObj });
            }
          } else {
            console.log("< Retrieving latest quote from cache >");
            dispatchQuotes({ type: "SUCCESS", payload: storedQuoteObj });
          }
          fetchNewQuote.current = false;
          return;
        }
      }
    } else {
      console.log("< Local cache is empty >");
    }
    validateAndTriggerAutoAdd(today);
  }, []);

  useEffect(() => {
    if (quote.isLoading) {
      if (fetchNewQuote.current) {
        fetchNewQuote.current = false;
        console.log("< Fetching latest quote from db >");
        authAxios
          .get("/api/quotes/latest")
          .then((response) => {
            if (response.data.found) {
              setToLocalCache(QUOTE_KEY, response.data.data);
              console.log("< Updated local cache with the latest quote >");
              dispatchQuotes({
                type: "SUCCESS",
                payload: response.data.data,
              });
            }
          })
          .catch((e) => {
            console.error("Error is", e);
            dispatchQuotes({ type: "FAILED" });
          });
        console.log("< Fetching many other quotes from db >");
        authAxios
          .get("/api/quotes/many")
          .then((response) => {
            if (response.data.found) {
              setToLocalCache(QUOTES_ARRAY_KEY, response.data.data);
              console.log("< Updated local cache with last 50 quotes >");
            }
          })
          .catch((e) => {
            console.error("Error is", e);
          });
      }
      //else {
      //   authAxios
      //     .get("/api/quotes/random")
      //     .then((response) =>
      //       dispatchQuotes({ type: "SUCCESS", payload: response.data.data })
      //     )
      //     .catch((e) => console.log("Error occurred", e));
      // }
    }
  }, [quote.isLoading]);

  const handleRandomClick = () => {
    dispatchQuotes({ type: "SUCCESS", payload: storedRandomQuoteVar });
  };

  const handleTodaysQuoteClick = () => {
    dispatchQuotes({ type: "SUCCESS", payload: storedQuoteObj });
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
        initState={showNewQuoteOnEveryLoad}
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
          onTodaysQuoteClick={handleTodaysQuoteClick}
          onRandomClick={handleRandomClick}
        />
        <SideDrawer isOpen={isDrawerOpen} handleDrawer={handleDrawer} />
      </div>
    </div>
  );
}

export default App;
