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
router.get("/getauthor", authorController.getAuthor);
router.post(
  "/createblog/:id", 
  upload.single("image"),
  authorController.createBlog
);

router.get("/blogbyid/:id", authorController.blogById);
router.delete("/delete/:id/:authorid", authorController.deleteBlog);
// router.put("/update/:id", authorController.updateBlog);
router.put("/updateaccount/:id", authorController.updateAccount);
router.get("/likes/:id", authorController.viewLikes);
router.get("/comments/:id", authorController.viewComments);
router.get("/stats/:id", authorController.accountStats);
module.exports = router;
