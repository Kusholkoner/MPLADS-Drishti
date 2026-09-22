import React from "react";
import { getRiskBadgeStyles, getRiskLevelFromScore } from "@/lib/formatters";
import { ShieldAlert, ShieldCheck, AlertTriangle, AlertOctagon, CopyCheck } from "lucide-react";

export const RiskBadge = ({
  level,
  score,
  showIcon = true,
  size = "md",
  className = "",
}) => {
  const rawNorm = (level || "").toLowerCase();
  const isDuplicate = rawNorm === "duplicate" || level === "DUPLICATE";

  // Calibrate effective level from score when a valid numeric score is present
  const effectiveLevel = isDuplicate
    ? "duplicate"
    : (rawNorm === "normal" || rawNorm === "valid" || rawNorm === "corrupted" || rawNorm === "suspicious")
    ? rawNorm
    : typeof score === "number" && !isNaN(score)
    ? getRiskLevelFromScore(score)
    : rawNorm || "low";

  const styles = getRiskBadgeStyles(effectiveLevel);

  const getIcon = () => {
    switch (effectiveLevel) {
      case "duplicate":
        return <CopyCheck className="w-3.5 h-3.5" />;
      case "critical":
      case "corrupted":
        return <AlertOctagon className="w-3.5 h-3.5" />;
      case "high":
      case "suspicious":
        return <ShieldAlert className="w-3.5 h-3.5" />;
      case "medium":
        return <AlertTriangle className="w-3.5 h-3.5" />;
      case "normal":
      case "valid":
      case "low":
      default:
        return <ShieldCheck className="w-3.5 h-3.5" />;
    }
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1 font-medium",
    md: "px-2.5 py-1 text-xs gap-1.5 font-semibold",
    lg: "px-3.5 py-1.5 text-sm gap-2 font-bold",
  }[size] || "px-2.5 py-1 text-xs gap-1.5 font-semibold";

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-all ${styles.bg} ${styles.text} ${styles.border} ${sizeClasses} ${className}`}
    >
      {showIcon && <span className="shrink-0">{getIcon()}</span>}
      <span>{styles.label || "Duplicate"}</span>
      {!isDuplicate && score !== undefined && score !== null && score !== "" && (
        <span className="opacity-80 font-mono tracking-tight text-[0.9em] border-l border-current/20 pl-1.5">
          {score}/100
        </span>
      )}
    </span>
  );
};
