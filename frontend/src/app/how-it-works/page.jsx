"use client";
import React from "react";
import Link from "next/link";
import { Database, Cpu, ShieldAlert, FileCheck, SearchCode, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "eSAKSHI & Treasury Ingestion",
      icon: Database,
      desc: "Continuous automated ingestion of project recommendations, administrative sanctions, contractor Running Account bills, and PFMS treasury debits across 12 official Parliamentary datasets.",
    },
    {
      num: "02",
      title: "Multi-Model AI Surveillance",
      icon: Cpu,
      desc: "Simultaneous screening across 21 specialized verification engines: Financial Velocity, Sentence-BERT NLP, Computer Vision Image Matcher, OCR Inconsistency Scanner, and Milestone Delay Predictor.",
    },
    {
      num: "03",
      title: "Composite Risk Prioritization",
      icon: ShieldAlert,
      desc: "Aggregation into a normalized 0–100 Composite Risk Index. Multi-signal confirmation rule requires at least 2 independent signals before escalating to Critical Risk.",
    },
    {
      num: "04",
      title: "Evidence Provenance Linking",
      icon: FileCheck,
      desc: "Every flagged risk point links directly to underlying cryptographic ground evidence, side-by-side comparison images, or OCR bill deltas in the evidence vault.",
    },
    {
      num: "05",
      title: "Authorized Auditor Investigation",
      icon: SearchCode,
      desc: "District and Central reviewing officers investigate prioritized cases, post remarks, dispatch field inspection warrants, and record formal audit determinations.",
    },
  ];

  return (
    <AppShell breadcrumbs={[{ label: "How It Works" }]}>
      <div className="space-y-8 max-w-5xl mx-auto py-4">
        {/* Page Header */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
            Process Explainer
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How MPLADS Sentinel Operates
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            A step-by-step walkthrough of how raw administrative records are transformed into actionable, evidence-linked risk intelligence across the 21-module AI grid.
          </p>
        </div>

        {/* Steps Linear Flow */}
        <div className="space-y-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center gap-5 hover:border-blue-300 dark:hover:border-blue-800 transition-colors"
              >
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-2xl font-mono font-black text-blue-600 dark:text-blue-400 w-10">
                    {step.num}
                  </span>
                  <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-1 flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
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
