const express = require("express");
const tagsRouter = express.Router();
const { requireAdmin } = require("./utils");

const { getAllTags, getRecipesByTagName, destroyTagAndRecipeTagsById } = require("../db");

tagsRouter.get("/", async (req, res, next) => {
  try {
    const allTags = await getAllTags();
    res.send(allTags);
  } catch (err) {
    next(err);
  }
});

tagsRouter.get("/:tagName/recipes", async (req, res, next) => {
  const { tagName } = req.params;
  try {
    const recipes = await getRecipesByTagName(tagName);
    res.send(recipes);
  } catch (err) {
    next(err);
  }
});

tagsRouter.delete("/:tagId", requireAdmin, async (req, res, next) => {
  const {tagId} = req.params;
  try{
    const deletedTag = await destroyTagAndRecipeTagsById(tagId);
    res.send({
      message: "Tag successfully deleted.",
      tagName: deletedTag.name
    });
  } catch (err){
    next(err);
  }
});

module.exports = tagsRouter;
