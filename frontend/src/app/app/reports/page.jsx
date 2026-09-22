"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  FileText,
  UploadCloud,
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  LayoutDashboard,
  CheckCircle2,
  AlertTriangle,
  Download,
  ExternalLink,
  MapPin,
  Building2,
  BadgeIndianRupee,
  Sparkles,
  Layers,
  Calendar,
  Eye,
  X,
  ChevronDown,
  FileSpreadsheet,
  Landmark,
  Printer,
  Maximize2,
  CopyCheck,
  Check,
  RotateCcw,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/common/MetricCard";
import { RiskBadge } from "@/components/common/RiskBadge";
import { api } from "@/lib/api";
import { formatIndianCurrency, formatRelativeTime, getRiskLevelFromScore } from "@/lib/formatters";
import { useAuth } from "@/lib/authContext";

export default function ReportsPage() {
  const { profile } = useAuth();
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [activeScope, setActiveScope] = useState({ mode: "database", batchId: null });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [selectedWorkModal, setSelectedWorkModal] = useState(null);
  const [notification, setNotification] = useState(null);
  const [ingestingAll, setIngestingAll] = useState(false);

  // Tab State: "report" (Official HTML Report) or "ledger" (Itemized Works Table)
  const [activeViewTab, setActiveViewTab] = useState("report");
  const [selectedReportWorkId, setSelectedReportWorkId] = useState("flagship");
  const [zoomScale, setZoomScale] = useState(1);
  const iframeRef = useRef(null);

  async function handleAdminIngestAll() {
    try {
      setIngestingAll(true);
      const res = await api.adminIngestAllFiles();
      if (res && res.success) {
        setNotification(`Successfully ingested all 12 official datasets (${res.summary?.totalWorksCount || 0} works). Final report saved to database.`);
        setTimeout(() => setNotification(null), 8000);
        await loadReportsData();
        if (res.batchId) setSelectedBatchId(res.batchId);
      } else {
        setNotification("Failed to batch ingest official datasets. Please check server logs.");
        setTimeout(() => setNotification(null), 5000);
      }
    } catch (err) {
      setNotification(`Batch ingestion error: ${err.message}`);
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setIngestingAll(false);
    }
  }

  async function loadReportsData() {
    try {
      setRefreshing(true);
      const [reports, scope] = await Promise.all([
        api.getUploadedReports(),
        api.getActiveScope(),
      ]);

      const batchesList = Array.isArray(reports) ? reports : [];
      setBatches(batchesList);
      setActiveScope(scope || { mode: "database", batchId: null });

      if (batchesList.length > 0) {
        if (!selectedBatchId || !batchesList.some((b) => b?.batchId === selectedBatchId)) {
          setSelectedBatchId(batchesList[0].batchId);
        }
      }
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadReportsData();
  }, []);

  // Currently selected batch
  const activeBatch = useMemo(() => {
    return batches.find((b) => b?.batchId === selectedBatchId) || batches[0] || null;
  }, [batches, selectedBatchId]);

  // All work reports of selected batch
  const workReports = useMemo(() => {
    if (!activeBatch) return [];
    if (Array.isArray(activeBatch.workReports) && activeBatch.workReports.length > 0) {
      return activeBatch.workReports;
    }
    if (Array.isArray(activeBatch.flaggedCases)) {
      return activeBatch.flaggedCases;
    }
    return [];
  }, [activeBatch]);

  // Unique states for filter
  const uniqueStates = useMemo(() => {
    const set = new Set();
    workReports.forEach((w) => {
      if (w?.state) set.add(w.state);
    });
    return Array.from(set).sort();
  }, [workReports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return workReports.filter((work) => {
      if (!work) return false;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (work.id && work.id.toLowerCase().includes(q)) ||
        (work.work_id && work.work_id.toLowerCase().includes(q)) ||
        (work.title && work.title.toLowerCase().includes(q)) ||
        (work.implementing_agency && work.implementing_agency.toLowerCase().includes(q)) ||
        (work.district && work.district.toLowerCase().includes(q)) ||
        (work.state && work.state.toLowerCase().includes(q));

      const isWorkDuplicate =
        work.risk_band === "DUPLICATE" ||
        work.risk?.level === "duplicate" ||
        (work.triggered_signals || []).some((s) => s.code === "SCOPE_DUP_02");

      let matchesRisk = true;
      if (riskFilter === "duplicate") {
        matchesRisk = isWorkDuplicate;
      } else if (riskFilter !== "all") {
        matchesRisk =
          !isWorkDuplicate &&
          ((work.risk_band && work.risk_band.toLowerCase() === riskFilter.toLowerCase()) ||
           (work.risk?.level && work.risk.level.toLowerCase() === riskFilter.toLowerCase()));
      }

      const matchesState = stateFilter === "all" || work.state === stateFilter;

      return matchesSearch && matchesRisk && matchesState;
    });
  }, [workReports, searchQuery, riskFilter, stateFilter]);

  // Synchronize active work into HTML report iframe via postMessage
  function syncWorkToIframe(work) {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    if (work === "flagship" || !work) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "LOAD_WORK_DATA",
          payload: {
            workId: "LS-EXP-2024-8842",
            caseUid: "MOSPI/VIG/2026/CR-0842/UP-VAR",
            title: "Construction of Multipurpose Community Infrastructure",
            state: "Uttar Pradesh",
            district: "Varanasi (PC-77)",
            agency: "Rural Engineering Dept (RED), Div-II, Varanasi",
            sanction: 2400000,
            disbursed: 2379048,
            riskLevel: "critical",
            riskScore: 14.2,
          },
        },
        "*"
      );
      return;
    }

    const isDup =
      work.risk_band === "DUPLICATE" ||
      work.risk?.level === "duplicate" ||
      (work.triggered_signals || []).some((s) => s.code === "SCOPE_DUP_02");

    iframeRef.current.contentWindow.postMessage(
      {
        type: "LOAD_WORK_DATA",
        payload: {
          workId: work.work_id || work.id,
          caseUid: `MOSPI/VIG/2026/CR-${(work.work_id || work.id).replace(/[^a-zA-Z0-9]/g, "")}`,
          title: work.title,
          state: work.state,
          district: work.district,
          agency: work.implementing_agency,
          sanction: work.sanction_amount || work.financials?.sanctionedAmount || 2500000,
          disbursed: work.disbursed_amount || work.financials?.disbursedAmount || 1800000,
          riskLevel: isDup
            ? "duplicate"
            : typeof (work.composite_risk_score ?? work.risk?.score) === "number"
            ? getRiskLevelFromScore(work.composite_risk_score ?? work.risk?.score)
            : (work.risk_band || work.risk?.level || "low").toLowerCase(),
          riskScore: isDup ? null : (work.composite_risk_score ?? work.risk?.score ?? null),
          isDuplicate: isDup,
        },
      },
      "*"
    );
  }

  function handleSelectWorkForReport(workId) {
    setSelectedReportWorkId(workId);
    if (workId === "flagship") {
      syncWorkToIframe("flagship");
    } else {
      const found = workReports.find((w) => (w.work_id || w.id) === workId);
      if (found) {
        syncWorkToIframe(found);
      }
    }
  }

  function handleOpenInReportTab(work) {
    setSelectedReportWorkId(work.work_id || work.id);
    setActiveViewTab("report");
    setTimeout(() => {
      syncWorkToIframe(work);
    }, 250);
  }

  // Restore Master Database Action
  async function handleRestoreMasterDatabase() {
    try {
      setRefreshing(true);
      await api.restoreMasterScope();
      setNotification("Surveillance scope restored to complete Master Database (All Works).");
      setTimeout(() => setNotification(null), 5000);
      await loadReportsData();
    } catch (err) {
      console.error("Failed to restore scope:", err);
    } finally {
      setRefreshing(false);
    }
  }

  // Export reports to CSV
  function handleExportCSV() {
    if (!filteredReports || filteredReports.length === 0) return;
    const headers = [
      "Work ID",
      "Title",
      "State",
      "District",
      "Implementing Agency",
      "Category",
      "Sanctioned Amount",
      "Disbursed Amount",
      "Risk Score",
      "Risk Band",
      "Primary Finding",
      "Status",
    ];
    const rows = filteredReports.map((w) => {
      const isDup =
        w.risk_band === "DUPLICATE" ||
        w.risk?.level === "duplicate" ||
        (w.triggered_signals || []).some((s) => s.code === "SCOPE_DUP_02");

      return [
        `"${w.work_id || w.id || ""}"`,
        `"${(w.title || "").replace(/"/g, '""')}"`,
        `"${w.state || ""}"`,
        `"${w.district || ""}"`,
        `"${(w.implementing_agency || "").replace(/"/g, '""')}"`,
        `"${w.category || ""}"`,
        w.sanction_amount || w.financials?.sanctionedAmount || 0,
        w.disbursed_amount || w.financials?.disbursedAmount || 0,
        isDup ? "Not Rated (Duplicate)" : (w.composite_risk_score ?? w.risk?.score ?? "N/A"),
        isDup ? "Duplicate" : (typeof (w.composite_risk_score ?? w.risk?.score) === "number" ? getRiskLevelFromScore(w.composite_risk_score ?? w.risk?.score).toUpperCase() : (w.risk_band || w.risk?.level || "LOW")),
        `"${(w.risk?.primarySignal || "").replace(/"/g, '""')}"`,
        `"${isDup ? "Duplicate" : (w.status || "")}"`,
      ];
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MPLADS_Statutory_Report_${activeBatch?.batchId || "BATCH"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handlePrintReport() {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.print();
    } else {
      window.open("/audit-dossier-template.html", "_blank");
    }
  }

  return (
    <AppShell breadcrumbs={[{ label: "Reports" }]}>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* INSTITUTIONAL HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                Statutory Audit Reports Hub
              </span>
              {activeScope?.mode === "uploaded" ? (
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-md border border-amber-300 dark:border-amber-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>Scoped to Ingested Batch ({activeScope.batchId})</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                  Master Database Scope
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              Statutory Audit Reports & Forensic Dossiers
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Official Government of India statutory vigilance audit dossiers, forensic evidence matrices, and e-SAKSHI multi-source verification.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {profile?.role === "system_admin" && (
              <button
                type="button"
                onClick={handleAdminIngestAll}
                disabled={ingestingAll || refreshing}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-sm shadow-blue-500/20 transition"
              >
                <Layers className={`w-3.5 h-3.5 ${ingestingAll ? "animate-spin" : ""}`} />
                <span>{ingestingAll ? "Ingesting All 12 Files..." : "Add All 12 Files at Once"}</span>
              </button>
            )}
            <Link
              href="/app/data"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload New Files</span>
            </Link>
            <Link
              href="/app/command-center"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 shadow-xs transition"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Command Center</span>
            </Link>
            {activeScope?.mode === "uploaded" && (
              <button
                type="button"
                onClick={handleRestoreMasterDatabase}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition"
                title="Restore dashboard view to show all works in the database"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                <span>Restore All Works</span>
              </button>
            )}
          </div>
        </div>

        {/* NOTIFICATION TOAST */}
        {notification && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 flex items-center justify-between text-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{notification}</span>
            </div>
            <button type="button" onClick={() => setNotification(null)}>
              <X className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
            </button>
          </div>
        )}

        {/* VIEW MODE TABS: OFFICIAL HTML REPORT vs BATCH WORKS LEDGER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveViewTab("report")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeViewTab === "report"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Official Statutory Report (HTML)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveViewTab("ledger")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeViewTab === "ledger"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Audit Batch &amp; Works Ledger ({workReports.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/audit-dossier-template.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Standalone Report</span>
            </a>
            <button
              type="button"
              onClick={handlePrintReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* TAB 1: THE ACTUAL OFFICIAL REPORT IN HTML */}
        {activeViewTab === "report" && (
          <div className="space-y-4">
            {/* REPORT CONTROLLER BAR */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-blue-600" />
                  <span>Dossier Case Subject:</span>
                </span>
                <div className="relative">
                  <select
                    value={selectedReportWorkId}
                    onChange={(e) => handleSelectWorkForReport(e.target.value)}
                    aria-label="Select Work for Statutory Report"
                    className="appearance-none pl-3 pr-8 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none cursor-pointer max-w-xs sm:max-w-md truncate"
                  >
                    <option value="flagship">
                      Flagship Statutory Audit: LS-EXP-2024-8842 (Varanasi PC-77)
                    </option>
                    {workReports.map((w) => {
                      const isDup =
                        w.risk_band === "DUPLICATE" ||
                        w.risk?.level === "duplicate" ||
                        (w.triggered_signals || []).some((s) => s.code === "SCOPE_DUP_02");
                      return (
                        <option key={w.id || w.work_id} value={w.work_id || w.id}>
                          {isDup ? "[DUPLICATE] " : `[${w.risk_band || "AUDIT"}] `}
                          {w.work_id || w.id} — {(w.title || "").substring(0, 45)}...
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                {/* Zoom Selector */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <button
                    type="button"
                    onClick={() => setZoomScale(0.85)}
                    className={`px-2 py-1 rounded-lg transition ${zoomScale === 0.85 ? "bg-white dark:bg-slate-900 text-blue-600 shadow-xs" : ""}`}
                  >
                    85%
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomScale(1)}
                    className={`px-2 py-1 rounded-lg transition ${zoomScale === 1 ? "bg-white dark:bg-slate-900 text-blue-600 shadow-xs" : ""}`}
                  >
                    100%
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handlePrintReport}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 hover:bg-blue-100 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Dossier</span>
                </button>

                <a
                  href="/audit-dossier-template.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full Screen</span>
                </a>
              </div>
            </div>

            {/* EMBEDDED OFFICIAL HTML REPORT VIEWER */}
            <div className="rounded-3xl bg-slate-950 p-2 sm:p-6 border border-slate-800 shadow-2xl overflow-hidden flex justify-center">
              <div
                className="w-full max-w-[960px] bg-white rounded-lg shadow-2xl overflow-hidden transition-all origin-top"
                style={{
                  transform: zoomScale === 1 ? "none" : `scale(${zoomScale})`,
                  marginBottom: zoomScale === 1 ? 0 : "-12%",
                }}
              >
                <iframe
                  ref={iframeRef}
                  src="/audit-dossier-template.html"
                  title="Official Statutory Audit Dossier Report"
                  className="w-full border-none"
                  style={{
                    height: "1400px",
                    display: "block",
                  }}
                  onLoad={() => {
                    if (selectedReportWorkId !== "flagship") {
                      const found = workReports.find(
                        (w) => (w.work_id || w.id) === selectedReportWorkId
                      );
                      if (found) syncWorkToIframe(found);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AUDIT BATCH & WORKS LEDGER */}
        {activeViewTab === "ledger" && (
          <div className="space-y-6">
            {/* ONLY THE NEEDED STATS - 4 CLEAN METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Audited Works in Batch"
                value={`${activeBatch?.summary?.totalWorksCount || workReports.length || 0}`}
                subtitle="Uploaded Projects Evaluated"
                icon={Building2}
                variant="default"
              />
              <MetricCard
                title="Sanctioned Allocation"
                value={`₹${activeBatch?.summary?.totalSanctionedCr || "0.0"} Cr`}
                subtitle="Total Approved Project Cap"
                icon={BadgeIndianRupee}
                variant="default"
              />
              <MetricCard
                title="Disbursed Expenditure"
                value={`₹${activeBatch?.summary?.totalExpenditureCr || "0.0"} Cr`}
                subtitle="Treasury Tranche Releases"
                icon={Landmark}
                variant="default"
              />
              <MetricCard
                title="Flagged Anomalies & Duplicates"
                value={`${activeBatch?.summary?.flaggedCasesCount || (activeBatch?.flaggedCases?.length) || 0}`}
                subtitle={`${activeBatch?.summary?.duplicateCount || 0} Duplicate • ${activeBatch?.summary?.criticalCount || 0} Critical`}
                icon={ShieldAlert}
                variant="critical"
              />
            </div>

            {/* BATCH SELECTOR & DATA AVAILABILITY CARD */}
            {batches.length > 0 && (
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                      {batches.findIndex((b) => b.batchId === activeBatch?.batchId) + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          Selected Batch: {activeBatch?.batchId}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {(activeBatch?.house || "lok_sabha").replace(/_/g, " ").toUpperCase()}
                        </span>
                        {activeScope?.batchId === activeBatch?.batchId && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            Active on Dashboard
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Uploaded: {activeBatch?.timestamp ? new Date(activeBatch.timestamp).toLocaleString() : "Recently"} • Evaluated in {activeBatch?.executionTimeMs || 420}ms
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="relative">
                      <select
                        value={activeBatch?.batchId || ""}
                        onChange={(e) => setSelectedBatchId(e.target.value)}
                        aria-label="Select Ingestion Batch"
                        className="appearance-none pl-3 pr-8 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                      >
                        {batches.map((b) => (
                          <option key={b.batchId} value={b.batchId}>
                            {b.batchId} ({(b.house || "LS").toUpperCase()}) — {b.summary?.totalWorksCount || b.workReports?.length || 0} works
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* WORK REPORTS TABLE & CONTROLS */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
              {/* Controls Bar */}
              <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Audited Work Dossiers ({filteredReports.length} of {workReports.length})
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Search */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search work title, ID, agency..."
                      className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl w-48 sm:w-60 focus:outline-none"
                    />
                  </div>

                  {/* Risk Filter */}
                  <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value)}
                    aria-label="Filter by Risk Level"
                    className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="all">All Risk Bands</option>
                    <option value="duplicate">Duplicate</option>
                    <option value="critical">Critical Risk (&lt;20)</option>
                    <option value="high">High Risk (20-39)</option>
                    <option value="medium">Medium Concern (40-59)</option>
                    <option value="low">Normal / Low Risk (60+)</option>
                  </select>

                  {/* State Filter */}
                  {uniqueStates.length > 1 && (
                    <select
                      value={stateFilter}
                      onChange={(e) => setStateFilter(e.target.value)}
                      aria-label="Filter by State"
                      className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none"
                    >
                      <option value="all">All States</option>
                      {uniqueStates.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Export CSV */}
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    disabled={filteredReports.length === 0}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    title="Download CSV report"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              {filteredReports.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[750px]">
                    <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Work ID</th>
                        <th className="py-3 px-4">Project Title &amp; Sector</th>
                        <th className="py-3 px-4">Location &amp; Agency</th>
                        <th className="py-3 px-4">Financials (Sanction / Disbursed)</th>
                        <th className="py-3 px-4">Evaluation &amp; Score</th>
                        <th className="py-3 px-4">Primary Signal</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredReports.map((work) => {
                        const sanctionAmt = work.sanction_amount || work.financials?.sanctionedAmount || 0;
                        const disburseAmt = work.disbursed_amount || work.financials?.disbursedAmount || 0;
                        const isDup =
                          work.risk_band === "DUPLICATE" ||
                          work.risk?.level === "duplicate" ||
                          (work.triggered_signals || []).some((s) => s.code === "SCOPE_DUP_02");

                        const score = isDup ? null : (work.composite_risk_score ?? work.risk?.score ?? null);
                        const level = isDup
                          ? "duplicate"
                          : typeof score === "number"
                          ? getRiskLevelFromScore(score)
                          : (work.risk_band || work.risk?.level || "LOW");

                        return (
                          <tr
                            key={work.id || work.work_id}
                            className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                          >
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                              {work.work_id || work.id}
                            </td>

                            <td className="py-3.5 px-4 max-w-xs">
                              <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                                {work.title}
                              </p>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                {work.category || "General Infrastructure"}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <p className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{work.district || "District"}, {work.state || "State"}</span>
                              </p>
                              <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                                {work.implementing_agency || "District Planning Authority"}
                              </p>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap font-mono text-xs">
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {formatIndianCurrency(sanctionAmt)}
                              </span>
                              <span className="text-[11px] text-slate-400 block">
                                Disbursed: {formatIndianCurrency(disburseAmt)}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <RiskBadge level={level} score={score} size="sm" />
                            </td>

                            <td className="py-3.5 px-4 max-w-xs">
                              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
                                {isDup
                                  ? "Duplicate Scope Detected"
                                  : work.risk?.primarySignal ||
                                    (work.triggered_signals && work.triggered_signals[0]?.finding) ||
                                    "Normal Parameters"}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenInReportTab(work)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/80 hover:bg-purple-100 dark:hover:bg-purple-900 border border-purple-200 dark:border-purple-800 transition"
                                title="View in Official Statutory HTML Report"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>View Report</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedWorkModal(work)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 transition"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Inspect</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {workReports.length === 0 ? "No Work Reports Available" : "No Works Match Your Filters"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    {workReports.length === 0
                      ? "Upload your custom e-SAKSHI CSV datasets in the Ingestion Hub to run dynamic adaptive audits and view generated dossiers."
                      : "Try clearing your search query or selecting 'All Risk Bands' to see the full list of audited works."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DETAILED WORK AUDIT DOSSIER MODAL */}
        {selectedWorkModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 my-8">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {selectedWorkModal.work_id || selectedWorkModal.id}
                    </span>
                    {(() => {
                      const isDup =
                        selectedWorkModal.risk_band === "DUPLICATE" ||
                        selectedWorkModal.risk?.level === "duplicate" ||
                        (selectedWorkModal.triggered_signals || []).some((s) => s.code === "SCOPE_DUP_02");
                      return (
                        <RiskBadge
                          level={isDup ? "duplicate" : (selectedWorkModal.risk_band || selectedWorkModal.risk?.level || "LOW")}
                          score={isDup ? null : (selectedWorkModal.composite_risk_score ?? selectedWorkModal.risk?.score ?? null)}
                          size="sm"
                        />
                      );
                    })()}
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                    {selectedWorkModal.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedWorkModal(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Work Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Location</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{selectedWorkModal.district}, {selectedWorkModal.state}</span>
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Implementing Agency</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{selectedWorkModal.implementing_agency}</span>
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Sanctioned Amount</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                    {formatIndianCurrency(selectedWorkModal.sanction_amount || selectedWorkModal.financials?.sanctionedAmount || 0)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Disbursed Amount</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                    {formatIndianCurrency(selectedWorkModal.disbursed_amount || selectedWorkModal.financials?.disbursedAmount || 0)}
                  </p>
                </div>
              </div>

              {/* Triggered Forensic Signals */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Triggered Surveillance Signals &amp; Findings
                </h4>
                {selectedWorkModal.triggered_signals && selectedWorkModal.triggered_signals.length > 0 ? (
                  <div className="space-y-2">
                    {selectedWorkModal.triggered_signals.map((sig, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-rose-800 dark:text-rose-300">
                            {sig.code || "SIG-ANOMALY"} • {sig.module || "Surveillance"}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-200/80 dark:bg-rose-900 text-rose-900 dark:text-rose-200">
                            {sig.severity || "HIGH"}
                          </span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200">{sig.finding}</p>
                        {sig.citation && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono italic pt-0.5">
                            Citation: {sig.citation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>No adverse anomaly triggers recorded. Operational progress is in compliance with standard guidelines.</span>
                  </div>
                )}
              </div>

              {/* Auditor Recommendation */}
              {selectedWorkModal.recommendation && (
                <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs">
                  <span className="font-bold text-blue-900 dark:text-blue-200 block mb-0.5">
                    Recommended Auditor Action
                  </span>
                  <p className="text-slate-700 dark:text-slate-300">{selectedWorkModal.recommendation}</p>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenInReportTab(selectedWorkModal);
                    setSelectedWorkModal(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Open in Official Statutory Report</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedWorkModal(null)}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
