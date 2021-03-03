const express = require("express");
const quotesRouter = express.Router();
const QuotesController = require("../controllers/quotes");

quotesRouter.get("/latest", [QuotesController.latest]);
quotesRouter.get("/range", [QuotesController.range]);
quotesRouter.post("/manualAdd", [QuotesController.manualAdd]);
quotesRouter.post("/autoAdd", [QuotesController.autoAdd]);

module.exports = quotesRouter;
