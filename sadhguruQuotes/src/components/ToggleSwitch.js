import React from "react";
import "./ToggleSwitch.css";

const ToggleSwitch = (props) => (
  <>
    <label className="switch">
      <input type="checkbox" />
      <span className="slider round"></span>
    </label>
  </>
);

export default ToggleSwitch;
