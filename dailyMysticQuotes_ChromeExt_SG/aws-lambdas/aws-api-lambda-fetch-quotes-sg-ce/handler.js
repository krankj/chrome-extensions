const serverless = require("serverless-http");
const cors = require("cors");
const express = require("express");
const { readData } = require("./dynamo");
const app = express();

app.use(cors());
app.use(express.json());
app.disable("x-powered-by");

app.get("/quotes", async (req, res, next) => {
  console.log("< Received read request >");
  try {
    const data = await readData(11111);
    console.log("< Sending data to client... >");
    return res.status(200).send({
      data: data.Items[0],
    });
  } catch (e) {
    console.error("Something went wrong while fetching data. Error: ", e);
    return res
      .status(500)
      .send({ error: "Something went wrong while fetching data from db" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
