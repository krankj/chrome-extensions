import ip from "ip";

const config =
  process.env.NODE_ENV === "development"
    ? { API_ENDPOINT: `http://${ip.address()}:9000` }
    : { API_ENDPOINT: "https://sadhguru-backend.vercel.app" };

export default config;
