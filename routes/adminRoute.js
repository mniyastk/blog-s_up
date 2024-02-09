const express = require("express");
const router = express.Router();
const adminControl = require("../controllers/adminController");
const { adminAuth } = require("../middlewares/adminAuth");

router.post("/login", adminControl.adminLogin);
router.get("/users", adminAuth, adminControl.allUsers);
router.get("/user/:id", adminAuth, adminControl.userById);
router.get("/authors", adminAuth, adminControl.allAuthors);
router.get("/author/:id", adminAuth, adminControl.authorById);
router.get("/blogs", adminAuth, adminControl.allBlogs);
router.get("/blog/:id", adminAuth, adminControl.blogById);
router.delete("user/:id", adminAuth, adminControl.deleteUser);
router.delete("author/:id", adminAuth, adminControl.deleteAuthor);
router.delete("blog/:id", adminAuth, adminControl.deleteBlog);
router.get("/stats", adminAuth, adminControl.stats);
router.get("/blogs/:category", adminAuth, adminControl.blogByCategory);
module.exports = router;
