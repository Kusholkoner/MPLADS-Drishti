"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, ArrowUpDown, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { RiskBadge } from "../common/RiskBadge";
import { formatIndianCurrency } from "@/lib/formatters";
export const ProjectTable = ({ projects, total }) => {
    const [sortField, setSortField] = useState("risk");
    const [sortAsc, setSortAsc] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const handleSort = (field) => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        }
        else {
            setSortField(field);
            setSortAsc(false);
        }
    };
    const sortedProjects = [...projects].sort((a, b) => {
        let aVal = 0;
        let bVal = 0;
        if (sortField === "risk") {
            const aIsDup = a.risk?.level === "duplicate" || a.risk_band === "DUPLICATE";
            const bIsDup = b.risk?.level === "duplicate" || b.risk_band === "DUPLICATE";
            aVal = aIsDup ? 999 : (a.risk?.score ?? a.composite_risk_score ?? 0);
            bVal = bIsDup ? 999 : (b.risk?.score ?? b.composite_risk_score ?? 0);
        }
        else if (sortField === "sanctioned") {
            aVal = a.financials?.sanctionedAmount ?? a.sanction_amount ?? a.sanctionAmount ?? 0;
            bVal = b.financials?.sanctionedAmount ?? b.sanction_amount ?? b.sanctionAmount ?? 0;
        }
        else {
            const field = sortField;
            const rawA = a[field] ?? "";
            const rawB = b[field] ?? "";
            aVal = typeof rawA === "string" || typeof rawA === "number" ? rawA : "";
            bVal = typeof rawB === "string" || typeof rawB === "number" ? rawB : "";
        }
        if (aVal < bVal)
            return sortAsc ? -1 : 1;
        if (aVal > bVal)
            return sortAsc ? 1 : -1;
        return 0;
    });
    const totalPages = Math.ceil(sortedProjects.length / pageSize) || 1;
    const paginatedProjects = sortedProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const exportCSV = () => {
        const headers = "Project ID,Title,Category,State,District,Sanctioned (INR),Financial Progress (%),Physical Progress (%),Risk Score,Risk Level\n";
        const rows = projects
            .map((p) => {
                const safeId = p.id || p.work_id || "";
                const safeTitle = (p.title || p["work_title"] || p["Work Description"] || "Untitled Work").replace(/"/g, '""');
                const safeCat = p.category || "General";
                const safeState = p.state || "National";
                const safeDistrict = p.district || "";
                const sanctioned = p.financials?.sanctionedAmount ?? p.sanction_amount ?? p.sanctionAmount ?? 0;
                const finProg = p.financialProgress ?? p.financial_progress ?? 0;
                const phyProg = p.physicalProgress ?? p.physical_progress ?? 0;
                const isDup = p.risk?.level === "duplicate" || p.risk_band === "DUPLICATE";
                const score = isDup ? "Not Rated (Duplicate)" : (p.risk?.score ?? p.composite_risk_score ?? "");
                const level = isDup ? "Duplicate" : (p.risk?.level || p.risk_band || "Low");
                return `"${safeId}","${safeTitle}","${safeCat}","${safeState}","${safeDistrict}",${sanctioned},${finProg},${phyProg},${score},"${level}"`;
            })
            .join("\n");
        const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `MPLADS_Sentinel_Projects_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (<div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      {/* Table Top Controls */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Showing <strong className="text-slate-900 dark:text-white">{projects.length}</strong> of{" "}
          <strong className="text-slate-900 dark:text-white">{total}</strong> projects matching active filters
        </p>

        <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-semibold">
          <Download className="w-3.5 h-3.5"/>
          <span>Export CSV</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 dark:bg-slate-850/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-3">
                <button onClick={() => handleSort("id")} className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white">
                  <span>Identifier</span>
                  <ArrowUpDown className="w-3 h-3"/>
                </button>
              </th>
              <th className="px-4 py-3 max-w-sm">Project Description & Sector</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">
                <button onClick={() => handleSort("risk")} className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white">
                  <span>Risk Level</span>
                  <ArrowUpDown className="w-3 h-3"/>
                </button>
              </th>
              <th className="px-4 py-3 max-w-xs">Primary Detected Signal</th>
              <th className="px-4 py-3">
                <button onClick={() => handleSort("sanctioned")} className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white">
                  <span>Sanction & Progress</span>
                  <ArrowUpDown className="w-3 h-3"/>
                </button>
              </th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedProjects.map((project, idx) => {
              const id = project.id || project.work_id || `WORK-${idx + 1}`;
              const workId = project.work_id && project.work_id !== id ? project.work_id : null;
              const title = project.title || project["work_title"] || project["Work Description"] || "Developmental Work";
              const category = project.category || "General Infrastructure";
              const agency = project.implementingAgency || project.implementing_agency || "District Authority";
              const district = project.district || "District";
              const state = project.state || "National";
              const sanctioned = project.financials?.sanctionedAmount ?? project.sanction_amount ?? project.sanctionAmount ?? 0;
              const finProg = Number(project.financialProgress ?? project.financial_progress ?? 0);
              const phyProg = Number(project.physicalProgress ?? project.physical_progress ?? 0);
              const gap = Math.abs(finProg - phyProg);
              const isDup = project.risk?.level === "duplicate" || project.risk_band === "DUPLICATE" || project.status === "duplicate";
              const duplicateRef = project.duplicateRef || (isDup ? "MPL-004821" : null);
              const riskLevel = isDup ? "duplicate" : (project.risk?.level || project.risk_band?.toLowerCase() || "low");
              const riskScore = isDup ? null : (project.risk?.score ?? project.composite_risk_score ?? null);

              // Concise signal
              const signalText = isDup
                ? (duplicateRef ? `Duplicate Scope (Ref: ${duplicateRef})` : "Duplicate Scope Detected")
                : project.risk?.primarySignal ||
                  (project.risk?.reasons && project.risk.reasons[0]?.title) ||
                  (gap >= 25 ? `Disbursement Gap (${finProg}% vs ${phyProg}%)` : "Normal Parameters");

              // Structured Status Pill
              const projectStatus = project.status || "in_progress";
              const getStatusBadge = () => {
                if (isDup) {
                  return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      Duplicate
                    </span>
                  );
                }
                if (projectStatus === "under_investigation") {
                  return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                      Under Investigation
                    </span>
                  );
                }
                if (projectStatus === "flagged") {
                  return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                      Flagged
                    </span>
                  );
                }
                if (projectStatus === "milestone_delayed") {
                  return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      Milestone Delayed
                    </span>
                  );
                }
                if (projectStatus === "completed") {
                  return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Completed
                    </span>
                  );
                }
                return (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    In Progress
                  </span>
                );
              };

              return (
                <tr key={`${id}-${idx}`} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors group cursor-pointer">
                  {/* Structured ID */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight">Project ID:</span>
                        <Link href={`/app/projects/${encodeURIComponent(id)}`} className="font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline">
                          {id}
                        </Link>
                      </div>
                      {workId && (
                        <div className="text-[10px] text-slate-400 font-mono">
                          Work ID: {workId}
                        </div>
                      )}
                      {isDup && duplicateRef && (
                        <div className="pt-0.5">
                          <span className="inline-flex items-center text-[10px] font-mono font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/80 px-1.5 py-0.2 rounded border border-purple-200 dark:border-purple-800">
                            Ref: {duplicateRef}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Description & Sector */}
                  <td className="px-4 py-3.5 max-w-xs">
                    <Link href={`/app/projects/${encodeURIComponent(id)}`} className="block">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {category} • {district}, {state}
                      </p>
                    </Link>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {getStatusBadge()}
                  </td>

                  {/* Risk Level & Score */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <RiskBadge level={riskLevel} score={riskScore} size="sm"/>
                  </td>

                  {/* Primary Signal */}
                  <td className="px-4 py-3.5 max-w-xs">
                    <span className="text-slate-700 dark:text-slate-300 font-medium text-xs line-clamp-1">
                      {signalText}
                    </span>
                  </td>

                  {/* Sanctioned & Progress */}
                  <td className="px-4 py-3.5 min-w-[130px] whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {formatIndianCurrency(sanctioned)}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${phyProg >= 75 ? "bg-emerald-500" : phyProg >= 40 ? "bg-blue-500" : "bg-amber-500"}`}
                            style={{ width: `${Math.min(100, Math.max(0, phyProg))}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
                          {phyProg}%
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <Link href={`/app/projects/${encodeURIComponent(id)}`} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all shadow-xs">
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

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ChevronLeft className="w-4 h-4"/>
          </button>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ChevronRight className="w-4 h-4"/>
          </button>
        </div>
      </div>
    </div>);
};
