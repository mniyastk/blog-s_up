const { createToken } = require("../helpers/createToken");
const User = require("../models/userShema");
const Blogs = require("../models/blogShema");
const Author = require("../models/authorShema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
  const authorExist = await Author.findOne({ email: email });
  if (userExist) {
    const auth = await bcrypt.compare(password, userExist.password);
    if (auth) {
      const token = createToken(email);
      res.cookie("userToken", token, { httpOnly: true });
      res.status(200).send({
        Messg: "Login success",
        token: token,
        accType: "user",
        user: userExist,
      });
    } else {
      res.status(404).send("Incorrect email or password");
    }
  } else if (authorExist) {
    const auth = await bcrypt.compare(password, authorExist.password);
    if (auth) {
      const token = createToken(email);
      res.cookie("authorToken", token, { httpOnly: true });
      res.status(200).send({
        Messg: "Login success",
        token: token,
        accType: "author",
        user: authorExist,
      });
    } else {
      res.status(404).send("Incorrect email or password");
    }
  } else {
    res.status(404).send({ Messg: "Incorrect email or password" });
  }
};

module.exports.logout = async (req, res) => {
  // const cookie = res.cookie.userToken
  res.cookie("userToken", "", { maxAge: 1 });
  res.send("success");
};

module.exports.getBlogs = async (req, res) => {
  const blogs = await Blogs.find();
  res.send(blogs);
};
module.exports.getBlogById = async (req, res) => {
  const blogId = req.params.id;
  const blog = await Blogs.findOne({ _id: blogId }).populate(
    "comments.postedby"
  );
  if (blog) {
    res.status(200).send(blog);
  } else {
    res.status(404).send("blog not found");
  }
};
module.exports.addComment = async (req, res) => {
  const { blogId, userId } = req.params;
  const content = req.body.comment;
  const user = await User.findOne({ _id: userId });
  const comment = await Blogs.findOneAndUpdate(
    { _id: blogId },
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

module.exports.editComment = async (req, res) => {
  const { blogId, userId, commentId } = req.params;
  const { editedComment } = req.body;
  const blog = await Blogs.findById(blogId);
  const uComments = blog?.comments?.map((item) => {
    if (item._id == commentId) {
      item.content = editedComment;
    }
    return item;
  });

  blog.comments = uComments;
  await blog.save();
  res.status(200).send("success");
};
module.exports.removeComment = async (req, res) => {
  const { blogId, commentId } = req.params;

  const blog = await Blogs.findById(blogId);
  const uComments = blog?.comments?.filter((item) => item._id != commentId);

  blog.comments = uComments

  res.status(200).send("success");
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

module.exports.saveBlog = async (req, res) => {
  const { blogId, userId } = req.params;
  const user = await User.findById(userId);
  const isExist = user.savedList.find((item) => item._id == blogId);
  if (!isExist) {
    const updatedUser = await User.findByIdAndUpdate(userId, {
      $push: { savedList: blogId },
    });
    res.status(200).send("success");
    console.log(updatedUser);
  }
};
module.exports.getUser = async (req, res) => {
  const token = req.cookies.userToken;
  if (token) {
    const decoded = jwt.decode(token);
    const user = await User.findOne({ email: decoded.user }).populate(
      "savedList"
    );
    res.status(200).send(user);
  } else {
    res.status(404).send("token not found");
  }
};
module.exports.getSavedList = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId).populate("savedList");
  res.status(200).send(user.savedList);
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
