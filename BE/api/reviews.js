const express = require("express");
const reviewRouter = express.Router();

// require user function

// db functions

reviewRouter.post("/:recipeId", (req, res) => {
  // requireUser eventually
  try {
    res.json({
      message: "Hello World!",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

reviewRouter.patch("/:reviewId", (req, res) => {
  // requireUser or requireAdmin eventually
  try {
    res.json({
      message: "Hello World!",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

reviewRouter.delete("/:reviewId", (req, res) => {
  // requireUser or requireAdmin eventually
  try {
    res.json({
      message: "Hello World!",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = reviewRouter;
