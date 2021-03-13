import React, { useState } from "react";
import "./SideDrawer.css";
import classNames from "classnames";

const SideDrawer = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <span
        className="openButton"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        &#9776;
      </span>

      <div className={classNames("sidenav", { open: isOpen })}>
        <a
          className="closebtn"
          onClick={() => {
            console.log("Close button clicked");
            setIsOpen(false);
          }}
        >
          &times;
        </a>
        <a href="#">About</a>
        <a href="#">Services</a>
      </div>
    </div>
  );
};

export default SideDrawer;
