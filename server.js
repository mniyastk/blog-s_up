const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authorRoute = require("./routes/authorRoute");
require("dotenv").config();
mongoose
  .connect("mongodb+srv://blogsup:09779346@cluster0.9iogxhx.mongodb.net/blog'sUp")
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log(err));
app.use(express.json());
app.use("/author", authorRoute);

app.listen(3005, () => {
  console.log("server running ");
}); 
  