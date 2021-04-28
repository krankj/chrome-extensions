"use strict";
const { fetchAndAdd } = require("./addToDb");
const logger = require("log4js").getLogger();
logger.level = "debug";
require("./services/init.service");

module.exports.run = async (event, context) => {
  const time = new Date();
  logger.info("[ ***INIT*** ]");
  await fetchAndAdd();
  logger.info("[ ***END*** ]");
  console.log(`Your cron function "${context.functionName}" ran at ${time}`);
};
