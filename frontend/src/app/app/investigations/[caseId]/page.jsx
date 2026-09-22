"use client";
import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, FileCheck, Printer, CheckCircle2, AlertTriangle, Activity, } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { EvidenceChain } from "@/components/investigation/EvidenceChain";
import { InvestigatorNotes } from "@/components/investigation/InvestigatorNotes";
import { InvestigationBriefModal } from "@/components/investigation/InvestigationBriefModal";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { api } from "@/lib/api";
import { getCaseStatusStyles, formatDateTime } from "@/lib/formatters";
export default function InvestigationWorkspacePage({ params }) {
    const resolvedParams = use(params);
    const caseId = resolvedParams.caseId;
    const [caseItem, setCaseItem] = useState(null);
    const [project, setProject] = useState(null);
    const [evidenceList, setEvidenceList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [briefModalOpen, setBriefModalOpen] = useState(false);
    useEffect(() => {
        async function loadWorkspaceData() {
            setLoading(true);
            try {
                const c = await api.getInvestigationById(caseId);
                if (c) {
                    setCaseItem(c);
                    const [p, ev] = await Promise.all([
                        api.getProjectById(c.projectId),
                        api.getEvidence({ projectId: c.projectId }),
                    ]);
                    setProject(p);
                    setEvidenceList(ev);
                }
            }
            catch (err) {
                console.error("Failed to load investigation workspace:", err);
            }
            finally {
                setLoading(false);
            }
        }
        loadWorkspaceData();
    }, [caseId]);
    const handleUpdateStatus = async (status, note) => {
        if (!caseItem)
            return;
        try {
            const updated = await api.updateInvestigationStatus(caseItem.id, status, note);
            if (updated)
                setCaseItem(updated);
        }
        catch (err) {
            console.error("Failed to update status:", err);
        }
    };
    const handleAddNote = async (content) => {
        if (!caseItem)
            return;
        try {
            const updated = await api.addInvestigationNote(caseItem.id, content);
            if (updated)
                setCaseItem(updated);
        }
        catch (err) {
            console.error("Failed to add note:", err);
        }
    };
    if (loading) {
        return (<AppShell breadcrumbs={[{ label: "Investigations", href: "/app/investigations" }, { label: caseId }]}>
        <LoadingSkeleton variant="card" count={4}/>
      </AppShell>);
    }
    if (!caseItem) {
        return (<AppShell breadcrumbs={[{ label: "Investigations", href: "/app/investigations" }, { label: caseId }]}>
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto"/>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Investigation Case Not Found</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            The investigation case &quot;{caseId}&quot; could not be located in the active audit queue.
          </p>
          <Link href="/app/investigations" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
            <ArrowLeft className="w-3.5 h-3.5"/> Return to Investigations Queue
          </Link>
        </div>
      </AppShell>);
    }
    const statusStyles = getCaseStatusStyles(caseItem.status);
    return (<AppShell breadcrumbs={[{ label: "Investigations", href: "/app/investigations" }, { label: caseItem.id }]} contextProjectId={caseItem.projectId} contextCaseId={caseItem.id}>
      <div className="space-y-6">
        {/* Workspace Header Bar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-black tracking-wider px-2.5 py-1 rounded-lg bg-slate-900 text-white dark:bg-blue-600">
                {caseItem.id}
              </span>
              <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}>
                {statusStyles.label}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                Priority: {caseItem.priority.toUpperCase()}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {caseItem.projectTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>
                Target Project:{" "}
                <Link href={`/app/projects/${caseItem.projectId}`} className="font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  {caseItem.projectId}
                </Link>
              </span>
              <span>•</span>
              <span>{caseItem.district}, {caseItem.state}</span>
              <span>•</span>
              <span>
                Reviewing Officer:{" "}
                <strong className="text-slate-700 dark:text-slate-200">
                  {caseItem.assignedTo?.name || "Senior Audit Officer (Central Cell)"}
                </strong>
              </span>
            </div>
          </div>

          {/* Action Toolbar & Brief Generator */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
            <button onClick={() => setBriefModalOpen(true)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors shadow-xs">
              <Printer className="w-3.5 h-3.5"/>
              <span>Export Audit Brief</span>
            </button>

            {caseItem.status !== "evidence_requested" && (<button onClick={() => handleUpdateStatus("evidence_requested", "Formal requisition issued to District Nodal Officer requesting fresh geotagged site imagery and ledger reconciliation.")} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 hover:bg-purple-100 border border-purple-200 dark:border-purple-800 transition-colors">
                <AlertTriangle className="w-3.5 h-3.5"/>
                <span>Request Evidence</span>
              </button>)}

            {caseItem.status !== "escalated" && (<button onClick={() => handleUpdateStatus("escalated", "Case escalated to Central Performance Audit Directorate for formal administrative inquiry.")} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm">
                <ShieldAlert className="w-3.5 h-3.5"/>
                <span>Escalate Case</span>
              </button>)}

            {caseItem.status !== "cleared" && (<button onClick={() => handleUpdateStatus("cleared", "Case cleared following comprehensive field verification and satisfactory engineering inspection.")} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5"/>
                <span>Mark Cleared</span>
              </button>)}
          </div>
        </div>

        {/* Primary Case Summary Banner */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-md border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-rose-400 font-bold uppercase tracking-wider">
            <span>Primary Investigated Irregularity</span>
            <span className="font-mono">Risk Index: {caseItem.riskScore} / 100</span>
          </div>
          <p className="text-sm font-semibold text-slate-100">{caseItem.primaryIssue}</p>
          <p className="text-xs text-slate-300 leading-relaxed">{caseItem.summary}</p>
        </div>

        {/* Two-Column Grid: Evidence Chain vs Notes & Audit Log */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Evidence Chain & Attached Artifacts */}
          <div className="lg:col-span-7 space-y-6">
            {/* Linear Evidence Chain */}
            <EvidenceChain chain={caseItem.evidenceChain && caseItem.evidenceChain.length > 0
            ? caseItem.evidenceChain
            : [
                {
                    step: "risk",
                    title: "Multi-Source Anomaly Trigger",
                    subtitle: `Composite Risk: ${caseItem.riskScore} / 100`,
                    status: "flagged",
                },
                {
                    step: "signal",
                    title: "AI Detection Engine",
                    subtitle: caseItem.primaryIssue,
                    status: "flagged",
                },
                {
                    step: "claim",
                    title: "Milestone Payout Claim",
                    subtitle: "₹30.8 L Disbursed vs 52% Execution",
                    status: "conflict",
                },
                {
                    step: "evidence",
                    title: "Ground Artifact Proof",
                    subtitle: "EVD-IMG-001 & EVD-DOC-003",
                    status: "conflict",
                },
                {
                    step: "source",
                    title: "eSAKSHI & PFMS Treasury Logs",
                    subtitle: "Verified against Official Treasury Record",
                    status: "verified",
                },
            ]}/>

            {/* Attached Evidence Artifacts List */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Linked Evidence Artifacts
              </h3>
              <div className="space-y-2">
                {evidenceList.map((e) => (<Link key={e.id} href={`/app/evidence/${e.id}`} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors group">
                    <div className="flex items-center gap-2.5">
                      <FileCheck className="w-4 h-4 text-blue-600"/>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {e.title}
                        </p>
                        <span className="text-[10px] font-mono text-slate-400">
                          {e.id} • {e.type.toUpperCase()} • {e.provenance.sourceSystem.split(" ")[0]}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${e.status === "verified"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"}`}>
                      {e.status}
                    </span>
                  </Link>))}
              </div>
            </div>
          </div>

          {/* Right: Investigator Notes & Audit Timeline */}
          <div className="lg:col-span-5 space-y-6">
            {/* Notes Composer & Feed */}
            <InvestigatorNotes notes={caseItem.notes} onAddNote={handleAddNote}/>

            {/* Step-by-step Audit Activity Log */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600"/>
                  Chronological Audit Log
                </h3>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Immutable Log</span>
              </div>

              <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {caseItem.activityLogs.map((log) => (<div key={log.id} className="relative text-xs space-y-0.5">
                    <div className="absolute -left-5 top-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900"/>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatDateTime(log.timestamp)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {log.details}
                    </p>
                    <span className="text-[10px] text-slate-400 italic block">
                      Actor: {log.actor}
                    </span>
                  </div>))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investigation Brief Modal */}
      <InvestigationBriefModal isOpen={briefModalOpen} onClose={() => setBriefModalOpen(false)} caseItem={caseItem} project={project}/>
    </AppShell>);
}
