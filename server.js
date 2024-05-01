const express = require("express");
const app = express();
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const authorRoute = require("./routes/authorRoute");
const adminRoute = require("./routes/adminRoute");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

require("dotenv").config();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "https://blogsup.vercel.app",
    credentials: true,
  })
);

try {
  mongoose
  .connect(
    "mongodb+srv://blogsup:09779346@cluster0.9iogxhx.mongodb.net/blog'sUp"
  )
  .then(() => console.log("db connected"))
  .catch((err) => {
    console.log(err.message);
  });
} catch (error) {
  console.log(error.message);
}

app.use("/api/author", authorRoute);
app.use("/api/user", userRoute); 
app.use("/api/admin", adminRoute);

app.listen(3005, () => {
  console.log("server running ");
});
