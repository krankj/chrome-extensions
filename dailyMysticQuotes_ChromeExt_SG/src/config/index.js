import ip from "ip";

const config =
  process.env.NODE_ENV === "development"
    ? {
        API_ENDPOINT:
          "https://khu95sfrxj.execute-api.ap-south-1.amazonaws.com/dev",
        SG_PRIVATE_KEY: "$@dhGuRu",
      }
    : {
        API_ENDPOINT:
          "https://jsgtx9nk4a.execute-api.ap-south-1.amazonaws.com/dev",
        SG_PRIVATE_KEY: "$@dhGuRu",
      };

export default config;
