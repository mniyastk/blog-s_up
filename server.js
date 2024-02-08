const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authorRoute = require("./routes/authorRoute");
require("dotenv").config();

app.use("/author", authorRoute);

mongoose.connect("mongodb://localhost:27017/blogsup");

app.listen(3005, () => {
  console.log("server running ");
});
