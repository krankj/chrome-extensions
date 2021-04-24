const log4j = require("log4js");
const logger = log4j.getLogger();
logger.level = "debug";
const envConfig = require("../config/env.config");

const envVarNotSet = (envVariable) => {
  logger.error(`${envVariable} env variable is not set`);
};

const callExit = () => {
  logger.info("Exiting process");
  process.exit(1);
};

const checkPrivateKeyEnv = () => {
  const sgPrivateKeyVar = process.env[envConfig.envVars.SG_PRIVATE_KEY_VAR];
  if (!sgPrivateKeyVar) {
    envVarNotSet(envConfig.envVars.SG_PRIVATE_KEY_VAR);
    callExit();
  }
};

const checkEnv = () => {
  const envVar = process.env[envConfig.envVars.SG_ENV_VAR];
  if (!envVar) {
    envVarNotSet(envConfig.envVars.SG_ENV_VAR);
    callExit();
  }
};

const checkEnvVars = () => {
  checkEnv();
  checkPrivateKeyEnv();
};

const preCheckAppConfig = () => {
  logger.debug("Performing app config pre check");
  checkEnvVars();
  logger.debug("App pre check successful");
};

preCheckAppConfig();
