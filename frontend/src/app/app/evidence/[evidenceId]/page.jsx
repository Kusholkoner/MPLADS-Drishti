"use client";
import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { Camera, CheckCircle2, AlertTriangle, ArrowLeft, ShieldAlert, Lock, Cpu, } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/formatters";
export default function EvidenceDetailPage({ params }) {
    const resolvedParams = use(params);
    const evidenceId = resolvedParams.evidenceId;
    const [evidence, setEvidence] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function loadItem() {
            setLoading(true);
            try {
                const item = await api.getEvidenceById(evidenceId);
                setEvidence(item);
            }
            catch (err) {
                console.error("Failed to load evidence item:", err);
            }
            finally {
                setLoading(false);
            }
        }
        loadItem();
    }, [evidenceId]);
    if (loading) {
        return (<AppShell breadcrumbs={[{ label: "Evidence", href: "/app/evidence" }, { label: evidenceId }]}>
        <LoadingSkeleton variant="card" count={3}/>
      </AppShell>);
    }
    if (!evidence) {
        return (<AppShell breadcrumbs={[{ label: "Evidence", href: "/app/evidence" }, { label: evidenceId }]}>
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto"/>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Evidence Record Not Found</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            The evidence artifact &quot;{evidenceId}&quot; is not present in the cryptographic audit repository.
          </p>
          <Link href="/app/evidence" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
            <ArrowLeft className="w-3.5 h-3.5"/> Return to Evidence Repository
          </Link>
        </div>
      </AppShell>);
    }
    return (<AppShell breadcrumbs={[{ label: "Evidence", href: "/app/evidence" }, { label: evidence.id }]}>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-black tracking-wider px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {evidence.id}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Type: {evidence.type}
              </span>
              <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${evidence.status === "verified"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
            : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"}`}>
                Status: {evidence.status}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {evidence.title}
            </h1>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Linked to Project:{" "}
              <Link href={`/app/projects/${evidence.projectId}`} className="font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline">
                {evidence.projectId}
              </Link>
              {evidence.projectTitle && ` — ${evidence.projectTitle}`}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href={`/app/projects/${evidence.projectId}`} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all shadow-sm">
              Open Digital Project Twin
            </Link>
          </div>
        </div>

        {/* Two-Column: Evidence Viewer & AI Findings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Document/Image Viewer */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Evidence Artifact Preview
              </h3>

              {evidence.type === "image" ? (<div className="aspect-video rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden">
                  <Camera className="w-12 h-12 text-slate-600 mb-3"/>
                  <p className="font-bold text-sm text-slate-200">{evidence.title}</p>
                  <p className="text-xs text-slate-400 mt-1">Geotagged Site Photo Submission</p>
                  {evidence.metadata?.gpsLatitude && (<div className="absolute bottom-3 left-3 right-3 flex justify-between text-[11px] font-mono bg-black/60 px-3 py-1.5 rounded-lg">
                      <span>GPS: {evidence.metadata.gpsLatitude}° N, {evidence.metadata.gpsLongitude}° E</span>
                      <span className="text-rose-400 font-bold">Match: {evidence.comparisonSimilarityPercent || 99.4}%</span>
                    </div>)}
                </div>) : (<div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      OCR Extracted Document Fields
                    </span>
                    <span className="text-[10px] text-slate-400">Multilingual OCR Engine v2.3</span>
                  </div>

                  {evidence.extractedFields && evidence.extractedFields.length > 0 ? (<div className="space-y-2">
                      {evidence.extractedFields.map((field, idx) => (<div key={idx} className={`p-2.5 rounded-lg border flex items-center justify-between ${field.isConsistent
                        ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                        : "bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800"}`}>
                          <div>
                            <span className="text-slate-500 text-[11px] block">{field.fieldName}</span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {typeof field.extractedValue === "number"
                        ? `₹${field.extractedValue.toLocaleString("en-IN")}`
                        : field.extractedValue}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${field.isConsistent
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"}`}>
                              {field.isConsistent ? "Consistent" : "Discrepancy"}
                            </span>
                            {field.mismatchNote && (<p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 max-w-xs font-sans">
                                {field.mismatchNote}
                              </p>)}
                          </div>
                        </div>))}
                    </div>) : (<p className="text-slate-400 text-center py-4">Standard Treasury Ledger Record</p>)}
                </div>)}
            </div>
          </div>

          {/* Right: AI Findings & Models */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-600"/>
                AI Verification Findings
              </h3>

              {evidence.findings && evidence.findings.length > 0 ? (<div className="space-y-3">
                  {evidence.findings.map((f) => (<div key={f.id} className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5"/>
                          {f.title}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-rose-600">
                          {Math.round(f.confidence * 100)}% Conf.
                        </span>
                      </div>
                      <p className="text-rose-700/90 dark:text-rose-300/80 leading-relaxed text-[11px]">
                        {f.description}
                      </p>
                      <div className="pt-1 text-[10px] text-slate-400 font-mono">
                        Model: {f.modelUsed}
                      </div>
                    </div>))}
                </div>) : (<div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600"/> Verification Passed
                  </p>
                  <p className="text-[11px]">No anomalous discrepancies or perceptual reuse detected in this artifact.</p>
                </div>)}
            </div>
          </div>
        </div>

        {/* Cryptographic Provenance Ledger Strip */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-600"/>
            Immutable Audit Provenance
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Source System</span>
              <span className="font-bold text-slate-900 dark:text-white">{evidence.provenance.sourceSystem}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Uploaded By</span>
              <span className="font-bold text-slate-900 dark:text-white">{evidence.provenance.uploaderRole} ({evidence.provenance.uploaderId})</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Uploaded Timestamp</span>
              <span className="font-bold text-slate-900 dark:text-white">{formatDateTime(evidence.provenance.uploadedAt)}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">SHA-256 Fingerprint</span>
              <span className="font-mono text-[10px] text-slate-600 dark:text-slate-300 truncate block">
                {evidence.provenance.sha256Hash || "8c6976e5b5410415..."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>);
}
