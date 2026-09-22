"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert, BadgeIndianRupee, Camera, CopyCheck, FileText, Clock, ArrowRight, Share2, Cpu } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/common/MetricCard";
import { RiskBadge } from "@/components/common/RiskBadge";
import { api } from "@/lib/api";
import { formatIndianCurrency } from "@/lib/formatters";
export default function RiskIntelligenceHubPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function loadRiskData() {
            try {
                const res = await api.getProjects({ limit: 10 });
                setProjects(res.projects.filter((p) => p.risk.score >= 60));
            }
            catch (err) {
                console.error("Failed to load risk projects:", err);
            }
            finally {
                setLoading(false);
            }
        }
        loadRiskData();
    }, []);
    const riskModules = [
        {
            id: "financial",
            title: "Financial Risk & Payment Anomalies",
            route: "/app/risk/financial",
            icon: BadgeIndianRupee,
            count: "47 Flagged",
            color: "rose",
            description: "Cost inflation, premature fund disbursement, split payment patterns, and financial/physical progress divergence.",
            badges: ["Split Invoicing", "Cost Outliers", "Advance Discrepancy"],
        },
        {
            id: "visual",
            title: "Visual Evidence Intelligence (CV)",
            route: "/app/risk/visual",
            icon: Camera,
            count: "31 Flagged",
            color: "orange",
            description: "Perceptual image hash reuse, deep vector embedding similarity, construction stage classification, and GPS distance deltas.",
            badges: ["99.4% Image Match", "Stage Mismatch", "EXIF Integrity"],
        },
        {
            id: "duplicates",
            title: "Duplicate Project Intelligence (NLP/GIS)",
            route: "/app/risk/duplicates",
            icon: CopyCheck,
            count: "19 Clusters",
            color: "purple",
            description: "Sentence-BERT semantic embedding matching, spatial proximity analysis, and scope duplication detection across adjacent works.",
            badges: ["SBERT Embeddings", "GIS Radius <500m", "Double-Sanction"],
        },
        {
            id: "documents",
            title: "Document & OCR Intelligence",
            route: "/app/risk/documents",
            icon: FileText,
            count: "26 Flagged",
            color: "sky",
            description: "Automated OCR extraction, cross-document amount reconciliation (Sanction vs Work Order vs Final Bill vs UC).",
            badges: ["Cross-Doc Mismatch", "UC Audit Delta", "GFR Compliance"],
        },
        {
            id: "timeline",
            title: "Timeline & Milestone Risk",
            route: "/app/risk/timeline",
            icon: Clock,
            count: "38 Flagged",
            color: "amber",
            description: "Milestone delay tracking, structural execution stall detection, and deadline slippage prediction modeling.",
            badges: ["Milestone Overruns", "Stalled Works", "Deadline Risk 81%"],
        },
        {
            id: "vendor-graph",
            title: "Vendor Collusion Network (GNN AI)",
            route: "/app/risk/vendor-graph",
            icon: Share2,
            count: "12 Clusters",
            color: "indigo",
            description: "Bipartite MP-Agency-Vendor graph intelligence. HHI monopoly detection, shared photo fraud, and MCA21 beneficial ownership cross-checks.",
            badges: ["HHI Index", "Monopoly >35%", "NetworkX GNN"],
        },
        {
            id: "predictive",
            title: "Predictive Risk & Attack Simulator",
            route: "/app/risk/predictive",
            icon: Cpu,
            count: "15 Active",
            color: "fuchsia",
            description: "Forward-looking XGBoost delay forecasting and adversarial synthetic fraud stress-testing against all 21 AI detection modules.",
            badges: ["81% Delay Risk", "ML Confidence 92%", "Synthetic Tests"],
        },
    ];
    return (<AppShell breadcrumbs={[{ label: "Risk Intelligence" }]}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
                Continuous Multi-Model Surveillance
              </span>
              <span className="text-xs text-slate-400">161 Active Risk Signals</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              Risk Intelligence Suite
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Correlated anomaly detection across financial ledgers, milestone timelines, geospatial proximity, and computer vision
            </p>
          </div>
        </div>

        {/* Top KPI Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Total Flagged Works" value="161" subtitle="Across 8 risk dimensions" trend={{ value: "0.87% of all works", isPositive: false, isPositiveGood: true }} icon={ShieldAlert} variant="default"/>
          <MetricCard title="Financial Anomalies" value="47" subtitle="₹28.4 Cr flagged value" trend={{ value: "+4 this week", isPositive: true, isPositiveGood: false }} icon={BadgeIndianRupee} variant="critical"/>
          <MetricCard title="Computer Vision Flags" value="31" subtitle="Image reuse & stage mismatch" trend={{ value: "99.4% peak match", isPositive: true, isPositiveGood: false }} icon={Camera} variant="warning"/>
          <MetricCard title="Duplicate Scope Clusters" value="19" subtitle="High semantic/spatial overlap" trend={{ value: "SBERT > 90%", isPositive: true, isPositiveGood: false }} icon={CopyCheck} variant="default"/>
        </div>

        {/* Specialized Risk Modules Grid */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Specialized Verification Intelligence Engines
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {riskModules.map((mod) => {
            const Icon = mod.icon;
            return (<Link key={mod.id} href={mod.route} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-600 shadow-sm transition-all flex flex-col justify-between group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-105 transition-all">
                        <Icon className="w-5 h-5"/>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        {mod.count}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {mod.badges.map((b) => (<span key={b} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {b}
                        </span>))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span>Inspect Engine & Works</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                  </div>
                </Link>);
        })}
          </div>
        </div>

        {/* High-Risk Projects Highlight */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Active High-Risk Anomalous Works
              </h3>
              <p className="text-xs text-slate-400">
                Prioritized projects with multiple correlated anomaly flags
              </p>
            </div>
            <Link href="/app/projects?risk=critical" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              View All Critical Cases →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {projects.map((p) => (<div key={p.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Link href={`/app/projects/${p.id}`} className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400 hover:underline">
                      {p.id}
                    </Link>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {p.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {p.district}, {p.state} • Sanctioned: <strong className="font-mono">{formatIndianCurrency(p.financials.sanctionedAmount)}</strong> • Primary Signal: <span className="text-rose-600 dark:text-rose-400 font-medium">{p.risk.primarySignal}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                  <RiskBadge level={p.risk.level} score={p.risk.score} size="sm"/>
                  <Link href={`/app/projects/${p.id}`} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition-colors">
                    Inspect Twin
                  </Link>
                </div>
              </div>))}
          </div>
        </div>
      </div>
    </AppShell>);
}
