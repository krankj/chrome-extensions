import React from "react";
import "./SideDrawer.css";
import classNames from "classnames";
import SocialIcons from "./SocialIcons";
import { ReactComponent as ClockIcon } from "../assets/icons/timer.svg";
import { ReactComponent as InfoIcon } from "../assets/icons/information.svg";

const SideDrawer = React.memo(({ version, isOpen, handleDrawer }) => {
  return (
    <div>
      <span
        className={classNames("openButton", { hide: isOpen })}
        onClick={handleDrawer}
      >
        {/* &#9776; */}
        <InfoIcon className="infoIcon" />
      </span>
      <div className={classNames("sidenav", { open: isOpen })}>
        <div
          key={isOpen}
          className={classNames("contentContainer", { hide: !isOpen })}
        >
          <button className="closebtn" onClick={handleDrawer}>
            &times;
          </button>
          <div className="infoContainer">
            <ClockIcon className="icon" />
            <p>Quotes are updated everyday at 8:15 AM IST</p>
          </div>
          <div className="infoContainer">
            <h1>Tell your friends</h1>
          </div>
          <div className="infoContainer">
            <h1>Follow us on</h1>
            <SocialIcons />
          </div>
          <span className="version">v{version}</span>
        </div>
      </div>
    </div>
  );
});

export default SideDrawer;
