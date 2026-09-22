import React from "react";
import { BadgeIndianRupee, Clock, CopyCheck, FileText, Camera } from "lucide-react";

export const RiskBreakdownBar = ({ breakdown = {}, className = "" }) => {
  const items = [
    {
      label: "Financial & Disbursal Integrity",
      penalty: breakdown.financial || 0,
      max: 30,
      icon: BadgeIndianRupee,
    },
    {
      label: "Visual Evidence Authenticity",
      penalty: breakdown.visual || 0,
      max: 25,
      icon: Camera,
    },
    {
      label: "Timeline & Milestone Adherence",
      penalty: breakdown.timeline || 0,
      max: 25,
      icon: Clock,
    },
    {
      label: "Scope Uniqueness (Non-Duplicate)",
      penalty: breakdown.duplicate || 0,
      max: 20,
      icon: CopyCheck,
    },
    {
      label: "Document & Statutory Compliance",
      penalty: breakdown.document || 0,
      max: 20,
      icon: FileText,
    },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const Icon = item.icon;
        // Higher is better: Health = Max - Penalty
        const healthScore = Math.max(0, item.max - item.penalty);
        const healthPercent = Math.min(100, Math.round((healthScore / item.max) * 100));

        const getStatusColor = (pct) => {
          if (pct >= 80) return { bar: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" };
          if (pct >= 60) return { bar: "bg-teal-500", text: "text-teal-600 dark:text-teal-400" };
          if (pct >= 40) return { bar: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" };
          if (pct >= 20) return { bar: "bg-orange-500", text: "text-orange-600 dark:text-orange-400" };
          return { bar: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" };
        };

        const color = getStatusColor(healthPercent);

        return (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <Icon className={`w-3.5 h-3.5 ${color.text}`} />
                {item.label}
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`font-mono font-bold ${color.text}`}>
                  {healthScore}
                </span>
                <span className="text-[10px] text-slate-400">/ {item.max} pts</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${color.bar}`}
                style={{ width: `${healthPercent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
