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
apiRouter.use("/reviews", reviewRouter);

const commentRouter = require("./comments");
apiRouter.use("/comments", commentRouter);

const tagsRouter = require("./tags");
apiRouter.use("/tags", tagsRouter);

module.exports = apiRouter;
