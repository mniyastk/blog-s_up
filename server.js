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
        origin: "https://blogsup.shop",
        credentials: true,
    })
);

try {
    mongoose
        .connect(process.env.MONGO_CONNECTION_STRING)
        .then(() => console.log("db connected"))
        .catch((err) => {
            console.log(err.message);
        });
} catch (error) {
    console.log(error.message);
}

app.use("/author", authorRoute);
app.use("/user", userRoute);
app.use("/admin", adminRoute);

app.listen(process.env.PORT, () => {
    console.log("server running ");
});
