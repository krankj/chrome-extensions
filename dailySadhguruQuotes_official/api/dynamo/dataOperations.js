const { AWS, tableName } = require("./config");
const logger = require("log4js").getLogger();
const { getBiYear } = require("../utils/helpers");
logger.level = "debug";

var docClient = new AWS.DynamoDB.DocumentClient();

function insert(params, type) {
  return new Promise((res, rej) => {
    docClient.put(params, function (err, data) {
      if (err) {
        logger.error(`[${type}] Could not add quote. Error -> ${err}`);
        rej(err);
      } else {
        res(data);
        logger.info(
          ` [${type}] Succesfully inserted data:`,
          data.publishedDate
        );
      }
    });
  });
}

exports.insertDataWithRandomQuotes = (quoteData, randomQuotesList) => {
  let params = {
    TableName: tableName,
    Item: {
      biYear: 11111,
      publishedDate: quoteData.publishedDate,
      imageLink: quoteData.imageLink,
      twitterLink: quoteData.twitterLink,
      quote: quoteData.quote,
      randomQuotesList,
    },
  };
  return insert(params, "BULK");
};

exports.insertData = (data) => {
  let biYear = getBiYear(data.publishedDate);
  let params = {
    TableName: tableName,
    Item: {
      biYear,
      publishedDate: data.publishedDate,
      imageLink: data.imageLink,
      twitterLink: data.twitterLink,
      quote: data.quote,
    },
    ConditionExpression: "biYear <> :b and publishedDate <> :p",
    ExpressionAttributeValues: {
      ":b": biYear,
      ":p": data.publishedDate,
    },
  };
  return insert(params, "DAILY");
};

exports.readData = (key) => {
  let params = {
    TableName: tableName,
    KeyConditionExpression: "biYear = :by",
    ExpressionAttributeValues: {
      ":by": key,
    },
  };
  return new Promise((res, rej) => {
    docClient.query(params, function (err, data) {
      if (err) {
        logger.error("Unable to read item. Error JSON:", JSON.stringify(err));
        rej(err);
      } else {
        res(data);
      }
    });
  });
};
