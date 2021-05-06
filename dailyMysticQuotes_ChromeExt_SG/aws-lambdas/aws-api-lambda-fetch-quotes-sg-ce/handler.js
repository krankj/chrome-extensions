const serverless = require("serverless-http");
const cors = require("cors");
const express = require("express");
const logger = require("log4js").getLogger();
logger.level = "debug";
const { readData } = require("./dynamo");
const app = express();
const fs = require("fs").promises;

app.use(cors());
app.use(express.json());
app.disable("x-powered-by");

const LOCAL_CACHE_FILE_NAME = "quotesLocalFile.json";
const ADD_MINS_FOR_NEXT_TRIGGER = 1455;

const fetchFromDbAndCacheLocally = async () => {
  try {
    logger.info("< Fetching latest quote from DB >");
    console.time("[DB_PULL]");
    const response = await readData(11111);
    logger.info("< Successfully fetched latest quote from DB >");
    console.timeEnd("[DB_PULL]");
    const data = response.Items[0];
    logger.info("< Attempting to insert new data to file >");
    console.time("[FILE_WRITE]");
    await fs.writeFile(LOCAL_CACHE_FILE_NAME, JSON.stringify(data), "utf-8");
    logger.info("< Successfully inserted new data to file >");
    console.timeEnd("[FILE_WRITE]");
    return data;
  } catch (e) {
    logger.error(
      "< Someting went wrong while running function 'fetchFromDbAndCacheLocally'. Error -> ",
      e
    );
  }
};

app.get("/quotes", async (req, res, next) => {
  logger.info("< Received read request >");
  try {
    let dataFromFile = await fs.readFile(LOCAL_CACHE_FILE_NAME, "utf-8");
    try {
      if (!dataFromFile) throw new Error("< Empty file >");
      dataFromFile = JSON.parse(dataFromFile);
    } catch (e) {
      logger.warn("< !!! File contains empty / invalid data !!! >");
      const data = await fetchFromDbAndCacheLocally();
      logger.info("< OK: Returning data from DB >");
      return res.status(200).send({ data });
    }
    let now = new Date();
    let nextTriggerDate = new Date(dataFromFile.publishedDate);
    nextTriggerDate.setMinutes(
      nextTriggerDate.getMinutes() + ADD_MINS_FOR_NEXT_TRIGGER
    );
    if (now.valueOf() <= nextTriggerDate.valueOf()) {
      logger.info("< OK: Returning data from Local File Cache >");
      return res.status(200).send({ data: dataFromFile });
    } else {
      const data = await fetchFromDbAndCacheLocally();
      if (data) {
        logger.info("< OK: Returning NEW data from DB >");
        return res.status(200).send({ data });
      }
      return res.status(500).send({
        error: "Something went wrong while fetching new quote from db",
      });
    }
  } catch (e) {
    logger.error(
      "Something went wrong while reading data from file. Error: ",
      e
    );
    logger.warn("< Responding with data directly from db >");
    const response = await readData(11111);
    return res.status(200).send({ data: response.Items[0] });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

app.listen(9000);

module.exports.handler = serverless(app);
