import React from "react";
import axios from "axios";

const Quote = () => {
  const [data, setData] = React.useState("");
  React.useEffect(() => {
    axios
      .get("https://reqres.in/api/users?page=2")
      .then((response) => setData(response.data.data[0].first_name));
  }, []);

  return (
    <p>
      Science should be just a quest to know, not a tool for unbridled
      exploitation.
    </p>
  );
};

export default Quote;
