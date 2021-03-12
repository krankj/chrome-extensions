import React from "react";
import sgSignature from "./assets/sg_signature.png";
import sgUnderline from "./assets/quote-beneath.png";
import SadhguruDefaultImage from "./assets/sadhguru.jpg";
import "./QuoteCard.css";

const QuoteCard = ({ publishedDate, quoteImage, children }) => {
  return (
    <div className="quoteCard">
      <p className="quoteDate">{publishedDate}</p>
      <img
        src={quoteImage}
        className="sg-image"
        alt="Sadhguru"
        onError={(e) => {
          e.target.src = SadhguruDefaultImage;
        }}
      />
      <div className="quoteTextContainer">
        <p className="quoteText">{children}</p>
      </div>
      <div className="signatureBox">
        <img
          className="sg-signature"
          src={sgSignature}
          alt="Sadhguru Signature"
        />
        <img
          className="sg-underline"
          src={sgUnderline}
          alt="Sadhguru Underline"
        />
      </div>
    </div>
  );
};

export default QuoteCard;
