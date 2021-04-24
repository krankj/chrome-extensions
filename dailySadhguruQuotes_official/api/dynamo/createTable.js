const { AWS, tableName } = require("./config");
var dynamodb = new AWS.DynamoDB();

var params = {
  TableName: tableName,
  KeySchema: [
    { AttributeName: "publishedDate", KeyType: "HASH" }, //Partition key
  ],
  AttributeDefinitions: [
    { AttributeName: "publishedDate", AttributeType: "S" },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
};

dynamodb.createTable(params, function (err, data) {
  if (err) {
    console.error(
      "Unable to create table. Error JSON:",
      JSON.stringify(err, null, 2)
    );
  } else {
    console.log(
      "Created table. Table description JSON:",
      JSON.stringify(data, null, 2)
    );
  }
});