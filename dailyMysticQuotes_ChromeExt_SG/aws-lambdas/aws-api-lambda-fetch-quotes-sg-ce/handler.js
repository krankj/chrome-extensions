const serverless = require("serverless-http");
const express = require("express");
const { readData } = require("./dynamo");
const app = express();

app.use(express.json());
app.disable("x-powered-by");

app.get("/quotes", async (req, res, next) => {
  const data = await readData(11111);
  return res.status(200).send({
    data: data.Items[0],
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
