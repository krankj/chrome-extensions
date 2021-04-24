const axios = require("axios");

exports.twitterSearchApi = axios.create({
  baseURL:
    "https://api.twitter.com/2/tweets/search/recent?query=from:SadhguruJV %23SadhguruQuotes -is:retweet has:hashtags",
  timeout: 5000,
  headers: {
    Authorization:
      "Bearer AAAAAAAAAAAAAAAAAAAAAGe9MgEAAAAAzHALa2rBRY95754h9RmeSQYNATw%3DCklMUtbV2CWhkwEqSeK12cmyIoqlmZFEpkEWZocfUId9VTALY9",
  },
});
