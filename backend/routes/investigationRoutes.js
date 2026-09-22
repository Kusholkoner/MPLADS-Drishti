const express = require("express");
const router = express.Router();
const {
  getInvestigations,
  getInvestigationById,
  createInvestigation,
  updateInvestigationStatus,
  addInvestigationNote,
} = require("../controllers/investigationController");

router.get("/", getInvestigations);
router.post("/", createInvestigation);
router.get("/:id", getInvestigationById);
router.patch("/:id/status", updateInvestigationStatus);
router.post("/:id/notes", addInvestigationNote);

module.exports = router;
