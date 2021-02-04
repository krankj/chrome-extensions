import React from "react";
import axios from "axios";

const Heading = () => {
  const [data, setData] = React.useState("");
  React.useEffect(() => {
    axios
      .get("https://reqres.in/api/users?page=2")
      .then((response) => setData(response.data.data[0].first_name));
  }, []);
  return <h1>Heading Sudarshan: {data}</h1>;
};

export default Heading;
