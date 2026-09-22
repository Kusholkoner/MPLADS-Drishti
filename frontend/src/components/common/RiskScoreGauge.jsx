import React from "react";
import { getRiskBadgeStyles, getRiskLevelFromScore } from "@/lib/formatters";

export const RiskScoreGauge = ({
  score,
  level,
  size = "md",
  className = "",
}) => {
  const rawNorm = (level || "").toLowerCase();
  const isDuplicate = rawNorm === "duplicate" || level === "DUPLICATE";

  // Derive effective level from numeric score when not a duplicate
  const effectiveLevel = isDuplicate
    ? "duplicate"
    : typeof score === "number" && !isNaN(score)
    ? getRiskLevelFromScore(score)
    : rawNorm || "low";

  const styles = getRiskBadgeStyles(effectiveLevel);

  // SVG Gauge calculations
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const validScore = typeof score === "number" && !isNaN(score) ? score : (isDuplicate ? 100 : 0);
  const strokeDashoffset = isDuplicate ? 0 : circumference - (validScore / 100) * circumference;

  const strokeColor = {
    duplicate: "#a855f7", // purple-500
    critical: "#e11d48", // rose-600
    high: "#f97316", // orange-500
    medium: "#f59e0b", // amber-500
    low: "#10b981", // emerald-500
  }[effectiveLevel] || "#10b981";
    const dimensions = {
        sm: { box: 80, stroke: 6, fontScore: "text-lg", fontSub: "text-[10px]" },
        md: { box: 110, stroke: 8, fontScore: "text-2xl", fontSub: "text-xs" },
        lg: { box: 140, stroke: 10, fontScore: "text-3xl", fontSub: "text-sm" },
    }[size] || { box: 110, stroke: 8, fontScore: "text-2xl", fontSub: "text-xs" };
    return (<div className={`relative flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center">
        <svg width={dimensions.box} height={dimensions.box} viewBox="0 0 100 100" className="transform -rotate-90">
          {/* Background Circle */}
          <circle cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth={dimensions.stroke} fill="transparent" className="text-slate-100 dark:text-slate-800"/>
          {/* Progress Arc */}
          <circle cx="50" cy="50" r={radius} stroke={strokeColor} strokeWidth={dimensions.stroke} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" fill="transparent" className="transition-all duration-1000 ease-out"/>
        </svg>

        {/* Center Score Readout */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          {isDuplicate ? (
            <>
              <span className={`font-mono font-black tracking-tight text-purple-600 dark:text-purple-400 text-sm sm:text-base`}>
                DUP
              </span>
              <span className={`font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[9px]`}>
                NOT RATED
              </span>
            </>
          ) : (
            <>
              <span className={`font-mono font-black tracking-tight text-slate-900 dark:text-white ${dimensions.fontScore}`}>
                {score ?? 0}
              </span>
              <span className={`font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 ${dimensions.fontSub}`}>
                / 100
              </span>
            </>
          )}
        </div>
      </div>

      <div className="mt-2">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${styles.bg} ${styles.text} ${styles.border}`}>
          {isDuplicate ? "Duplicate Scope" : `${styles.label} Priority`}
        </span>
      </div>
    </div>);
};
