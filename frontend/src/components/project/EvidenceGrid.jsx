import React from "react";
import Link from "next/link";
import { FileText, Camera, BadgeIndianRupee, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
export const EvidenceGrid = ({ evidenceList, className = "", }) => {
    return (<div className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Attached Project Evidence & Verification
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically fingerprinted documents, site photographs, and PFMS treasury records
          </p>
        </div>
        <Link href="/app/evidence" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
          <span>All Evidence ({evidenceList.length})</span>
          <ArrowRight className="w-3.5 h-3.5"/>
        </Link>
      </div>

      {/* Grid of Evidence Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {evidenceList.map((e) => {
            const typeIcon = {
                image: Camera,
                document: FileText,
                payment: BadgeIndianRupee,
                certificate: CheckCircle2,
                inspection: FileText,
                gps: MapPin,
                report: FileText,
            }[e.type] || FileText;
            const Icon = typeIcon;
            const statusStyles = {
                verified: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
                conflict: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800",
                review: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800",
                missing: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
            }[e.status];
            return (<Link key={e.id} href={`/app/evidence/${e.id}`} className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 bg-slate-50/50 dark:bg-slate-850/40 transition-all flex flex-col justify-between group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    <Icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"/>
                    <span>{e.id}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusStyles}`}>
                    {e.status}
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {e.title}
                </p>
              </div>

              {/* Footer info */}
              <div className="pt-2 mt-2 border-t border-slate-200/60 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                <span>{e.provenance.sourceSystem.split(" ")[0]}</span>
                <span>{e.fileSize || "Verified Record"}</span>
              </div>
            </Link>);
        })}
      </div>
    </div>);
};
