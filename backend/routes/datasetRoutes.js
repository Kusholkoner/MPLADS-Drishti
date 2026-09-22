const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  getDatasets,
  getDatasetById,
  getNationalDatasetSummary,
  ingestESakshiFile,
  getDynamicSlots,
  dynamicIngestFiles,
  adminIngestAllFiles,
  getActiveScope,
  restoreScope,
  getUploadedReports,
  getUploadedBatchById,
} = require("../controllers/datasetController");

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage, limits: { fileSize: 25 * 1024 * 1024 } });

const multiSlotUpload = upload.fields([
  { name: "slot_recommended", maxCount: 1 },
  { name: "slot_sanctioned", maxCount: 1 },
  { name: "slot_completed", maxCount: 1 },
  { name: "slot_expenditure", maxCount: 1 },
  { name: "slot_limits", maxCount: 1 },
  { name: "slot_calamity", maxCount: 1 },
]);

router.get("/slots", getDynamicSlots);
router.post("/dynamic-ingest", multiSlotUpload, dynamicIngestFiles);
router.post("/admin/ingest-all", adminIngestAllFiles);
router.get("/scope", getActiveScope);
router.post("/scope/restore", restoreScope);
router.get("/reports", getUploadedReports);
router.get("/reports/:batchId", getUploadedBatchById);
router.get("/summary/national", getNationalDatasetSummary);
router.get("/", getDatasets);
router.post("/ingest-esakshi", upload.single("file"), ingestESakshiFile);
router.get("/:id", getDatasetById);

module.exports = router;
