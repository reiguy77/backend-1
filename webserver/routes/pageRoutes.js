const express = require("express");
const router = express.Router();
const pageController = require("../controllers/page.controller");


router.get('/:appId/:pageName', pageController.get);
router.post('', pageController.update);

module.exports = router;