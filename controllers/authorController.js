const authorModel = require("../models/authorShema");
const bcrypt = require("bcrypt");
const blogModel = require("../models/blogShema");
const { createToken } = require("../helpers/createToken");
// const htmlToText = require("html-to-text");
const jwt = require('jsonwebtoken')

const s3 = require("../s3");

///Regiser///
const authorRegister = async (req, res) => {
  const data = req.body;

  const user = new authorModel({
    username: data.username,
    email: data.email,
    password: data.password,
  });

  const isexist = await authorModel.findOne({ email: user.email });
  if (isexist) {
    res.status(409).send(`${user.email} already exist`);
  } else {
    const newUser = await authorModel.create(user);
    res.status(201).send(newUser);
  }
};

///Login///
const authorLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await authorModel.findOne({ email: email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      const authorToken = createToken(email);
      res.cookie("authorToken", authorToken, { httpOnly: true });
      res.status(200).send("Login Successfully....");
    } else {
      res.status(404).send("Incorrect Username or Password");
    }
  }
};

///Account///
const getAccount = async (req, res) => {
  const id = req.params.id;
  const user = await authorModel.findOne({ authorId: id });
  res.status(200).send(user);
};
const getAuthor = async (req, res) => {
  const token = req.cookies.authorToken;
  if (token) {
    const decoded = jwt.decode(token);
    const author = await authorModel.findOne({ email: decoded.user });
    res.status(200).send(author);
  } else {
    res.status(404).send("token not found");
  }
};

///New Blog///
const createBlog = async (req, res) => {
  const authorId = req.params.id;
  const author = await authorModel.findOne({ authorId: authorId });
  const { title, content, category, tags, image } = req.body;
  const tagsArray = tags.split(",").map((tag, index) => tag.trim());
  const params = {
    Bucket: "blogs-up",
    Key: image,
    Body: image,
  };
  const data = await s3.upload(params).promise();
  const imageUrl = data.Location;

  const newBlog = new blogModel({
    title: title,
    content: content,
    category: category,
    tags: tagsArray,
    author: authorId,
    image: imageUrl,
  });

  await authorModel.findOneAndUpdate(
    { authorId: authorId },
    { $push: { blogsId: newBlog._id } }
  );

  const newBlogPost = await blogModel.create(newBlog);
  res.send(newBlogPost);
};

/// View posted Blogs///

const postedBolgs = async (req, res) => {
  const id = req.params.id;
  const blogs = await blogModel.find({ author: id });

  if (blogs) {
    res.status(200).send(blogs);
  } else {
    res.status(404).send("Blogs not found");
  }
};

///View Seperate Blog///
const blogById = async (req, res) => {
  const id = req.params.id;
  const blog = await blogModel.findOne({ blogId: id });
  if (blog) {
    res.status(200).send(blog);
  } else {
    res.status(404).send("blog not found...!");
  }
};

///// Update Blog //////

const updateBlog = async (req, res) => {
  const id = req.params.id;
  const blog = await blogModel.findById(id);
  const { title, content, category, tags, image } = req.body;
  const tagsArray = tags.split(",").map((tag, index) => tag.trim());
  const params = {
    Bucket: "blogs-up",
    Key: image,
    Body: image,
  };
  const data = await s3.upload(params).promise();
  const imageUrl = data.Location;
  const updatedBlog = await blogModel.findByIdAndUpdate(id, {
    $set: {
      title: title,
      content: content,
      category: category,
      tags: tagsArray,
      image: imageUrl,
    },
  });

  if (updatedBlog) {
    res.send("Successfully updated");
  } else {
    res.send("something went wrong");
  }
};

///Delete Blog///
const deleteBlog = async (req, res) => {
  const id = req.params.id;
  const authorId = req.params.authorid;
  const author = await authorModel.findById(authorId);

  const updatedBlog = author.blogsId.filter((item) => item._id != id);
  const removeblog = await blogModel.findOneAndDelete({ _id: id });
  const authorBlogs = await authorModel.findOneAndUpdate(author._id, {
    $set: {
      blogsId: updatedBlog,
    },
  });
  if (removeblog && authorBlogs) {
    res.send("success");
  } else {
    res.send("something went wrong");
  }
};

/// view comments///
const viewComments = async (req, res) => {
  const id = req.params.id;
  const blog = await blogModel.findOne({ blogId: id });
  if (blog) {
    const comments = blog.comments;
    res.status(200).send(comments);
  } else {
    res.status(404).send("comments not found");
  }
};

/// view likes///
const viewLikes = async (req, res) => {
  const id = req.params.id;
  const blog = await blogModel.findOne({ blogId: id });
  if (blog) {
    const likes = blog.likes;
    res.status(200).send(likes);
  } else {
    res.status(404).send("Likes not found");
  }
};

//// Update Account /////
const updateAccount = async (req, res) => {
  const id = req.params.id;
  const author = await authorModel.findById(id);

  const { username, phone, image } = req.body;
  const updatedAuthor = await authorModel.findOneAndUpdate(author._id, {
    $set: {
      username: username,
      phone: phone,
    },
  });
  
  if (updatedAuthor) {
    res.send("Successfully Updated");
  } else {
    res.send("Something went Wrong...");
  }
};
module.exports = {
  authorRegister,
  authorLogin,
  getAccount,
  getAuthor,
  createBlog,
  postedBolgs,
  updateBlog,
  blogById,
  deleteBlog,
  viewLikes,
  viewComments,
  // adddComment,
  updateAccount,
};
