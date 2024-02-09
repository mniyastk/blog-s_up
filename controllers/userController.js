const { createToken } = require("../helpers/createToken");
const User = require("../models/userShema");
const bcrypt = require("bcrypt");
module.exports.register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  const userExist = await User.findOne({ email: email });
  if (!userExist) {
    await User.create(req.body);
    res.status(200).send("Register success");
  } else {
    res.status(409).send("User already exist");
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  const userExist = await User.findOne({ email: email });
  if (userExist) {
    const auth = await bcrypt.compare(password, userExist.password);
    if (auth) {
      const token = createToken(email);
      res.cookie("userToken", token, { httpOnly: true });
      res.status(200).send("Login success");
    } else {
      res.status(404).send("Incorrect email or password");
    }
  } else {
    res.status(404).send("Incorrect email or password");
  }
};

module.exports.getPosts = async (req, res) => {
  res.send("posts");
};
module.exports.getPostsById = async (req, res) => {
  res.send("i am from posts ");
};
module.exports.getPostsByCategory = async (req, res) => {
  res.send("i am from this category");
};

module.exports.getWatchingHistory = async (req, res) => {
  res.send("user history");
};
module.exports.getAuther = async (req, res) => {
  res.send("Auther");
};
