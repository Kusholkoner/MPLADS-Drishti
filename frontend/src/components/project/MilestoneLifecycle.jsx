import React from "react";
import { CheckCircle2, Clock, AlertTriangle, CircleDashed } from "lucide-react";
import { formatIndianCurrency } from "@/lib/formatters";
export const MilestoneLifecycle = ({ milestones, className = "", }) => {
    return (<div className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Project Lifecycle & Execution Milestones
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Milestone progress tracking with evidence verification checkpoints
          </p>
        </div>
      </div>

      {/* Horizontal Lifecycle Stepper */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[650px] grid grid-cols-5 gap-3">
          {milestones.map((m, idx) => {
            const isCompleted = m.status === "completed";
            const isDelayed = m.status === "delayed";
            const isInProgress = m.status === "in_progress";
            const statusStyles = isCompleted
                ? {
                    border: "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20",
                    icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400"/>,
                    pill: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
                    label: "Completed",
                }
                : isDelayed
                    ? {
                        border: "border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20",
                        icon: <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400"/>,
                        pill: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
                        label: "Delayed",
                    }
                    : isInProgress
                        ? {
                            border: "border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20",
                            icon: <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400"/>,
                            pill: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
                            label: "In Progress",
                        }
                        : {
                            border: "border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 opacity-70",
                            icon: <CircleDashed className="w-4 h-4 text-slate-400"/>,
                            pill: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
                            label: "Pending",
                        };
            return (<div key={m.id} className={`p-3.5 rounded-xl border ${statusStyles.border} space-y-2 flex flex-col justify-between`}>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      #{m.sequence}
                    </span>
                    {statusStyles.icon}
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight">
                    {m.name}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-current/10 text-[11px]">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Disbursed:</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {formatIndianCurrency(m.disbursedAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Progress:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {m.completionPercentage}%
                    </span>
                  </div>
                  <span className={`inline-block w-full text-center py-0.5 rounded text-[10px] font-bold ${statusStyles.pill}`}>
                    {statusStyles.label}
                  </span>
                </div>
              </div>);
        })}
        </div>
      </div>
    </div>);
};
