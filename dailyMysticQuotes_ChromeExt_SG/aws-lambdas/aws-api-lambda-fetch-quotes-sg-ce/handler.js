const serverless = require("serverless-http");
const cors = require("cors");
const express = require("express");
const logger = require("log4js").getLogger();
logger.level = "debug";
const { readData } = require("./dynamo");
const app = express();
const fs = require("fs").promises;
const os = require("os");
const path = require("path");
const lockfile = require("proper-lockfile");

app.use(cors());
app.use(express.json());
app.disable("x-powered-by");

const LOCAL_CACHE_FILE_NAME = `${os.tmpdir()}${path.sep}quotesLocalFile.json`;

const fetchFromDb = async () => {
  try {
    logger.info("< Fetching latest quote from DB >");
    console.time("[DB_PULL]");
    const response = await readData(11111);
    logger.info("< Successfully fetched latest quote from DB >");
    console.timeEnd("[DB_PULL]");
    const data = response.Items[0];
    return data;
  } catch (e) {
    logger.error(
      "< Someting went wrong while running function 'fetchFromDb'. Error -> ",
      e
    );
  }
};

const fetchFromDbAndCacheLocally = async () => {
  try {
    const data = await fetchFromDb();
    data.isFile = true;
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
    process.exit(1);
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
      console.log("Error is", e);
      logger.warn("< !!! File contains empty / invalid data !!! >");
      const data = await fetchFromDb();
      if (data) return res.status(200).send({ data });
      else return res.status(500).send({ message: "Something went wrong" });
    }
    logger.info("< OK: Returning data from Local File Cache >");
    return res.status(200).send({ data: dataFromFile });
  } catch (e) {
    logger.error(
      "Something went wrong while reading data from file. Error: ",
      e
    );
    logger.warn("< Responding with data directly from db >");
    const data = await fetchFromDb();
    return res.status(200).send({ data });
  }
});

app.post("/cacheQuoteLocally", async (req, res) => {
  await fs.writeFile(LOCAL_CACHE_FILE_NAME);
  lockfile
    .lock(LOCAL_CACHE_FILE_NAME)
    .then(async (release) => {
      try {
        await fetchFromDbAndCacheLocally();
        release();
      } catch (e) {
        console.log("Error is", e);
        logger.error("Something wrong occurred while caching file locally");
      }
    })
    .catch((e) => {
      console.error("Error occurred ->", e);
    });
  return res
    .status(200)
    .send({ ok: "Initiated request to cache data locally" });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

app.listen(9000);

module.exports.handler = serverless(app);
