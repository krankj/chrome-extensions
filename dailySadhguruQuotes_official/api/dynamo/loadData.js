const { AWS, tableName } = require("./config");
var fs = require("fs");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000",
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing data into DynamoDB. Please wait.");

var allQuotes = JSON.parse(fs.readFileSync("quoteData.json", "utf8"));
allQuotes.forEach(function (quote) {
  console.log("Adding quote for", quote.publishedDate);
  var params = {
    TableName: tableName,
    Item: {
      publishedDate: quote.publishedDate,
      imageLink: quote.imageLink,
      twitterLink: quote.twitterLink,
      quote: quote.quote,
    },
    ConditionExpression: "publishedDate <> :publishedDateVal",
    ExpressionAttributeValues: {
      ":publishedDateVal": quote.publishedDate,
    },
  };

  docClient.put(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to add quote for date",
        quote.publishedDate,
        ". Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("Succesfully added quote:", quote.publishedDate);
    }
  });
});
