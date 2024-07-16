const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ msg: "Authentication token is required" });
  }
  jwt.verify(token, "bookStore123", (err, user) => {
    if (err) {
      return res.status(401).json({ msg: "Token expired.Please login again" });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
