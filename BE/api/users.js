const express = require("express");
const usersRouter = express.Router();
const bcrypt = require("bcrypt");
const { requireUser, requireAdmin } = require("./utils");
const { returnImageUrl } = require("./uploadImage");

const {
  createUser,
  updateUser,
  getAllUsers,
  getUserByUsername,
  getUserPageById,
  getPublicUserPageById,
  destroyUserById
} = require("../db");

const jwt = require("jsonwebtoken");

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await getAllUsers();

    res.send({ users });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

usersRouter.post("/register", async (req, res, next) => {
  const { username, name, email, password: unhashed } = req.body;

  try {
    const user = await getUserByUsername(username);
    if (user) {
      next({
        name: "UserExistsError",
        message: "A user by that username already exists",
      });
    }

    const password = await bcrypt.hash(unhashed, 10);
    const newUser = await createUser({
      username,
      name,
      email,
      password,
    });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1w",
    });

    const { admin } = newUser;

    res.send({
      message: "Thank you for signing up!",
      token,
      admin,
      username,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please provide username and password",
    });
  }
  try {
    const user = await getUserByUsername(username);
    let auth;
    if (user) {
      auth = await bcrypt.compare(password, user.password);
    }
    if (user && auth) {
      const token = jwt.sign(
        { id: user.id, username },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );
      const { admin } = user;
      res.send({
        message: "Successfully logged in!",
        token,
        admin,
        username,
      });
    } else {
      next({
        name: "InvalidCredentialsError",
        message: "Invalid username or password",
      });
    }
  } catch (err) {
    next(err);
  }
});

usersRouter.get("/me", requireUser, async (req, res, next) => {
  const { user } = req;
  const { id: userId } = user;
  try {
    const me = await getUserPageById(userId);
    res.send(me);
  } catch (err) {
    next(err);
  }
});

usersRouter.patch("/me", requireUser, async (req, res, next) => {
  try {
    const { id } = req.user;
    const { body: fields } = req;
    if (fields.admin) {
      delete fields.admin;
      next({
        name: "SelfAdminChangeError",
        message: "You cannot change your own admin status.",
      });
    } else {
      if (fields.password) {
        fields.password = await bcrypt.hash(fields.password, 10);
      }

      const updatedUser = await updateUser(id, fields);
      res.send(updatedUser);
    }
  } catch (err) {
    next(err);
  }
});

usersRouter.get("/:userId/", async (req, res, next) => {
  const { userId } = req.params;
  try {
    let user;

    if (req.user && req.user.admin) {
      user = await getUserPageById(userId);
    } else {
      user = await getPublicUserPageById(userId);
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
});

usersRouter.patch("/:userId/", requireAdmin, async (req, res, next) => {
  try {
    const { userId: id } = req.params;
    const tokenId = req.user.id;
    const { body: fields } = req;
    if (fields.password) {
      fields.password = await bcrypt.hash(fields.password, 10);
    }

    if (fields.admin && tokenId == id) {
      delete fields.admin;
      next({
        name: "SelfAdminChangeError",
        message: "You cannot change your own admin status, even as an admin."
      });
    } else {
      const updatedUser = await updateUser(id, fields);
      res.send(updatedUser);
    }
  } catch (err) {
    next(err);
  }
});

usersRouter.delete("/:userId/", requireAdmin, async (req, res, next) => {
  try{
    const {userId} = req.params;
    const tokenId = req.user.id;

    if (userId == tokenId){
      next({
        name: "SelfDeleteError",
        message: "You cannot delete yourself, even as an admin."
      });
    } else {
        const deletedUser = await destroyUserById(userId);
        res.send({
          message: "Successfully deleted user.",
          deletedUser: deletedUser
        });
    }
  } catch (err){
    next(err);
  }
});

module.exports = usersRouter;
