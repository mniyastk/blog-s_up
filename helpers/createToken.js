const jwt = require("jsonwebtoken");

const secret = "process.env.JWT";
const maxAge = 12 * 60 * 60 * 1000;

module.exports.createToken = (username) => {
  return jwt.sign({ user: username }, secret, { expiresIn: maxAge });
}; 