import React, { useEffect, useState } from "react";
import { ReactComponent as Random } from "../assets/icons/refresh.svg";
import { ReactComponent as Today } from "../assets/icons/right-quote.svg";
import "./Controls.css";
import ReactTooltip from "react-tooltip";
import { getFromLocalCache, setToLocalCache } from "../utils/localstorage";

const TIMES_CLICKED_CACHE_KEY = "sg-tool-tips";

const Controls = ({ onRandomClick, onTodaysQuoteClick }) => {
  const [showTodaysQuoteButton, setShowTodaysQuoteButton] = useState(false);
  const [clickCount, setClickCount] = useState(
    getFromLocalCache(TIMES_CLICKED_CACHE_KEY) || { random: 0, today: 0 }
  );

  const checkIfTTTobeShown = () => {
    if (clickCount.today > 5) {
      return false;
    }
    return true;
  };

  const [showToolTip, setShowToolTip] = useState(() => checkIfTTTobeShown());

  const updateClicks = () => {
    setToLocalCache(TIMES_CLICKED_CACHE_KEY, clickCount);
  };

  useEffect(() => {
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
