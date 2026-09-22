import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import {
  FileQuestion,
  LayoutDashboard,
  FolderKanban,
  SearchCode,
  Sparkles,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";

export default function AppNotFound() {
  return (
    <AppShell breadcrumbs={[{ label: "404 Not Found" }]}>
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-xl w-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-3xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center shadow-lg border border-rose-200 dark:border-rose-900">
            <FileQuestion className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Workspace Record Not Found</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Work ID or Sub-Route Not Found
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              The project twin, investigation case, or evidence record you are trying to access does not exist in the active MPLADS database.
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
            <Link
              href="/app/command-center"
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 transition shadow-xs text-center space-y-1"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-600 mx-auto" />
              <p className="font-bold text-xs text-slate-900 dark:text-white">Command Center</p>
              <p className="text-[10px] text-slate-400">National view</p>
            </Link>

            <Link
              href="/app/projects"
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 transition shadow-xs text-center space-y-1"
            >
              <FolderKanban className="w-4 h-4 text-emerald-600 mx-auto" />
              <p className="font-bold text-xs text-slate-900 dark:text-white">Master Projects</p>
              <p className="text-[10px] text-slate-400">18,432 works</p>
            </Link>

            <Link
              href="/app/copilot"
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 transition shadow-xs text-center space-y-1"
            >
              <Sparkles className="w-4 h-4 text-purple-600 mx-auto" />
              <p className="font-bold text-xs text-slate-900 dark:text-white">Ask Copilot</p>
              <p className="text-[10px] text-slate-400">Query records</p>
            </Link>
          </div>

          <div className="pt-2">
            <Link
              href="/app/command-center"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
