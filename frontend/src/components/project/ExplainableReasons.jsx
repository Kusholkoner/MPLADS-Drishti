"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FileCheck, ChevronDown, ChevronUp, ShieldAlert, AlertTriangle, ArrowRight } from "lucide-react";
import { RiskBadge } from "../common/RiskBadge";

export const ExplainableReasons = ({ reasons = [], className = "" }) => {
  const [expandedIds, setExpandedIds] = useState({});
  const [statuses, setStatuses] = useState({});

  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const updateStatus = (id, newStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: newStatus }));
  };

  // Derive concise technical phrases (2-4 words)
  const getConciseTrigger = (reason) => {
    const t = (reason.title || "").toLowerCase();
    const s = (reason.severity || "").toLowerCase();
    if (s === "duplicate" || t.includes("duplicate")) return "Duplicate Action Detected";
    if (t.includes("financial") || t.includes("progress") || t.includes("disbursement")) return "Disbursement Divergence";
    if (t.includes("image") || t.includes("visual") || t.includes("photo")) return "Visual Similarity Conflict";
    if (t.includes("milestone") || t.includes("timeline") || t.includes("delay")) return "Milestone Schedule Slippage";
    if (t.includes("cost") || t.includes("rate") || t.includes("deviation")) return "CPWD Rate Outlier";
    if (t.includes("split") || t.includes("invoice") || t.includes("tender")) return "Tender Splitting Detected";
    if (t.includes("document") || t.includes("uc") || t.includes("inconsistency")) return "Treasury UC Discrepancy";
    return reason.title ? reason.title.split(" ").slice(0, 4).join(" ") : "Operational Variance";
  };

  const getConciseAction = (reason) => {
    const t = (reason.title || "").toLowerCase();
    const s = (reason.severity || "").toLowerCase();
    if (s === "duplicate" || t.includes("duplicate")) return "Review & Verify";
    if (s === "critical" || t.includes("disbursement") || t.includes("advance")) return "Freeze Tranche";
    if (t.includes("image") || t.includes("visual")) return "Site Re-inspection";
    if (t.includes("milestone") || t.includes("delay")) return "Issue Notice";
    if (t.includes("cost") || t.includes("split")) return "Audit Sanction Ledger";
    return "Verify Field Data";
  };

  const getContingencyDirective = (reason) => {
    const s = (reason.severity || "").toLowerCase();
    if (s === "critical" || s === "duplicate") return "Hold Project";
    if (s === "high") return "Withhold Next Bill";
    if (s === "medium") return "Audit Schedule";
    return "Standard Monitoring";
  };

  return (
    <div className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 ${className}`}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Risk Contingency Setup
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              Actionable Protocol
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Operational triage matrix: identify risk, severity, corrective action, and contingency protocol
          </p>
        </div>
      </div>

      {/* Contingency Matrix Rows */}
      <div className="space-y-3">
        {reasons.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No active risk contingency triggers for this project.
          </div>
        ) : (
          reasons.map((reason, idx) => {
            const id = reason.id || `RSN-${idx + 1}`;
            const isExpanded = Boolean(expandedIds[id]);
            const currentStatus = statuses[id] || "Pending";
            const trigger = getConciseTrigger(reason);
            const action = getConciseAction(reason);
            const contingency = getContingencyDirective(reason);

            return (
              <div
                key={id}
                className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 overflow-hidden transition-all shadow-2xs"
              >
                {/* Structured 5-Column Primary Matrix */}
                <div className="p-3.5 grid grid-cols-2 sm:grid-cols-5 gap-3 items-center text-xs">
                  {/* 1. Risk */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Risk
                    </span>
                    <RiskBadge level={reason.severity} score={reason.scoreContribution ? undefined : undefined} size="sm" />
                  </div>

                  {/* 2. Trigger */}
                  <div className="sm:col-span-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Trigger
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 block truncate" title={reason.title}>
                      {trigger}
                    </span>
                  </div>

                  {/* 3. Recommended Action */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Recommended Action
                    </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400 block truncate">
                      {action}
                    </span>
                  </div>

                  {/* 4. Contingency */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Contingency
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {contingency}
                    </span>
                  </div>

                  {/* 5. Status & Expand Toggle */}
                  <div className="col-span-2 sm:col-span-1 flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5 sm:text-right">
                        Status
                      </span>
                      <select
                        value={currentStatus}
                        onChange={(e) => updateStatus(id, e.target.value)}
                        aria-label={`Status for ${id}`}
                        className="px-2 py-0.5 text-[11px] font-bold rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Hold Project">Hold Project</option>
                        <option value="Reviewing">Reviewing</option>
                        <option value="Mitigated">Mitigated</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleExpand(id)}
                      aria-label="Toggle details"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors mt-3 sm:mt-2"
                      title={isExpanded ? "Collapse technical details" : "Expand technical details"}
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Secondary Technical Details (Expandable Drawer) */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-3 animate-in fade-in duration-150">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Technical Explanation & Impact
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                        {reason.explanation || reason.description || "Quantitative statistical anomaly detected across audited metrics."}
                      </p>
                    </div>

                    {/* Deviations Table */}
                    {reason.deviations && reason.deviations.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Quantitative Deviations
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {reason.deviations.map((dev, dIdx) => (
                            <div
                              key={dIdx}
                              className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono"
                            >
                              <span className="text-slate-500">{dev.label}:</span>
                              <span className="text-slate-400">Exp: {dev.expected}</span>
                              <span className="font-bold text-rose-600 dark:text-rose-400">Act: {dev.actual}</span>
                              <span className="px-1 rounded bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-bold">
                                {dev.delta}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Metadata, Citations & Evidence Links */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-2 flex-wrap text-slate-500">
                        {reason.evidenceIds && reason.evidenceIds.length > 0 && (
                          <>
                            <span className="font-semibold text-slate-400">Supporting Evidence:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {reason.evidenceIds.map((eId) => (
                                <Link
                                  key={eId}
                                  href={`/app/evidence/${eId}`}
                                  className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 hover:underline font-mono font-bold flex items-center gap-1 border border-blue-200 dark:border-blue-800"
                                >
                                  <FileCheck className="w-3 h-3" />
                                  <span>{eId}</span>
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="text-slate-400 flex items-center gap-3">
                        {reason.confidence && (
                          <span>Confidence: <strong className="text-slate-700 dark:text-slate-300">{Math.round(reason.confidence * 100)}%</strong></span>
                        )}
                        {reason.model && (
                          <span>Model: <strong className="font-mono text-slate-700 dark:text-slate-300">{reason.model}</strong></span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
