const express = require("express");
const usersRouter = express.Router();
const bcrypt = require("bcrypt");
// requireUser eventually

// import database functions

const jwt = require("jsonwebtoken");

usersRouter.get("/", (req, res) => {
  try {
    res.json({
      message: "testing get all users",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

usersRouter.post("/register", async (req, res) => {
  console.log(req.body);
  try {
    res.json({
      message: "testing register a user",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

usersRouter.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    res.json({
      message: "testing login a user",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

usersRouter.get("/me", async (req, res) => {
  try {
    res.json({
      message: "testing get my information",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

usersRouter.patch("/me", async (req, res) => {
  try {
    res.json({
      message: "testing patch my information",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

usersRouter.get("/:userId/", async (req, res) => {
  const { userId } = req.params;
  try {
    res.json({
      message: `testing get a user with the id: ${userId}`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
usersRouter.get("/:userId/recipes", async (req, res) => {
  const { userId } = req.params;
  try {
    res.json({
      message: `testing get all recipes for a user with the id: ${userId}`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

usersRouter.get("/:userId/reviews", async (req, res) => {
  const { userId } = req.params;
  try {
    res.json({
      message: `testing get all reviews for a user with the id: ${userId}`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

usersRouter.get("/:userId/comments", async (req, res) => {
  const { userId } = req.params;
  try {
    res.json({
      message: `testing get all comments for a user with the id: ${userId}`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = usersRouter;