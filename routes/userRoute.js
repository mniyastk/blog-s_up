const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { userAuth } = require("../middlewares/userAuth");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.delete("/signout", userController.logout);
router.get("/blogs", userController.getBlogs);
router.get("/getuser", userController.getUser);
router.get("/blog/:id", userController.getBlogById);
router.get("/blogs/:category", userController.getBlogsByCategory);
router.post("/comment/:blogId/:userId", userController.addComment);
router.put(
  "/editcomment/:blogId/:userId/:commentId",
  userController.editComment
);
router.delete(
  "/removecomment/:blogId/:commentId",
  userController.removeComment
);
router.post("/like/:blogId/:userId", userController.addLike);
// router.get("/blog/history", userController.getWatchingHistory);
router.post("/blog/save/:blogId/:userId", userController.saveBlog);
router.post("/follow/:authorId/:userId", userController.follow);
router.delete("/unfollow/:authorId/:userId", userController.unFollow);
router.get("/getfollowing/:userId", userController.getFollowing);
router.delete("/blog/unsave/:blogId/:userId", userController.unSaveBlog);
router.get("/savedlist/:userId", userController.getSavedList);
router.get("/auther/:id", userController.getAuther);

module.exports = router;
