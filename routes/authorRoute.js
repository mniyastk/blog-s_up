const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");

router.post("/register", authorController.authorRegister);
router.post("/login", authorController.authorLogin);
router.get("/getaccount", authorController.getAccount);
router.post("/createblog", authorController.createBlog);
router.get("/blogbyid/:id", authorController.blogById);
router.delete("/removeblog/:id", authorController.deleteBlog);
router.get("/likes/:id", authorController.viewLikes);
router.get("/comments/:id", authorController.viewComments);
module.exports = router;
