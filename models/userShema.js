const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    userId: {
        type: String,
        default: Date.now(),
        required: true,
    },
    avatar: {
        type: String,
        required: true,
        default: "https://res.cloudinary.com/dunf6rko6/image/upload/v1715858011/avatar_adwhnn.png",
    },
    blogsId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "posts",
        },
    ],
    savedList: [{ type: mongoose.Schema.Types.ObjectId, ref: "posts" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
