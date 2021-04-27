const logger = require("log4js").getLogger();
logger.level = "debug";
const CryptoJS = require("crypto-js");
const envConfig = require("./config/env.config");
const { twitterSearchApi } = require("./utils/authAxios");
const { getBiYear } = require("./utils/helpers");

const {
  insertData,
  readData,
  insertDataWithRandomQuotes,
} = require("./dynamo/dataOperations");

async function getQuotesFromTwitter(pastDays) {
  if (pastDays < 1 || pastDays > 7) {
    throw new Error("Invalid 'pastDays' supplied. Must be between 1 and 7");
  }
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

const checkIfValidFieldsExist = (quote) => {
  if (!quote.quote) {
    throw new Error("Quote data does not contian today's quote");
  }
  if (!quote.publishedDate || !Date.parse(quote.publishedDate)) {
    throw new Error(
      "Quote data does not contain published date / contains invalid date"
    );
  }
  if (!quote.imageLink) {
    throw new Error("Quote data does not contain image link");
  }
};

exports.fetchAndAdd = async () => {
  const last = 1;
  try {
    const quotes = await getQuotesFromTwitter(last);
    if (quotes) {
      logger.info("Retrieved quotes from twitter", quotes);
      let latestQuote = quotes[0];
      checkIfValidFieldsExist(latestQuote);
      try {
        console.log("Latest quote is", latestQuote);
        let quote = await insertData(latestQuote);
        logger.info("Inserted latest quote to database: ", quote);
      } catch (e) {
        logger.error("CATCH ERROR Could not add latest quote", e);
      }
      try {
        let randomQuotes = await insertEncryptedRandomQuotes(latestQuote);
        logger.info("Inserted random quotes to databse: ", randomQuotes);
      } catch (e) {
        logger.error("Caught Error. Could not add random quotes", e);
      }
    } else {
      logger.warn("No quotes could be fetched from twitter");
    }
  } catch (e) {
    logger.error("Something went wrong while fetching quotes from Twitter", e);
  }
};

const insertEncryptedRandomQuotes = async (latestQuote) => {
  try {
    let today = new Date();
    let biYear = getBiYear(today);
    const quotesB1 = await readData(biYear);

    today.setMonth(today.getMonth() - 6);
    const quotesB2 = await readData(getBiYear(today));

    console.log("B1 Quotes are ", quotesB1.Items);

    console.log("B2 Quotes are ", quotesB2.Items);

    let quotes = [...quotesB1.Items, ...quotesB2.Items].splice(0, 200);

    console.log("Merged Quotes are", quotes);

    let privateKey = process.env[envConfig.envVars.SG_PRIVATE_KEY_VAR];
    var encryptedQuotes = CryptoJS.AES.encrypt(
      JSON.stringify(quotes),
      privateKey
    ).toString();
    encryptedQuotes = "Sudarshan";
    logger.info("Encrypted random quotes are: ", encryptedQuotes);
    let randomQuotes = await insertDataWithRandomQuotes(
      latestQuote,
      encryptedQuotes
    );
  } catch (e) {
    logger.error("Something went wrong while inserting random quotes", e);
  }
};
