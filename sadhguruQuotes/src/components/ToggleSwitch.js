import React, { useEffect, useRef, useState } from "react";
import ReactTooltip from "react-tooltip";
import "./ToggleSwitch.css";
import keys from "../utils/keys";

const ToggleSwitch = ({ callback, initState }) => {
  const [checked, setChecked] = useState(initState);
  const handleChecked = (e) => {
    setChecked(e.target.checked);
  };
  const switchRef = useRef(true);

  useEffect(() => {
    if (switchRef.current) {
      switchRef.current = false;
      return;
    }
    callback(checked);
    localStorage.setItem(keys.FETCH_RANDOM_QUOTE_KEY, checked);
  }, [checked]);

  return (
    <>
      <label
        data-for="toggleSwitch"
        data-tip={
          !checked
            ? "Toggle on to get a random quote on every new tab"
            : "Toggle off to get today's quote on every new tab"
        }
        className="switch"
      >
        <input type="checkbox" checked={checked} onChange={handleChecked} />
        <span className="slider round"></span>
      </label>
      <ReactTooltip
        id="toggleSwitch"
        eventOff="click"
        place="bottom"
        delayShow={100}
        textColor="#f9f5ee"
        backgroundColor="rgb(138, 70, 6)"
      />
    </>
  );
};

export default ToggleSwitch;
