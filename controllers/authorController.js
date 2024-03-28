const authorModel = require("../models/authorShema");
const bcrypt = require("bcrypt");
const blogModel = require("../models/blogShema");
const { createToken } = require("../helpers/createToken");
const { uploadFile } = require("../s3");

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

const authorLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await authorModel.findOne({ email: email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      const authorToken = createToken(email);
      res.cookie("authorToken", authorToken, { httpOnly: true });
      res.status(200).send("Login Successfully...");
    } else {
      res.status(404).send("Incorrect Username or Password");
    }
  }
};

const getAccount = async (req, res) => {
  const id = req.params.id;
  const user = await authorModel.findOne({ authorId: id });
  res.status(200).send(user);
};

const createBlog = async (req, res) => {
   
  const { title, content, category, tags, image } = req.body;

 res.send(req.body)

  // const uploaded = await uploadFile(image);
  // console.log(uploaded);
  // const uploadParams = {
  //   Bucket: "blogsup",
  //   Key: "https://console.cloudinary.com/console/c-37184aaaa09eb786e4aaa2a402ef45/media_library/homepage/asset/86bd625596c4f7796862e221fcb17629/manage?context=manage",
  //   Body: "https://console.cloudinary.com/console/c-37184aaaa09eb786e4aaa2a402ef45/media_library/homepage/asset/86bd625596c4f7796862e221fcb17629/manage?context=manage",

  // };

  // s3.upload(uploadParams, (err, data) => {
  //   if (err) {
  //     console.error("Error uploading file:", err);
  //   } else {
  //     console.log("File uploaded successfully:", data.Location);
  //   }
  // });

  // (async () => {
  //   await s3
  //     .putObject({
  //       Body: "hello  world",
  //       Bucket: "blogs-up",
  //       Key: "sample.txt",
  //     })
  //     .promise();
  // })();

  // const newBlog = new blogModel({
  //   title: title,
  //   content: content,
  //   category: category,
  //   tags: tags,
  //   author: authorId,
  //   image: image,
  // });

  // await authorModel.findOneAndUpdate(
  //   { authorId: authorId },
  //   { $push: { blogsId: newBlog._id } }
  // );

  // const newBlogPost = await blogModel.create(newBlog);
  // res.send(newBlogPost);
};

const postedBolgs = async (req, res) => {
  const id = req.params.id;
  const blogs = await blogModel.find({ author: id });

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
    res.status(404).send("blog not found...!");
  }
};
const deleteBlog = async (req, res) => {
  const id = req.params.id;
  const removeblog = await blogModel.findOneAndDelete({ blogId: id });
  if (removeblog) {
    res.status(200).send("post deleted");
  } else {
    res.status(400).send("something went wrong");
  }
};
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
module.exports = {
  authorRegister,
  authorLogin,
  getAccount,
  createBlog,
  postedBolgs,
  blogById,
  deleteBlog,
  viewLikes,
  viewComments,
};
