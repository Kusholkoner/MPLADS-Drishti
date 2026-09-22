"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

export default function ResearchPage() {
  const citations = [
    {
      title: "Scheme Guidelines on Members of Parliament Local Area Development Scheme (MPLADS)",
      source: "Ministry of Statistics and Programme Implementation (MoSPI), Government of India",
      year: "2023",
      relevance: "Governs allowable work categories, sanction ceilings, quota reservations, and mandatory installment milestones.",
      feature: "Deterministic Compliance Rules Engine",
    },
    {
      title: "Report of the Comptroller and Auditor General of India on Performance Audit of MPLADS",
      source: "Comptroller and Auditor General of India (CAG Report No. 31)",
      year: "2020",
      relevance: "Identifies systemic patterns in unspent fund accumulation, milestone overruns, and documentation gaps.",
      feature: "Financial Velocity & Advance Scanners",
    },
    {
      title: "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks",
      source: "Reimers & Gurevych (EMNLP-IJCNLP)",
      year: "2019",
      relevance: "Dense semantic vector representations used for high-accuracy proposal deduplication.",
      feature: "Duplicate Project Intelligence",
    },
    {
      title: "A Unified Approach to Interpreting Model Predictions (SHAP)",
      source: "Lundberg & Lee (NeurIPS)",
      year: "2017",
      relevance: "Provides exact mathematical point contribution explanations for every composite risk score.",
      feature: "Explainable AI (XAI) Reasons Panel",
    },
  ];

  return (
    <AppShell breadcrumbs={[{ label: "Research & CAG Citations" }]}>
      <div className="space-y-8 max-w-5xl mx-auto py-4">
        {/* Page Header */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
            Literature & Policy Foundations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Academic & Institutional Research Citations
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            Every analytical model and risk threshold in MPLADS Sentinel is grounded in established public audit frameworks and peer-reviewed computer science literature.
          </p>
        </div>

        {/* Citations List */}
        <div className="space-y-4">
          {citations.map((c, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 hover:border-blue-300 dark:hover:border-blue-800 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {c.title}
                </h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {c.year}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {c.source}
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong>Why Relevant: </strong> {c.relevance}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-blue-600 dark:text-blue-400 font-mono font-bold">
                Feature Influenced: {c.feature}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/app/command-center"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all"
          >
            <span>Return to Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
