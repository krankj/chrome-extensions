import React, { Children } from "react";
// import axios from "axios";
import sgSignature from "./assets/sg_signature.png";
import SadhguruDefaultImage from "./assets/sadhguru.jpg";
import "./QuoteCard.css";

const QuoteCard = ({ publishedDate, quoteImage, children }) => {
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
      <div className="quoteTextContainer">
        <p className="quoteText">{children}</p>
        <img
          className="sg-signature"
          src={sgSignature}
          alt="Sadhguru Signature"
        />
      </div>
    </div>
  );
};

export default QuoteCard;
