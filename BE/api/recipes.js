const express = require("express");
const recipesRouter = express.Router();
const { requireUser, requireAdmin } = require("./utils");
const { returnImageUrl } = require("./uploadImage");

const {
  getAllRecipesPage,
  createRecipe,
  getReviewedRecipesPage,
  getRecipeById,
  updateRecipe,
  destroyRecipeById,
} = require("../db");

recipesRouter.get("/", async (req, res, next) => {
  try {
    const allRecipes = await getAllRecipesPage();
    res.send(allRecipes);
  } catch (err) {
    next(err);
  }
});

recipesRouter.post("/", requireAdmin, async (req, res, next) => {
  const { id: userId } = req.user;
  const { body } = req;
  
  if(body.tags && body.tags.length != 0){
    let tagListCheck = body.tags;
    tagListCheck.forEach((tag)=>{
      const trimmedTag = tag.replaceAll(' ', '');
      if (trimmedTag == ''){
        next({
          name: "BlankTagError",
          message: "You cannot submit a blank tag",
        });
      }
    });
  }
  
  const recipe = { ...body, userId };
  try {
    const newRecipe = await createRecipe(recipe);
    res.send(newRecipe);
  } catch (err) {
    next(err);
  }
});

recipesRouter.get("/reviewedRecipes", requireAdmin, async (req, res, next) => {
  // requireAdmin eventually
  try {
    const reviewedRecipes = await getReviewedRecipesPage();
    res.send(reviewedRecipes);
  } catch (err) {
    next(err);
  }
});

recipesRouter.get("/:recipeId", async (req, res, next) => {
  const { recipeId } = req.params;
  let userId = null;
  if (req.user) {
    userId = req.user.id;
  }

  try {
    const recipe = await getRecipeById(recipeId);
    const response = {
      userId,
      recipe,
    };
    res.send(response);
  } catch (err) {
    next(err);
  }
});

recipesRouter.patch("/:recipeId", requireAdmin, async (req, res, next) => {
  const { recipeId } = req.params;
  const { body: fields } = req;

  if(fields.tags && fields.tags.length != 0){
    let tagListCheck = fields.tags;
    tagListCheck.forEach((tag)=>{
      const trimmedTag = tag.replaceAll(' ', '');
      if (trimmedTag == ''){
        next({
          name: "BlankTagError",
          message: "You cannot submit a blank tag",
        });
      }
    });
  }

  try {
    const updatedRecipe = await updateRecipe(recipeId, fields);
    res.send(updatedRecipe);
  } catch (err) {
    next(err);
  }
});

recipesRouter.delete("/:recipeId", requireAdmin, async (req, res, next) => {
  const { recipeId } = req.params;
  // requireAdmin eventually
  try {
    const destroyedRecipe = await destroyRecipeById(recipeId);
    res.send({
      name: "DeleteConfirmation",
      message: `${destroyedRecipe.title} has been deleted.`,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = recipesRouter;
