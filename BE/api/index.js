const express = require("express");
const apiRouter = express.Router();
const path = require("path");

const jwt = require("jsonwebtoken");

apiRouter.use(express.static(path.join(__dirname, "documentation")));

module.exports = apiRouter;
