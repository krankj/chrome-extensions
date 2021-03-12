import React, { useState } from "react";
import { ReactComponent as Random } from "./assets/icons/refresh.svg";
import { ReactComponent as Today } from "./assets/icons/right-quote.svg";
import "./Controls.css";

const Controls = ({ onRandomClick, onTodaysQuoteClick }) => {
  const [showTodaysQuoteButton, setShowTodaysQuoteButton] = useState(false);

  return (
    <div className="controlsContainer">
      <button
        title="Get Random Quote"
        onClick={() => {
          setShowTodaysQuoteButton(true);
          onRandomClick();
        }}
      >
        <Random className="randomIcon" />
      </button>
      {showTodaysQuoteButton && (
        <button
          title="Get Today's quote"
          onClick={() => {
            setShowTodaysQuoteButton(false);
            onTodaysQuoteClick();
          }}
        >
          <Today className="todayIcon" />
        </button>
      )}
    </div>
  );
};

export default Controls;
