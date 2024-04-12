const mongose = require("mongoose");
const bcrypt = require("bcrypt");

const authorSchema = new mongose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
  },
  image:{
    type:String
  },
  blogsId: [
    {
      type: mongose.Schema.Types.ObjectId,
      ref: "posts",
    },
  ],
  authorId: {
    type: String,
    default: Date.now(),
  },
});
authorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const author = mongose.model("author", authorSchema);
module.exports = author;
