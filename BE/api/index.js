const express = require("express");
const apiRouter = express.Router();
const path = require("path");

const jwt = require("jsonwebtoken");

apiRouter.use(express.static(path.join(__dirname, "documentation")));

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const recipesRouter = require("./recipes");
apiRouter.use("/recipes", recipesRouter);

const reviewRouter = require("./reviews");
apiRouter.use("/comments", reviewRouter);

const commentsRouter = require("./comments");
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
