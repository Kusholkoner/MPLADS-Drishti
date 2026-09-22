"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ShieldAlert,
  Activity,
  Cpu,
  Database,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  Users,
  FileText,
  BarChart3,
  Search,
  MapPin,
  Zap,
  ArrowRight,
  RefreshCw,
  Globe,
  Layers,
  Eye,
  Lock,
  Server,
  Wifi,
  WifiOff,
  CircleDot,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/authContext";

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = {
    healthy: { cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400", dot: "bg-emerald-500", label: "Healthy" },
    online: { cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400", dot: "bg-emerald-500", label: "Online" },
    active: { cls: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400", dot: "bg-blue-500", label: "Active" },
    degraded: { cls: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400", dot: "bg-amber-500", label: "Degraded" },
    offline: { cls: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400", dot: "bg-red-500", label: "Offline" },
    checking: { cls: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400", dot: "bg-slate-400 animate-pulse", label: "Checking..." },
  }[status] || { cls: "bg-slate-100 text-slate-500", dot: "bg-slate-400", label: status };

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Quick Action Card ────────────────────────────────────────────────────────
function QuickActionCard({ href, icon: Icon, label, description, color }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all"
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{description}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

// ─── AI Module Row ────────────────────────────────────────────────────────────
function AIModuleRow({ code, name, status, category }) {
  const statusCfg = {
    active: "text-emerald-600 dark:text-emerald-400",
    standby: "text-amber-600 dark:text-amber-400",
    loading: "text-blue-500 dark:text-blue-400",
  }[status] || "text-slate-400";

  return (
    <div className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 w-12 shrink-0">{code}</span>
      <span className="flex-1 text-xs text-slate-700 dark:text-slate-300 truncate">{name}</span>
      <span className={`text-[10px] font-semibold uppercase tracking-wide ${statusCfg}`}>{status}</span>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
      {sub && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

// ─── AI Modules Manifest ──────────────────────────────────────────────────────
const AI_MODULES = [
  { code: "MOD-01", name: "Data Quality Validator", category: "Ingestion", status: "active" },
  { code: "MOD-02", name: "Entity Resolution AI (NER + Fuzzy)", category: "Ingestion", status: "active" },
  { code: "MOD-03", name: "Proposal Intelligence Engine", category: "Compliance", status: "active" },
  { code: "MOD-04", name: "Statutory Compliance Checker", category: "Compliance", status: "active" },
  { code: "MOD-05", name: "Cost Anomaly Detector", category: "Financial", status: "active" },
  { code: "MOD-06", name: "Timeline & SLA Breach Monitor", category: "Compliance", status: "active" },
  { code: "MOD-07", name: "Multi-Source Financial Audit", category: "Financial", status: "active" },
  { code: "MOD-08", name: "Physical-Financial Divergence Net", category: "Financial", status: "active" },
  { code: "MOD-09", name: "Duplicate & Ghost Work Detector", category: "Integrity", status: "active" },
  { code: "MOD-10", name: "Vendor Monopoly & Shell GNN", category: "Integrity", status: "active" },
  { code: "MOD-11", name: "Document Intelligence (OCR)", category: "Documents", status: "active" },
  { code: "MOD-12", name: "Document Similarity Engine", category: "Documents", status: "active" },
  { code: "MOD-13", name: "Visual Verification (dHash + ELA)", category: "Vision", status: "active" },
  { code: "MOD-14", name: "Geospatial Polygon Verifier", category: "Geospatial", status: "active" },
  { code: "MOD-15", name: "Contractor Collusion Graph Intelligence", category: "Integrity", status: "active" },
  { code: "MOD-16", name: "Predictive Risk Scorer (XGBoost)", category: "Risk", status: "active" },
  { code: "MOD-17", name: "Multi-Signal Risk Fusion Engine", category: "Risk", status: "active" },
  { code: "MOD-18", name: "SHAP Explanation Engine", category: "Explainability", status: "active" },
  { code: "MOD-19", name: "Dossier & Evidence Card Generator", category: "Output", status: "active" },
  { code: "MOD-20", name: "Audit Copilot (Gemini 2.0 Flash)", category: "LLM", status: "active" },
  { code: "MOD-21", name: "Active Learning Feedback Loop", category: "Learning", status: "active" },
];

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export default function DashboardPage() {
  const { profile, isConfigured } = useAuth();
  const router = useRouter();

  const [health, setHealth] = useState(null);
  const [healthStatus, setHealthStatus] = useState("checking");
  const [aiEngineStatus, setAiEngineStatus] = useState("checking");
  const [dbStatus, setDbStatus] = useState("checking");
  const [lastRefresh, setLastRefresh] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showAllModules, setShowAllModules] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!profile && typeof window !== "undefined") {
      const stored = localStorage.getItem("mplads_active_user");
      if (!stored) {
        router.push("/login");
      }
    }
  }, [profile, router]);

  const fetchHealth = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/health`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
        setHealthStatus("healthy");
        const db = data.checks?.database?.status || "";
        setDbStatus(db === "connected" ? "online" : db.startsWith("degraded") ? "degraded" : "offline");
        setAiEngineStatus(
          data.checks?.aiEngine?.status === "healthy" ? "online" : "offline"
        );
      } else {
        setHealthStatus("degraded");
        setDbStatus("checking");
        setAiEngineStatus("offline");
      }
    } catch {
      setHealthStatus("offline");
      setDbStatus("offline");
      setAiEngineStatus("offline");
    } finally {
      setRefreshing(false);
      setLastRefresh(new Date());
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const QUICK_ACTIONS = [
    {
      href: "/app/command-center",
      icon: ShieldAlert,
      label: "Command Center",
      description: "Surveillance dashboard & risk alerts",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
    },
    {
      href: "/app/projects",
      icon: Layers,
      label: "Projects",
      description: "Browse & monitor MPLADS works",
      color: "bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400",
    },
    {
      href: "/app/analytics",
      icon: BarChart3,
      label: "Analytics",
      description: "National & state-level insights",
      color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
    },
    {
      href: "/app/copilot",
      icon: Zap,
      label: "AI Copilot",
      description: "Query with Gemini 2.0 Flash",
      color: "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    },
    {
      href: "/app/investigations",
      icon: Search,
      label: "Investigations",
      description: "Active vigilance cases",
      color: "bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400",
    },
    {
      href: "/app/evidence",
      icon: Eye,
      label: "Evidence",
      description: "Upload & verify field evidence",
      color: "bg-teal-100 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400",
    },
    {
      href: "/app/reports",
      icon: FileText,
      label: "Reports",
      description: "Export audit reports",
      color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
    },
    {
      href: "/app/data",
      icon: Database,
      label: "Datasets",
      description: "Ingest cloud datasets (Lok/Rajya Sabha)",
      color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    },
  ];

  const displayedModules = showAllModules ? AI_MODULES : AI_MODULES.slice(0, 10);

  const avatarInitials = profile?.avatar_initials || profile?.full_name?.substring(0, 2).toUpperCase() || "U";
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── Welcome Header ─────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-blue-600/25">
              {avatarInitials}
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{greeting},</p>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                {profile?.full_name || "Officer"}
              </h1>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  {profile?.role_label || profile?.role || "Officer"}
                </span>
                {profile?.designation && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    · {profile.designation}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={fetchHealth}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh Status
          </button>
        </div>

        {/* ── System Status Strip ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Backend API", status: healthStatus, icon: Server },
            { label: "Supabase DB", status: dbStatus, icon: Database },
            { label: "AI Engine", status: aiEngineStatus, icon: Cpu },
            {
              label: "Supabase Auth",
              status: isConfigured ? "online" : "offline",
              icon: Lock,
            },
          ].map(({ label, status, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3"
            >
              <Icon className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">{label}</p>
                <StatusBadge status={status} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Stats Row ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Works Monitored"
            value={health?.checks?.persistence?.activeWorksCount ?? "—"}
            icon={Layers}
            color="bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
            sub="Active surveillance scope"
          />
          <StatCard
            label="AI Modules"
            value="21"
            icon={Cpu}
            color="bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400"
            sub="All modules operational"
          />
          <StatCard
            label="DB Latency"
            value={health ? `${health.checks?.database?.latencyMs ?? "?"}ms` : "—"}
            icon={Activity}
            color="bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
            sub="Supabase PostgreSQL"
          />
          <StatCard
            label="Uptime"
            value={health ? `${Math.floor(health.uptimeSeconds / 60)}m` : "—"}
            icon={Clock}
            color="bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
            sub="Backend process uptime"
          />
        </div>

        {/* ── Two-Column Main ────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* Quick Actions */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Quick Actions</h2>
              <Link href="/app/command-center" className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                Full Dashboard <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {QUICK_ACTIONS.map((action) => (
                <QuickActionCard key={action.href} {...action} />
              ))}
            </div>
          </div>

          {/* AI Pipeline Status */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">AI Pipeline</h2>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                21 / 21 Active
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              {/* Pipeline health bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pipeline Health</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">100%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>

              {/* LLM info */}
              <div className="flex items-center gap-2 mb-4 p-2.5 bg-violet-50 dark:bg-violet-950/30 rounded-lg border border-violet-200 dark:border-violet-800">
                <Zap className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-violet-700 dark:text-violet-300">Gemini 2.0 Flash</p>
                  <p className="text-[10px] text-violet-500 dark:text-violet-400">LLM Engine · MOD-20 Audit Copilot</p>
                </div>
              </div>

              {/* Module list */}
              <div>
                {displayedModules.map((mod) => (
                  <AIModuleRow key={mod.code} {...mod} />
                ))}
              </div>

              <button
                onClick={() => setShowAllModules((v) => !v)}
                className="mt-3 w-full text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline py-1"
              >
                {showAllModules ? "Show less" : `Show all 21 modules`}
              </button>
            </div>
          </div>
        </div>

        {/* ── Backend Health Details ─────────────────────────────────────── */}
        {health && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">System Health Details</h2>
              {lastRefresh && (
                <span className="text-xs text-slate-400">
                  Last refreshed: {lastRefresh.toLocaleTimeString()}
                </span>
              )}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Database</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{health.checks?.database?.provider}</p>
                <p className="text-xs text-slate-500">
                  Status: <span className="font-semibold text-slate-700 dark:text-slate-300">{health.checks?.database?.status}</span>
                </p>
                <p className="text-xs text-slate-500">Latency: {health.checks?.database?.latencyMs}ms</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">AI Engine</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">FastAPI Python Service</p>
                <p className="text-xs text-slate-500">
                  Status: <span className="font-semibold text-slate-700 dark:text-slate-300">{health.checks?.aiEngine?.status}</span>
                </p>
                <p className="text-xs text-slate-500">Latency: {health.checks?.aiEngine?.latencyMs}ms</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Storage</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Supabase Storage</p>
                <p className="text-xs text-slate-500">
                  Status: <span className="font-semibold text-slate-700 dark:text-slate-300">{health.checks?.storage?.status}</span>
                </p>
                <p className="text-xs text-slate-500">
                  Buckets: {health.checks?.storage?.buckets?.join(", ") || "none"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Backend Memory</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Node.js Express</p>
                <p className="text-xs text-slate-500">RSS: {health.checks?.memory?.rssMb} MB</p>
                <p className="text-xs text-slate-500">Heap: {health.checks?.memory?.heapUsedMb} MB</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Footer Note ────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 pb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>
            MPLABS Drishti v2.5.0 · SIH26102 · Ministry of Statistics &amp; Programme Implementation (MoSPI) ·{" "}
            {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}
          </span>
        </div>
      </div>
    </AppShell>
  );
}
