"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { RiskBadge } from "../common/RiskBadge";
import { formatIndianCurrency, formatRelativeTime } from "@/lib/formatters";
export const PriorityQueueTable = ({ projects, totalWorks = "45,806" }) => {
    return (<div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Priority Investigation Queue
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800">
              Immediate Auditor Attention
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Works prioritized by multi-model anomaly convergence across financial, visual, and timeline signals
          </p>
        </div>

        <Link href="/app/projects" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start sm:self-auto">
          <span>View All {totalWorks} Works</span>
          <ArrowRight className="w-3.5 h-3.5"/>
        </Link>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-3">Project ID</th>
              <th className="px-4 py-3">Work Title & Location</th>
              <th className="px-4 py-3">Sanctioned</th>
              <th className="px-4 py-3">Risk Assessment</th>
              <th className="px-4 py-3">Primary Detected Signal</th>
              <th className="px-4 py-3">Screened</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {(projects || []).map((project, idx) => {
              const id = project.id || project.work_id || `PROJ-${idx + 1}`;
              const title = project.title || project["work_title"] || project["Work Description"] || "Developmental Work";
              const district = project.district || "District";
              const state = project.state || "National";
              const category = project.category || "General";
              const sanctioned = project.financials?.sanctionedAmount ?? project.sanction_amount ?? project.sanctionAmount ?? 0;
              const isDup = project.risk?.level === "duplicate" || project.risk_band === "DUPLICATE";
              const riskLevel = isDup ? "duplicate" : (project.risk?.level || project.risk_band?.toLowerCase() || "high");
              const riskScore = isDup ? null : (project.risk?.score ?? project.composite_risk_score ?? null);
              const primarySignal = project.risk?.primarySignal || project.triggered_signals?.[0]?.finding || "Identified by automated cross-stream reconciliation.";
              const lastAssessedAt = project.risk?.lastAssessedAt || project.timestamp || project.created_at || new Date().toISOString();

              return (
                <tr key={`${id}-${idx}`} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                  {/* Project ID */}
                  <td className="px-4 py-3.5 font-mono font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    <Link href={`/app/projects/${encodeURIComponent(id)}`} className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                      <span>{id}</span>
                    </Link>
                  </td>

                  {/* Title & Location */}
                  <td className="px-4 py-3.5 max-w-xs">
                    <Link href={`/app/projects/${encodeURIComponent(id)}`} className="block">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-slate-400 text-[11px]">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0"/>
                          {district}, {state}
                        </span>
                        <span>•</span>
                        <span className="truncate">{category}</span>
                      </div>
                    </Link>
                  </td>

                  {/* Sanctioned Amount */}
                  <td className="px-4 py-3.5 whitespace-nowrap font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {formatIndianCurrency(sanctioned)}
                  </td>

                  {/* Risk Badge */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <RiskBadge level={riskLevel} score={riskScore} size="sm"/>
                  </td>

                  {/* Primary Signal */}
                  <td className="px-4 py-3.5 max-w-xs">
                    <span className="text-slate-700 dark:text-slate-300 font-medium line-clamp-1">
                      {primarySignal}
                    </span>
                  </td>

                  {/* Relative Timestamp */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-slate-400 text-[11px]">
                    {formatRelativeTime(lastAssessedAt)}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <Link href={`/app/projects/${encodeURIComponent(id)}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-xs bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 transition-all shadow-xs">
                      <span>Inspect Twin</span>
                      <ArrowRight className="w-3.5 h-3.5"/>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>);
};
