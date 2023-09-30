const express = require("express");
const router = express.Router();
goalCategory = require("../controllers/goalCategory.controller.js");

router.post("/", goalCategory.createCategory);
router.get("/", goalCategory.getAllCategories);
router.delete("/:id", goalCategory.deleteCategory);
router.put("/:id", goalCategory.updateCategory);

module.exports = router;