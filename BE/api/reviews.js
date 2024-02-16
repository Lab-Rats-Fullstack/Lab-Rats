const express = require("express");
const reviewRouter = express.Router();

// require user function

// db functions

reviewRouter.post("/:recipeId", (req, res) => {
  const { recipeId } = req.params;
  // requireUser eventually
  try {
    console.log(req.body);
    res.json({
      message: `testing post a review for recipe with the id: ${recipeId}`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

reviewRouter.patch("/:reviewId", (req, res) => {
  const { reviewId } = req.params;
  // requireUser or requireAdmin eventually
  try {
    res.json({
      message: `testing patch a review with the id: ${reviewId}`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

reviewRouter.delete("/:reviewId", (req, res) => {
  const { reviewId } = req.params;
  // requireUser or requireAdmin eventually
  try {
    res.json({
      message: `testing delete a review with the id: ${reviewId}`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = reviewRouter;
