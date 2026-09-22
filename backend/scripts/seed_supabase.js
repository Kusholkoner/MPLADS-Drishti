const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || SUPABASE_URL.includes("your-project-id")) {
  console.warn("⚠️ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured in backend/.env.");
  console.warn("👉 Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env before running seeder.");
  console.log("ℹ️ Note: The application will continue running with the built-in fallback data engine.");
  process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const sampleProjects = [
  {
    id: "MPL-004821",
    title: "Construction of Multipurpose Community Hall at Village Khera",
    category: "Community Infrastructure",
    state: "Delhi",
    district: "New Delhi",
    constituency: "New Delhi PC-04",
    mp_name: "Smt. Meenakshi Lekhi",
    mp_house: "Lok Sabha",
    implementing_agency: "Delhi State Industrial and Infrastructure Development Corp (DSIIDC)",
    status: "in_progress",
    financial_progress: 88,
    physical_progress: 52,
    financials: {
      recommendedAmount: 3500000,
      sanctionedAmount: 3500000,
      committedAmount: 3500000,
      paidDisbursedAmount: 3080000,
      verifiedExpenditureAmount: 2920000,
      unreconciledGap: 160000,
      comparableMedianAmount: 2660000,
      costDeviationPercent: 31.4,
    },
    dates: {
      recommendedDate: "2025-08-15",
      sanctionedDate: "2025-10-10",
      workOrderDate: "2025-10-28",
      expectedCompletionDate: "2026-06-30",
    },
    gps_coordinates: { latitude: 28.5832, longitude: 77.1645 },
    risk: {
      score: 87,
      level: "critical",
      primarySignal: "Severe Financial / Physical Progress Divergence (36% Gap) & Reused Foundation Photo",
      confidence: 0.94,
      breakdown: {
        financialAnomalyScore: 28,
        timelineMilestoneDelayScore: 18,
        visualIntegrityScore: 24,
        documentExtractionScore: 12,
        graphRelationshipScore: 0,
        duplicateScopeScore: 5,
      },
      reasons: [
        {
          id: "RSN-01",
          title: "Premature Fund Disbursement vs Field Milestone Execution",
          category: "Financial Risk",
          severity: "critical",
          scoreContribution: 28,
          confidence: 0.96,
          explanation: "Executing agency disbursed 88% of sanctioned funds (₹30.80 L), but physical inspection verifies only 52% completion.",
          model: "Statistical Velocity Anomaly Detector v2.1",
          evidenceIds: ["EVD-PAY-001", "EVD-DOC-003"],
        },
        {
          id: "RSN-02",
          title: "Perceptual Image Hash Match (Reused Site Photograph)",
          category: "Visual Evidence (CV)",
          severity: "critical",
          scoreContribution: 24,
          confidence: 0.994,
          explanation: "Submitted milestone photograph matches an image uploaded in March 2024 for MPL-002419 with 99.4% similarity.",
          model: "ResNet-50 + Difference Hash Embeddings",
          evidenceIds: ["EVD-IMG-001"],
        },
      ],
    },
    milestones: [
      { id: "M1", sequence: 1, name: "Site Clearance & Excavation", status: "completed", disbursedAmount: 700000, completionPercentage: 100 },
      { id: "M2", sequence: 2, name: "Foundation & Plinth Casting", status: "completed", disbursedAmount: 1050000, completionPercentage: 100 },
      { id: "M3", sequence: 3, name: "Superstructure Masonry & Columns", status: "delayed", disbursedAmount: 1330000, completionPercentage: 40 },
      { id: "M4", sequence: 4, name: "RCC Roof Slab Casting", status: "pending", disbursedAmount: 0, completionPercentage: 0 },
      { id: "M5", sequence: 5, name: "Finishing, Electrification & Handover", status: "pending", disbursedAmount: 0, completionPercentage: 0 },
    ],
    investigation_case_id: "CASE-2026-00128",
  },
  {
    id: "MPL-004822",
    title: "Construction of Community Centre at Village Khera Extension",
    category: "Community Infrastructure",
    state: "Delhi",
    district: "New Delhi",
    constituency: "New Delhi PC-04",
    mp_name: "Smt. Meenakshi Lekhi",
    mp_house: "Lok Sabha",
    implementing_agency: "Delhi State Industrial and Infrastructure Development Corp (DSIIDC)",
    status: "in_progress",
    financial_progress: 60,
    physical_progress: 45,
    financials: {
      recommendedAmount: 3800000,
      sanctionedAmount: 3800000,
      committedAmount: 3800000,
      paidDisbursedAmount: 2280000,
      verifiedExpenditureAmount: 2100000,
      unreconciledGap: 180000,
      comparableMedianAmount: 2750000,
      costDeviationPercent: 38.2,
    },
    dates: {
      recommendedDate: "2025-09-02",
      sanctionedDate: "2025-11-14",
      workOrderDate: "2025-12-01",
      expectedCompletionDate: "2026-08-15",
    },
    gps_coordinates: { latitude: 28.5865, longitude: 77.168 },
    risk: {
      score: 76,
      level: "high",
      primarySignal: "Potential Scope Duplication & Spatial Overlap with MPL-004821 (<450m Distance)",
      confidence: 0.89,
      breakdown: {
        financialAnomalyScore: 16,
        timelineMilestoneDelayScore: 10,
        visualIntegrityScore: 12,
        documentExtractionScore: 8,
        graphRelationshipScore: 10,
        duplicateScopeScore: 20,
      },
      reasons: [],
    },
    milestones: [],
  },
  {
    id: "MPL-005104",
    title: "Installation of 50 High-Mast Solar Lighting Systems",
    category: "Renewable Energy & Lighting",
    state: "Uttar Pradesh",
    district: "Varanasi",
    constituency: "Varanasi PC-77",
    mp_name: "Shri Narendra Modi",
    mp_house: "Lok Sabha",
    implementing_agency: "Uttar Pradesh New & Renewable Energy Development Agency (UPNEDA)",
    status: "in_progress",
    financial_progress: 92,
    physical_progress: 40,
    financials: {
      recommendedAmount: 4500000,
      sanctionedAmount: 4500000,
      committedAmount: 4500000,
      paidDisbursedAmount: 4140000,
      verifiedExpenditureAmount: 3950000,
      unreconciledGap: 190000,
      comparableMedianAmount: 3200000,
      costDeviationPercent: 40.6,
    },
    dates: {
      recommendedDate: "2025-06-10",
      sanctionedDate: "2025-07-20",
      workOrderDate: "2025-08-05",
      expectedCompletionDate: "2026-02-28",
    },
    gps_coordinates: { latitude: 25.3176, longitude: 82.9739 },
    risk: {
      score: 79,
      level: "high",
      primarySignal: "Vendor Price Markup (+40.6% over Benchmark) & Progress Lag",
      confidence: 0.91,
      breakdown: {},
      reasons: [],
    },
    milestones: [],
    investigation_case_id: "CASE-2026-00129",
  },
];

const sampleEvidence = [
  {
    id: "EVD-IMG-001",
    project_id: "MPL-004821",
    project_title: "Multipurpose Community Hall at Village Khera",
    type: "image",
    title: "Foundation Footing Concrete Pouring Inspection Photo",
    status: "conflict",
    file_url: "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1200&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=300&q=80",
    file_size: "3.4 MB",
    mime_type: "image/jpeg",
    provenance: {
      sourceSystem: "eSAKSHI Mobile Inspection App v2.4",
      uploaderId: "AE-NEWDELHI-04",
      uploaderRole: "Assistant Engineer (Civil), DSIIDC",
      uploadedAt: "2025-11-20T14:22:10Z",
      sha256Hash: "8c6976e5b5410415bde3f802111c81ef408e647bbf9e9efc28a8a43fe7d02219",
    },
    metadata: {
      gpsLatitude: 28.7845,
      gpsLongitude: 77.0892,
      captureTimestamp: "2024-03-12T09:14:00Z",
      cameraModel: "Samsung Galaxy SM-G991B",
      exifPreserved: true,
      milestoneId: "M2",
    },
    extracted_fields: [
      { fieldName: "Asset Type", extractedValue: "Concrete Foundation Footing", confidence: 0.98, isConsistent: true },
      { fieldName: "Geotag Consistency", extractedValue: "18.7 km offset from Khera Village", confidence: 0.99, isConsistent: false },
    ],
    findings: [
      { id: "F1", title: "Perceptual Image Hash Reuse", description: "Image matches previous upload for project MPL-002419 from March 2024 with 99.4% similarity.", severity: "critical", confidence: 0.994, modelUsed: "ResNet-50 + dHash" },
    ],
    comparison_evidence_id: "EVD-IMG-ARCHIVE-2024-08",
    comparison_similarity_percent: 99.4,
  },
];

const sampleInvestigations = [
  {
    id: "CASE-2026-00128",
    project_id: "MPL-004821",
    project_title: "Construction of Multipurpose Community Hall at Village Khera",
    state: "Delhi",
    district: "New Delhi",
    category: "Community Infrastructure",
    risk_score: 87,
    primary_issue: "Premature fund disbursement (88%) with reused site foundation photo and structural lag.",
    priority: "urgent",
    status: "under_review",
    summary: "Automated surveillance flagged severe 36% progress gap between treasury release (₹30.80 L) and field execution (52%), combined with image reuse.",
    assigned_to: {
      id: "OFFICER-001",
      name: "Shri Rajesh Verma",
      role: "Senior Audit Officer, MoSPI",
      email: "r.verma.audit@gov.in",
    },
    opened_at: "2026-02-18T10:30:00Z",
    updated_at: new Date().toISOString(),
    notes: [
      {
        id: "NOTE-01",
        authorId: "OFFICER-001",
        authorName: "Shri Rajesh Verma",
        authorRole: "Senior Audit Officer",
        content: "Verified treasury ledger voucher #02 against physical inspection log. Notice issued to DSIIDC Executive Engineer requesting fresh geotagged site video.",
        createdAt: "2026-02-20T11:15:00Z",
        linkedEvidenceIds: ["EVD-IMG-001", "EVD-PAY-001"],
      },
    ],
    activity_logs: [
      {
        id: "LOG-01",
        timestamp: "2026-02-18T10:30:00Z",
        actor: "Sentinel Surveillance Engine",
        action: "Automated Case Triggered",
        details: "Composite risk score 87/100 exceeded mandatory audit threshold (>75).",
      },
    ],
    evidence_chain: [
      { step: "risk", title: "Surveillance Threshold Trigger", subtitle: "Composite Risk: 87 / 100", status: "flagged", details: "Surveillance algorithm detected 5 correlated anomaly vectors." },
      { step: "signal", title: "Financial Velocity Mismatch", subtitle: "88% Disbursed vs 52% Executed", status: "flagged", details: "PFMS disbursement pace exceeds physical certification." },
      { step: "evidence", title: "Foundation Site Photo", subtitle: "EVD-IMG-001", status: "conflict", details: "Perceptual Hash similarity 99.4% with March 2024 archive photo." },
    ],
  },
];

async function seed() {
  console.log("🌱 Seeding Supabase database with MPLADS Sentinel data...");

  try {
    // 1. Projects
    console.log("Inserting Projects...");
    const { error: projErr } = await supabase.from("projects").upsert(sampleProjects, { onConflict: "id" });
    if (projErr) console.error("Projects error:", projErr.message);
    else console.log("✅ Projects seeded successfully.");

    // 2. Evidence
    console.log("Inserting Evidence...");
    const { error: evdErr } = await supabase.from("evidence").upsert(sampleEvidence, { onConflict: "id" });
    if (evdErr) console.error("Evidence error:", evdErr.message);
    else console.log("✅ Evidence seeded successfully.");

    // 3. Investigations
    console.log("Inserting Investigations...");
    const { error: invErr } = await supabase.from("investigations").upsert(sampleInvestigations, { onConflict: "id" });
    if (invErr) console.error("Investigations error:", invErr.message);
    else console.log("✅ Investigations seeded successfully.");

    // 4. National Analytics
    console.log("Inserting National Analytics...");
    const { error: anErr } = await supabase.from("national_analytics").upsert(
      {
        id: "national_summary",
        total_works_monitored: 18432,
        total_sanctioned_cr: 4892.4,
        total_disbursed_cr: 3715.8,
        total_flagged_risk_value_cr: 42.8,
        risk_counts: { critical: 34, high: 127, medium: 842, low: 17429 },
        risk_trend_7d: [
          { date: "22 Feb", critical: 31, high: 120, medium: 830 },
          { date: "23 Feb", critical: 32, high: 122, medium: 835 },
          { date: "24 Feb", critical: 33, high: 124, medium: 838 },
          { date: "25 Feb", critical: 32, high: 125, medium: 840 },
          { date: "26 Feb", critical: 34, high: 126, medium: 841 },
          { date: "27 Feb", critical: 34, high: 127, medium: 842 },
          { date: "28 Feb", critical: 34, high: 127, medium: 842 },
        ],
        risk_distribution: [
          { category: "Community Infrastructure", count: 42, percentage: 26.1, totalFlaggedValueLakhs: 1470 },
          { category: "Roads, Pathways & Bridges", count: 38, percentage: 23.6, totalFlaggedValueLakhs: 950 },
          { category: "Drinking Water & Sanitation", count: 31, percentage: 19.3, totalFlaggedValueLakhs: 820 },
          { category: "Renewable Energy & Lighting", count: 28, percentage: 17.4, totalFlaggedValueLakhs: 640 },
          { category: "Education & Child Welfare", count: 22, percentage: 13.6, totalFlaggedValueLakhs: 400 },
        ],
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (anErr) console.error("Analytics error:", anErr.message);
    else console.log("✅ National Analytics seeded successfully.");

    // 5. State Metrics
    console.log("Inserting State Metrics...");
    const { error: stErr } = await supabase.from("state_metrics").upsert(
      [
        { state: "Delhi", total_works: 412, total_sanctioned_cr: 128.5, total_expenditure_cr: 94.2, high_risk_works: 12, critical_works: 4, average_risk_score: 42.1, primary_risk_factor: "Milestone Discrepancies & Photo Reuse" },
        { state: "Uttar Pradesh", total_works: 2840, total_sanctioned_cr: 812.0, total_expenditure_cr: 618.5, high_risk_works: 48, critical_works: 14, average_risk_score: 38.6, primary_risk_factor: "Cost Deviation & Solar Lighting Unit Markup" },
      ],
      { onConflict: "state" }
    );
    if (stErr) console.error("State metrics error:", stErr.message);
    else console.log("✅ State metrics seeded successfully.");

    console.log("\n🎉 Supabase Database Seeded Completely!");
  } catch (err) {
    console.error("❌ Seed error:", err);
  }
}

seed();
