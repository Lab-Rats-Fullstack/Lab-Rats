function requireUser(req, res, next) {
  if (!req.user) {
    res.status(401);
    next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action",
    });
  }

  next();
}

function requireAdmin(req, res, next) {
  if (!req.user.admin) {
    res.status(401);
    next({
      name: "MissingAdminError",
      message: "You must be an admin to perform this action",
    });
  }
  next();
}

function checkAdmin(user) {
  return user.admin;
}

module.exports = {
  requireUser,
  requireAdmin,
  checkAdmin,
};
