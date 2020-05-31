const tokendb = require("./tokendb");

const authMiddleware = (req, res, next) => {
  const { token } = req.cookies;
  // Do we have a "token" cookie?
  if (!token) {
    res.redirect("/login");
    return;
  }
  // Does the token exist?
  const info = tokendb.getToken(token);
  if (!info) {
    res.redirect("/login");
    return;
  }
  req.isAdmin = info.admin;
  next();
};

module.exports = authMiddleware;
