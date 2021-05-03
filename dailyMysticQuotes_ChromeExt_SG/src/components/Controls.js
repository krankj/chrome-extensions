import React, { useCallback, useEffect, useState } from "react";
import { ReactComponent as Random } from "../assets/icons/randomQuoteIcon.svg";
import { ReactComponent as Today } from "../assets/icons/todayQuoteIcon.svg";
import "./Controls.css";

const Controls = ({ randomQuoteDate, onRandomClick, onTodaysQuoteClick }) => {
  const [disableTodaysQuoteButton, setDisableTodaysQuoteButton] = useState(
    false
  );

  const checkIfTodaysQuote = useCallback(() => {
    const today = new Date();
    const nextTriggerDate = new Date(randomQuoteDate);
    nextTriggerDate.setHours(nextTriggerDate.getHours() + 24);
    return today < nextTriggerDate;
  }, [randomQuoteDate]);

  useEffect(() => {
    checkIfTodaysQuote()
      ? setDisableTodaysQuoteButton(true)
      : setDisableTodaysQuoteButton(false);
  }, [checkIfTodaysQuote]);

  return (
    <div className="controlsContainer">
      <div
        className="randomButton"
        onClick={() => {
          setDisableTodaysQuoteButton(false);
          onRandomClick();
        }}
      >
        <Random className="randomIcon" />
        <span>Random quote</span>
      </div>
      <div
        className="todayButton"
        onClick={() => {
          setDisableTodaysQuoteButton(true);
          onTodaysQuoteClick();
        }}
      >
        <Today className="todayIcon" />
        <span>Todays quote</span>
      </div>
    </div>
  );
};

export default Controls;
