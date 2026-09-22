const express = require("express");
const router = express.Router();
const multer = require("multer");
const { getEvidence, getEvidenceById, uploadEvidence } = require("../controllers/evidenceController");

// Configure multer memory storage with 25 MB ceiling for evidence binaries (photos, PDFs, scans)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

router.get("/", getEvidence);
router.post("/", upload.single("file"), uploadEvidence);
router.get("/:id", getEvidenceById);

module.exports = router;
