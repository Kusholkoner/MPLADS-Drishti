"use client";
import React from "react";
import Link from "next/link";
import { BadgeIndianRupee, ShieldAlert, ArrowRight, TrendingUp, Split } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/common/MetricCard";
import { RiskBadge } from "@/components/common/RiskBadge";
export default function FinancialRiskPage() {
    const financialAnomalies = [
        {
            id: "FIN-01",
            projectId: "MPL-004821",
            projectTitle: "Multipurpose Community Hall at Village Khera",
            district: "New Delhi",
            state: "Delhi",
            type: "Progress Divergence & Cost Outlier",
            expected: "Sanction: ₹35.0 L | Max Disbursed: 55%",
            actual: "Disbursed: ₹30.8 L (88%) vs Physical 52%",
            deviation: "+36% Gap / +31.4% Cost",
            riskScore: 87,
            severity: "critical",
            description: "Severe financial payout velocity ahead of physical structural execution. Final bill also exceeds sanctioned ceiling by ₹6.0 L.",
        },
        {
            id: "FIN-02",
            projectId: "MPL-005104",
            projectTitle: "50 Solar High-Mast Lighting Systems in 12 GPs",
            district: "Varanasi",
            state: "Uttar Pradesh",
            type: "Premature Advance Fund Retention",
            expected: "Payment on Physical Delivery: ₹18.0 L",
            actual: "Disbursed: ₹41.4 L (92%) vs 20 Poles (40%)",
            deviation: "+₹23.4 L Unreconciled Gap",
            riskScore: 89,
            severity: "critical",
            description: "Vendor received 92% funds without site delivery certificates for remaining 30 high-mast lighting units.",
        },
        {
            id: "FIN-03",
            projectId: "MPL-003921",
            projectTitle: "Paved CC Road from Main Market to PHC",
            district: "Pune",
            state: "Maharashtra",
            type: "Split Procurement Invoicing",
            expected: "Mandatory e-Tender Threshold: ≥ ₹10.0 L",
            actual: "3 Vouchers: ₹9.8L + ₹9.75L + ₹4.95L in 72h",
            deviation: "Evaded e-Tender Review",
            riskScore: 76,
            severity: "high",
            description: "Split payment vouchers issued to the same contractor PAN within 72 hours to bypass competitive e-tendering rules.",
        },
        {
            id: "FIN-04",
            projectId: "MPL-007812",
            projectTitle: "Model Anganwadi Infrastructure Modernization",
            district: "Bengaluru Urban",
            state: "Karnataka",
            type: "Utilization Certificate (UC) Discrepancy",
            expected: "Treasury Disbursed: ₹11.0 L",
            actual: "UC Claim: ₹14.4 L (Over-reported)",
            deviation: "₹3.4 L Ledger Delta",
            riskScore: 72,
            severity: "high",
            description: "Provisional Utilization Certificate filed for ₹14.4 L, but Treasury booked debits reflect only ₹11.0 L.",
        },
    ];
    return (<AppShell breadcrumbs={[{ label: "Risk Intelligence", href: "/app/risk" }, { label: "Financial Risk" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
                Financial Risk Intelligence Engine
              </span>
              <span className="text-xs text-slate-400">PFMS & Treasury Integrated</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              Expenditure Velocity & Payment Anomalies
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Statistical detection of premature advances, cost inflation, split vouchers, and unreconciled treasury debits
            </p>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Financial Anomalies" value="47" subtitle="Flagged expenditure signals" trend={{ value: "29.1% of all risks", isPositive: true, isPositiveGood: false }} icon={BadgeIndianRupee} variant="critical"/>
          <MetricCard title="Unreconciled Value" value="₹28.4 Cr" subtitle="Disbursed without verified UC" trend={{ value: "Pending site audits", isPositive: false, isPositiveGood: false }} icon={ShieldAlert} variant="warning"/>
          <MetricCard title="Split Invoicing Clusters" value="8" subtitle="Tender threshold evasions" trend={{ value: "3 vendors implicated", isPositive: true, isPositiveGood: false }} icon={Split} variant="warning"/>
          <MetricCard title="Progress Gap Outliers" value="24" subtitle="Disbursed >30% ahead of works" trend={{ value: "High risk tier", isPositive: true, isPositiveGood: false }} icon={TrendingUp} variant="default"/>
        </div>

        {/* Financial Anomaly Detection Table */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Prioritized Financial Anomaly Cases
              </h3>
              <p className="text-xs text-slate-400">
                Detailed comparison of expected treasury baseline vs actual ledger transactions
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-850/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Project & Location</th>
                  <th className="px-4 py-3">Anomaly Type</th>
                  <th className="px-4 py-3">Expected Baseline</th>
                  <th className="px-4 py-3">Actual Ledger / Claim</th>
                  <th className="px-4 py-3">Deviation Delta</th>
                  <th className="px-4 py-3">Risk Assessment</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {financialAnomalies.map((item) => (<tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors group">
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

                    <td className="px-4 py-3.5 font-semibold text-slate-700 dark:text-slate-300">
                      {item.type}
                    </td>

                    <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                      {item.expected}
                    </td>

                    <td className="px-4 py-3.5 text-slate-900 dark:text-slate-100 font-mono font-bold text-[11px]">
                      {item.actual}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        {item.deviation}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <RiskBadge level={item.severity} score={item.riskScore} size="sm"/>
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <Link href={`/app/projects/${item.projectId}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition-colors">
                        <span>Audit Case</span>
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
