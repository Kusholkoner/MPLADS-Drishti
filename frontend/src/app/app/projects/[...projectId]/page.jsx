"use client";
import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building, MapPin, Sparkles, SearchCode, ShieldAlert, ArrowLeft, } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { RiskScoreGauge } from "@/components/common/RiskScoreGauge";
import { RiskBreakdownBar } from "@/components/common/RiskBreakdownBar";
import { FinancialProgressMismatch } from "@/components/project/FinancialProgressMismatch";
import { MilestoneLifecycle } from "@/components/project/MilestoneLifecycle";
import { ExplainableReasons } from "@/components/project/ExplainableReasons";
import { EvidenceGrid } from "@/components/project/EvidenceGrid";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { AskSentinelDrawer } from "@/components/layout/AskSentinelDrawer";
import { api } from "@/lib/api";
import { formatIndianCurrency } from "@/lib/formatters";
export default function ProjectDetailPage({ params }) {
    const resolvedParams = use(params);
    const rawId = resolvedParams?.projectId;
    const projectId = Array.isArray(rawId) ? decodeURIComponent(rawId.join("/")) : decodeURIComponent(rawId || "");
    const router = useRouter();
    const [project, setProject] = useState(null);
    const [evidenceList, setEvidenceList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [askSentinelOpen, setAskSentinelOpen] = useState(false);
    const [creatingCase, setCreatingCase] = useState(false);
    useEffect(() => {
        async function loadProjectDetails() {
            setLoading(true);
            try {
                const p = await api.getProjectById(projectId);
                if (p) {
                    setProject(p);
                    const ev = await api.getEvidence({ projectId: p.id });
                    setEvidenceList(ev);
                }
            }
            catch (err) {
                console.error("Failed to load project:", err);
            }
            finally {
                setLoading(false);
            }
        }
        loadProjectDetails();
    }, [projectId]);
    const handleCreateInvestigation = async () => {
        if (!project)
            return;
        if (project.investigationCaseId) {
            router.push(`/app/investigations/${project.investigationCaseId}`);
            return;
        }
        setCreatingCase(true);
        try {
            const newCase = await api.createInvestigation({
                projectId: project.id,
                primaryIssue: project.risk.primarySignal,
                priority: project.risk.level === "critical" ? "urgent" : "high",
                notes: `Automated investigation case opened for ${project.id}. Primary flagged reason: ${project.risk.primarySignal}`,
            });
            router.push(`/app/investigations/${newCase.id}`);
        }
        catch (err) {
            console.error("Failed to create case:", err);
        }
        finally {
            setCreatingCase(false);
        }
    };
    if (loading) {
        return (<AppShell breadcrumbs={[{ label: "Projects", href: "/app/projects" }, { label: projectId }]}>
        <LoadingSkeleton variant="card" count={4}/>
      </AppShell>);
    }
    if (!project) {
        return (<AppShell breadcrumbs={[{ label: "Projects", href: "/app/projects" }, { label: projectId }]}>
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto"/>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Project Not Found</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            The project record &quot;{projectId}&quot; could not be located in the Sentinel repository.
          </p>
          <Link href="/app/projects" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
            <ArrowLeft className="w-3.5 h-3.5"/> Return to Master Projects
          </Link>
        </div>
      </AppShell>);
    }
    return (<AppShell breadcrumbs={[{ label: "Projects", href: "/app/projects" }, { label: project.id }]} contextProjectId={project.id}>
      <div className="space-y-6">
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-black tracking-wider px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
                {project.id}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {project.category}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {project.mpHouse} — {project.mpName}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0"/>
                {project.district}, {project.state} ({project.constituency})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0"/>
                Agency: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{project.implementingAgency}</strong>
              </span>
            </div>
          </div>

          {/* Right Risk Gauge & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
            <RiskScoreGauge score={project.risk?.score} level={project.risk?.level} size="md"/>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button onClick={handleCreateInvestigation} disabled={creatingCase} className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-all active:scale-[0.98]">
                <SearchCode className="w-4 h-4"/>
                <span>{project.investigationCaseId ? "Open Active Investigation" : "Create Investigation Case"}</span>
              </button>

              <button onClick={() => setAskSentinelOpen(true)} className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/80 border border-blue-200 dark:border-blue-800 transition-colors">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"/>
                <span>Ask Sentinel AI</span>
              </button>
            </div>
          </div>
        </div>

        {/* Financial Summary Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sanctioned Budget</p>
            <p className="text-lg font-mono font-extrabold text-slate-900 dark:text-white">
              {formatIndianCurrency(project.financials?.sanctionedAmount ?? 0)}
            </p>
            <span className="text-[10px] text-slate-400 block">100% of Administrative Approval</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Paid / Disbursed</p>
            <p className="text-lg font-mono font-extrabold text-blue-600 dark:text-blue-400">
              {formatIndianCurrency(project.financials?.paidDisbursedAmount ?? 0)}
            </p>
            <span className="text-[10px] text-slate-400 block">{project.financialProgress ?? 0}% of Total Sanction</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Verified Expenditure</p>
            <p className="text-lg font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatIndianCurrency(project.financials?.verifiedExpenditureAmount ?? 0)}
            </p>
            <span className="text-[10px] text-slate-400 block">Audited Treasury Debits</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Unreconciled Gap</p>
            <p className="text-lg font-mono font-extrabold text-rose-600 dark:text-rose-400">
              {formatIndianCurrency(project.financials?.unreconciledGap ?? 0)}
            </p>
            <span className="text-[10px] text-rose-500 font-semibold block">Pending Utilization Proof</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Comparable Median</p>
            <p className="text-lg font-mono font-extrabold text-slate-800 dark:text-slate-200">
              {formatIndianCurrency(project.financials?.comparableMedianAmount ?? 0)}
            </p>
            <span className="text-[10px] text-rose-500 font-bold block">
              +{project.financials?.costDeviationPercent ?? 0}% Cost Anomaly
            </span>
          </div>
        </div>

        {/* Financial / Physical Mismatch Gauge */}
        <FinancialProgressMismatch financialProgress={project.financialProgress ?? 0} physicalProgress={project.physicalProgress ?? 0} disbursedAmount={project.financials?.paidDisbursedAmount ?? 0} sanctionedAmount={project.financials?.sanctionedAmount ?? 0}/>

        {/* Milestone Lifecycle Stepper */}
        <MilestoneLifecycle milestones={project.milestones || []}/>

        {/* Two-Column Grid: Risk Reasons & Risk Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Explainable Reasons */}
          <div className="lg:col-span-8">
            <ExplainableReasons reasons={project.risk?.reasons || []}/>
          </div>

          {/* Risk Category Breakdown */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 h-fit">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Composite Risk Breakdown
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Aggregated category points out of 100 total index
              </p>
            </div>
            <RiskBreakdownBar breakdown={project.risk?.breakdown || {}}/>
          </div>
        </div>

        {/* Evidence Grid */}
        <EvidenceGrid evidenceList={evidenceList}/>
      </div>

      {/* Contextual Ask Sentinel Drawer */}
      <AskSentinelDrawer isOpen={askSentinelOpen} onClose={() => setAskSentinelOpen(false)} contextProjectId={project.id}/>
    </AppShell>);
}
