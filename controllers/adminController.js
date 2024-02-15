const userModel = require("../models/userShema");
const blogModel = require("../models/blogShema");
const authorModel = require("../models/authorShema");
const { createToken } = require("../helpers/createToken");
const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "123") {
    const token = createToken(username);
    res.cookie("adminToken", token, { httpOnly: true });
    res.status(200).send("Login Success");
  } else {
    res.status(404).send("Incorrect Username or Password");
  }
};

const allUsers = async (req, res) => {
  const users = await userModel.find();
  if (users) {
    res.status(200).send(users);
  } else {
    res.status(404).send("Users not found");
  }
};
const userById = async (req, res) => {
  const id = req.params.id;
  const user = await userModel.findOne({ userId: id });
  if (user) {
    res.status(200).send(user);
  } else {
    res.status(404).send("User not found");
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  const removedUser = await userModel.findOneAndDelete({ userId: id });
  if (removedUser) {
    res.status(200).send("Successfully Removed User");
  } else {
    res.status(404).send("Failed to remove user");
  }
};

const allBlogs = async (req, res) => {
  const blogs = await blogModel.find();
  if (blogs) {
    res.status(200).send(blogs);
  } else {
    res.status(404).send("Blogs not found");
  }
};
const blogById = async (req, res) => {
  const id = req.params.id;
  const blog = await blogModel.findOne({ blogId: id });
  if (blog) {
    res.status(200).send(blog);
  } else {
    res.status(404).send("Blogs not found");
  }
};

const deleteBlog = async (req, res) => {
  const id = req.params.id;
  const removedBlog = await blogModel.findOneAndDelete({ userId: id });
  if (removedBlog) {
    res.status(200).send("Successfully Removed Blog");
  } else {
    res.status(404).send("Failed to remove Blog");
  }
};
const allAuthors = async (req, res) => {
  const authors = await authorModel.find();
  if (authors) {
    res.status(200).send(authors);
  } else {
    res.status(400).send("Authors not found");
  }
};

const authorById = async (req, res) => {
  const id = req.params.id;
  const author = await authorModel.findOne({ authorId: id });
  if (author) {
    res.status(200).send(author);
  } else {
    res.status(404).send("Author Not found");
  }
};
const deleteAuthor = async (req, res) => {
  const id = req.params.id;
  const removedAuthor = await authorModel.findOneAndDelete({ userId: id });
  if (removedAuthor) {
    res.status(200).send("Successfully Removed Author");
  } else {
    res.status(404).send("Failed to remove Author");
  }
};
const stats = async (req, res) => {
  const totalUsers = (await userModel.find()).length;
  const totaBlogs = (await blogModel.find()).length;
  const totalAuthors = (await authorModel.find()).length;
  const category = await blogModel.distinct("category");
  res.send({
    totaBlogs: totaBlogs,
    totalAuthors: totalAuthors,
    totalUsers: totalUsers,
    category: category,
  });
};

const blogByCategory = async (req, res) => {
  const category = req.params.category;
  const blogs = await blogModel.find({ category: category });
  if (blogs) {
    res.status(200).send(blogs);
  } else {
    res.status(404).send("This Category has not blogs");
  }
};
const blogsBYAuthor = async (req, res) => {
  const id = req.params.id;
  const authorBlogs = await authorModel
    .findOne({ authorId: id })
    .populate("blogsId"); 

  if (authorBlogs) {
    res.status(200).send(authorBlogs);
  } else { 
    res.status(404).send("Blogs not found");
  }
};
module.exports = {
  adminLogin,
  allUsers,
  userById,
  deleteUser,
  allBlogs,
  blogById,
  deleteBlog,
  allAuthors,
  authorById,
  deleteAuthor,
  stats,
  blogByCategory,
  blogsBYAuthor,
};
