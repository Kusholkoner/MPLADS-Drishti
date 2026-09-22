"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

export default function MethodologyPage() {
  const models = [
    {
      name: "Deterministic Statutory Rules Engine",
      purpose: "Statutory GFR & MPLADS compliance validation",
      tech: "Declarative Rule Engine & Schema Validators",
      examples: "Sanction ceiling limits, non-permissible work categories, statutory quota allocations (15% SC / 7.5% ST).",
    },
    {
      name: "Sentence-BERT (SBERT) NLP Matcher",
      purpose: "Deduplication & scope overlap detection",
      tech: "all-MiniLM-L6-v2 + Cosine Similarity (>88%)",
      examples: "Detects reworded project proposals in adjacent Gram Panchayats with >88% semantic match.",
    },
    {
      name: "Computer Vision (CV) Perceptual Matcher",
      purpose: "Site photo reuse & stage classification",
      tech: "64-bit Difference Hashing (dHash) + CLIP ViT-B/32",
      examples: "Catches identical foundation photographs reused from past fiscal years or across constituencies (Hamming ≤ 6).",
    },
    {
      name: "Financial Velocity Statistical Scanner",
      purpose: "Advance retention & split invoicing detection",
      tech: "Isolation Forest (100 Trees) & IQR clustering",
      examples: "Flags payment vouchers clustered just below the ₹10.0 Lakh competitive e-tender threshold.",
    },
    {
      name: "Multi-Signal Risk Fusion Engine",
      purpose: "Multi-model risk weighting & explainable scoring",
      tech: "Calibrated Weighted Aggregation (0-100) + Double Confirmation Rule",
      examples: "Combines financial divergence, duplicate NLP, and contractor clustering into an audit-defensible score.",
    },
  ];

  return (
    <AppShell breadcrumbs={[{ label: "AI Methodology" }]}>
      <div className="space-y-8 max-w-5xl mx-auto py-4">
        {/* Page Header */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
            Hybrid AI Architecture
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Methodology & Machine Learning Framework
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            Why Sentinel employs a hybrid architecture combining deterministic statutory rules with statistical ML, deep vision embeddings, and explainable AI.
          </p>
        </div>

        {/* Models Grid */}
        <div className="space-y-4">
          {models.map((mod, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 hover:border-purple-300 dark:hover:border-purple-800 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {mod.name}
                </h3>
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                  {mod.tech}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Primary Audit Purpose: {mod.purpose}
              </p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 text-xs text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800">
                <strong>Real Audit Detection: </strong> {mod.examples}
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
