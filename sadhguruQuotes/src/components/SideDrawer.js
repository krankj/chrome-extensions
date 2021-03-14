import React from "react";
import "./SideDrawer.css";
import classNames from "classnames";
import SocialIcons from "./SocialIcons";

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
        <button className="closebtn" onClick={handleDrawer}>
          &times;
        </button>
        <div
          key={isOpen}
          className={classNames("contactContainer", { hide: !isOpen })}
        >
          <h1>Made with love and grace by</h1>
          <p>Sudarshan K J</p>
          <p>kjsudi@gmail.com</p>
          <p>+919686678568</p>
          <SocialIcons />
        </div>
      </div>
    </div>
  );
};

export default SideDrawer;
