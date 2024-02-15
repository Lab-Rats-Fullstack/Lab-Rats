const express = require("express");
const usersRouter = express.Router();
const bcrypt = require("bcrypt");
// requireUser eventually

// import database functions

const jwt = require("jsonwebtoken");

usersRouter.get("/", (req, res) => {
  try {
    res.json({
      message: "Hello World!",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

usersRouter.post("/register", async (req, res) => {
  try {
    res.json({
      message: "Hello World!",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

usersRouter.post("/login", async (req, res) => {
  try {
    res.json({
      message: "Hello World!",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

usersRouter.get("/me", async (req, res) => {
  try {
    res.json({
      message: "Hello World!",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
usersRouter.get("/:userId/", async (req, res) => {
  try {
    res.json({
      message: "Hello World!",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
usersRouter.get("/:userId/recipes", async (req, res) => {
  try {
    res.json({
      message: "Hello World!",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

usersRouter.get("/:userId/reviews", async (req, res) => {
  try {
    res.json({
      message: "Hello World!",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

usersRouter.get("/:userId/comments", async (req, res) => {
  try {
    res.json({
      message: "Hello World!",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = usersRouter;
