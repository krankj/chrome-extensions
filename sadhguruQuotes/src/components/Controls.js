import React, { useEffect, useState } from "react";
import { ReactComponent as Random } from "../assets/icons/refresh.svg";
import { ReactComponent as Today } from "../assets/icons/right-quote.svg";
import "./Controls.css";
import ReactTooltip from "react-tooltip";
import { getFromLocalCache, setToLocalCache } from "../utils/localstorage";
import keys from "../utils/keys";

const Controls = ({ randomQuoteDate, onRandomClick, onTodaysQuoteClick }) => {
  console.log("Random quote dat is", randomQuoteDate);
  const [showTodaysQuoteButton, setShowTodaysQuoteButton] = useState(false);
  const [clickCount, setClickCount] = useState(
    getFromLocalCache(keys.TIMES_CLICKED_CACHE_KEY) || { random: 0, today: 0 }
  );
  const today = new Date();
  const checkIfTodaysQuote = () => {
    const nextTriggerDate = new Date(randomQuoteDate);
    nextTriggerDate.setHours(nextTriggerDate.getHours() + 24);
    return today < nextTriggerDate;
  };

  const checkIfTTTobeShown = () => {
    if (clickCount.today > 5) {
      return false;
    }
    return true;
  };

  const [showToolTip, setShowToolTip] = useState(() => checkIfTTTobeShown());

  const updateClicks = () => {
    setToLocalCache(keys.TIMES_CLICKED_CACHE_KEY, clickCount);
  };

  useEffect(() => {
    checkIfTodaysQuote()
      ? setShowTodaysQuoteButton(false)
      : setShowTodaysQuoteButton(true);
    updateClicks();
    setShowToolTip(checkIfTTTobeShown());
  }, [clickCount]);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <div className="controlsContainer">
      <button
        data-for="controls"
        data-tip="Get a random quote"
        className="randomButton"
        onClick={() => {
          setShowTodaysQuoteButton(true);
          onRandomClick();
          setClickCount((prev) => {
            return { ...prev, random: prev.random + 1 };
          });
        }}
      >
        <Random className="randomIcon" />
      </button>

      {showTodaysQuoteButton && (
        <button
          data-for="controls"
          data-tip="Get Today's quote"
          className="todayButton"
          onClick={() => {
            setShowTodaysQuoteButton(false);
            onTodaysQuoteClick();
            setClickCount((prev) => {
              return { ...prev, today: prev.today + 1 };
            });
          }}
        >
          <Today className="todayIcon" />
        </button>
      )}
      <ReactTooltip
        id="controls"
        place="bottom"
        delayShow={100}
        textColor="#f9f5ee"
        backgroundColor="rgb(138, 70, 6)"
        disable={!showToolTip}
      />
    </div>
  );
};

export default Controls;
