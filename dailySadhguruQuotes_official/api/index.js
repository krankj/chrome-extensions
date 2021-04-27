const { fetchAndAdd } = require("./addToDb");
const logger = require("log4js").getLogger();
const { getBiYear } = require("./utils/helpers");
logger.level = "debug";
require("./services/init.service");

// logger.info("Adding latest quote");
// autoAdd();
// logger.info("Added latest quote");

(async function () {
  logger.info("MAIN...Fetching random quotes");
  await fetchAndAdd();
  logger.info("MAIN-END...Fetched random quotes");
})();
