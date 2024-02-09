const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController")


router.post("/register",userController.register)
router.post("/login",userController.login)
router.get('/posts',userController.getPosts)
router.get('/post/:id',userController.getPostsById)
router.get('/post/:category',userController.getPostsByCategory)
router.get('/post/history',userController.getWatchingHistory)
router.get('/auther/:id',userController.getAuther)



module.exports = router;
