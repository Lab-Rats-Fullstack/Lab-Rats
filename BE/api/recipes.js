const express = require("express");
const recipesRouter = express.Router();

// require user function

// db functions

recipesRouter.get("/", (req, res) => {
  try {
    res.json({
      message: `testing get all recipes`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

recipesRouter.post("/", async (req, res) => {
  console.log(req.body);
  // requireAdmin eventually
  try {
    res.json({
      message: `testing post a recipe`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

recipesRouter.get("/reviewedRecipes", async (req, res) => {
  // requireAdmin eventually
  try {
    res.json({
      message: `testing get all reviewed recipes`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

recipesRouter.post("/:recipeId", async (req, res) => {
  const { recipeId } = req.params;

  try {
    res.json({
      message: `testing get a recipe with the id: ${recipeId}`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

recipesRouter.patch("/:recipeId", async (req, res) => {
  const { recipeId } = req.params;
  // requireAdmin eventually
  try {
    res.json({
      message: `testing patch a recipe with the id: ${recipeId}`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

recipesRouter.delete("/:recipeId", async (req, res) => {
  const { recipeId } = req.params;
  // requireAdmin eventually
  try {
    res.json({
      message: `testing delete a recipe with the id: ${recipeId}`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = recipesRouter;
