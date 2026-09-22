const supabaseService = require("../services/supabaseService");

// GET /api/analytics/national
exports.getNationalAnalytics = async (req, res) => {
  try {
    const data = await supabaseService.getNationalAnalytics();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/analytics/states
exports.getStateMetrics = async (req, res) => {
  try {
    const data = await supabaseService.getStateMetrics();
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/analytics/states/:state
exports.getStateBySlug = async (req, res) => {
  try {
    const { state } = req.params;
    const formatted = state.replace(/-/g, " ");
    const states = await supabaseService.getStateMetrics();
    const st = states.find((s) => s.state.toLowerCase() === formatted.toLowerCase());

    if (!st) {
      return res.status(404).json({ success: false, message: `State ${state} not found.` });
    }

    res.json({ success: true, data: st });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/analytics/districts
exports.getDistrictMetrics = async (req, res) => {
  try {
    const { state } = req.query;
    const districts = [
      { district: "New Delhi", state: "Delhi", totalWorks: 284, totalSanctionedLakhs: 7200, totalExpenditureLakhs: 5800, highRiskWorks: 7, criticalWorks: 3, averageRiskScore: 44.2, delayedWorksPercent: 32 },
      { district: "Jaipur", state: "Rajasthan", totalWorks: 320, totalSanctionedLakhs: 8400, totalExpenditureLakhs: 7100, highRiskWorks: 5, criticalWorks: 2, averageRiskScore: 31.4, delayedWorksPercent: 22 },
      { district: "Jodhpur", state: "Rajasthan", totalWorks: 240, totalSanctionedLakhs: 6100, totalExpenditureLakhs: 5200, highRiskWorks: 3, criticalWorks: 1, averageRiskScore: 26.8, delayedWorksPercent: 18 },
      { district: "Varanasi", state: "Uttar Pradesh", totalWorks: 412, totalSanctionedLakhs: 9800, totalExpenditureLakhs: 7100, highRiskWorks: 9, criticalWorks: 3, averageRiskScore: 42.1, delayedWorksPercent: 38 },
      { district: "Lucknow", state: "Uttar Pradesh", totalWorks: 380, totalSanctionedLakhs: 9100, totalExpenditureLakhs: 7400, highRiskWorks: 6, criticalWorks: 2, averageRiskScore: 36.2, delayedWorksPercent: 27 },
      { district: "Pune", state: "Maharashtra", totalWorks: 395, totalSanctionedLakhs: 9400, totalExpenditureLakhs: 7900, highRiskWorks: 6, criticalWorks: 2, averageRiskScore: 35.8, delayedWorksPercent: 24 },
      { district: "Patna", state: "Bihar", totalWorks: 340, totalSanctionedLakhs: 8100, totalExpenditureLakhs: 6000, highRiskWorks: 5, criticalWorks: 2, averageRiskScore: 38.4, delayedWorksPercent: 41 },
      { district: "Bengaluru Urban", state: "Karnataka", totalWorks: 360, totalSanctionedLakhs: 8900, totalExpenditureLakhs: 7500, highRiskWorks: 4, criticalWorks: 1, averageRiskScore: 29.5, delayedWorksPercent: 19 },
      { district: "Wayanad", state: "Kerala", totalWorks: 210, totalSanctionedLakhs: 5100, totalExpenditureLakhs: 4600, highRiskWorks: 1, criticalWorks: 0, averageRiskScore: 16.8, delayedWorksPercent: 8 },
    ];
    let filtered = districts;
    if (state && state !== "all") {
      filtered = filtered.filter((d) => d.state.toLowerCase() === state.toLowerCase());
    }
    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/analytics/geopoints
exports.getGeographicRiskPoints = async (req, res) => {
  try {
    const data = await supabaseService.getGeographicRiskPoints();
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
