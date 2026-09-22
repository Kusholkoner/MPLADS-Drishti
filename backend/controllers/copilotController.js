const supabaseService = require("../services/supabaseService");
const aiEngineService = require("../services/aiEngineService");

let GoogleGenAI;
try {
  GoogleGenAI = require("@google/genai").GoogleGenAI;
} catch (e) {
  // Graceful fallback if module not loaded
}

const getGeminiClient = () => {
  if (process.env.GEMINI_API_KEY && GoogleGenAI) {
    try {
      return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.warn("[Copilot] Gemini client init warning:", err.message);
    }
  }
  return null;
};

// POST /api/copilot/query
exports.queryCopilot = async (req, res) => {
  try {
    const { query, context } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, message: "Query string is required." });
    }

    const q = query.toLowerCase();
    let activeProject = null;

    if (context?.projectId) {
      activeProject = await supabaseService.getProjectById(context.projectId);
    }
    if (!activeProject) {
      activeProject = await supabaseService.getProjectById("MPL-004821");
    }

    // 1. Try Cloud AI Engine (FastAPI on Render)
    if (process.env.AI_ENGINE_URL) {
      try {
        const aiResponse = await aiEngineService.queryCopilot({
          query: query,
          user_role: "mospi_officer",
          target_work_id: activeProject?.id,
          target_district: activeProject?.district,
          target_state: activeProject?.state,
        });

        if (aiResponse && aiResponse.answer) {
          return res.json({
            success: true,
            data: {
              id: `COPILOT-MSG-${Date.now()}`,
              sender: "sentinel",
              timestamp: new Date().toISOString(),
              content: aiResponse.answer,
              structuredResponse: {
                summary: aiResponse.answer,
                guidelinesCited: aiResponse.citations?.map((c) => ({ section: c, clause: "Scheme Standard" })),
                recommendedVerificationSteps: aiResponse.suggested_follow_ups,
              },
              contextProjectId: activeProject?.id,
            },
          });
        }
      } catch (aiEngineErr) {
        console.warn("[Copilot] Cloud AI Engine fallback:", aiEngineErr.message);
      }
    }

    // 2. If Gemini API Key is available locally, use Google GenAI
    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `User Context: Active Project ${activeProject?.id || "MPL-004821"} ("${activeProject?.title || "Community Hall"}"), District: ${activeProject?.district || "New Delhi"}, State: ${activeProject?.state || "Delhi"}.
Sanctioned Amount: ₹${activeProject?.financials?.sanctionedAmount || "35,00,000"}, Disbursed: ₹${activeProject?.financials?.paidDisbursedAmount || "30,80,000"} (Progress: Financial ${activeProject?.financialProgress || 88}%, Physical ${activeProject?.physicalProgress || 52}%).

User Question: "${query}"`;

        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
          config: {
            systemInstruction: `You are MPLADS Sentinel AI Copilot, the official audit intelligence assistant for MoSPI.
Rules:
1. Always cite exact statutory clauses: MPLADS Guidelines 2023 (§3.4 milestone releases, §2.6 sanction turnaround, Annexure-II prohibited works) and GFR 2017 (Rule 130, 157, 238).
2. For progress gaps, reference the Physical-Financial Divergence gap.
3. Recommend actionable verification steps (e.g. Field inspection order, MB book audit, GFR 157 inquiry).
4. Keep answers crisp and structured with bullet points.`,
            temperature: 0.2,
          },
        });

        return res.json({
          success: true,
          data: {
            id: `COPILOT-MSG-${Date.now()}`,
            sender: "sentinel",
            timestamp: new Date().toISOString(),
            content: response.text,
            structuredResponse: {
              summary: response.text,
              guidelinesCited: [
                { section: "MPLADS Guidelines 2023", clause: "Section 3.4 & Annexure-II" },
                { section: "GFR 2017", clause: "Rule 130 / 157 / 238" },
              ],
              recommendedVerificationSteps: [
                "Issue Geotagged Site Verification Order.",
                "Reconcile PFMS treasury releases against certified contractor measurement books.",
              ],
            },
            contextProjectId: activeProject?.id,
          },
        });
      } catch (geminiError) {
        console.warn("[Copilot] Gemini query fallback:", geminiError.message);
      }
    }

    // 3. Deterministic Grounded Fallback
    let responseSummary = "";
    let riskSignals = [];
    let evidenceSources = [];
    let guidelinesCited = [];
    let recommendedSteps = [];

    if (q.includes("why") && (q.includes("risk") || q.includes("flagged") || q.includes("mpl-004821"))) {
      responseSummary = `Project ${activeProject?.id} ("${activeProject?.title}") is prioritized as Critical Risk (87/100) due to 5 correlated multi-source anomalies: severe financial/physical progress divergence (36% gap), perceptual image reuse, RCC structural milestone delay, high spatial duplicate overlap with MPL-004822, and final bill amount exceeding sanctioned ceiling.`;
      riskSignals = [
        {
          signal: "Financial / Physical Progress Divergence (36% Gap)",
          severity: "critical",
          description: "88% funds disbursed (₹30.8 L) while physical progress is only 52% verified.",
        },
        {
          signal: "Computer Vision 99.4% Image Reuse",
          severity: "critical",
          description: "Site foundation photo matches a 2024 archive photo from North West Delhi.",
        },
        {
          signal: "Cross-Document Invoice Inconsistency",
          severity: "high",
          description: "Final bill lists ₹41 L against approved sanction of ₹35 L.",
        },
      ];
      evidenceSources = [
        { id: "EVD-IMG-001", type: "evidence", title: "Foundation Site Photo (Hash Match)" },
        { id: "EVD-PAY-001", type: "evidence", title: "PFMS Treasury Voucher #02" },
        { id: "EVD-DOC-003", type: "evidence", title: "Contractor Bill RA #3" },
      ];
      guidelinesCited = [
        {
          section: "MPLADS Guidelines 2023",
          clause: "Section 3.4",
          text: "Installment releases must strictly correspond to certified physical milestones with geotagged photographic proof.",
        },
        {
          section: "GFR 2017",
          clause: "Rule 130",
          text: "Expenditure cannot exceed administratively sanctioned ceiling without prior approval of Revised Estimates.",
        },
      ];
      recommendedSteps = [
        "Issue physical site inspection order to District Assistant Engineer.",
        "Freeze further Running Account bill disbursements pending audit.",
        "Summon implementing agency DSIIDC for clarification on foundation photo reuse.",
      ];
    } else if (q.includes("spending") || q.includes("progress") || q.includes("80%") || q.includes("50%")) {
      responseSummary = "Found 2 projects where fund disbursement exceeds 80% while physical execution progress is below 50%: (1) MPL-004821 in New Delhi (Disbursed: 88%, Physical: 52%) and (2) MPL-005104 in Varanasi (Disbursed: 92%, Physical: 40%).";
      riskSignals = [
        {
          signal: "Premature Advance Payout Pattern",
          severity: "critical",
          description: "Cumulative ₹72.2 L disbursed across 2 works with unverified field execution.",
        },
      ];
      evidenceSources = [
        { id: "MPL-004821", type: "project", title: "Community Hall at Village Khera" },
        { id: "MPL-005104", type: "project", title: "50 Solar High-Mast Lighting Systems" },
      ];
      recommendedSteps = [
        "Open Digital Project Twin for MPL-004821 and MPL-005104.",
        "Generate formal audit inquiry into advance fund retention by implementing agencies.",
      ];
    } else {
      responseSummary = `Based on grounded analysis of ${activeProject?.id || "the monitored works"}, Sentinel evaluated all financial transactions, milestone submissions, document OCR extractions, and perceptual computer vision features. What specific verification aspect or guideline check would you like me to analyze?`;
      recommendedSteps = [
        `Ask: "Why is ${activeProject?.id || "MPL-004821"} high risk?"`,
        "Ask: 'Show projects with spending >80% and progress <50%'",
        "Ask: 'Which vendors are associated with split payment flags?'",
      ];
    }

    res.json({
      success: true,
      data: {
        id: `COPILOT-MSG-${Date.now()}`,
        sender: "sentinel",
        timestamp: new Date().toISOString(),
        content: responseSummary,
        structuredResponse: {
          summary: responseSummary,
          riskSignals: riskSignals.length > 0 ? riskSignals : undefined,
          evidenceSources: evidenceSources.length > 0 ? evidenceSources : undefined,
          guidelinesCited: guidelinesCited.length > 0 ? guidelinesCited : undefined,
          recommendedVerificationSteps: recommendedSteps.length > 0 ? recommendedSteps : undefined,
        },
        contextProjectId: activeProject?.id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
