const logger = require("log4js").getLogger();
const Joi = require("joi");
logger.level = "debug";
const { twitterSearchApi } = require("../utils/authAxios");
const QuoteModel = require("../models/quoteModel");

const schema = Joi.object({
  quote: Joi.string().required(),
  category: Joi.string(),
  publishedDate: Joi.date().required(),
  imageLink: Joi.string(),
  twitterLink: Joi.string(),
});

exports.latest = async (req, res) => {
  try {
    const quote = await QuoteModel.findLatest();
    if (quote) return res.status(200).send({ found: true, data: quote });
    else return res.status(404).send({ found: false, data: "No quotes found" });
  } catch (e) {
    return res.status(500).send({ error: "Internal error" + e });
  }
};

exports.range = (req, res) => {};

exports.manualAdd = async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ error: "Bad request" });
  try {
    const quote = await QuoteModel.insert(req.body);
    return res.status(200).send({ data: quote });
  } catch (e) {
    return res.status(500).send({ error: "Error occurred" + e });
  }
};

async function getQuotesFromTwitter(pastDays) {
  const today = new Date();
  const offset = today.getTimezoneOffset() / 60;
  today.setDate(today.getDate() - pastDays);
  today.setHours(today.getHours() + offset);
  try {
    const response = await twitterSearchApi.get("", {
      params: {
        start_time: today,
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
    if (error.response.status === 400) {
      logger.error("Bad request was made to twitter api");
    } else {
      logger.error("Error occurred while contacting twitter api.", error);
    }
  }
}

exports.autoAdd = async (req, res) => {
  const last = req.query.last;
  if (!last) return res.status(400).send({ message: "No last date mentioned" });

  if (last > 7 || last < 1) {
    return res.status(400).send({ message: "Bad query parameter" });
  }
  try {
    const quotes = await getQuotesFromTwitter(last);
    if (quotes) {
      await QuoteModel.insertMany(quotes);
      return res.status(200).send({ message: "Done" });
    } else {
      return res
        .status(500)
        .send({ message: "No quotes could be fetched from twitter" });
    }
  } catch (e) {
    let failedCount = e.writeErrors.length;
    if (last - failedCount === 0) {
      return res
        .status(409)
        .send({ error: "Could not insert any of the quotes: " + e });
    } else {
      return res.status(206).send({
        error: "Few documents' insertion failed",
        failedDocs: failedCount,
      });
    }
  }
};
