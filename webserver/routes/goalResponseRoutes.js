const express = require("express");
const router = express.Router();
goalResponse = require("../controllers/goalResponse.controller.js");
 
router.post("/", goalResponse.create);
router.get("/", goalResponse.findAll);
router.get("/:goalId", goalResponse.findByGoalId);
// router.get("/:id", goalResponse.findOne);
router.delete("/:id", goalResponse.delete);
router.delete("/", goalResponse.deleteAll);
router.put("/:id", goalResponse.update);


module.exports = router; 