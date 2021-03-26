import React, { useEffect, useRef, useState } from "react";
import ReactTooltip from "react-tooltip";
import "./ToggleSwitch.css";

const ToggleSwitch = ({ callback, initState }) => {
  const FETCH_RANDOM_QUOTE_KEY = "sg-fetch-random-quote";

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
    localStorage.setItem(FETCH_RANDOM_QUOTE_KEY, checked);
  }, [checked]);

  return (
    <>
      <label
        data-tip="Turn this on to get random quotes on every new tab"
        className="switch"
      >
        <input
          data-tip="hello world"
          type="checkbox"
          checked={checked}
          onChange={handleChecked}
        />
        <span className="slider round"></span>
      </label>
      <ReactTooltip
        place="bottom"
        delayShow={100}
        textColor="#f9f5ee"
        backgroundColor="rgb(138, 70, 6)"
      />
    </>
  );
};

export default ToggleSwitch;
