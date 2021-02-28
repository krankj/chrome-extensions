import React, { useEffect, useReducer } from "react";
import "./App.css";
import QuoteCard from "./QuoteCard";
import axios from "axios";

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
      .get("http://localhost:9000/api/quotes/today")
      .then((response) =>
        dispatchQuotes({ type: "SUCCESS", payload: response.data.data })
      )
      .catch((e) => dispatchQuotes({ type: "FAILED" }));
  }, []);

  return (
    <div className="container">
      <div className="app">
        <QuoteCard
          publishedDate={quote.publishedDate}
          quoteImage={quote.quoteImage}
        >
          {quote.text}
        </QuoteCard>
      </div>
    </div>
  );
}

export default App;
