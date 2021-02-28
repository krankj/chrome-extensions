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

exports.today = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const quote = await QuoteModel.findByDate(today);
    if (quote) return res.status(200).send({ found: true, data: quote });
    else
      return res
        .status(200)
        .send({ found: false, data: "No quotes found for today" });
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
  today.setDate(today.getDate() - pastDays);
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
        publishedDate: element.created_at.split("T")[0],
      };
      return quoteObj;
    });
  } catch (error) {
    logger.error("Error occurred while contacting twitter api.", error);
  }
}

exports.autoAdd = async (req, res) => {
  const last = req.query.last;
  if (last > 7 || last < 1) {
    return res.status(400).send({ message: "Bad query parameter" });
  }
  const quotes = await getQuotesFromTwitter(last);
  try {
    await QuoteModel.insertMany(quotes);
    return res.status(200).send({ message: "Done" });
  } catch (e) {
    let failedCount = e.writeErrors.length;
    if (last - failedCount === 0) {
      return res
        .status(500)
        .send({ error: "Could not insert any of the quotes: " + e });
    } else {
      return res.status(206).send({
        error: "Few documents' insertion failed",
        failedDocs: failedCount,
      });
    }
  }
};
