import ip from "ip";

const config =
  process.env.NODE_ENV === "development"
    ? {
        API_ENDPOINT: `http://${ip.address()}:9000`,
        SG_PRIVATE_KEY: "sadhguru",
        //Tweets are posted exactly at 2:45 GMT everyday, so start trigggering an api call only after 2:45GMT the next day
        ADD_MINS_TO_TRIGGER: 1455,
      }
    : {
        API_ENDPOINT: "https://sadhguru-backend.vercel.app",
        SG_PRIVATE_KEY: "$@dhGuRu",
        ADD_MINS_TO_TRIGGER: 1455,
      };

export default config;
