const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");

router.get("/log", authorController.authorlog);
module.exports = router;
