const logger = require("log4js").getLogger();
logger.level = "debug";
const CryptoJS = require("crypto-js");
const envConfig = require("./config/env.config");
const { twitterSearchApi } = require("./utils/authAxios");

async function getQuotesFromTwitter(pastDays) {
  const startDateTime = new Date();
  startDateTime.setDate(startDateTime.getDate() - pastDays);

  try {
    const response = await twitterSearchApi.get("", {
      params: {
        start_time: startDateTime,
        "tweet.fields": "author_id,created_at,public_metrics,source",
        expansions: "attachments.media_keys",
        "media.fields": "url,height,width",
      },
    });
    const mainData = response.data.data;
    const includes = response.data.includes.media;
    return mainData.map((element) => {
      const found = includes.find(
        (ele) => element.attachments.media_keys[0] === ele.media_key
      );
      const split = element.text.split(" #SadhguruQuotes ");
      const text = split[0];
      const link = split[1];

      const quoteObj = {
        quote: text,
        twitterLink: link,
        imageLink: found.url || "Not found",
        publishedDate: element.created_at,
      };
      return quoteObj;
    });
  } catch (error) {
    logger.error("Error occurred while contacting twitter api.", error);
  }
}

exports.autoAdd = async () => {
  const last = 1;
  try {
    const quotes = await getQuotesFromTwitter(last);
    if (quotes) {
      logger.info("Retrieved quotes from twitter", quotes);
    } else {
      logger.warn("No quotes could be fetched from twitter");
    }
  } catch (e) {
    logger.error("Something went wrong while fetching quotes from Twitter");
  }
};

exports.getManyQuotes = async () => {
  let count = 200;
  try {
    // here I must be fetching all the quotes that are already stored
    const quotes = { something: 1 };
    let privateKey = process.env[envConfig.envVars.SG_PRIVATE_KEY_VAR];
    var encryptedQuotes = CryptoJS.AES.encrypt(
      JSON.stringify(quotes),
      privateKey
    ).toString();
    return encryptedQuotes;
  } catch (e) {
    logger.error("Something went wrong while fetching all quotes");
  }
};
