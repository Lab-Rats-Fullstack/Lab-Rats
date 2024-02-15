const express = require("express");
const commentsRouter = express.Router();

// require user function

// db functions

commentsRouter.get("/", (req, res) => {
  try {
    res.json({
      message: "Hello World!",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

commentsRouter.post("/", async (req, res) => {
  // requireAdmin eventually
  try {
    res.json({
      message: "Hello World!",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

commentsRouter.get("/reviewedRecipes", async (req, res) => {
  // requireAdmin eventually
  try {
    res.json({
      message: "Hello World!",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
