const express = require("express");
const recipesRouter = express.Router();

// require user function

// db functions

recipesRouter.get("/", (req, res) => {
  try {
    res.json({
      message: "Hello World!",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

recipesRouter.post("/", async (req, res) => {
  // requireAdmin eventually
  try {
    res.json({
      message: "Hello World!",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

recipesRouter.get("/reviewedRecipes", async (req, res) => {
  // requireAdmin eventually
  try {
    res.json({
      message: "Hello World!",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

recipesRouter.get("/:recipeId", async (req, res) => {
  // requireAdmin eventually
  try {
    res.json({
      message: "Hello World!",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

recipesRouter.patch("/:recipeId", async (req, res) => {
  // requireAdmin eventually
  try {
    res.json({
      message: "Hello World!",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

recipesRouter.delete("/:recipeId", async (req, res) => {
  // requireAdmin eventually
  try {
    res.json({
      message: "Hello World!",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = recipesRouter;
