const express = require("express");
const router = express.Router();
const { queryCopilot } = require("../controllers/copilotController");

router.post("/query", queryCopilot);

module.exports = router;
