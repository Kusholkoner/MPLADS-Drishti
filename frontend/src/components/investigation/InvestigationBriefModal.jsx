"use client";
import React from "react";
import { X, Printer } from "lucide-react";
import { formatIndianCurrency, formatDateTime } from "@/lib/formatters";
import { APP_NAME, APP_HINDI_NAME, MINISTRY_NAME } from "@/lib/constants";
export const InvestigationBriefModal = ({ isOpen, onClose, caseItem, project, }) => {
    if (!isOpen)
        return null;
    const handlePrint = () => {
        window.print();
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Actions */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between no-print bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Executive Investigation Brief Preview
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {caseItem.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white dark:bg-blue-600 text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs">
              <Printer className="w-3.5 h-3.5"/>
              <span>Print / Export PDF</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800">
              <X className="w-4 h-4"/>
            </button>
          </div>
        </div>

        {/* Printable Brief Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 text-slate-900 dark:text-slate-100 font-sans text-xs">
          {/* Official Letterhead */}
          <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-4 space-y-1">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              Government of India • {MINISTRY_NAME}
            </p>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {APP_NAME} ({APP_HINDI_NAME}) — PERFORMANCE AUDIT BRIEF
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              CONFIDENTIAL • FOR AUTHORIZED REVIEW ONLY • CASE REF: {caseItem.id}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 font-mono text-[11px]">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Case ID</span>
              <span className="font-bold">{caseItem.id}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Project ID</span>
              <span className="font-bold text-blue-600">{caseItem.projectId}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Composite Risk</span>
              <span className="font-bold text-rose-600">{caseItem.riskScore} / 100 (CRITICAL)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Report Date</span>
              <span>{formatDateTime(new Date().toISOString())}</span>
            </div>
          </div>

          {/* Project Summary */}
          <div className="space-y-1.5">
            <h4 className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
              1. Project Details & Executive Identification
            </h4>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <p className="font-bold text-sm text-slate-900 dark:text-white">{caseItem.projectTitle}</p>
              <p className="text-slate-500">
                Location: <strong>{caseItem.district}, {caseItem.state}</strong> | Category: <strong>{caseItem.category}</strong>
              </p>
              {project && (<p className="text-slate-500 font-mono text-[11px] pt-1">
                  Sanctioned: <strong>{formatIndianCurrency(project.financials.sanctionedAmount)}</strong> | Disbursed:{" "}
                  <strong>{formatIndianCurrency(project.financials.paidDisbursedAmount)}</strong> | Project Progress: <strong>{project.physicalProgress}%</strong>
                </p>)}
            </div>
          </div>

          {/* Core Findings & Anomaly Summary */}
          <div className="space-y-1.5">
            <h4 className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
              2. Primary Flagged Anomalies & Risk Intelligence Findings
            </h4>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <p className="font-semibold text-rose-600 dark:text-rose-400">
                Primary Anomaly: {caseItem.primaryIssue}
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {caseItem.summary}
              </p>
            </div>
          </div>

          {/* Relevant Guidelines Cited */}
          <div className="space-y-1.5">
            <h4 className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
              3. Statutory Guidelines & Compliance Cross-Reference
            </h4>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-[11px]">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-800 dark:text-slate-200">• MPLADS Scheme Guidelines 2023 (Para 3.4):</p>
                <p className="text-slate-500 pl-3">
                  Installment fund disbursements to executing agencies must strictly synchronize with verified physical milestones backed by geotagged site imagery.
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-slate-800 dark:text-slate-200">• General Financial Rules (GFR 2017 - Rule 130):</p>
                <p className="text-slate-500 pl-3">
                  Expenditure cannot exceed approved administrative estimates without formal Revised Technical Sanctions.
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Auditor Actions */}
          <div className="space-y-1.5">
            <h4 className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
              4. Recommended Actions for Competent Authority
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300 pl-1">
              <li>Deploy District Inspection Team for physical measurement and verification of structural stage.</li>
              <li>Seek formal clarification from implementing agency regarding reused foundation photograph (EVD-IMG-001).</li>
              <li>Withhold further Running Account bill disbursements pending formal financial reconciliation.</li>
            </ol>
          </div>

          {/* Signature Block */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end text-[11px]">
            <div>
              <p className="text-slate-400">Investigating Officer:</p>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {caseItem.assignedTo?.name || "Shri Rajesh Verma"}
              </p>
              <p className="text-[10px] text-slate-400">{caseItem.assignedTo?.role || "Senior Audit Officer, MoSPI"}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400">Status:</p>
              <span className="font-bold uppercase text-amber-600">Under Active Review</span>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
