"use client";
import React from "react";
import Link from "next/link";
import { FileText, ShieldAlert, ArrowRight, ScanLine, FileCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/common/MetricCard";
export default function DocumentIntelligencePage() {
    const documentChecks = [
        {
            id: "DOC-01",
            projectId: "MPL-004821",
            projectTitle: "Multipurpose Community Hall at Village Khera",
            documentTitle: "Contractor Running Account Bill #3",
            sanctionAmount: "₹35,00,000",
            workOrderAmount: "₹35,00,000",
            claimedBillAmount: "₹41,00,000",
            ucAmount: "₹30,80,000",
            mismatchStatus: "₹6.0 L Excess Over Sanction",
            severity: "high",
            riskScore: 87,
        },
        {
            id: "DOC-02",
            projectId: "MPL-007812",
            projectTitle: "Model Anganwadi Center Upgradation",
            documentTitle: "Provisional Utilization Certificate (GFR 12-A)",
            sanctionAmount: "₹18,00,000",
            workOrderAmount: "₹18,00,000",
            claimedBillAmount: "₹14,40,000",
            ucAmount: "₹14,40,000 (Treasury: ₹11.0L)",
            mismatchStatus: "₹3.4 L Unreconciled Passbook Delta",
            severity: "high",
            riskScore: 72,
        },
        {
            id: "DOC-03",
            projectId: "MPL-005104",
            projectTitle: "50 Solar High-Mast Lighting Systems in 12 GPs",
            documentTitle: "Interim Delivery Certificate",
            sanctionAmount: "₹45,00,000",
            workOrderAmount: "₹45,00,000",
            claimedBillAmount: "₹41,40,000",
            ucAmount: "Pending Site Audit",
            mismatchStatus: "Missing 30 GP Site Acceptance Proofs",
            severity: "critical",
            riskScore: 89,
        },
    ];
    return (<AppShell breadcrumbs={[{ label: "Risk Intelligence", href: "/app/risk" }, { label: "Document Intelligence" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/80 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                OCR & Cross-Document Consistency Engine
              </span>
              <span className="text-xs text-slate-400">26 Flagged Inconsistencies</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              Document Verification & OCR Extraction Intelligence
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cross-document automated reconciliation between Administrative Sanctions, Work Orders, Contractor Invoices, and Utilization Certificates
            </p>
          </div>

          <Link href="/app/risk/documents/compare" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm self-start md:self-auto transition-all">
            <ScanLine className="w-3.5 h-3.5"/>
            <span>Launch Layout Similarity Studio</span>
          </Link>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Document Mismatches" value="26" subtitle="Cross-document amount deltas" trend={{ value: "OCR Confidence 96%", isPositive: true, isPositiveGood: true }} icon={FileText} variant="default"/>
          <MetricCard title="Sanction Overruns" value="11 Cases" subtitle="Invoices exceeding sanction" trend={{ value: "Without Revised Estimate", isPositive: false, isPositiveGood: false }} icon={ShieldAlert} variant="critical"/>
          <MetricCard title="UC Discrepancies" value="9 Cases" subtitle="Ledger vs treasury gap" trend={{ value: "₹8.2 Cr flagged", isPositive: true, isPositiveGood: false }} icon={FileCheck} variant="warning"/>
          <MetricCard title="OCR Engine Precision" value="98.2%" subtitle="Multilingual Tesseract & TrOCR" trend={{ value: "v2.3 Active", isPositive: true, isPositiveGood: true }} icon={ScanLine} variant="default"/>
        </div>

        {/* Cross-Document Consistency Matrix */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Cross-Document Amount Inconsistency Matrix
              </h3>
              <p className="text-xs text-slate-400">
                Automated multi-way comparison across sanction, tender, invoice, and certification documents
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-850/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Flagged Document</th>
                  <th className="px-4 py-3">Sanction Order</th>
                  <th className="px-4 py-3">Work Order</th>
                  <th className="px-4 py-3">Claimed Bill</th>
                  <th className="px-4 py-3">UC Amount</th>
                  <th className="px-4 py-3">AI Finding / Delta</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                {documentChecks.map((item) => (<tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors group">
                    <td className="px-4 py-3.5 max-w-xs font-sans">
                      <Link href={`/app/projects/${item.projectId}`} className="block">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {item.projectId}
                        </span>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 mt-0.5">
                          {item.projectTitle}
                        </p>
                      </Link>
                    </td>

                    <td className="px-4 py-3.5 font-sans font-semibold text-slate-700 dark:text-slate-300">
                      {item.documentTitle}
                    </td>

                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                      {item.sanctionAmount}
                    </td>

                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                      {item.workOrderAmount}
                    </td>

                    <td className="px-4 py-3.5 font-bold text-rose-600 dark:text-rose-400">
                      {item.claimedBillAmount}
                    </td>

                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                      {item.ucAmount}
                    </td>

                    <td className="px-4 py-3.5 font-sans">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        {item.mismatchStatus}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap font-sans">
                      <Link href={`/app/projects/${item.projectId}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition-colors">
                        <span>Audit Record</span>
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
