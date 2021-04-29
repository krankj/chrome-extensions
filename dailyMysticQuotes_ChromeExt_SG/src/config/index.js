import ip from "ip";

const config =
  process.env.NODE_ENV === "development"
    ? {
        API_ENDPOINT: `http://${ip.address()}:9000`,
        SG_PRIVATE_KEY: "sadhguru",
      }
    : {
        API_ENDPOINT: "https://sadhguru-backend.vercel.app",
        SG_PRIVATE_KEY: "$@dhGuRu",
      };

export default config;
