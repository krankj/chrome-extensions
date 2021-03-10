import React from "react";
// import axios from "axios";
import sgSignature from "./assets/sg_signature.png";
import sgUnderline from "./assets/quote-beneath.png";
import { ReactComponent as Random } from "./assets/icons/bell.svg";
import { ReactComponent as Today } from "./assets/icons/message.svg";
import SadhguruDefaultImage from "./assets/sadhguru.jpg";
import "./QuoteCard.css";

const QuoteCard = ({
  publishedDate,
  quoteImage,
  children,
  onRandomClick,
  onTodaysQuoteClick,
}) => {
  // const [data, setData] = React.useState("");
  // React.useEffect(() => {
  //   axios
  //     .get("https://reqres.in/api/users?page=2")
  //     .then((response) => setData(response.data.data[0].first_name));
  // }, []);

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
      <div className="controlsContainer">
        <button title="Get Random Quote" onClick={onRandomClick}>
          <Random className="randomIcon" />
        </button>
        <button title="Get Today's quote" onClick={onTodaysQuoteClick}>
          <Today className="todayIcon" />
        </button>
      </div>
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
