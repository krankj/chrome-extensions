const axios = require("axios");

exports.twitterSearchApi = () =>
  axios.create({
    baseURL:
      "https://api.twitter.com/2/tweets/search/recent?tweet.fields=author_id,created_at,public_metrics,source&expansions=attachments.media_keys&media.fields=url,height,width&query=from:SadhguruJV %23SadhguruQuotes -is:retweet has:hashtags",
    timeout: 1000,
    headers: {
      Authorization:
        "Bearer AAAAAAAAAAAAAAAAAAAAAGe9MgEAAAAAzHALa2rBRY95754h9RmeSQYNATw%3DCklMUtbV2CWhkwEqSeK12cmyIoqlmZFEpkEWZocfUId9VTALY9",
    },
  });
