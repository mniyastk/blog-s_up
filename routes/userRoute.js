const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { userAuth } = require("../middlewares/userAuth");

const upload = require("../middlewares/multer");

router.post("/register", userController.register);
router.post("/googleauth", userController.googleAuth);
router.post("/login", userController.login);
router.delete("/signout", userController.logout);
router.get("/blogs", userController.getBlogs);
router.get("/getuser", userController.getUser);
router.get("/blog/:id", userController.getBlogById);
router.get("/blogs/:category", userController.getBlogsByCategory);
router.post("/comment/:blogId/:userId", userController.addComment);
router.put("/editcomment/:blogId/:userId/:commentId", userController.editComment);
router.delete("/removecomment/:blogId/:commentId", userController.removeComment);
router.post("/like/:blogId/:userId", userController.addLike);
// router.get("/blog/history", userController.getWatchingHistory);
router.post("/blog/save/:blogId/:userId", userController.saveBlog);
router.post("/follow/:authorId/:userId", userController.follow);
router.post("/createblog/:userId", upload.single("image"), userController.createBlog);
router.get("/allblogs/:id", userController.postedBolgs);
router.delete("/unfollow/:authorId/:userId", userController.unFollow);
router.put("/updateblog/:id", userController.updateBlog);
router.delete("/delete/:id/:authorid", userController.deleteBlog);
router.get("/getfollowing/:userId", userController.getFollowing);
router.get("/getfollowers/:userId", userController.getFollowers);
router.delete("/blog/unsave/:blogId/:userId", userController.unSaveBlog);
router.get("/savedlist/:userId", userController.getSavedList);
router.get("/auther/:id", userController.getAuther);

module.exports = router;
