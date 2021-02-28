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
      return { ...state, data: action.payload, isLoading: false };
    case "SUCCESS":
      return {
        ...state,
        text: action.payload.quote,
        publishedDate: action.payload.publishedDate,
        quoteImage: action.payload.imageLink,
        isLoading: false,
      };
    case "FAILED":
      return { ...state, isLoading: false, isError: true };
    default:
      throw new Error("Invalid / No action type received");
  }
};

function App() {
  const [quote, dispatchQuotes] = useReducer(quoteReducer, {
    text: "",
    publishedDate: "",
    quoteImage: "",
    isLoading: false,
    isError: false,
  });

  useEffect(() => {
    axios
      .get("https://sadhguru-backend.vercel.app/api/quotes/today")
      .then((response) =>
        dispatchQuotes({ type: "SUCCESS", payload: response.data.data })
      )
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
          quoteImage={quote.quoteImage}
        >
          {quote.text}
        </QuoteCard>
      </div>
    </div>
  );
}

export default App;
