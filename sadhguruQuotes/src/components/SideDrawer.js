import React from "react";
import "./SideDrawer.css";
import classNames from "classnames";
import SocialIcons from "./SocialIcons";
import { ReactComponent as ClockIcon } from "../assets/icons/wall-clock.svg";
import { ReactComponent as ContentIcon } from "../assets/icons/content.svg";
import { ReactComponent as MadeIcon } from "../assets/icons/tools.svg";

const SideDrawer = ({ isOpen, handleDrawer }) => {
  return (
    <div>
      <span
        className={classNames("openButton", { hide: isOpen })}
        onClick={handleDrawer}
      >
        &#9776;
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
            <ContentIcon className="icon" />
            <p>
              All the content is proprietary of{" "}
              <a
                href="https://isha.sadhguru.org/in/en/wisdom/type/quotes"
                target="_blank"
                rel="noreferrer"
              >
                Isha Foundation
              </a>
            </p>
          </div>
          <div className="infoContainer">
            <MadeIcon className="icon" />
            <h1>Made with love and grace by</h1>
            <p>Sudarshan K J</p>
            <p>kjsudi@gmail.com</p>
            <p>+919686678568</p>
            <SocialIcons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideDrawer;
