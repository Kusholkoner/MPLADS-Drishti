"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SearchCode, ArrowRight, Clock, CheckCircle2, AlertTriangle, } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/common/MetricCard";
import { RiskBadge } from "@/components/common/RiskBadge";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { api } from "@/lib/api";
import { getCaseStatusStyles, formatRelativeTime } from "@/lib/formatters";
export default function InvestigationsQueuePage() {
    const [cases, setCases] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function loadCases() {
            setLoading(true);
            try {
                const list = await api.getInvestigations({
                    status: selectedStatus !== "all" ? selectedStatus : undefined,
                });
                setCases(list);
            }
            catch (err) {
                console.error("Failed to load investigations:", err);
            }
            finally {
                setLoading(false);
            }
        }
        loadCases();
    }, [selectedStatus]);
    const statuses = [
        { label: "All Cases", value: "all" },
        { label: "New", value: "new" },
        { label: "Under Review", value: "under_review" },
        { label: "Evidence Requested", value: "evidence_requested" },
        { label: "Escalated", value: "escalated" },
        { label: "Cleared", value: "cleared" },
    ];
    return (<AppShell breadcrumbs={[{ label: "Investigations" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                Auditor Case Management Queue
              </span>
              <span className="text-xs text-slate-400">Human-In-The-Loop Workflow</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              Active Investigation Workspace Queue
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Convert automated multi-model risk signals into structured audit investigations with full ground evidence traceability
            </p>
          </div>

          <Link href="/app/investigations/CASE-2026-00128" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-sm self-start md:self-auto">
            <span>Open Showcase Case #128</span>
            <ArrowRight className="w-3.5 h-3.5"/>
          </Link>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Active Cases" value="8" subtitle="Prioritized for audit review" trend={{ value: "3 Urgent Priority", isPositive: true, isPositiveGood: false }} icon={SearchCode} variant="default"/>
          <MetricCard title="Under Active Review" value="4" subtitle="Assigned to nodal officers" trend={{ value: "Field inspections active", isPositive: true, isPositiveGood: true }} icon={Clock} variant="warning"/>
          <MetricCard title="Evidence Requested" value="2" subtitle="Awaiting photo / ledger proof" trend={{ value: "Varanasi & Bengaluru", isPositive: false, isPositiveGood: false }} icon={AlertTriangle} variant="warning"/>
          <MetricCard title="Resolved & Cleared" value="14" subtitle="Verified without irregularity" trend={{ value: "Audited cases", isPositive: true, isPositiveGood: true }} icon={CheckCircle2} variant="default"/>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 w-fit">
          {statuses.map((tab) => (<button key={tab.value} onClick={() => setSelectedStatus(tab.value)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedStatus === tab.value
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}>
              {tab.label}
            </button>))}
        </div>

        {/* Case Table */}
        {loading ? (<LoadingSkeleton variant="table" count={4}/>) : (<div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-850/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Case ID</th>
                    <th className="px-4 py-3">Project Title & Location</th>
                    <th className="px-4 py-3">Risk Assessment</th>
                    <th className="px-4 py-3">Primary Flagged Concern</th>
                    <th className="px-4 py-3">Assigned Officer</th>
                    <th className="px-4 py-3">Case Status</th>
                    <th className="px-4 py-3">Updated</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {cases.map((c) => {
                const statusStyles = getCaseStatusStyles(c.status);
                return (<tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors group cursor-pointer">
                        {/* Case ID */}
                        <td className="px-4 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                          <Link href={`/app/investigations/${c.id}`} className="hover:underline">
                            {c.id}
                          </Link>
                        </td>

                        {/* Project Title */}
                        <td className="px-4 py-3.5 max-w-xs">
                          <Link href={`/app/investigations/${c.id}`} className="block">
                            <span className="font-mono text-[10px] text-slate-400">
                              {c.projectId}
                            </span>
                            <p className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {c.projectTitle}
                            </p>
                            <span className="text-[11px] text-slate-400">
                              {c.district}, {c.state}
                            </span>
                          </Link>
                        </td>

                        {/* Risk */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <RiskBadge level={c.riskScore >= 80 ? "critical" : c.riskScore >= 60 ? "high" : "medium"} score={c.riskScore} size="sm"/>
                        </td>

                        {/* Primary Concern */}
                        <td className="px-4 py-3.5 max-w-xs">
                          <p className="text-slate-700 dark:text-slate-300 font-medium line-clamp-2 text-[11px]">
                            {c.primaryIssue}
                          </p>
                        </td>

                        {/* Assigned To */}
                        <td className="px-4 py-3.5 whitespace-nowrap text-slate-600 dark:text-slate-300">
                          {c.assignedTo ? (<div>
                              <p className="font-semibold text-slate-800 dark:text-slate-200">
                                {c.assignedTo.name}
                              </p>
                              <span className="text-[10px] text-slate-400">
                                {c.assignedTo.role.split(",")[0]}
                              </span>
                            </div>) : (<span className="text-slate-400 italic">Unassigned</span>)}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}>
                            {statusStyles.label}
                          </span>
                        </td>

                        {/* Updated */}
                        <td className="px-4 py-3.5 whitespace-nowrap text-slate-400 text-[11px]">
                          {formatRelativeTime(c.updatedAt)}
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <Link href={`/app/investigations/${c.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-900 hover:text-white dark:hover:bg-blue-600 transition-all shadow-xs">
                            <span>Workspace</span>
                            <ArrowRight className="w-3.5 h-3.5"/>
                          </Link>
                        </td>
                      </tr>);
            })}
                </tbody>
              </table>
            </div>
          </div>)}
      </div>
    </AppShell>);
}
