const express = require("express");
const tagsRouter = express.Router();

// require user function

// db functions

tagsRouter.get("/", (req, res) => {
  try {
    res.json({
      message: "testing tag get",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

tagsRouter.get("/:tagName/recipes", (req, res) => {
  const { tagName } = req.params;
  try {
    res.json({
      message: `testing get all recipes for tag with the tagname: ${tagName}`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = tagsRouter;
