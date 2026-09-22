const supabaseService = require("../services/supabaseService");

// GET /api/projects
exports.getProjects = async (req, res) => {
  try {
    const {
      search,
      state,
      district,
      category,
      riskLevel,
      status,
      minRiskScore,
      sortBy = "riskScore",
      sortOrder = "desc",
      page = 1,
      limit = 20,
    } = req.query;

    const filters = {
      search,
      state,
      district,
      category,
      riskLevel,
      status,
      minRiskScore,
      sortBy,
      sortOrder,
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 20,
      userRole: req.user?.role || req.profile?.role || req.headers["x-demo-role"] || req.headers["x-user-role"],
    };

    const { projects, total } = await supabaseService.getProjects(filters);

    res.json({
      success: true,
      data: projects,
      pagination: {
        total,
        page: filters.page,
        totalPages: Math.ceil(total / filters.limit) || 1,
        limit: filters.limit,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/projects/:id
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await supabaseService.getProjectById(id);

    if (!project) {
      return res.status(404).json({ success: false, message: `Project ${id} not found.` });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/projects/export/csv
exports.exportProjectsCSV = async (req, res) => {
  try {
    const { projects } = await supabaseService.getProjects({ limit: 1000 });
    let csv = "Project ID,Title,Category,State,District,Hon'ble MP,Agency,Sanctioned (INR),Disbursed (INR),Risk Score,Risk Level,Primary Signal\n";

    projects.forEach((p) => {
      csv += `"${p.id}","${(p.title || "").replace(/"/g, '""')}","${p.category}","${p.state}","${p.district}","${p.mpName || p.mp_name || ""}","${p.implementingAgency || p.implementing_agency || ""}",${p.financials?.sanctionedAmount || 0},${p.financials?.paidDisbursedAmount || 0},${p.risk?.score || 0},"${p.risk?.level || "low"}","${(p.risk?.primarySignal || "").replace(/"/g, '""')}"\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("MPLADS_Sentinel_Projects_Registry.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
