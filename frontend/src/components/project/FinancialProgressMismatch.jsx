import React from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { formatPercentage } from "@/lib/formatters";

export const FinancialProgressMismatch = ({
  financialProgress = 0,
  physicalProgress = 0,
  disbursedAmount = 0,
  sanctionedAmount = 0,
  className = "",
}) => {
  const gap = Math.abs(financialProgress - physicalProgress);
  const isAheadOfMilestone = financialProgress > physicalProgress && gap >= 15;
  const isHealthy = gap < 15;

  return (
    <div
      className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border ${
        isAheadOfMilestone
          ? "border-rose-200/80 dark:border-rose-900/60"
          : "border-slate-200/80 dark:border-slate-800"
      } shadow-sm space-y-4 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Project Milestone Execution &amp; Delivery
            </h3>
            {isAheadOfMilestone ? (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Advance Disbursal Alert
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Milestone Aligned
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified on-site completion and structural delivery status
          </p>
        </div>

        <div className="text-right self-start sm:self-auto">
          <span className="text-xs text-slate-400">Execution Status:</span>
          <span
            className={`ml-1.5 font-mono font-extrabold text-sm ${
              isAheadOfMilestone
                ? "text-rose-600 dark:text-rose-400"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {isAheadOfMilestone ? "Advance Drawn" : "On Track"}
          </span>
        </div>
      </div>

      {/* Unified Progress Bar */}
      <div className="space-y-2 pt-1">
        <div className="flex justify-between text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isAheadOfMilestone ? "bg-amber-500" : "bg-emerald-500"
              }`}
            />
            Certified Milestone Completion
          </span>
          <span className="font-mono text-slate-900 dark:text-white text-sm font-bold">
            {formatPercentage(physicalProgress)}
          </span>
        </div>
        <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              physicalProgress >= 75
                ? "bg-emerald-500"
                : physicalProgress >= 40
                ? "bg-blue-600"
                : "bg-amber-500"
            }`}
            style={{ width: `${Math.min(100, Math.max(0, physicalProgress))}%` }}
          />
        </div>
      </div>

      {/* Warning Box */}
      {isAheadOfMilestone && (
        <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-800/80 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-rose-800 dark:text-rose-300">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Premature Disbursement Alert</span>
          </div>
          <p className="text-rose-700/90 dark:text-rose-300/80 leading-relaxed text-[11px]">
            Funds were released ahead of certified structural completion on site. Physical delivery must be verified by engineering inspectors before further bills are processed.
          </p>
        </div>
      )}
    </div>
  );
};
