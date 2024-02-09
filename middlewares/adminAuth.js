const jwt = require("jsonwebtoken");

const secret = "process.env.JWT";

module.exports.adminAuth = (req, res, next) => {
  const token = req.cookies.adminToken;
  if (token) {
    jwt.verify(token, secret, (err) => {
      if (err) {
        res.status(401).send("Unauthorized");
      } else {
        next();
      }
    });
  } else {
    res.status(401).send("Unauthorized");
  }
};
