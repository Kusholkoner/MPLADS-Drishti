const express = require("express");
const router = express.Router();
const {
  evaluateProposal,
  checkDuplicates,
  verifyImage,
  analyzeProgressDivergence,
  getNetworkGraph,
  predictRisk,
  simulateAttack,
  analyzeWork,
  computeSemanticSimilarity,
  submitFeedbackDisposition,
} = require("../controllers/aiEngineController");

// Standard AI Pipeline Routes
router.post("/proposal-check", evaluateProposal);
router.post("/duplicate-check", checkDuplicates);
router.post("/vision-verify", verifyImage);
router.post("/financial-physical-divergence", analyzeProgressDivergence);
router.get("/graph-network", getNetworkGraph);
router.post("/predictive-risk", predictRisk);
router.post("/attack-simulator", simulateAttack);

// Direct 21-Module AI Engine Proxies
router.post("/analyze-work", analyzeWork);
router.post("/semantic-similarity", computeSemanticSimilarity);
router.post("/feedback/disposition", submitFeedbackDisposition);

module.exports = router;
