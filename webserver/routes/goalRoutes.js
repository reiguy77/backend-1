
const express = require("express");
const router = express.Router();
const goal = require("../controllers/goals/goal.controller.js");

router.post("/", goal.create);
router.get("/:id", goal.findAll);
router.delete("/:id", goal.delete);
router.delete("/", goal.deleteAll);
router.put("/:id", goal.update);


 
module.exports = router;