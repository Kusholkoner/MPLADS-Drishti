const express = require("express");
const router = express.Router();
const { getProjects, getProjectById, exportProjectsCSV } = require("../controllers/projectController");

router.get("/", getProjects);
router.get("/export/csv", exportProjectsCSV);
router.get("/:id", getProjectById);

module.exports = router;
