"use client";
import React from "react";
import Link from "next/link";
import { Clock, AlertTriangle, ShieldAlert, ArrowRight, TrendingDown, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/common/MetricCard";
export default function TimelineRiskPage() {
    const delayedProjects = [
        {
            id: "TL-01",
            projectId: "MPL-005104",
            projectTitle: "50 Solar High-Mast Lighting Systems in 12 GPs",
            district: "Varanasi",
            state: "Uttar Pradesh",
            plannedEnd: "28 Feb 2026",
            currentDelay: "64 Days",
            predictedDelay: "110 Days",
            deadlineRiskPercent: 94,
            stalledStage: "Pole Erection & Battery Installation",
            riskScore: 89,
            severity: "critical",
        },
        {
            id: "TL-02",
            projectId: "MPL-009142",
            projectTitle: "Community RO Water Purification Plant",
            district: "Patna",
            state: "Bihar",
            plannedEnd: "31 Mar 2026",
            currentDelay: "42 Days",
            predictedDelay: "75 Days",
            deadlineRiskPercent: 88,
            stalledStage: "Pipeline Right-of-Way Clearance",
            riskScore: 64,
            severity: "high",
        },
        {
            id: "TL-03",
            projectId: "MPL-004821",
            projectTitle: "Multipurpose Community Hall at Village Khera",
            district: "New Delhi",
            state: "Delhi",
            plannedEnd: "30 Jun 2026",
            currentDelay: "38 Days",
            predictedDelay: "60 Days",
            deadlineRiskPercent: 81,
            stalledStage: "RCC Roof Slab Masonry",
            riskScore: 87,
            severity: "critical",
        },
        {
            id: "TL-04",
            projectId: "MPL-007812",
            projectTitle: "Model Anganwadi Center Upgradation",
            district: "Bengaluru Urban",
            state: "Karnataka",
            plannedEnd: "31 May 2026",
            currentDelay: "20 Days",
            predictedDelay: "35 Days",
            deadlineRiskPercent: 62,
            stalledStage: "Solar Rooftop Commissioning",
            riskScore: 72,
            severity: "high",
        },
    ];
    return (<AppShell breadcrumbs={[{ label: "Risk Intelligence", href: "/app/risk" }, { label: "Timeline Risk" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                Timeline & Execution Velocity Engine
              </span>
              <span className="text-xs text-slate-400">38 Delayed Works</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              Milestone Delays & Deadline Risk Intelligence
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Predictive models identifying stalled construction phases, repeated extensions, and critical path slippage
            </p>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Delayed Works" value="38" subtitle="Past scheduled milestone" trend={{ value: "+5 this month", isPositive: true, isPositiveGood: false }} icon={Clock} variant="warning"/>
          <MetricCard title="Average Delay" value="41 Days" subtitle="Across flagged projects" trend={{ value: "Max 64 days (Varanasi)", isPositive: false, isPositiveGood: false }} icon={TrendingDown} variant="default"/>
          <MetricCard title="High Deadline Risk (>80%)" value="14" subtitle="Predicted delivery failure" trend={{ value: "Urgent escalation", isPositive: true, isPositiveGood: false }} icon={ShieldAlert} variant="critical"/>
          <MetricCard title="On-Track Completion Rate" value="91.4%" subtitle="National compliance baseline" trend={{ value: "+2.1% YoY", isPositive: true, isPositiveGood: true }} icon={CheckCircle2} variant="default"/>
        </div>

        {/* Predictive Delay Tracker */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Stalled Milestone & Predictive Delay Matrix
              </h3>
              <p className="text-xs text-slate-400">
                Machine learning forecast comparing planned deadline vs expected completion based on execution velocity
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-850/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Project & Location</th>
                  <th className="px-4 py-3">Stalled Milestone Phase</th>
                  <th className="px-4 py-3">Planned Completion</th>
                  <th className="px-4 py-3">Current Delay</th>
                  <th className="px-4 py-3">Predicted Final Delay</th>
                  <th className="px-4 py-3">Deadline Failure Risk</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {delayedProjects.map((item) => (<tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors group">
                    <td className="px-4 py-3.5 max-w-xs">
                      <Link href={`/app/projects/${item.projectId}`} className="block">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {item.projectId}
                        </span>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 mt-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {item.projectTitle}
                        </p>
                        <span className="text-[11px] text-slate-400">
                          {item.district}, {item.state}
                        </span>
                      </Link>
                    </td>

                    <td className="px-4 py-3.5 font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 mt-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0"/>
                      <span>{item.stalledStage}</span>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-600 dark:text-slate-300">
                      {item.plannedEnd}
                    </td>

                    <td className="px-4 py-3.5 font-mono font-bold text-rose-600 dark:text-rose-400">
                      +{item.currentDelay}
                    </td>

                    <td className="px-4 py-3.5 font-mono font-semibold text-amber-600 dark:text-amber-400">
                      ~{item.predictedDelay}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className={item.deadlineRiskPercent >= 80 ? "text-rose-600" : "text-amber-600"}>
                            {item.deadlineRiskPercent}%
                          </span>
                        </div>
                        <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${item.deadlineRiskPercent >= 80 ? "bg-rose-600" : "bg-amber-500"}`} style={{ width: `${item.deadlineRiskPercent}%` }}/>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <Link href={`/app/projects/${item.projectId}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition-colors">
                        <span>Audit Timeline</span>
                        <ArrowRight className="w-3.5 h-3.5"/>
                      </Link>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>);
}
