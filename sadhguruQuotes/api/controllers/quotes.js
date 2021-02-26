const logger = require("log4js").getLogger();
const Joi = require("joi");
logger.level = "debug";
const QuoteModel = require("../models/quoteModel");

const schema = Joi.object({
  quote: Joi.string().required(),
  category: Joi.string(),
  publishedDate: Joi.date().required(),
  imageLink: Joi.string(),
  twitterLink: Joi.string(),
});

exports.today = (req, res) => {
  return res.status(200).send({ message: "ok" });
};

exports.range = (req, res) => {};

exports.insert = async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ error: "Bad request" });
  try {
    const quote = await QuoteModel.insert(req.body);
    return res.status(200).send({ data: quote });
  } catch (e) {
    return res.status(500).send({ error: "Error occurred" + e });
  }
};
