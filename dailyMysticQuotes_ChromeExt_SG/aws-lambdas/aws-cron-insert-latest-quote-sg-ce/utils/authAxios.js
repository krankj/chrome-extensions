const axios = require("axios");
const config = require("../config/env.config");

exports.twitterSearchApi = axios.create({
  baseURL:
    "https://api.twitter.com/2/tweets/search/recent?query=from:SadhguruJV %23SadhguruQuotes -is:retweet has:hashtags",
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${
      process.env[config.envVars.SG_TWITTER_AUTH_KEY_VAR]
    }`,
  },
});
