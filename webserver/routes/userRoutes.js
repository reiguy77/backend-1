const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/", userController.create);
router.put("/:id", userController.update);

router.post("/verifyUser", userController.find);

module.exports = router;