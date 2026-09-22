import React from "react";
export const LoadingSkeleton = ({ variant = "card", count = 1, className = "", }) => {
    if (variant === "card") {
        return (<div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (<div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-shimmer"/>
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl animate-shimmer"/>
            </div>
            <div className="w-36 h-8 bg-slate-200 dark:bg-slate-800 rounded animate-shimmer"/>
            <div className="w-48 h-3 bg-slate-200 dark:bg-slate-800 rounded animate-shimmer"/>
          </div>))}
      </div>);
    }
    if (variant === "table") {
        return (<div className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden ${className}`}>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex gap-4">
          <div className="w-40 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-shimmer"/>
          <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-shimmer"/>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {Array.from({ length: count || 4 }).map((_, i) => (<div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="w-48 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-shimmer"/>
                <div className="w-72 h-3 bg-slate-200 dark:bg-slate-800 rounded animate-shimmer"/>
              </div>
              <div className="w-20 h-6 bg-slate-200 dark:bg-slate-800 rounded-full animate-shimmer"/>
            </div>))}
        </div>
      </div>);
    }
    return (<div className={`space-y-2 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (<div key={i} className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded animate-shimmer"/>))}
    </div>);
};
