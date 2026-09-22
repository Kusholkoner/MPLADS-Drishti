import React from "react";
import { ShieldAlert, AlertTriangle, FileText, Lock } from "lucide-react";
export const EvidenceChain = ({ chain, className = "" }) => {
    return (<div className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Investigation Evidence Chain
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Traceable linear progression from automated AI risk trigger to authoritative ground records
          </p>
        </div>
      </div>

      {/* Linear Step Flow */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {chain.map((node, idx) => {
            const stepIcon = {
                risk: ShieldAlert,
                signal: AlertTriangle,
                claim: FileText,
                evidence: FileText,
                source: Lock,
            }[node.step] || FileText;
            const Icon = stepIcon;
            const statusColor = {
                flagged: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800",
                conflict: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800",
                verified: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800",
            }[node.status];
            return (<div key={idx} className="relative group">
              {/* Dot Icon on Timeline */}
              <div className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${statusColor}`}>
                <Icon className="w-3 h-3"/>
              </div>

              {/* Node Card */}
              <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Step {idx + 1}: {node.step}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    {node.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {node.title}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {node.subtitle}
                </p>
                {node.details && (<p className="text-[11px] text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-800/80">
                    {node.details}
                  </p>)}
              </div>
            </div>);
        })}
      </div>
    </div>);
};
