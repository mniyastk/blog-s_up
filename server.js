const express = require("express");
const app = express();
const userRoute = require("./routes/userRoute");
const authorRoute = require("./routes/authorRoute");

const mongoose = require("mongoose");

require("dotenv").config();

mongoose
  .connect(
    "mongodb+srv://blogsup:09779346@cluster0.9iogxhx.mongodb.net/blog'sUp"
  )
  .then(() => console.log("db connected"))
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());

app.use("/user", userRoute);

app.use("/author", authorRoute);

app.listen(3005, () => {
  console.log("server running ");
});
