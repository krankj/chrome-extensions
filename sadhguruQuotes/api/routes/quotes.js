const express = require("express");
const quotesRouter = express.Router();
const QuotesController = require("../controllers/quotes");

quotesRouter.get("/today", [QuotesController.today]);
quotesRouter.get("/range", [QuotesController.range]);
quotesRouter.post("/add", [QuotesController.insert]);

module.exports = quotesRouter;
