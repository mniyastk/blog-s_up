const { createToken } = require("../helpers/createToken");
const User = require("../models/userShema");
const Blogs = require("../models/blogShema");
const Author = require("../models/authorShema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { tryCatch } = require("../utils/tryCatch");
const s3 = require("../s3");
const author = require("../models/authorShema");

///////////////////////////////// REGISTER ////////////////////////////////////////

module.exports.register = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    const userExist = await User.findOne({ email: email });
    if (!userExist) {
        const user = await User.create(req.body);
        res.status(200).json("Register successfull");
    } else {
        res.status(409).send("User already exist");
    }
};

///////////////////////////////// GOOGLE AUTH ////////////////////////////////////////

module.exports.googleAuth = async (req, res) => {
    const user = jwt.decode(req.body.credential);
    const { name, email, picture } = user;
    const userExist = await User.findOne({ email: email });
    if (userExist) {
        const token = createToken(email);
        res.cookie("userToken", token, { httpOnly: true });
        res.status(200).json({ Messg: "Login success", user: userExist });
    } else {
        const token = createToken(email);
        res.cookie("userToken", token, { httpOnly: true });
        const userdetails = await User.create({
            username: name,
            email,
            avatar: picture,
        });
        res.status(200).json({ Messg: "Login success", token: req.body.credential, user: userdetails });
    }
};

///////////////////////////////// LOGIN ////////////////////////////////////////

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            const auth = await bcrypt.compare(password, userExist.password);
            if (auth) {
                const token = createToken(email);
                res.cookie("userToken", token, { httpOnly: true });
                res.status(200).json({
                    Messg: "Login success",
                    token: token,
                    user: userExist,
                });
            } else {
                res.status(404).send("Incorrect email or password");
            }
        } else {
            res.status(404).send("Incorrect email or password");
        }
    } catch (error) {
        res.status(404).send("Incorrect email or password");
    }
};

////////////////////////// GET USER ///////////////////////////////////////////////

module.exports.getUser = async (req, res) => {
    const token = req.cookies.userToken;
    if (token) {
        const decoded = jwt.decode(token);
        const user = await User.findOne({ email: decoded.user }).populate("savedList");
        res.status(200).send(user);
    } else {
        res.status(404).send("token not found");
    }
};

///////////////////////////////////// LOGOUT ////////////////////////////////////////

module.exports.logout = async (req, res) => {
    res.cookie("userToken", "", { maxAge: 1 });
    res.send("success");
};

////////////////////////////////////// GET ALL BLOGS //////////////////////////////

module.exports.getBlogs = async (req, res) => {
    const blogs = await Blogs.find().populate("author");
    if (blogs) {
        res.status(200).send(blogs);
    } else {
        res.status(404).send("Blogs not found");
    }
};

///////////////////////////////// USER BLOGS ////////////////////////////////////////

module.exports.postedBolgs = async (req, res) => {
    const id = req.params.id;
    const blogs = await Blogs.find();
    const authorBlogs = blogs.filter((ele) => ele.author == id);

    if (authorBlogs) {
        res.status(200).send(authorBlogs);
    } else {
        res.status(404).send("Blogs not found");
    }
};

///////////////////////////// GET BLOG BY ID //////////////////////////////

module.exports.getBlogById = tryCatch(async (req, res) => {
    const blogId = req.params.id;
    const blog = await Blogs.findOne({ _id: blogId }).populate("comments.postedby").populate("author");
    if (blog) {
        res.status(200).send(blog);
    } else {
        res.status(404).send("blog not found");
    }
});

///////////////////////////// POST COMMENT /////////////////////////////

module.exports.addComment = async (req, res) => {
    const { blogId, userId } = req.params;
    const content = req.body.comment;
    const user = await User.findOne({ _id: userId });
    const comment = await Blogs.findOneAndUpdate(
        { _id: blogId },
        {
            $push: {
                comments: {
                    content: content,
                    created: Date.now(),
                    postedby: user._id,
                },
            },
        }
    );
    res.status(200).send("Comment posted");
};

////////////////////////////// EDIT COMMENT ///////////////////////////

module.exports.editComment = async (req, res) => {
    const { blogId, userId, commentId } = req.params;
    const { editedContent } = req.body;
    const blog = await Blogs.findById(blogId);
    const uComments = blog?.comments?.map((item) => {
        if (item._id == commentId) {
            item.content = editedContent;
        }
        return item;
    });
    blog.comments = uComments;
    await blog.save();
    res.status(200).send("success");
};

//////////////////////////// REMOVE COMMENT ////////////////////////////

module.exports.removeComment = async (req, res) => {
    const { blogId, commentId } = req.params;

    const blog = await Blogs.findById(blogId);
    const uComments = blog?.comments?.filter((item) => item._id != commentId);

    blog.comments = uComments;
    await blog.save();

    res.status(200).send("success");
};

/////////////////////// ADD LIKE //////////////////////////////

module.exports.addLike = async (req, res) => {
    const { blogId, userId } = req.params;

    const user = await User.findOne({ userId: userId });
    const blog = await Blogs.findOne({ blogId: blogId });
    const likes = blog.likes;
    const isLiked = likes.find((like) => like.postedby.equals(user._id));
    if (isLiked) {
        const unlike = blog.likes.filter((item) => !item.postedby.equals(user._id));
        await Blogs.findOneAndUpdate(
            { blogId: blogId },
            {
                $set: {
                    likes: unlike,
                },
            }
        );
        res.send("Unliked");
    } else {
        await Blogs.findOneAndUpdate(
            { blogId: blogId },
            {
                $push: {
                    likes: {
                        postedby: user._id,
                    },
                },
            }
        );
        res.send("liked");
    }
};

//////////////////////// SAVE BLOG ////////////////////////////

module.exports.saveBlog = async (req, res) => {
    const { blogId, userId } = req.params;
    const user = await User.findById(userId);
    const isExist = user.savedList.find((item) => item._id == blogId);
    if (!isExist) {
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $push: { savedList: blogId },
        });
        res.status(200).send("success");
    }
};

/////////////////////////////// CREATE BLOG //////////////////////////

module.exports.createBlog = async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    const { title, content, category, tags, image } = req.body;
    const tagsArray = tags.split(",").map((tag, index) => tag.trim());
    const params = {
        Bucket: "blogs-up",
        Key: image,
        Body: image,
    };
    // const data = await s3.upload(params).promise();
    // const imageUrl = data.Location;

    const newBlog = await Blogs.create({
        title: title,
        content: content,
        category: category,
        tags: tagsArray,
        author: user._id,
        // image: imageUrl,
    });
    await User.findOneAndUpdate({ userId: userId }, { $push: { blogsId: newBlog._id } });
    res.status(200).send(newBlog);
};

/////////////////////////// UPDATE BLOG /////////////////////////////

module.exports.updateBlog = async (req, res) => {
    const id = req.params.id;
    const blog = await Blogs.findById(id);
    const { title, content, category, tags, image } = req.body;
    const oldTag = blog.tags;
    // const tagsArray = tags.split(",").map((tag, index) => tag.trim());

    const params = {
        Bucket: "blogs-up",
        Key: image,
        Body: image,
    };
    // const oldImage = blog.image;
    // let imageurl = "";
    // if (oldImage === image) {
    //     imageurl = image;
    // } else {
    //     const data = await s3.upload(params).promise();
    //     imageurl = data.Location;
    // }

    const updatedBlog = await Blogs.findByIdAndUpdate(id, {
        $set: {
            title: title,
            content: content,
            category: category,
            tags: tags,
            // image: imageurl,
        },
    });

    if (updatedBlog) {
        res.status(200).send("Successfully updated");
    } else {
        res.status(400).send("something went wrong");
    }
};

/////////////////////////// DELETE BLOG ////////////////////////

module.exports.deleteBlog = async (req, res) => {
    const id = req.params.id;
    const authorId = req.params.authorid;
    const user = await User.findById(authorId);

    const updatedBlog = user.blogsId.filter((item) => item._id != id);
    const removeblog = await Blogs.findOneAndDelete({ _id: id });
    const userBlogs = await User.findOneAndUpdate(user._id, {
        $set: {
            blogsId: updatedBlog,
        },
    });
    if (removeblog && userBlogs) {
        res.status(200).send("success");
    } else {
        res.status(400).send("something went wrong");
    }
};

///////////////////////// FOLLOWING ////////////////////////

module.exports.follow = async (req, res) => {
    const { authorId, userId } = req.params;

    await User.findByIdAndUpdate(userId, {
        $push: {
            following: authorId,
        },
    });
    await User.findByIdAndUpdate(authorId, {
        $push: {
            followers: userId,
        },
    });
    res.status(200).send("Followed");
};

//////////////////////// UNFOLLOW ///////////////////////

module.exports.unFollow = async (req, res) => {
    const { authorId, userId } = req.params;
    const user = await User.findById(userId);
    const author = await User.findById(authorId);
    const uFollowers = author.followers.filter((item) => item._id != userId);
    const uFollingList = user.following.filter((item) => item._id != authorId);
    author.followers = uFollowers;
    user.following = uFollingList;
    await user.save();
    await author.save();
    res.status(200).send("unfollowed");
};

//////////////////////////// GET FOLLOWING //////////////////////////

module.exports.getFollowing = async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("following");
    res.status(200).send(user.following);
};

///////////////////////////// GET FOLLOWERS //////////////////////////

module.exports.getFollowers = async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("followers");
    res.status(200).send(user.followers);
};

////////////////////////////// UNSAVE BLOG ////////////////////////////

module.exports.unSaveBlog = async (req, res) => {
    const { blogId, userId } = req.params;
    const user = await User.findById(userId);
    const isExist = user.savedList.find((item) => item._id == blogId);

    if (isExist) {
        const uSavedList = user.savedList.filter((item) => item._id != blogId);
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $set: { savedList: uSavedList },
        });
        res.status(200).send("success");
    }
};

//////////////////////////// GET SAVED LIST //////////////////////////////

module.exports.getSavedList = async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("savedList");
    res.status(200).send(user.savedList);
};

//////////////////////////// GET BLOGS BY CATEGORY /////////////////////////////

module.exports.getBlogsByCategory = async (req, res) => {
    const category = req.params.category;
    const blogs = await Blogs.find({ category: category }).populate("author");
    if (blogs) {
        res.status(200).send(blogs);
    } else {
        res.status(404).send("Not Found");
    }
};

//////////////////////////////// GET AUTHOR //////////////////

module.exports.getAuther = async (req, res) => {
    const authorId = req.params.id;
    const author = Author.findOne({ authorId: authorId });
    if (author) {
        res.status(200).send(author);
    } else {
        res.status(404).send("Not Found");
    }
};

module.exports.getWatchingHistory = async (req, res) => {
    res.send("user history");
};
