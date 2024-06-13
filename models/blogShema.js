const mongoose = require("mongoose");

const blogsShema = new mongoose.Schema({
  blogId: {
    type: String,
    default: Date.now(),
  },
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  image: {
    type: String,
  },
  category: {
    type: String,
  },
  tags: {
    type: [{ type: String }],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  comments: [
    {
      content: String,
      created: { type: Date, default: Date.now() },
      postedby: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    },
  ],
  likes: [
    {
      postedby: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    },
  ],
});

const blogs = mongoose.model("posts", blogsShema);

module.exports = blogs;
