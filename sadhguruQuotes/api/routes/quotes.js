const express = require("express");
const quotesRouter = express.Router();
const QuotesController = require("../controllers/quotes");

quotesRouter.get("/latest", [QuotesController.latest]);
quotesRouter.get("/exists", [QuotesController.quoteExists]);
quotesRouter.get("/range", [QuotesController.range]);
quotesRouter.get("/random", [QuotesController.random]);
quotesRouter.post("/manualAdd", [QuotesController.manualAdd]);
quotesRouter.post("/autoAdd", [QuotesController.autoAdd]);

module.exports = quotesRouter;
