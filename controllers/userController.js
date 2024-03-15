const { createToken } = require("../helpers/createToken");
const User = require("../models/userShema");
const Blogs = require("../models/blogShema");
const Author = require("../models/authorShema");
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
  console.log( blogId);
  const blog = await Blogs.findOne({ _id: blogId });
  console.log(blog);
  if (blog) {
    res.status(200).send(blog);
  } else {
    res.status(404).send("blog not found");
  }
};
module.exports.addComment = async (req, res) => {
  const { blogId, userId } = req.params;
  const content = req.body.content;
  const user = await User.findOne({ userId: userId });
  const comment = await Blogs.findOneAndUpdate(
    { blogId: blogId },
    {
      $push: {
        comments: {
          content: content,
          created: Date.now(),
          postedby: user._id,
        },
      },
    }
  );
  res.status(200).send("Comment posted");
};
module.exports.addLike = async (req, res) => {
  const { blogId, userId } = req.params;
  const user = await User.findOne({ userId: userId });
  const blog = await Blogs.findOne({ blogId: blogId });
  console.log(user._id);
  const likes = blog.likes;
  const isLiked = likes.find((like) => like.postedby.equals(user._id));
  console.log("isLiked", isLiked);
  if (isLiked) {
    const unlike = blog.likes.filter((item) => !item.postedby.equals(user._id));
    console.log("unlike", unlike);
    await Blogs.findOneAndUpdate(
      { blogId: blogId },
      {
        $set: {
          likes: unlike,
        },
      }
    );
    res.send("Unliked");
  } else {
    await Blogs.findOneAndUpdate(
      { blogId: blogId },
      {
        $push: {
          likes: {
            postedby: user._id,
          },
        },
      }
    );
    res.send("liked");
  }
};

module.exports.getBlogsByCategory = async (req, res) => {
  const category = req.params.category;
  const blogs = await Blogs.find({ category: category });
  if (blogs) {
    res.status(200).send(blogs);
  } else {
    res.status(404).send("Not Found");
  }
};

module.exports.getAuther = async (req, res) => {
  const authorId = req.params.id;
  const author = Author.findOne({ authorId: authorId });
  if (author) {
    res.status(200).send(author);
  } else {
    res.status(404).send("Not Found");
  }
};

module.exports.getWatchingHistory = async (req, res) => {
  res.send("user history");
};
