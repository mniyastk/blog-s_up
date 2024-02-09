const jwt = require("jsonwebtoken");

const secret = "process.env.JWT";

module.exports.userAuth = (req, res, next) => {
  const token = req.cookies.userToken;
  if (token) {
    jwt.verify(token, secret, (err) => {
      if (err) {
<<<<<<< HEAD
        res.status(401).send("Unautherized");
      } else {
        next();
=======
        res.status(401).send("Unauthorized");
>>>>>>> origin
      }
    });
  } else {
    res.status(401).send("Unauthorized");
  }
};
