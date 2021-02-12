import React from "react";
// import axios from "axios";
import sgSignature from "./assets/sg_signature.png";
import "./Quote.css";

const Quote = () => {
  // const [data, setData] = React.useState("");
  // React.useEffect(() => {
  //   axios
  //     .get("https://reqres.in/api/users?page=2")
  //     .then((response) => setData(response.data.data[0].first_name));
  // }, []);

  return (
    <div className="quoteContainer">
      <p className="quote">
        Science should be just a quest to know, not a tool for unbridled
        exploitation. Okay I get this and that and this and that
      </p>
      <img
        className="sg-signature"
        src={sgSignature}
        alt="Sadhguru Signature"
      />
    </div>
  );
};

export default Quote;
