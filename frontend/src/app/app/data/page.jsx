"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Database,
  Search,
  UploadCloud,
  FileCheck,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  FileText,
  Camera,
  BadgeIndianRupee,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Layers,
  Fingerprint,
  Info,
  Clock,
  Building2,
  Lock,
  UserCheck,
  FileSpreadsheet,
  Landmark,
  Check,
  X,
  FileUp,
  Activity,
  FileQuestion,
  SlidersHorizontal,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { formatIndianCurrency } from "@/lib/formatters";
import { useAuth } from "@/lib/authContext";

// Master definition of the 6 official MPLADS document slots
const MASTER_SLOTS = [
  {
    key: "recommended",
    label: "1. Works Recommended",
    shortTitle: "Proposals & Recommendations",
    description: "Developmental works proposed and prioritized by Hon'ble MPs.",
    icon: FileSpreadsheet,
    officialFileLs: "Works Recommended (Lok Sabha).csv",
    officialFileRs: "Works Recommended (Rajya Sabha).csv",
    relevantRoles: ["mospi_officer", "mp", "state_nodal_authority", "investigator", "system_admin"],
    criticalFor: "Duplicate Scope AI (Mod 09)",
  },
  {
    key: "sanctioned",
    label: "2. Works Sanctioned",
    shortTitle: "Administrative Sanctions",
    description: "Administratively approved projects, cost estimates, and implementing agency work orders.",
    icon: Landmark,
    officialFileLs: "Works Sanctioned (Lok Sabha).csv",
    officialFileRs: "Works Sanctioned (Rajya Sabha).csv",
    relevantRoles: ["mospi_officer", "state_nodal_authority", "mp", "implementing_agency", "investigator", "field_verification_officer", "system_admin"],
    criticalFor: "Central Works Registry (Mod 02) & Cost Outlier AI (Mod 05)",
  },
  {
    key: "completed",
    label: "3. Works Completed",
    shortTitle: "Completion Certificates",
    description: "Handover inspection certificates, certified completion dates, and asset status.",
    icon: CheckCircle2,
    officialFileLs: "Works Completed (Lok Sabha).csv",
    officialFileRs: "Works Completed (Rajya Sabha).csv",
    relevantRoles: ["mospi_officer", "state_nodal_authority", "implementing_agency", "field_verification_officer", "investigator", "system_admin"],
    criticalFor: "Physical Milestone Sign-off (Mod 08)",
  },
  {
    key: "expenditure",
    label: "4. Expenditure & Disbursements",
    shortTitle: "Treasury Vouchers & RA Bills",
    description: "Itemized treasury drawdowns, contractor payments, and Running Account (RA) bills.",
    icon: BadgeIndianRupee,
    officialFileLs: "Expenditure on Completed and On-going Works as on Date (Lok Sabha).csv",
    officialFileRs: "Expenditure on Completed and On-going Works as on Date (Rajya Sabha).csv",
    relevantRoles: ["mospi_officer", "state_nodal_authority", "implementing_agency", "investigator", "system_admin"],
    criticalFor: "Physical-Financial Divergence AI (Mod 08) & Cartel Rings (Mod 15)",
  },
  {
    key: "limits",
    label: "5. Allocated Limits for Hon'ble MPs",
    shortTitle: "MP Quota Entitlements",
    description: "Annual statutory entitlement limits, sanctioned commitments, and unspent balances.",
    icon: Layers,
    officialFileLs: "Allocated Limit for Honble MPs (Lok Sabha).csv",
    officialFileRs: "Allocated Limit for Honble MPs (Rajya Sabha).csv",
    relevantRoles: ["mospi_officer", "state_nodal_authority", "mp", "investigator", "system_admin"],
    criticalFor: "Statutory Compliance AI (Mod 04 - Quota Caps)",
  },
  {
    key: "calamity",
    label: "6. Calamity Consents",
    shortTitle: "Disaster Relief Allocations",
    description: "Special emergency contributions for declared national and state calamities.",
    icon: ShieldAlert,
    officialFileLs: "Amount consented for Calamity (Lok Sabha).csv",
    officialFileRs: "Amount consented for Calamity (Rajya Sabha).csv",
    relevantRoles: ["mospi_officer", "state_nodal_authority", "mp", "investigator", "system_admin"],
    criticalFor: "Statutory Compliance AI (Mod 04 - Guideline §5.2)",
  },
];

// Single artifact presets for individual file verification
const DEMO_PRESETS = [
  {
    id: "bill_overclaim",
    label: "RA Bill #4 (Cost Inflation +31.4%)",
    category: "contractor_bill",
    icon: BadgeIndianRupee,
    fileName: "eSAKSHI_RA_Bill_04_RCC_Structural.pdf",
    fileSize: "2.4 MB",
    projectId: "MPL-004821",
    projectTitle: "Construction of Multipurpose Community Hall at Village Khera",
    description: "Measurement Book voucher claiming ₹14,200/cum vs CPWD ceiling ₹10,800/cum.",
  },
  {
    id: "photo_reused",
    label: "Foundation Site Photo (99.4% dHash Match)",
    category: "site_photo",
    icon: Camera,
    fileName: "Site_Foundation_Casting_Geotagged.jpg",
    fileSize: "3.8 MB",
    projectId: "MPL-004821",
    projectTitle: "Construction of Multipurpose Community Hall at Village Khera",
    description: "Inspection photo matching archived project in North West Delhi with 18.7km coordinate offset.",
  },
  {
    id: "pfms_advance",
    label: "PFMS Treasury Voucher (Premature Release)",
    category: "pfms_voucher",
    icon: FileText,
    fileName: "PFMS_Treasury_Release_Voucher_02.pdf",
    fileSize: "1.2 MB",
    projectId: "MPL-004821",
    projectTitle: "Construction of Multipurpose Community Hall at Village Khera",
    description: "88% fund disbursement recorded while certified physical progress is only 52%.",
  },
];

export default function DynamicIngestionPage() {
  const { profile } = useAuth();
  const role = profile?.role || "mospi_officer";

  // Tab State: 'dynamic_slots' (Primary) | 'single_artifact' | 'explorer'
  const [activeTab, setActiveTab] = useState("dynamic_slots");

  // House Selector State
  const [selectedHouse, setSelectedHouse] = useState("lok_sabha"); // 'lok_sabha' | 'rajya_sabha' | 'both'

  // 6 Slots Upload State: { [slotKey]: { file: File | null, isPreset: boolean, fileName: string, fileSize: string } }
  const [slotFiles, setSlotFiles] = useState({
    recommended: null,
    sanctioned: null,
    completed: null,
    expenditure: null,
    limits: null,
    calamity: null,
  });

  // Processing & Surveillance Outcome State
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [dynamicResult, setDynamicResult] = useState(null);
  const [auditError, setAuditError] = useState(null);

  // Single Artifact Upload State (Tab 2)
  const [selectedPreset, setSelectedPreset] = useState(DEMO_PRESETS[0]);
  const [singleFileType, setSingleFileType] = useState(DEMO_PRESETS[0].category);
  const [singleCustomFile, setSingleCustomFile] = useState(null);
  const [singleResult, setSingleResult] = useState(null);

  // Explorer Data State (Tab 3)
  const [datasets, setDatasets] = useState([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState("DS-01");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDatasets() {
      try {
        const ds = await api.getDatasets();
        setDatasets(ds || []);
      } catch (err) {
        console.error("Failed to load datasets:", err);
      }
    }
    loadDatasets();
  }, []);

  // Handle Custom File Upload into a Specific Slot
  const handleSlotFileChange = (slotKey, e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSlotFiles((prev) => ({
        ...prev,
        [slotKey]: {
          file,
          isPreset: false,
          fileName: file.name,
          fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        },
      }));
      setDynamicResult(null);
    }
  };

  // Remove / Clear a specific slot
  const handleClearSlot = (slotKey) => {
    setSlotFiles((prev) => ({
      ...prev,
      [slotKey]: null,
    }));
  };

  // Presentation Mode: Pre-load the 6 official Lok Sabha files (1-click)
  const handleLoadLokSabhaPreset = () => {
    setSelectedHouse("lok_sabha");
    setSlotFiles({
      recommended: { isPreset: true, fileName: "Works Recommended (Lok Sabha).csv", fileSize: "2.2 MB" },
      sanctioned: { isPreset: true, fileName: "Works Sanctioned (Lok Sabha).csv", fileSize: "1.7 MB" },
      completed: { isPreset: true, fileName: "Works Completed (Lok Sabha).csv", fileSize: "933 KB" },
      expenditure: { isPreset: true, fileName: "Expenditure on Completed and On-going Works as on Date (Lok Sabha).csv", fileSize: "2.0 MB" },
      limits: { isPreset: true, fileName: "Allocated Limit for Honble MPs (Lok Sabha).csv", fileSize: "35 KB" },
      calamity: { isPreset: true, fileName: "Amount consented for Calamity (Lok Sabha).csv", fileSize: "1.3 KB" },
    });
    setDynamicResult(null);
  };

  // Presentation Mode: Pre-load the 6 official Rajya Sabha files (1-click)
  const handleLoadRajyaSabhaPreset = () => {
    setSelectedHouse("rajya_sabha");
    setSlotFiles({
      recommended: { isPreset: true, fileName: "Works Recommended (Rajya Sabha).csv", fileSize: "1.4 MB" },
      sanctioned: { isPreset: true, fileName: "Works Sanctioned (Rajya Sabha).csv", fileSize: "1.9 MB" },
      completed: { isPreset: true, fileName: "Works Completed (Rajya Sabha).csv", fileSize: "2.1 MB" },
      expenditure: { isPreset: true, fileName: "Expenditure on Completed and On-going Works as on Date (Rajya Sabha).csv", fileSize: "1.9 MB" },
      limits: { isPreset: true, fileName: "Allocated Limit for Honble MPs (Rajya Sabha).csv", fileSize: "21 KB" },
      calamity: { isPreset: true, fileName: "Amount consented for Calamity (Rajya Sabha).csv", fileSize: "2.5 KB" },
    });
    setDynamicResult(null);
  };

  // Presentation Mode: Pre-load Partial 3-Stream Ingestion (demonstrates missing data resilience)
  const handleLoadPartialPreset = () => {
    setSelectedHouse("lok_sabha");
    setSlotFiles({
      recommended: { isPreset: true, fileName: "Works Recommended (Lok Sabha).csv", fileSize: "2.2 MB" },
      sanctioned: { isPreset: true, fileName: "Works Sanctioned (Lok Sabha).csv", fileSize: "1.7 MB" },
      completed: { isPreset: true, fileName: "Works Completed (Lok Sabha).csv", fileSize: "933 KB" },
      expenditure: null, // intentionally empty
      limits: null,      // intentionally empty
      calamity: null,    // intentionally empty
    });
    setDynamicResult(null);
  };

  // Clear all slots
  const handleClearAllSlots = () => {
    setSlotFiles({
      recommended: null,
      sanctioned: null,
      completed: null,
      expenditure: null,
      limits: null,
      calamity: null,
    });
    setDynamicResult(null);
  };

  // Count staged slots
  const stagedSlotsCount = Object.values(slotFiles).filter(Boolean).length;

  // Execute Dynamic Ingestion & Multi-Modal Audit
  const handleRunDynamicAudit = async () => {
    setIsProcessing(true);
    setDynamicResult(null);

    // Multi-stage visual audit pipeline
    setPipelineStep(1); // Column Schema Normalization
    await new Promise((r) => setTimeout(r, 650));
    setPipelineStep(2); // Cross-Entity Record Linking
    await new Promise((r) => setTimeout(r, 700));
    setPipelineStep(3); // Multi-Signal Risk Fusion
    await new Promise((r) => setTimeout(r, 750));
    setPipelineStep(4); // Data Completeness & Degradation Notice Assembly
    await new Promise((r) => setTimeout(r, 600));

    try {
      // Check if user uploaded any custom files or used presets
      const hasCustomUploads = Object.values(slotFiles).some((s) => s?.file);

      let res;
      if (hasCustomUploads) {
        const formData = new FormData();
        formData.append("house", selectedHouse);
        Object.entries(slotFiles).forEach(([key, slot]) => {
          if (slot?.file) {
            formData.append(`slot_${key}`, slot.file);
          }
        });
        res = await api.dynamicIngestFiles(formData);
      } else {
        // Preset or simulated batch mode
        const allPreset = Object.values(slotFiles).every((s) => s?.isPreset);
        const partialPreset = stagedSlotsCount === 3 && slotFiles.recommended && slotFiles.sanctioned && slotFiles.completed;
        const presetType = partialPreset
          ? "presentation_partial"
          : selectedHouse === "rajya_sabha"
          ? "presentation_rajya_sabha"
          : "presentation_lok_sabha";

        res = await api.dynamicIngestFiles({
          house: selectedHouse,
          usePreset: presetType,
        });
      }

      if (res) {
        setDynamicResult(res);
        setAuditError(null);
      }
    } catch (err) {
      console.error("Dynamic Ingestion Audit Error:", err);
      setAuditError(err?.message || "Dynamic ingestion encountered a processing issue. Please check your CSV format.");
    } finally {
      setIsProcessing(false);
      setPipelineStep(0);
    }
  };

  // System Admin 1-Click: Ingest All 12 Official Datasets At Once (Lok Sabha + Rajya Sabha across all 6 slots)
  const handleAdminIngestAll12 = async () => {
    setIsProcessing(true);
    setDynamicResult(null);
    setSelectedHouse("both");

    setPipelineStep(1); // Column Schema Normalization
    await new Promise((r) => setTimeout(r, 650));
    setPipelineStep(2); // Cross-Entity Record Linking
    await new Promise((r) => setTimeout(r, 700));
    setPipelineStep(3); // Multi-Signal Risk Fusion
    await new Promise((r) => setTimeout(r, 750));
    setPipelineStep(4); // Data Completeness & Degradation Assembly
    await new Promise((r) => setTimeout(r, 600));

    try {
      const res = await api.adminIngestAllFiles();
      if (res) {
        setDynamicResult(res);
        setAuditError(null);
      }
    } catch (err) {
      console.error("Batch All 12 Ingestion Error:", err);
      setAuditError(err?.message || "Failed to batch ingest all 12 official datasets.");
    } finally {
      setIsProcessing(false);
      setPipelineStep(0);
    }
  };

  return (
    <AppShell breadcrumbs={[{ label: "Dynamic e-SAKSHI Multi-Slot Ingestion Hub" }]}>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Institutional Positioning Banner */}
        <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-gradient-to-r from-blue-50/90 via-slate-50 to-indigo-50/80 dark:from-blue-950/40 dark:via-slate-900 dark:to-indigo-950/30 p-5 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2.5 py-0.5 rounded-full border border-blue-300 dark:border-blue-800">
                  Dynamic Multi-Slot Ingestion Engine
                </span>
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3" />
                  Resilient Column & Title Mapping Active
                </span>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  Adaptive Scoring (Degrades Missing Data)
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                e-SAKSHI Dynamic Multi-Source Surveillance Intake
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                Upload official or custom e-SAKSHI CSV datasets across the 6 statutory streams. Upload only what you have—the AI automatically adapts to varying column titles, re-weights evaluations over available streams, and marks unverified dimensions in the final audit report.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs">
              <button
                onClick={() => setActiveTab("dynamic_slots")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "dynamic_slots"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>6-Slot Ingestion Studio</span>
              </button>
              <button
                onClick={() => setActiveTab("explorer")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "explorer"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Dataset Explorer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stakeholder Jurisdictional & Role Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-900 dark:bg-slate-950 text-slate-200 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-xs">
              {profile?.avatar_initials || "AS"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">{profile?.full_name || "Authorized Official"}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
                  {profile?.role_label || profile?.role?.replace(/_/g, " ")}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span>Jurisdiction:</span>
                <strong className="text-slate-200 font-medium">{profile?.jurisdiction || "National Oversight (All India)"}</strong>
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-4">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Authorized Ingestion Scope
            </span>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              {role === "mp"
                ? "Constituency Recommendations & Sanctions"
                : role === "implementing_agency"
                ? "Sanctioned Works & Expenditure Invoices"
                : role === "field_verification_officer"
                ? "Physical Inspection Warrants & Completed Works"
                : "Full 6-Slot National Ingestion (All Streams)"}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: 6-SLOT DYNAMIC INGESTION STUDIO */}
        {/* ========================================================================= */}
        {activeTab === "dynamic_slots" && (
          <div className="space-y-6">
            {/* Top Bar: House Selector & 1-Click Presentation Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* House Selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-blue-600" />
                  Parliamentary House:
                </span>
                <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setSelectedHouse("lok_sabha")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedHouse === "lok_sabha"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Lok Sabha (543 MPs)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedHouse("rajya_sabha")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedHouse === "rajya_sabha"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Rajya Sabha (250 MPs)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedHouse("both")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedHouse === "both"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Combined Ledger
                  </button>
                </div>
              </div>

              {/* Presentation Presets Action Group */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Presentation Presets:
                </span>
                <button
                  type="button"
                  onClick={handleLoadLokSabhaPreset}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  Load 6 Lok Sabha Files
                </button>
                <button
                  type="button"
                  onClick={handleLoadRajyaSabhaPreset}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  Load 6 Rajya Sabha Files
                </button>
                <button
                  type="button"
                  onClick={handleLoadPartialPreset}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-all flex items-center gap-1.5 shadow-xs"
                  title="Upload only 3 files to verify how missing data is adapted and reported"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Partial 3-Stream Demo
                </button>
                {/* System Admin 1-Click Batch Ingestion: All 12 Official Files */}
                {(role === "system_admin" || role === "mospi_officer") && (
                  <button
                    type="button"
                    onClick={handleAdminIngestAll12}
                    disabled={isProcessing}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
                    title="System Admin: Ingest all 12 official CSV datasets (Lok Sabha + Rajya Sabha across all 6 slots) simultaneously"
                  >
                    <Layers className={`w-3.5 h-3.5 ${isProcessing ? "animate-spin" : ""}`} />
                    <span>{isProcessing ? "Ingesting All 12 Files..." : "Add All 12 Files at Once"}</span>
                  </button>
                )}
                {stagedSlotsCount > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllSlots}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Staging Summary & Run Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 text-white shadow-md gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {stagedSlotsCount}/6
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Staged Document Streams</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      {stagedSlotsCount === 6 ? "Full Multi-Source Audit" : stagedSlotsCount > 0 ? "Adaptive Partial Audit" : "Ready for Ingestion"}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    {stagedSlotsCount === 6
                      ? "All 6 statutory streams ready. Full 21-module surveillance grid will execute with 100% confidence."
                      : stagedSlotsCount > 0
                      ? `${6 - stagedSlotsCount} stream(s) omitted. AI will gracefully adapt risk weights and mark missing dimensions.`
                      : "Choose preset or drag custom CSV files into the slots below. Leaving slots empty is fully supported."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={stagedSlotsCount === 0 || isProcessing}
                onClick={handleRunDynamicAudit}
                className={`px-6 py-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-sm ${
                  stagedSlotsCount === 0 || isProcessing
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25 active:scale-95"
                }`}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Pipeline Step {pipelineStep}/4...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-blue-200" />
                    <span>Run Multi-Source Dynamic Audit</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Audit Error Notice (if any) */}
            {auditError && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span><strong>Audit Warning:</strong> {auditError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAuditError(null)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* 6 INDIVIDUAL DOCUMENT SLOTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {MASTER_SLOTS.map((slot, index) => {
                const Icon = slot.icon;
                const staged = slotFiles[slot.key];
                const isAuthorized = slot.relevantRoles.includes(role) || role === "system_admin";
                const officialFileName = selectedHouse === "rajya_sabha" ? slot.officialFileRs : slot.officialFileLs;

                return (
                  <div
                    key={slot.key}
                    className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                      staged
                        ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-400 dark:border-blue-700 shadow-xs"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    {/* Slot Header */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-xl ${staged ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                              Slot 0{index + 1}
                            </span>
                            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                              {slot.label}
                            </h4>
                          </div>
                        </div>

                        {staged ? (
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Staged
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                            Optional
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {slot.description}
                      </p>

                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="text-[9px] font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                          Critical: {slot.criticalFor}
                        </span>
                      </div>
                    </div>

                    {/* Slot Body: Drag & Drop Dropzone or Staged Info */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      {staged ? (
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-900/60 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-0.5 overflow-hidden">
                              <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                                {staged.fileName}
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                Size: {staged.fileSize} • {staged.isPreset ? "Official Pre-trained File" : "Custom Uploaded File"}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleClearSlot(slot.key)}
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 transition-colors"
                              title="Remove file"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center hover:border-blue-500 transition-all bg-slate-50/50 dark:bg-slate-950/40 flex-1 flex flex-col items-center justify-center">
                          <input
                            type="file"
                            accept=".csv"
                            onChange={(e) => handleSlotFileChange(slot.key, e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <UploadCloud className="w-5 h-5 text-slate-400 mb-1 pointer-events-none" />
                          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 pointer-events-none">
                            Drop custom CSV or click to browse
                          </p>
                          <span className="text-[9px] text-slate-400 pointer-events-none">
                            Auto-maps varying column titles
                          </span>
                        </div>
                      )}

                      {/* Slot Footer Actions */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSlotFiles((prev) => ({
                              ...prev,
                              [slot.key]: {
                                isPreset: true,
                                fileName: officialFileName,
                                fileSize: slot.key === "calamity" ? "2 KB" : slot.key === "limits" ? "30 KB" : "1.8 MB",
                              },
                            }));
                            setDynamicResult(null);
                          }}
                          className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <FileSpreadsheet className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          Pre-load Official File
                        </button>

                        <span className="text-[10px] text-slate-400 font-medium">
                          {isAuthorized ? "Role Authorized" : "Restricted Role"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ========================================================================= */}
            {/* SURVEILLANCE OUTCOME DISPLAY: DYNAMIC ADAPTIVE AUDIT REPORT */}
            {/* ========================================================================= */}
            {dynamicResult && (
              <div className="space-y-6 pt-2 animate-in fade-in-50 duration-300">
                {/* 1. Header Banner & Data Completeness Score */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          Batch ID: {dynamicResult?.batchId || "BATCH-ONLINE"}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Execution time: {dynamicResult?.executionTimeMs || 420}ms
                        </span>
                      </div>
                      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                        Dynamic Multi-Source Surveillance Audit Report
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <Link
                          href="/app/command-center"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          <span>View Scoped Dashboard</span>
                        </Link>
                        <Link
                          href="/app/reports"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition shadow-xs"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-600" />
                          <span>View Reports</span>
                        </Link>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-auto">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Data Completeness Score
                        </span>
                        <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                          {dynamicResult?.summary?.completenessPercent ?? 100}%
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center font-bold text-xs text-blue-700 dark:text-blue-300">
                        {dynamicResult?.summary?.slotsAvailableCount ?? 6}/6
                      </div>
                    </div>
                  </div>

                  {/* Missing Data Notices Alert Box */}
                  {dynamicResult?.missingDataNotices && dynamicResult.missingDataNotices.length > 0 ? (
                    <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                          Data Availability & Adaptive Scoring Notice ({dynamicResult.missingDataNotices.length} Stream{dynamicResult.missingDataNotices.length > 1 ? "s" : ""} Omitted)
                        </h4>
                      </div>
                      <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                        To prevent artificial score inflation or erroneous fraud flags, the Sentinel engine has re-normalized risk weights across only the verified data streams provided. The following evaluations were safely deferred:
                      </p>
                      <ul className="space-y-1.5 pt-1">
                        {dynamicResult.missingDataNotices.map((notice, i) => (
                          <li key={i} className="text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            <span>
                              <strong className="font-semibold">{notice.dimension}:</strong> {notice.impact}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                          100% Comprehensive Statutory Verification (High Assurance)
                        </h4>
                        <p className="text-xs text-emerald-800 dark:text-emerald-300">
                          All 6 statutory streams provided. Full 8-dimension risk fusion executed with complete confidence cross-referencing.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Active vs Degraded Dimensions Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider">
                        Active Audited Dimensions ({dynamicResult?.activeDimensions?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(dynamicResult?.activeDimensions || []).map((dim, i) => (
                          <span key={i} className="text-[10px] font-medium bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                            {dim}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider">
                        Deferred Dimensions ({dynamicResult?.degradedDimensions?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(dynamicResult?.degradedDimensions || []).length > 0 ? (
                          dynamicResult.degradedDimensions.map((dim, i) => (
                            <span key={i} className="text-[10px] font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                              ⊘ {dim}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">None — full surveillance grid active.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Top Flagged Works Cross-Correlated */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        Flagged Anomaly Dossiers ({(dynamicResult?.flaggedCases || []).length} Works Identified)
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Cross-correlated across uploaded streams using Sentinel Multi-Signal Risk Fusion
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold">
                      Multi-Signal Fusion
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                          <th className="pb-3">Work ID & Title</th>
                          <th className="pb-3">Jurisdiction</th>
                          <th className="pb-3">Implementing Agency</th>
                          <th className="pb-3">Sanction / Spent</th>
                          <th className="pb-3 text-center">Risk Score</th>
                          <th className="pb-3">Primary Signal</th>
                          <th className="pb-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                        {(dynamicResult?.flaggedCases || []).map((work) => (
                          <tr key={work.work_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="py-3.5 pr-3">
                              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block">
                                {work.work_id}
                              </span>
                              <span className="text-slate-800 dark:text-slate-200 line-clamp-1 max-w-xs font-semibold">
                                {work.title}
                              </span>
                            </td>
                            <td className="py-3.5 pr-3 text-slate-600 dark:text-slate-300">
                              {work.district}, {work.state}
                            </td>
                            <td className="py-3.5 pr-3 text-slate-600 dark:text-slate-300 line-clamp-1 max-w-[180px]">
                              {work.implementing_agency}
                            </td>
                            <td className="py-3.5 pr-3 whitespace-nowrap">
                              <span className="font-mono text-slate-900 dark:text-white block">
                                ₹{((Number(work.sanction_amount) || 0) / 100000).toFixed(1)} L
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Disb: ₹{((Number(work.disbursed_amount) || 0) / 100000).toFixed(1)} L
                              </span>
                            </td>
                            <td className="py-3.5 text-center">
                              <span className={`inline-block px-2 py-0.5 rounded-full font-bold font-mono text-[11px] ${
                                (Number(work.composite_risk_score) || 0) >= 80
                                  ? "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                                  : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                              }`}>
                                {work.composite_risk_score}
                              </span>
                            </td>
                            <td className="py-3.5 pr-3 max-w-xs">
                              {work.triggered_signals && work.triggered_signals.length > 0 ? (
                                <span className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                                  {work.triggered_signals[0].finding}
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">Baseline variance check</span>
                              )}
                            </td>
                            <td className="py-3.5 text-right whitespace-nowrap">
                              <Link
                                href={`/app/projects/${work.work_id}`}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                              >
                                View Twin →
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. Schema Normalization & Header Adaptation Table */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                        Dynamic Schema Mapping & Title Resolution Report
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Shows how differing CSV column headers were automatically mapped to canonical surveillance attributes
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                    {Object.entries(dynamicResult?.schemaReports || {}).map(([slotKey, schema]) => (
                      <div key={slotKey} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">
                            {slotKey.replace(/_/g, " ")} Stream
                          </span>
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                            {schema?.confidenceScore ?? 0}% Match
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono truncate">
                          File: {schema?.filename || "Uploaded File"}
                        </p>
                        <div className="text-[10px] space-y-1 text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-700">
                          <div>Mapped Headers: <strong className="text-slate-900 dark:text-white">{Object.keys(schema?.mappedHeaders || {}).length} columns</strong></div>
                          <div>Unmapped Extra: <span className="text-slate-400">{(schema?.unmappedHeaders || []).length} custom fields preserved</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: EXPLORER VIEW */}
        {/* ========================================================================= */}
        {activeTab === "explorer" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Official MPLADS Master Registry Explorer
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Inspect raw rows from the 12 official Lok Sabha & Rajya Sabha CSV datasets
                </p>
              </div>

              {/* Dataset Picker */}
              <select
                value={selectedDatasetId}
                onChange={(e) => setSelectedDatasetId(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
              >
                {datasets.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.house})
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search across columns..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            {/* Registry Preview Table */}
            {datasets.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      {datasets[0]?.columns?.map((col) => (
                        <th key={col.key} className="p-3 whitespace-nowrap">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {datasets[0]?.sampleRows?.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        {Object.values(row).map((val, cIdx) => (
                          <td key={cIdx} className="p-3 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">Loading datasets...</div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
