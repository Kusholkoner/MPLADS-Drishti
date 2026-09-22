const express = require("express");
const router = express.Router();
const {
  getNationalAnalytics,
  getStateMetrics,
  getStateBySlug,
  getDistrictMetrics,
  getGeographicRiskPoints,
} = require("../controllers/analyticsController");

router.get("/national", getNationalAnalytics);
router.get("/states", getStateMetrics);
router.get("/states/:state", getStateBySlug);
router.get("/districts", getDistrictMetrics);
router.get("/geopoints", getGeographicRiskPoints);

module.exports = router;
