"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Layers, ExternalLink, SearchCode, } from "lucide-react";
export const LayoutComparator = ({ uploadedDocName, analysis, onCreateCase, }) => {
    const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(0);
    const candidate = analysis.matchedCandidateFiles[selectedCandidateIndex] || analysis.matchedCandidateFiles[0];
    return (<div className="space-y-6">
      {/* Top Match Metric Strip */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-400/30">
              AI Layout Coordinate Matcher v2.4
            </span>
            <span className="text-xs text-slate-400">SHA-256: {analysis.sha256.substring(0, 16)}...</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            {analysis.overallSimilarity >= 80
            ? "High-Confidence Layout & Template Reuse Detected"
            : "Standard Document Template Comparison"}
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Uploaded document layout coordinates match{" "}
            <strong className="text-white">{candidate.evidenceId}</strong> ({candidate.title}) from{" "}
            <strong>{candidate.projectId}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-center p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Layout Geometry</span>
            <span className="text-xl font-mono font-black text-purple-400">{analysis.layoutScore}%</span>
          </div>
          <div className="text-center p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Content Match</span>
            <span className="text-xl font-mono font-black text-blue-400">{analysis.contentScore}%</span>
          </div>
          <div className="text-center p-3 rounded-2xl bg-white/10 border border-rose-500/40">
            <span className="text-[10px] uppercase font-bold text-rose-300 block">Overall Similarity</span>
            <span className="text-xl font-mono font-black text-rose-400">{analysis.overallSimilarity}%</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Visual Layout Canvases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document A (Uploaded Document) */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                UPLOADED DOCUMENT
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 truncate max-w-xs">
              {uploadedDocName}
            </span>
          </div>

          {/* Simulated Document Layout Canvas */}
          <div className="relative aspect-[3/4] rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 p-4 font-mono text-[10px] overflow-hidden flex flex-col justify-between shadow-inner">
            {/* Header Zone Box */}
            <div className="p-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-300 space-y-0.5">
              <span className="font-bold uppercase tracking-wider text-[9px] block">
                ZONE A: {analysis.extractedTemplate.layoutStructure.headerZone.label}
              </span>
              <p className="text-[10px] text-slate-600 dark:text-slate-400">
                Official Letterhead & Departmental Hierarchy
              </p>
            </div>

            {/* Metadata Zone Box */}
            <div className="p-2.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-300 space-y-0.5">
              <span className="font-bold uppercase tracking-wider text-[9px] block">
                ZONE B: {analysis.extractedTemplate.layoutStructure.projectMetaZone.label}
              </span>
              <p className="text-[10px] text-slate-600 dark:text-slate-400">
                Work Code, MP Recommendation Ref & Approval Date
              </p>
            </div>

            {/* Table Zone Box */}
            <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 space-y-1 flex-1 my-2 flex flex-col justify-center">
              <span className="font-bold uppercase tracking-wider text-[9px] block">
                ZONE C: {analysis.extractedTemplate.layoutStructure.expenditureTableZone.label}
              </span>
              <div className="space-y-1 text-slate-600 dark:text-slate-400 text-[9px]">
                <div className="flex justify-between border-b border-amber-200 dark:border-amber-900 pb-0.5">
                  <span>1. Structural Civil Works:</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹24,50,000</span>
                </div>
                <div className="flex justify-between border-b border-amber-200 dark:border-amber-900 pb-0.5">
                  <span>2. Electrification & Lighting:</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹6,30,000</span>
                </div>
                <div className="flex justify-between font-bold text-rose-600">
                  <span>Claimed Bill Total:</span>
                  <span>₹41,00,000 (Over Sanction)</span>
                </div>
              </div>
            </div>

            {/* Signature & Seal Box */}
            <div className="self-end w-1/2 p-2.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-300 text-center">
              <span className="font-bold uppercase tracking-wider text-[9px] block">
                ZONE D: {analysis.extractedTemplate.layoutStructure.signatureZone.label}
              </span>
              <p className="text-[9px] text-rose-600 dark:text-rose-400 mt-0.5">
                Pixel Coordinate: (55%, 78%)
              </p>
            </div>
          </div>
        </div>

        {/* Document B (Matched Repository Candidate Document) */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-purple-50 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                MATCHED REPOSITORY CANDIDATE ({candidate.evidenceId})
              </span>
            </div>
            <Link href={`/app/evidence/${candidate.evidenceId}`} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              <span>Inspect Record</span>
              <ExternalLink className="w-3.5 h-3.5"/>
            </Link>
          </div>

          {/* Simulated Matched Layout Canvas */}
          <div className="relative aspect-[3/4] rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-purple-300 dark:border-purple-800 p-4 font-mono text-[10px] overflow-hidden flex flex-col justify-between shadow-inner">
            {/* Header Zone Box */}
            <div className="p-2.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-300 space-y-0.5">
              <span className="font-bold uppercase tracking-wider text-[9px] block">
                ZONE A: Identical DSIIDC Letterhead Pattern
              </span>
              <p className="text-[10px] text-slate-600 dark:text-slate-400">
                Pixel delta &lt; 4px alignment match
              </p>
            </div>

            {/* Metadata Zone Box */}
            <div className="p-2.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-300 space-y-0.5">
              <span className="font-bold uppercase tracking-wider text-[9px] block">
                ZONE B: Sanction Reference Alignment
              </span>
              <p className="text-[10px] text-slate-600 dark:text-slate-400">
                Project: {candidate.projectId} ({candidate.projectTitle})
              </p>
            </div>

            {/* Table Zone Box */}
            <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 space-y-1 flex-1 my-2 flex flex-col justify-center">
              <span className="font-bold uppercase tracking-wider text-[9px] block">
                ZONE C: Original CPWD Rate Schedule
              </span>
              <div className="space-y-1 text-slate-600 dark:text-slate-400 text-[9px]">
                <div className="flex justify-between border-b border-amber-200 dark:border-amber-900 pb-0.5">
                  <span>Sanctioned Rate Schedule:</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹35,00,000</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-600">
                  <span>Approved Ceiling:</span>
                  <span>₹35,00,000</span>
                </div>
              </div>
            </div>

            {/* Signature & Seal Box */}
            <div className="self-end w-1/2 p-2.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/60 border-2 border-dashed border-rose-500 text-rose-900 dark:text-rose-300 text-center">
              <span className="font-bold uppercase tracking-wider text-[9px] block">
                ZONE D: Matched Stamp Coordinates
              </span>
              <p className="text-[9px] text-rose-600 font-bold mt-0.5">
                98.6% Seal Geometry Match
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Discrepancy & Deviation Analysis Matrix */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600"/>
              Document Layout Discrepancies & Integrity Signals
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated bounding box and OCR comparative diff
            </p>
          </div>

          <Link href={`/app/investigations/CASE-2026-00128`} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-all self-start sm:self-auto">
            <SearchCode className="w-4 h-4"/>
            <span>Open Active Investigation Case</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {analysis.layoutDeviations.map((dev, idx) => (<div key={idx} className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-800 dark:text-rose-300">
                  {dev.zone}
                </span>
                <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                  {dev.delta}
                </span>
              </div>
              <p className="text-rose-700/90 dark:text-rose-300/80 leading-relaxed text-[11px]">
                {dev.finding}
              </p>
            </div>))}
        </div>
      </div>

      {/* Matched Candidate Files in Database Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Repository Candidate Files with Matching Layout Structure
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click on any candidate record to switch the visual side-by-side comparator
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-850/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Evidence Artifact</th>
                <th className="px-4 py-3">Target Project</th>
                <th className="px-4 py-3">Template Type</th>
                <th className="px-4 py-3">Layout Match</th>
                <th className="px-4 py-3">Content Match</th>
                <th className="px-4 py-3">Overall Similarity</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {analysis.matchedCandidateFiles.map((item, idx) => {
            const isSelected = selectedCandidateIndex === idx;
            return (<tr key={item.evidenceId} onClick={() => setSelectedCandidateIndex(idx)} className={`cursor-pointer transition-colors ${isSelected
                    ? "bg-purple-50/60 dark:bg-purple-950/30"
                    : "hover:bg-slate-50/80 dark:hover:bg-slate-850/50"}`}>
                    <td className="px-4 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {item.evidenceId}
                      <p className="font-sans font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {item.title}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 max-w-xs">
                      <span className="font-mono text-[10px] text-slate-400">{item.projectId}</span>
                      <p className="font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">
                        {item.projectTitle}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">{item.templateType}</td>
                    <td className="px-4 py-3.5 font-mono font-bold text-purple-600 dark:text-purple-400">
                      {item.layoutSimilarity}%
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {item.contentSimilarity}%
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${item.overallSimilarity >= 80
                    ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800"}`}>
                        {item.overallSimilarity}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <button type="button" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCandidateIndex(idx);
                }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isSelected
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200"}`}>
                        {isSelected ? "Comparing Now" : "Compare Layout"}
                      </button>
                    </td>
                  </tr>);
        })}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
};
