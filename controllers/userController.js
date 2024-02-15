const { createToken } = require("../helpers/createToken");
const User = require("../models/userShema");
const Blogs = require("../models/blogShema");
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

module.exports.getBlogs = async (req, res) => {
  const blogs = await Blogs.find();
  res.send(blogs);
};
module.exports.getBlogById = async (req, res) => {
  const blogId = req.params.id;
  console.log(typeof blogId);
  const blog = await Blogs.findOne({ blogId: blogId });
  console.log(blog);
  if (blog) {
    res.status(200).send(blog);
  } else {
    res.status(404).send("blog not found");
  }
};
module.exports.addComment = async (req, res) => {
  const { blogId, userId } = req.params;

  const comment = await Blogs.findOneAndUpdate(
    { blogId: blogId },
    {
      $push: {
        comments: { content: "ksfkhkh", created: Date.now(), postedBy: userId },
      },
    }
  );
  res.status(200).send("Comment posted");
};

module.exports.getBlogsByCategory = async (req, res) => {
  const category = req.params.category;
  const blogs = await Blogs.aggregate[{ $match: { category: category } }];
  console.log(blogs);
};

module.exports.getWatchingHistory = async (req, res) => {
  res.send("user history");
};
module.exports.getAuther = async (req, res) => {
  res.send("Auther");
};
