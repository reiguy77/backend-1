
const express = require("express");
const router = express.Router();
const goal = require("../controllers/goal.controller.js");

router.post("/", goal.create);
router.get("/", goal.findAll);
router.get("/:categoryId", goal.findSpecificCategory);
router.delete("/:id", goal.delete);
router.delete("/", goal.deleteAll);
router.put("/:id", goal.update);


 
module.exports = router;