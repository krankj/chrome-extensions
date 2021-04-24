var { AWS, tableName } = require("./config");
var docClient = new AWS.DynamoDB.DocumentClient();

var params = {
  TableName: tableName,
};

docClient.scan(params, function (err, data) {
  if (err) {
    console.error(
      "Unable to read item. Error JSON:",
      JSON.stringify(err, null, 2)
    );
  } else {
    console.log("Read succeeded:", JSON.stringify(data, null, 2));
  }
});
