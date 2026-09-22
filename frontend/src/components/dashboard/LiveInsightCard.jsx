import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Cpu, AlertTriangle } from "lucide-react";
export const LiveInsightCard = () => {
    return (<div className="relative p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shrink-0 mt-0.5 shadow-xs">
            <Sparkles className="w-5 h-5"/>
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5"/> Sentinel Pattern Intelligence
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3"/> Active Anomaly Cluster
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
              Financial/Physical Progress Divergence (Gap &gt;30%) is currently the highest-frequency critical signal across 18,432 monitored works.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              38 delayed structural works currently have active fund disbursements without verified milestone site evidence.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
          <Link href="/app/risk/financial" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20">
            <span>Explore Risk Pattern</span>
            <ArrowRight className="w-3.5 h-3.5"/>
          </Link>
          <Link href="/app/projects/MPL-004821" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all">
            <span>Inspect Case</span>
          </Link>
        </div>
      </div>
    </div>);
};
