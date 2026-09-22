"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  ShieldAlert,
  FileText,
  FileCheck,
  SearchCode,
  BarChart3,
  Sparkles,
  Database,
  UploadCloud,
  ShieldCheck,
  ExternalLink,
  ScanLine,
  Users,
  HardHat,
  ClipboardCheck,
  Server,
  Activity,
  ChevronUp,
  HelpCircle,
  BookOpen,
  GraduationCap,
  Scale,
  Info,
  Share2,
  Cpu,
  LogOut,
} from "lucide-react";
import { APP_NAME, APP_HINDI_NAME, SIH_PROBLEM_ID } from "@/lib/constants";
import { useAuth } from "@/lib/authContext";
import { api } from "@/lib/api";

export const Sidebar = ({ onCloseMobile }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const role = profile?.role || "mospi_officer";

  const [activity, setActivity] = React.useState(null);
  const [showDetails, setShowDetails] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    const loadStats = async () => {
      try {
        const stats = await api.getSystemActivity();
        if (isMounted && stats) {
          setActivity(stats);
        }
      } catch {}
    };
    loadStats();
    const timer = setInterval(loadStats, 10000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  // Build role-specific navigation menu
  const getNavItems = () => {
    switch (role) {
      case "system_admin":
        return [
          { label: "Command Center", href: "/app/command-center", icon: LayoutDashboard },
          { label: "User & RBAC Manager", href: "/app/admin", icon: Users, badge: "Admin", badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
          { label: "Master Projects", href: "/app/projects", icon: FolderKanban },
          { label: "Risk Intelligence", href: "/app/risk", icon: ShieldAlert, badge: "161", badgeColor: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300" },
          { label: "Vendor Graph (AI)", href: "/app/risk/vendor-graph", icon: Share2, badge: "GNN", badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" },
          { label: "Attack Simulator", href: "/app/risk/predictive", icon: Cpu, badge: "Sim", badgeColor: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300" },
          { label: "Reports", href: "/app/reports", icon: FileText, badge: "Reports", badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
          { label: "Evidence Repository", href: "/app/evidence", icon: FileCheck },
          { label: "Investigations", href: "/app/investigations", icon: SearchCode, badge: "3 Urgent", badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
          { label: "Analytics & Maps", href: "/app/analytics", icon: BarChart3 },
          { label: "AI Copilot", href: "/app/copilot", icon: Sparkles, badge: "AI", badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300" },
          { label: "e-SAKSHI Ingestion Hub", href: "/app/data", icon: UploadCloud, badge: "Ingest", badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
        ];

      case "field_verification_officer":
        return [
          { label: "Field Command Center", href: "/app/command-center", icon: LayoutDashboard },
          { label: "Assigned Field Inspections", href: "/app/projects", icon: ClipboardCheck, badge: "9 Tasks", badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
          { label: "Reports", href: "/app/reports", icon: FileText, badge: "Reports", badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
          { label: "Site Evidence & Geotag", href: "/app/evidence", icon: FileCheck, badge: "Upload", badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
          { label: "e-SAKSHI Ingestion Hub", href: "/app/data", icon: UploadCloud },
          { label: "Field Inquiry Notes", href: "/app/investigations", icon: SearchCode },
        ];

      case "implementing_agency":
        return [
          { label: "Agency Command Center", href: "/app/command-center", icon: LayoutDashboard },
          { label: "Executed Works", href: "/app/projects", icon: HardHat, badge: "26 Works", badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
          { label: "Reports", href: "/app/reports", icon: FileText, badge: "Reports", badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
          { label: "Contractor Invoices & Evidence", href: "/app/evidence", icon: FileCheck, badge: "Upload", badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
          { label: "e-SAKSHI Ingestion Hub", href: "/app/data", icon: UploadCloud, badge: "Upload", badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
        ];

      case "mp":
        return [
          { label: "Constituency Command Center", href: "/app/command-center", icon: LayoutDashboard },
          { label: "Constituency Works", href: "/app/projects", icon: FolderKanban },
          { label: "Reports", href: "/app/reports", icon: FileText, badge: "Reports", badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
          { label: "Constituency Analytics", href: "/app/analytics", icon: BarChart3 },
          { label: "e-SAKSHI Ingestion Hub", href: "/app/data", icon: UploadCloud },
          { label: "AI Project Copilot", href: "/app/copilot", icon: Sparkles, badge: "AI", badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
        ];

      case "state_nodal_authority":
        return [
          { label: "State Command Center", href: "/app/command-center", icon: LayoutDashboard },
          { label: "Statewide Projects", href: "/app/projects", icon: FolderKanban },
          { label: "Reports", href: "/app/reports", icon: FileText, badge: "Reports", badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
          { label: "State Risk Alerts", href: "/app/risk", icon: ShieldAlert, badge: "State", badgeColor: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300" },
          { label: "Evidence Repository", href: "/app/evidence", icon: FileCheck },
          { label: "Audit Investigations", href: "/app/investigations", icon: SearchCode },
          { label: "State Analytics & Maps", href: "/app/analytics", icon: BarChart3 },
          { label: "AI Copilot", href: "/app/copilot", icon: Sparkles, badge: "AI", badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
          { label: "e-SAKSHI Ingestion Hub", href: "/app/data", icon: UploadCloud },
        ];

      case "investigator":
        return [
          { label: "Vigilance Command Center", href: "/app/command-center", icon: LayoutDashboard },
          { label: "Investigation Dossiers", href: "/app/investigations", icon: SearchCode, badge: "Active Cases", badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
          { label: "Reports", href: "/app/reports", icon: FileText, badge: "Reports", badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
          { label: "Risk Anomaly Signals", href: "/app/risk", icon: ShieldAlert, badge: "161 Flags", badgeColor: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300" },
          { label: "Layout Similarity Studio", href: "/app/risk/documents/compare", icon: ScanLine, badge: "OCR", badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300" },
          { label: "Evidence Chain Repository", href: "/app/evidence", icon: FileCheck },
          { label: "Forensic Copilot", href: "/app/copilot", icon: Sparkles, badge: "AI", badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
          { label: "e-SAKSHI Ingestion Hub", href: "/app/data", icon: UploadCloud },
        ];

      case "mospi_officer":
      default:
        return [
          { label: "Command Center", href: "/app/command-center", icon: LayoutDashboard },
          { label: "Master Projects", href: "/app/projects", icon: FolderKanban },
          { label: "Reports", href: "/app/reports", icon: FileText, badge: "Reports", badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
          { label: "Risk Intelligence", href: "/app/risk", icon: ShieldAlert, badge: "161", badgeColor: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300" },
          { label: "Vendor Graph (AI)", href: "/app/risk/vendor-graph", icon: Share2, badge: "GNN", badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" },
          { label: "Attack Simulator", href: "/app/risk/predictive", icon: Cpu, badge: "Sim", badgeColor: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300" },
          { label: "Layout Similarity Studio", href: "/app/risk/documents/compare", icon: ScanLine, badge: "OCR", badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300" },
          { label: "Evidence Repository", href: "/app/evidence", icon: FileCheck },
          { label: "Investigations", href: "/app/investigations", icon: SearchCode, badge: "3 Urgent", badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
          { label: "Analytics & Maps", href: "/app/analytics", icon: BarChart3 },
          { label: "AI Copilot", href: "/app/copilot", icon: Sparkles, badge: "AI", badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
          { label: "e-SAKSHI Ingestion Hub", href: "/app/data", icon: UploadCloud, badge: "Ingest", badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 h-screen flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200/80 dark:border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800">
        <Link href="/app/command-center" onClick={onCloseMobile} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                {APP_NAME}
              </span>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-1 py-0.2 rounded border border-blue-200 dark:border-blue-800">
                {APP_HINDI_NAME}
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-400">
              MoSPI DIID • {SIH_PROBLEM_ID}
            </p>
          </div>
        </Link>
      </div>

      {/* Main Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {profile?.role_label || "Active Module"}
          </span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href === "/app/command-center" && (pathname === "/" || pathname === "/app")) ||
            (item.href !== "/app/command-center" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-blue-600 text-white dark:bg-blue-600 dark:text-white shadow-md shadow-blue-600/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-white" : "text-slate-400 dark:text-slate-500"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : item.badgeColor || "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Multipage Statutory Reference & Documentation */}
        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="px-3 pb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Statutory Knowledge
            </span>
          </div>
          {[
            { label: "How It Works", href: "/how-it-works", icon: HelpCircle },
            { label: "AI Methodology", href: "/methodology", icon: BookOpen },
            { label: "Research & CAG", href: "/research", icon: GraduationCap },
            { label: "Trust & Ethics", href: "/transparency", icon: Scale },
            { label: "About MoSPI", href: "/about", icon: Info },
          ].map((refItem) => {
            const RefIcon = refItem.icon;
            const isRefActive = pathname === refItem.href || pathname.startsWith(refItem.href + "/");
            return (
              <Link
                key={refItem.href}
                href={refItem.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isRefActive
                    ? "bg-slate-100 dark:bg-slate-850 text-blue-600 dark:text-blue-400 font-bold"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850/60 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <RefIcon className={`w-3.5 h-3.5 ${isRefActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`} />
                  <span className="truncate">{refItem.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Authenticated Officer Profile & Quick Logout Bar */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              {profile?.avatar_initials || profile?.full_name?.substring(0, 2).toUpperCase() || "OF"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {profile?.full_name || "Institutional Officer"}
              </p>
              <p className="text-[10px] text-slate-400 font-medium truncate">
                {profile?.designation || profile?.role?.replace("_", " ")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              await signOut();
              router.push("/login?status=signed_out");
            }}
            title="Sign Out / Logout Session"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real-time System Activity Stats (Bottom Left) */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
        <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 shadow-sm">
          {/* Activity Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/60 mb-2">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                System Activity
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Live
              </span>
            </div>
          </div>

          {/* Activity Stats Rows */}
          <div className="space-y-1.5 text-[11px]">
            {/* 1. Database Stat */}
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5 truncate">
                <Database className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">Database</span>
              </div>
              <span className="font-mono text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/60 shrink-0">
                {activity?.database?.mode === "uploaded"
                  ? `${activity.database.activeWorksCount || 0} Works`
                  : activity?.database?.status === "online" ? "Connected (0)" : "Connecting"}
              </span>
            </div>

            {/* 2. Backend Stat */}
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5 truncate">
                <Server className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">Backend</span>
              </div>
              <span className="font-mono text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200/60 dark:border-blue-800/60 shrink-0">
                Port {activity?.backend?.port || 5000} : {activity?.backend?.uptimeSeconds ? `${Math.floor(activity.backend.uptimeSeconds / 60)}m` : "Online"}
              </span>
            </div>

            {/* 3. AI Modules Stat */}
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5 truncate">
                <Sparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 shrink-0" />
                <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">AI Modules</span>
              </div>
              <span className="font-mono text-[10px] font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-200/60 dark:border-purple-800/60 shrink-0">
                {activity?.aiModules?.activeEnginesCount || 21}/21 Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
