import React from "react";
import { FileQuestion } from "lucide-react";
export const EmptyState = ({ title, description, icon: Icon = FileQuestion, action, className = "", }) => {
    return (<div className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 ${className}`}>
      {Icon && (<div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-4">
            <Icon className="w-6 h-6"/>
          </div>)}
      <h3 className="text-sm font-bold text-slate-800 dark:text-white">
        {title}
      </h3>
      {description && (<p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          {description}
        </p>)}
      {action && (<button onClick={action.onClick} className="mt-5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:bg-blue-700 transition-all shadow-sm">
          {action.label}
        </button>)}
    </div>);
};
