import React, { useCallback, useEffect, useState } from "react";
import { ReactComponent as Random } from "../assets/icons/refresh.svg";
import { ReactComponent as Today } from "../assets/icons/right-quote.svg";
import "./Controls.css";
import ReactTooltip from "react-tooltip";

const Controls = ({
  randomQuoteDate,
  onRandomClick,
  onTodaysQuoteClick,
  metaData,
}) => {
  const [showTodaysQuoteButton, setShowTodaysQuoteButton] = useState(false);
  const checkIfTTTobeShown = useCallback(() => metaData.clicks.today <= 5, [
    metaData,
  ]);
  const [showToolTip, setShowToolTip] = useState(() => checkIfTTTobeShown());
  const checkIfTodaysQuote = useCallback(() => {
    const today = new Date();
    const nextTriggerDate = new Date(randomQuoteDate);
    nextTriggerDate.setHours(nextTriggerDate.getHours() + 24);
    return today < nextTriggerDate;
  }, [randomQuoteDate]);

  useEffect(() => {
    checkIfTodaysQuote()
      ? setShowTodaysQuoteButton(false)
      : setShowTodaysQuoteButton(true);
    setShowToolTip(checkIfTTTobeShown());
  }, [checkIfTodaysQuote, checkIfTTTobeShown]);

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
