const { fetchAndAdd } = require("./addToDb");
const logger = require("log4js").getLogger();
logger.level = "debug";
require("./services/init.service");

(async function () {
  logger.info("[ ***INIT*** ]");
  await fetchAndAdd();
  logger.info("[ ***END*** ]");
})();
