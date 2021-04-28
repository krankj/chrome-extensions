const express = require("express");
const port = process.env.PORT || 9000;
require("dotenv").config();
const cors = require("cors");
const app = express();
const logger = require("log4js").getLogger();
logger.level = "debug";
const { QuotesRoute } = require("./routes");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const apiRouter = express.Router();
app.use("/api", apiRouter);
apiRouter.use("/quotes", QuotesRoute);

app.listen(port, () => logger.info(`Listening on port ${port}`));
