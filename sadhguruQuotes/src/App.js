import React, { useEffect, useReducer } from "react";
import "./App.css";
import QuoteCard from "./QuoteCard";
import axios from "axios";
import ordinal from "date-and-time/plugin/ordinal";
import date from "date-and-time";

date.plugin(ordinal);
const datePattern = date.compile("MMMM DDD, YYYY");

const quoteInit = {
  quote: "",
  publishedDate: "",
  imageLink: "",
  isLoading: true,
  isError: false,
};

const quoteReducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return quoteInit;
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

function App() {
  const storedQuote = () => JSON.parse(localStorage.getItem(QUOTE_KEY));
  const [quote, dispatchQuotes] = useReducer(
    quoteReducer,
    storedQuote() || quoteInit
  );

  useEffect(() => {
    console.log("Changing quotes");
  }, [quote]);

  useEffect(() => {
    if (quote.isLoading) {
      setTimeout(
        () =>
          axios
            .get("https://sadhguru-backend.vercel.app/api/quotes/today")
            .then((response) => {
              // localStorage.setItem(
              //   QUOTE_KEY,
              //   JSON.stringify(response.data.data)
              // );
              dispatchQuotes({ type: "SUCCESS", payload: response.data.data });
            })
            .catch((e) => {
              console.error("Error is", e);
              dispatchQuotes({ type: "FAILED" });
            }),
        5000
      );
    }
  }, [quote.isLoading]);

  const getPublishdedDate = () => {
    if (quote.isLoading) return "Please wait";
    if (quote.isError)
      return "Something went wrong, but hey is there somehting like that?";
    const publishedDate = new Date(quote.publishedDate);
    const offset = publishedDate.getTimezoneOffset() / 60;
    publishedDate.setHours(publishedDate.getHours() + offset);
    return date.format(publishedDate, datePattern);
  };

  return (
    <div className="container">
      <div className="app">
        <QuoteCard
          key={quote.quote}
          publishedDate={getPublishdedDate()}
          quoteImage={quote.imageLink}
        >
          {quote.isLoading ? "Loading..." : quote.quote}
          {quote.isError &&
            "There is nothing wrong or right. It's just something pleasant or unplesant that has occurred. Hold tight while I make it plesant"}
        </QuoteCard>
      </div>
    </div>
  );
}

export default App;
