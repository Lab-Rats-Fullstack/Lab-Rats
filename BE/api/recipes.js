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
  if (body.base64) {
    const { base64: imagePath } = body;
    const imgUrl = await returnImageUrl(imagePath);
    body.imgUrl = imgUrl;
  }

  delete body.base64;

  const recipe = { ...body, userId };
  console.log(recipe);
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

  if (fields.base64) {
    const { base64: imagePath } = fields;
    const imgUrl = await returnImageUrl(imagePath);
    fields.imgUrl = imgUrl;
    console.log(imgUrl);
  }

  delete fields.base64;

  try {
    const updatedRecipe = await updateRecipe(recipeId, fields);
    console.log(updatedRecipe);
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
