const express = require("express");
const reviewRouter = express.Router();
const { requireUser, checkAdmin } = require("./utils");

const {
  createReview,
  updateReview,
  getReviewById,
  destroyReviewById,
  client,
} = require("../db");

reviewRouter.post("/:recipeId", requireUser, async (req, res, next) => {
  console.log("inside endpoint");
  const {
    params: { recipeId },
    user: { id: userId },
    body: { title, content, rating },
  } = req;

  const {rows: [potentiallyAlreadyReviewed]} = await client.query(`
    SELECT reviews.id
    FROM reviews
    WHERE reviews.userId=$1
    AND reviews.recipeId=$2;
  `, [userId, recipeId]);

  if (potentiallyAlreadyReviewed){
    next({
      name: "AlreadyReviewedError",
      message: "You cannot review a recipe twice",
    });
  }

  const review = { userId, title, content, rating, recipeId };
  try {
    const newReview = await createReview(review);
    res.send(newReview);
  } catch (err) {
    next(err);
  }
});

reviewRouter.patch("/:reviewId", requireUser, async (req, res, next) => {
  const {
    params: { reviewId },
    body: fields,
    user: { id },
  } = req;

  const admin = checkAdmin(req.user);
  const { userid } = await getReviewById(reviewId);
  if (id != userid && !admin) {
    next({
      name: "WrongUserError",
      message: "You cannot edit a review that is not yours.",
    });
  }
  try {
    const updatedReview = await updateReview(reviewId, fields);
    res.send(updatedReview);
  } catch (err) {
    next(err);
  }
});

reviewRouter.delete("/:reviewId", requireUser, async (req, res, next) => {
  const {
    params: { reviewId },
    user: { id },
  } = req;
  const admin = checkAdmin(req.user);
  const { userid } = await getReviewById(reviewId);
  if (id != userid && !admin) {
    next({
      name: "WrongUserError",
      message: "You cannot delete a review that is not yours.",
    });
  }
  try {
    const deletedReview = await destroyReviewById(reviewId);
    res.send({
      name: "DeleteConfirmation",
      message: `The review from ${deletedReview.user.username} has been deleted.`,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = reviewRouter;
