const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");
const { authorAuth } = require("../middlewares/authorAuth");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/register", authorController.authorRegister);
router.post("/login", authorController.authorLogin);
router.get("/getaccount/:id", authorController.getAccount);
router.post(
  "/createblog/:id",
  upload.single("image"), 
  authorController.createBlog
);
router.get("/allblogs/:id", authorController.postedBolgs);
router.get("/blogbyid/:id", authorAuth, authorController.blogById);
router.delete("/removeblog/:id", authorAuth, authorController.deleteBlog);
router.get("/likes/:id", authorAuth, authorController.viewLikes);
router.get("/comments/:id", authorAuth, authorController.viewComments);
module.exports = router;
