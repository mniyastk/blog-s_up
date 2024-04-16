const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    default: Date.now(),
    required: true,
  },
  savedList: [{ type: mongoose.Schema.Types.ObjectId, ref: "posts" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "author" }],
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
