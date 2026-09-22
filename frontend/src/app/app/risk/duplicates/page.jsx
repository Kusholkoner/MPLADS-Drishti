"use client";
import React, { useState } from "react";
import Link from "next/link";
import { CopyCheck, MapPin, ArrowRight, ShieldAlert, Cpu } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/common/MetricCard";
import { RiskBadge } from "@/components/common/RiskBadge";
import { formatIndianCurrency } from "@/lib/formatters";
export default function DuplicateIntelligencePage() {
    const [activeTab, setActiveTab] = useState("cluster1");
    return (<AppShell breadcrumbs={[{ label: "Risk Intelligence", href: "/app/risk" }, { label: "Duplicate Intelligence" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                NLP & Geospatial Scope Deduplication Engine
              </span>
              <span className="text-xs text-slate-400">19 Flagged Clusters</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              Duplicate Project & Scope Overlap Intelligence
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sentence-BERT semantic vector embeddings paired with GIS spatial radius to flag potential double-sanction of identical assets
            </p>
          </div>

          <Link href="/app/projects/MPL-004821" className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 shadow-sm self-start md:self-auto">
            <CopyCheck className="w-3.5 h-3.5"/>
            <span>Inspect Flagged Showcase Pair</span>
          </Link>
        </div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Duplicate Clusters" value="19" subtitle="Potential scope overlaps" trend={{ value: "SBERT > 85%", isPositive: true, isPositiveGood: false }} icon={CopyCheck} variant="default"/>
          <MetricCard title="Overlap Sanctioned" value="₹14.8 Cr" subtitle="Co-located proposals" trend={{ value: "Flagged for survey", isPositive: false, isPositiveGood: false }} icon={ShieldAlert} variant="warning"/>
          <MetricCard title="Geospatial Proximity (<500m)" value="12 Pairs" subtitle="Adjacent village works" trend={{ value: "Cadastral check", isPositive: true, isPositiveGood: false }} icon={MapPin} variant="critical"/>
          <MetricCard title="Deduplication Model" value="SBERT + GIS" subtitle="Cosine + Haversine Radius" trend={{ value: "v2.0 Active", isPositive: true, isPositiveGood: true }} icon={Cpu} variant="default"/>
        </div>

        {/* Visual Pipeline Flow Diagram */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Automated Duplicate Screening Pipeline
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <p className="font-bold text-slate-800 dark:text-slate-200">1. Proposal Ingest</p>
              <p className="text-[10px] text-slate-400 mt-1">Title & Scope Text</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <p className="font-bold text-purple-600 dark:text-purple-400">2. SBERT Vector</p>
              <p className="text-[10px] text-slate-400 mt-1">768-Dim Embedding</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <p className="font-bold text-blue-600 dark:text-blue-400">3. Cosine Search</p>
              <p className="text-[10px] text-slate-400 mt-1">Text Similarity</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <p className="font-bold text-emerald-600 dark:text-emerald-400">4. GIS Proximity</p>
              <p className="text-[10px] text-slate-400 mt-1">Radius &lt; 500m</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <p className="font-bold text-amber-600 dark:text-amber-400">5. Cost Ratio</p>
              <p className="text-[10px] text-slate-400 mt-1">Budget Envelope</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800">
              <p className="font-bold text-rose-600 dark:text-rose-400">6. Potential Match</p>
              <p className="text-[10px] text-rose-500 mt-1">Prioritize Review</p>
            </div>
          </div>
        </div>

        {/* Featured Showcase Cluster: Project A vs Project B */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  Cluster #DUP-2026-04
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  91.2% Overall Scope Match
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Potential double-sanction detected between adjacent community hall projects in Village Khera, New Delhi
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/app/investigations/CASE-2026-00128" className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700">
                Inspect Investigation Case
              </Link>
            </div>
          </div>

          {/* Side-by-side Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Project A */}
            <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  PROJECT A (MPL-004821)
                </span>
                <RiskBadge level="critical" score={87} size="sm"/>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Construction of Multipurpose Community Hall at Village Khera
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Single-storey multipurpose community center for public gatherings, vocational training, and Panchayat meetings.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60 dark:border-slate-800 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Sanctioned</span>
                  <p className="font-bold text-slate-900 dark:text-white">{formatIndianCurrency(3500000)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Agency</span>
                  <p className="font-bold text-slate-900 dark:text-white">DSIIDC</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">GPS Location</span>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px]">28.5832° N, 77.1645° E</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Sanction Date</span>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px]">10 Oct 2025</p>
                </div>
              </div>

              <Link href="/app/projects/MPL-004821" className="w-full flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:text-blue-600 transition-colors">
                <span>Open Digital Twin A</span>
                <ArrowRight className="w-3.5 h-3.5"/>
              </Link>
            </div>

            {/* Project B */}
            <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                  PROJECT B (MPL-004822)
                </span>
                <RiskBadge level="duplicate" size="sm"/>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Construction of Community Centre at Village Khera Extension
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Proposed community center building for public welfare and library space at Khera Extension ward.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60 dark:border-slate-800 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Sanctioned</span>
                  <p className="font-bold text-slate-900 dark:text-white">{formatIndianCurrency(3700000)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Agency</span>
                  <p className="font-bold text-slate-900 dark:text-white">DSIIDC</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">GPS Location</span>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px]">28.5845° N, 77.1681° E</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Sanction Date</span>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px]">20 Oct 2025</p>
                </div>
              </div>

              <Link href="/app/projects/MPL-004822" className="w-full flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:text-blue-600 transition-colors">
                <span>Open Digital Twin B</span>
                <ArrowRight className="w-3.5 h-3.5"/>
              </Link>
            </div>
          </div>

          {/* Similarity Scores Breakdown Matrix */}
          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-850/60 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-600"/>
              Multi-Dimensional Similarity Matrix
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-purple-200/60 dark:border-purple-800">
                <span className="text-slate-400 block text-[11px]">Text Similarity (SBERT)</span>
                <span className="text-lg font-mono font-extrabold text-purple-700 dark:text-purple-300">
                  92.4%
                </span>
                <span className="text-[10px] text-slate-400 block">Cosine vector distance</span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-purple-200/60 dark:border-purple-800">
                <span className="text-slate-400 block text-[11px]">Location Proximity</span>
                <span className="text-lg font-mono font-extrabold text-rose-600 dark:text-rose-400">
                  438 Meters
                </span>
                <span className="text-[10px] text-slate-400 block">Haversine GPS delta</span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-purple-200/60 dark:border-purple-800">
                <span className="text-slate-400 block text-[11px]">Cost Scope Overlap</span>
                <span className="text-lg font-mono font-extrabold text-amber-600 dark:text-amber-400">
                  89.2%
                </span>
                <span className="text-[10px] text-slate-400 block">₹35.0L vs ₹37.0L</span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-purple-200/60 dark:border-purple-800">
                <span className="text-slate-400 block text-[11px]">Overall Potential Match</span>
                <span className="text-lg font-mono font-extrabold text-rose-600 dark:text-rose-400">
                  91.2%
                </span>
                <span className="text-[10px] font-bold text-rose-500 block">Potential Duplicate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>);
}
