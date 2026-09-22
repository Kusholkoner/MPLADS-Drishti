"use client";
import React from "react";
import Link from "next/link";
import { X, ShieldAlert, AlertTriangle, FileText, CheckCircle2, Clock } from "lucide-react";
import { formatRelativeTime } from "@/lib/formatters";
export const NotificationDrawer = ({ isOpen, onClose }) => {
    if (!isOpen)
        return null;
    const notifications = [
        {
            id: "NOTIF-01",
            title: "Critical Risk Escalation: MPL-004821",
            description: "Financial/physical progress divergence gap widened to 36% with 99.4% perceptual image reuse match.",
            type: "critical",
            href: "/app/projects/MPL-004821",
            time: "2026-08-28T14:32:00Z",
            icon: ShieldAlert,
        },
        {
            id: "NOTIF-02",
            title: "Potential Duplicate Scope Flagged",
            description: "NLP SBERT engine detected 91.2% similarity between MPL-004821 and MPL-004822 in New Delhi.",
            type: "warning",
            href: "/app/risk/duplicates",
            time: "2026-08-28T14:30:00Z",
            icon: AlertTriangle,
        },
        {
            id: "NOTIF-03",
            title: "Investigation Case Assigned",
            description: "CASE-2026-00128 assigned to Senior Audit Officer Shri Rajesh Verma for priority review.",
            type: "info",
            href: "/app/investigations/CASE-2026-00128",
            time: "2026-08-28T14:40:00Z",
            icon: FileText,
        },
        {
            id: "NOTIF-04",
            title: "Advance Fund Disbursement Alert",
            description: "Project MPL-005104 (Varanasi) has ₹23.4 L unreconciled equipment advance with 64-day delay.",
            type: "warning",
            href: "/app/projects/MPL-005104",
            time: "2026-08-28T12:15:00Z",
            icon: Clock,
        },
        {
            id: "NOTIF-05",
            title: "Milestone Compliance Verified",
            description: "Primary Health Center MPL-006219 passed automated AI geotag and milestone verification.",
            type: "success",
            href: "/app/projects/MPL-006219",
            time: "2026-08-28T11:00:00Z",
            icon: CheckCircle2,
        },
    ];
    return (<div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Sentinel Intelligence Alerts
            </h3>
            <p className="text-xs text-slate-400">
              Live automated screening feed
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600">
            <X className="w-4 h-4"/>
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100 dark:divide-slate-800/60">
          {notifications.map((n) => {
            const Icon = n.icon;
            const iconStyles = {
                critical: "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400",
                warning: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
                info: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
                success: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
            }[n.type];
            return (<Link key={n.id} href={n.href} onClick={onClose} className="pt-3 first:pt-0 flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group block">
                <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${iconStyles}`}>
                  <Icon className="w-4 h-4"/>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {n.title}
                    </p>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                      {formatRelativeTime(n.time)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {n.description}
                  </p>
                </div>
              </Link>);
        })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex justify-between items-center text-xs text-slate-400">
          <span>5 New Anomaly Signals</span>
          <Link href="/app/risk" onClick={onClose} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            View All in Risk Hub →
          </Link>
        </div>
      </div>
    </div>);
};
