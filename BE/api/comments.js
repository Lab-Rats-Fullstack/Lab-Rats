const express = require("express");
const commentRouter = express.Router();

// require user function

// db functions

commentRouter.post("/:reviewId", (req, res) => {
  const { recipeId } = req.params;
  // requireUser eventually
  try {
    console.log(req.body);
    res.json({
      message: `testing post a comment for recipe with the id: ${recipeId}`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
commentRouter.patch("/:commentId", (req, res) => {
  const { commentId } = req.params;
  // requireUser or requireAdmin eventually
  try {
    res.json({
      message: `testing patch a comment with the id: ${commentId}`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

commentRouter.delete("/:commentId", (req, res) => {
  const { commentId } = req.params;
  // requireUser or requireAdmin eventually
  try {
    res.json({
      message: `testing delete a comment with the id: ${commentId}`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = commentRouter;
