import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
export const MetricCard = ({ title, value, subtitle, trend, icon: Icon, variant = "default", className = "", onClick, }) => {
    const variantStyles = {
        default: {
            border: "border-slate-200/80 dark:border-slate-800",
            iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
            glow: "hover:border-slate-300 dark:hover:border-slate-700",
        },
        critical: {
            border: "border-rose-200/80 dark:border-rose-900/50",
            iconBg: "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400",
            glow: "hover:border-rose-400 dark:hover:border-rose-700",
        },
        warning: {
            border: "border-amber-200/80 dark:border-amber-900/50",
            iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
            glow: "hover:border-amber-400 dark:hover:border-amber-700",
        },
        success: {
            border: "border-emerald-200/80 dark:border-emerald-900/50",
            iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
            glow: "hover:border-emerald-400 dark:hover:border-emerald-700",
        },
    }[variant];
    return (<div onClick={onClick} className={`relative p-5 rounded-2xl bg-white dark:bg-slate-900 border ${variantStyles.border} ${variantStyles.glow} shadow-sm transition-all duration-200 ${onClick ? "cursor-pointer hover:shadow-md active:scale-[0.99]" : ""} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className={`p-2.5 rounded-xl shrink-0 ${variantStyles.iconBg}`}>
          <Icon className="w-5 h-5"/>
        </div>
      </div>

      {(subtitle || trend) && (<div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-800/80">
          {subtitle && (<span className="text-slate-500 dark:text-slate-400 truncate">
              {subtitle}
            </span>)}
          {trend && (<span className={`inline-flex items-center gap-1 font-semibold ${trend.isPositive
                    ? trend.isPositiveGood
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    : trend.isPositiveGood
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-emerald-600 dark:text-emerald-400"}`}>
              {trend.isPositive ? (<TrendingUp className="w-3.5 h-3.5"/>) : (<TrendingDown className="w-3.5 h-3.5"/>)}
              {trend.value}
            </span>)}
        </div>)}
    </div>);
};
