const jwt = require("jsonwebtoken");

const secret = "process.env.JWT";

module.exports.userAuth = (req, res, next) => {
  const token = req.cookies.userToken;
  if (token) {
    jwt.verify(token, secret, (err) => {
      if (err) {
        res.status(401).send("Unautherized");
      } else {
        next();
      }
    });
  } else {
    res.status(401).send("Unautherized");
  }
};
