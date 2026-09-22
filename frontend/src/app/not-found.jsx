import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ArrowLeft,
  LayoutDashboard,
  FolderKanban,
  SearchCode,
  Sparkles,
  Home,
  HelpCircle,
  FileQuestion,
  Compass,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between antialiased font-sans">
      {/* Top Government Header Strip */}
      <header className="border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
              र
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white block leading-none">
                MPLADS Sentinel <span className="text-blue-600 font-mono text-xs">रक्षक</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                MoSPI Data Informatics & Innovation Division (SIH26102)
              </span>
            </div>
          </Link>

          <Link
            href="/app/command-center"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-blue-600 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition shadow-xs"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Command Center</span>
          </Link>
        </div>
      </header>

      {/* Main 404 Hero Section */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-200">
          {/* Animated Emblem / 404 Badge */}
          <div className="relative inline-block">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-blue-600/20 via-rose-500/20 to-purple-600/20 border border-slate-200 dark:border-slate-800 mx-auto flex items-center justify-center shadow-xl backdrop-blur-sm">
              <FileQuestion className="w-12 h-12 sm:w-14 sm:h-14 text-rose-600 dark:text-rose-400 animate-pulse" />
            </div>
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-black bg-rose-600 text-white shadow-md">
              404
            </span>
          </div>

          {/* Text Content */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Record Or Route Not Located</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Work Profile or Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
              The statutory route, project twin ID, or investigation dossier you requested could not be located in the active MoSPI Sentinel registry.
            </p>
          </div>

          {/* Quick Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto">
            <Link
              href="/app/command-center"
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition shadow-xs flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                  Command Center
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Live national surveillance dashboard
                </p>
              </div>
            </Link>

            <Link
              href="/app/projects"
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition shadow-xs flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FolderKanban className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                  Master Projects
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Search 18,432+ active project twins
                </p>
              </div>
            </Link>

            <Link
              href="/app/investigations"
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition shadow-xs flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <SearchCode className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                  Vigilance Desk
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Review active fraud inquiry cases
                </p>
              </div>
            </Link>

            <Link
              href="/app/copilot"
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition shadow-xs flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                  AI Copilot
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Ask Gemini about project records
                </p>
              </div>
            </Link>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/app/command-center"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shadow-md"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Return to Command Center</span>
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <Home className="w-4 h-4" />
              <span>Public Homepage</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 py-4 text-center text-[11px] text-slate-400">
        <p>Ministry of Statistics and Programme Implementation (MoSPI) • National Vigilance Surveillance Layer • SIH26102</p>
      </footer>
    </div>
  );
}
