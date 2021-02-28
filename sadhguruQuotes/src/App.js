import React, { useEffect, useReducer } from "react";
import "./App.css";
import QuoteCard from "./QuoteCard";
import axios from "axios";
import ordinal from "date-and-time/plugin/ordinal";
import date from "date-and-time";

date.plugin(ordinal);
const datePattern = date.compile("MMMM DDD, YYYY");

const quoteReducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return { ...state, isLoading: true, isError: false };
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

const quoteInit = {
  quote: "Loading...",
  publishedDate: "2021-02-28",
  imageLink: "",
};

const QUOTE_KEY = "sg-quote";

function App() {
  const storedQuote = () => localStorage.getItem(QUOTE_KEY);

  const [quote, dispatchQuotes] = useReducer(
    quoteReducer,
    storedQuote() || quoteInit
  );

  useEffect(() => {
    console.log("Biggest quote is", quote);
  }, [quote]);

  useEffect(() => {
    const quoteObject = storedQuote();
    if (quoteObject) {
      setTimeout(
        () =>
          dispatchQuotes({ type: "SUCCESS", payload: JSON.parse(quoteObject) }),
        5000
      );
      return;
    }
    axios
      .get("https://sadhguru-backend.vercel.app/api/quotes/today")
      .then((response) => {
        localStorage.setItem(
          QUOTE_KEY,
          JSON.parseJSON.stringify(response.data.data)
        );
        dispatchQuotes({ type: "SUCCESS", payload: response.data.data });
      })
      .catch((e) => dispatchQuotes({ type: "FAILED" }));
  }, []);

  return (
    <div className="container">
      <div className="app">
        <QuoteCard
          publishedDate={date.format(
            new Date(quote.publishedDate),
            datePattern
          )}
          quoteImage={quote.imageLink}
        >
          {quote.quote}
        </QuoteCard>
      </div>
    </div>
  );
}

export default App;
