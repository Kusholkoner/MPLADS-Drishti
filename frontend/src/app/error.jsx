"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  RefreshCw,
  LayoutDashboard,
  Home,
  ShieldAlert,
  Terminal,
} from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("[Sentinel Surveillance Runtime Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between antialiased font-sans">
      {/* Header */}
      <header className="border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
              र
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white block leading-none">
                MPLADS Sentinel <span className="text-rose-600 font-mono text-xs">रक्षक</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Surveillance System Diagnostic
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-initialize Session</span>
          </button>
        </div>
      </header>

      {/* Main Error Body */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-xl w-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-3xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center shadow-lg border border-rose-200 dark:border-rose-900">
            <AlertTriangle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Runtime Exception Intercepted (500)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Temporary Surveillance Processing Error
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              An unexpected exception occurred during data synthesis. The security boundary has prevented system instability.
            </p>
          </div>

          {/* Diagnostic Box */}
          {error?.message && (
            <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 text-left text-xs font-mono overflow-x-auto space-y-1 shadow-inner">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <Terminal className="w-3 h-3 text-rose-400" />
                <span>Diagnostic Error Trace</span>
              </div>
              <p className="text-rose-300 text-[11px] break-all">{error.message}</p>
              {error.digest && (
                <p className="text-slate-500 text-[10px]">Digest ID: {error.digest}</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry / Recover Component</span>
            </button>
            <Link
              href="/app/command-center"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Return to Command Center</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 py-4 text-center text-[11px] text-slate-400">
        <p>MoSPI Surveillance Engine • National Incident Logging Active • SIH26102</p>
      </footer>
    </div>
  );
}
