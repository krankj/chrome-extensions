import React, { useEffect, useReducer } from "react";
import "./App.css";
import QuoteCard from "./QuoteCard";
import ordinal from "date-and-time/plugin/ordinal";
import date from "date-and-time";
import authAxios from "./utils/auth";

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

function storeLocally(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function App() {
  const storedQuote = () => JSON.parse(localStorage.getItem(QUOTE_KEY));
  const [quote, dispatchQuotes] = useReducer(quoteReducer, quoteInit);

  useEffect(() => {
    //check if quote is outdated and if there exists new quote for today
    const storedQuoteObj = storedQuote();
    const today = new Date();
    function validateAndTriggerAutoAdd(today) {
      authAxios
        .get("/api/quotes/exists", {
          params: { date: today.toISOString().split("T")[0] },
        })
        .then(() => {
          console.log("< Latest quote already exists >");
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
          dispatchQuotes({ type: "SUCCESS", payload: storedQuoteObj });
          return;
        }
      }
    }
    validateAndTriggerAutoAdd(today);
  }, []);

  useEffect(() => {
    if (quote.isLoading) {
      console.log("< Fetching latest quote from db >");
      authAxios
        .get("/api/quotes/latest")
        .then((response) => {
          if (response.data.found) {
            storeLocally(QUOTE_KEY, response.data.data);
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
    }
  }, [quote.isLoading]);

  const getPublishdedDate = () => {
    if (quote.isError) return "Infinity";
    if (quote.isLoading || !quote.publishedDate) return "Please wait...";
    const publishedDate = new Date(quote.publishedDate);
    const offset = publishedDate.getTimezoneOffset() / 60;
    publishedDate.setHours(publishedDate.getHours() + offset);
    return `${date.format(publishedDate, datePattern)}`;
  };

  return (
    <div className="container">
      <div className="app">
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
      </div>
    </div>
  );
}

export default App;
