const express = require("express");
const commentRouter = express.Router();
const { requireUser, checkAdmin } = require("./utils");

const {
  createComment,
  updateComment,
  getCommentById,
  destroyCommentById,
} = require("../db");

commentRouter.post("/:reviewId", requireUser, async (req, res, next) => {
  const {
    params: { reviewId },
    user: { id: userId },
    body: { content },
  } = req;
  const comment = { reviewId, userId, content };
  try {
    const newComment = await createComment(comment);
    res.send(newComment);
  } catch (err) {
    next(err);
  }
});
commentRouter.patch("/:commentId", requireUser, async (req, res, next) => {
  const {
    params: { commentId },
    body: fields,
    user: { id },
  } = req;
  const admin = checkAdmin(user);
  const { userid } = await getCommentById(commentId);
  if (id != userid && !admin) {
    next({
      name: "WrongUserError",
      message: "You cannot edit a review that is not yours.",
    });
  }
  try {
    const updatedComment = await updateComment(commentId, fields);
    res.send(updatedComment);
  } catch (err) {
    next(err);
  }
});

commentRouter.delete("/:commentId", requireUser, async (req, res, next) => {
  const {
    params: { commentId },
    user: { id },
  } = req;
  const admin = checkAdmin(user);
  const { userid } = await getCommentById(commentId);
  if (id != userid && !admin) {
    next({
      name: "WrongUserError",
      message: "You cannot delete a comment that is not yours.",
    });
  }
  try {
    const deletedComment = await destroyCommentById(commentId);
    res.send(deletedComment);
  } catch (err) {
    next(err);
  }
});

module.exports = commentRouter;
