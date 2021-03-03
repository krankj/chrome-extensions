const config =
  process.env.NODE_ENV === "development"
    ? { API_ENDPOINT: "http://10.0.0.195:9000" }
    : { API_ENDPOINT: "https://sadhguru-backend.vercel.app" };

export default config;
