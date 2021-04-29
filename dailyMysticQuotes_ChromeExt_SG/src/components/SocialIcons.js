import React from "react";
import "./SocialIcons.css";
import FbIcon from "../assets/icons/facebook.png";
import InstaIcon from "../assets/icons/instagram.png";

const SocialIcons = () => (
  <div className="socialIcons">
    <a href="https://www.facebook.com/kjsudi" target="_blank" rel="noreferrer">
      <img src={FbIcon} alt="fbIcon" />
    </a>
    <a
      href="https://www.instagram.com/kay.jay.es/"
      target="_blank"
      rel="noreferrer"
    >
      <img src={InstaIcon} alt="instaIcon" />
    </a>
  </div>
);

export default SocialIcons;
