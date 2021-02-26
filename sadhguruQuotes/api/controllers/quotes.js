const logger = require("log4js").getLogger();
const Joi = require("joi");
logger.level = "debug";
const QuoteModel = require("../models/quoteModel");

const schema = Joi.object({
  quote: Joi.string().required(),
  publishedDate: Joi.date().required(),
  imageLink: Joi.string(),
  twitterLink: Joi.string(),
  category: Joi.string.required(),
});

exports.today = (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details });
  }
};

exports.range = (req, res) => {
  const { error } = schema.validate(req.body);
};

exports.insert = async (req, res) => {
  const quote = await QuoteModel.insert(req.body);
};
