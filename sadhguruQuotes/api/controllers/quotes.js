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

async function getQuoteFromTwitter() {
  try {
    const response = await twitterSearchApi().get();
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
        category: "",
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
  const quotes = await getQuoteFromTwitter();
  try {
    const quote = await QuoteModel.insert(quoteObj);
    return res.status(200).send({ data: quote });
  } catch (e) {
    return res.status(500).send({ error: "Error occurred: " + e });
  }
};
