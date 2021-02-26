const express = require("express");
const quotesRouter = express.Router();
const QuotesController = require("../controllers/quotes");

authRouter.get("/today", [QuotesController.today]);
authRouter.get("/range", [AuthController.range]);

module.exports = quotesRouter;
