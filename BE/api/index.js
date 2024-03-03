const express = require("express");
const apiRouter = express.Router();
const path = require("path");

const jwt = require("jsonwebtoken");
const { getUserById } = require("../db");
const { JWT_SECRET } = process.env;

apiRouter.use(express.static(path.join(__dirname, "documentation")));

apiRouter.use(async (req, res, next) => {
  const auth = req.header("Authorization");
  const token = auth?.split(" ")[1];

  if (!auth) next();
  if (token == 'null') next();
  else {
    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      if (id) {
        req.user = await getUserById(id);
        next();
      } else
        next({
          name: "AuthorizationHeaderError",
          message: "Authorization token malformed",
        });
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
});

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }

  next();
});

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

apiRouter.use((error, req, res, next) => {
  res.send(error);
});

module.exports = apiRouter;
