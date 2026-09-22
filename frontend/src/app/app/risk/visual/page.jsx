"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Camera, MapPin, Eye, Sparkles, Layers } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/common/MetricCard";
export default function VisualEvidencePage() {
    const [zoomSubmitted, setZoomSubmitted] = useState(false);
    return (<AppShell breadcrumbs={[{ label: "Risk Intelligence", href: "/app/risk" }, { label: "Visual Evidence (CV)" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/80 px-2 py-0.5 rounded-md border border-orange-200 dark:border-orange-800">
                Computer Vision & Perceptual Hash Engine
              </span>
              <span className="text-xs text-slate-400">31 Flagged Visual Records</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              Visual Evidence & Forensic Verification Intelligence
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Automated image deduplication, EXIF geotag integrity verification, and construction milestone stage classification
            </p>
          </div>

          <Link href="/app/evidence/EVD-IMG-001" className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-sm self-start md:self-auto">
            <Eye className="w-3.5 h-3.5"/>
            <span>Open Showcase Image Evidence</span>
          </Link>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Image Reuse Matches" value="14 Pairs" subtitle="Perceptual hash >90%" trend={{ value: "99.4% peak match", isPositive: true, isPositiveGood: false }} icon={Camera} variant="critical"/>
          <MetricCard title="GPS Location Deltas" value="11 Flags" subtitle="Geotag >1km from site" trend={{ value: "Max 18.7 km offset", isPositive: true, isPositiveGood: false }} icon={MapPin} variant="warning"/>
          <MetricCard title="Stage Inconsistencies" value="16 Flags" subtitle="Claimed vs detected stage" trend={{ value: "Stage classifier v2.1", isPositive: true, isPositiveGood: false }} icon={Layers} variant="warning"/>
          <MetricCard title="CV Detection Precision" value="99.4%" subtitle="ResNet-50 & pHash embeddings" trend={{ value: "Multi-Model Live", isPositive: true, isPositiveGood: true }} icon={Sparkles} variant="default"/>
        </div>

        {/* High-Impact Visual Showcase: Side-by-Side Image Comparison */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  Critical Visual Alert
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  99.4% Perceptual Similarity — Evidence Reused across Distinct Works
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparison between submitted milestone evidence for MPL-004821 and historical 2024 archive submission
              </p>
            </div>

            <Link href="/app/investigations/CASE-2026-00128" className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors">
              Escalate in Case #128
            </Link>
          </div>

          {/* Side-by-side Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image A: Submitted Evidence */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    SUBMITTED EVIDENCE (EVD-IMG-001)
                  </span>
                </div>
                <span className="text-xs text-rose-600 font-bold">Project: MPL-004821</span>
              </div>

              {/* Image Container with Simulated Canvas */}
              <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden border border-slate-700 flex flex-col items-center justify-center p-4 text-center">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"/>
                <Camera className="w-10 h-10 text-slate-600 mb-2"/>
                <p className="text-xs font-bold text-slate-200">
                  Foundation Excavation & RCC Column Casting
                </p>
                <p className="text-[10px] text-slate-400">
                  Submitted for Village Khera Community Hall (28 Nov 2025)
                </p>

                {/* Overlay Metadata Tag */}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[10px] font-mono text-white/90 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  <span>GPS: 28.5832° N, 77.1645° E</span>
                  <span className="text-rose-400 font-bold">pHash: e3b0c44...</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  Submitted Milestone Proof
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  Uploaded by Assistant Engineer on 28 Nov 2025 claiming completion of Milestone #1 foundation civil works.
                </p>
              </div>
            </div>

            {/* Image B: Historical Match */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                    HISTORICAL MATCH (EVD-IMG-002)
                  </span>
                </div>
                <span className="text-xs text-slate-400">Project: MPL-002419 (Archive 2024)</span>
              </div>

              {/* Image Container with Simulated Canvas */}
              <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden border border-slate-700 flex flex-col items-center justify-center p-4 text-center">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"/>
                <Camera className="w-10 h-10 text-slate-600 mb-2"/>
                <p className="text-xs font-bold text-slate-200">
                  Archived North West Delhi Senior Citizen Room
                </p>
                <p className="text-[10px] text-slate-400">
                  Submitted in March 2024 for a separate constituency
                </p>

                {/* Overlay Metadata Tag */}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[10px] font-mono text-white/90 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  <span>GPS: 28.7121° N, 77.1023° E</span>
                  <span className="text-amber-400 font-bold">pHash: f4a1c55...</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  National Repository Baseline Match
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  Deep embedding cosine distance &lt; 0.006 indicates identical physical scene with stripped camera EXIF metadata.
                </p>
              </div>
            </div>
          </div>

          {/* AI Forensic Findings Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
            {/* Finding 1 */}
            <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                1. Perceptual Similarity Match
              </span>
              <p className="text-lg font-mono font-black text-rose-600 dark:text-rose-400">
                99.4% Match
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                Possible reused evidence across projects located 18.7 km apart.
              </p>
            </div>

            {/* Finding 2 */}
            <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                2. Geotag Distance Delta
              </span>
              <p className="text-lg font-mono font-black text-amber-600 dark:text-amber-400">
                18.7 km Offset
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                Photo coordinates belong to North West Delhi instead of Village Khera.
              </p>
            </div>

            {/* Finding 3 */}
            <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                3. Construction Stage Check
              </span>
              <p className="text-lg font-mono font-black text-blue-600 dark:text-blue-400">
                Stage 1/7 vs 3/7
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                Image exhibits raw earth excavation rather than completed plinth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>);
}
