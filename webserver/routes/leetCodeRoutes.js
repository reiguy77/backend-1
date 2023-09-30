const express = require("express");
const router = express.Router();
const leetCodeController = require("../controllers/leetCode.controller");

router.post("/", leetCodeController.getLeetCodeData);



module.exports = router;