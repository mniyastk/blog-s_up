const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { userAuth } = require("../middlewares/userAuth");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/blogs", userAuth, userController.getBlogs);
router.get("/blog/:id", userController.getBlogById);
router.get("/blogs/:category", userController.getBlogsByCategory);
router.post("/comment/:blogId/:userId", userController.addComment);
router.post("/like/:blogId/:userId", userController.addLike);
router.get("/blog/history", userController.getWatchingHistory);
router.get("/auther/:id", userController.getAuther);

module.exports = router;
