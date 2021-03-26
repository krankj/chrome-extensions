import React from "react";
import ReactTooltip from "react-tooltip";
import "./ToggleSwitch.css";

const ToggleSwitch = (props) => (
  <>
    <label
      data-tip="Turn this on to get random quotes on every new tab"
      className="switch"
    >
      <input data-tip="hello world" type="checkbox" />
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

export default ToggleSwitch;
