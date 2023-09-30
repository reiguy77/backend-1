const express = require("express");
const router = express.Router();
const tokenController = require("../controllers/token.controller");


router.post('/', tokenController.getNewToken);
router.delete('/', tokenController.delete);
router.post('/verifyAccessToken', tokenController.verifyAccessToken);

module.exports = router;
