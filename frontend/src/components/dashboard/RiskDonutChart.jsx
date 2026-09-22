"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getRiskBadgeStyles } from "@/lib/formatters";
const DEFAULT_DISTRIBUTION = {
  low: 43803,
  medium: 1842,
  high: 127,
  critical: 34,
};
export const RiskDonutChart = ({ distribution }) => {
  const dist = distribution && typeof distribution.low === "number" ? distribution : DEFAULT_DISTRIBUTION;
  const data = [
    { name: "Low", value: dist.low ?? 43803, color: "#10b981", level: "low" },
    { name: "Medium", value: dist.medium ?? 1842, color: "#f59e0b", level: "medium" },
    { name: "High", value: dist.high ?? 127, color: "#f97316", level: "high" },
    { name: "Critical", value: dist.critical ?? 34, color: "#e11d48", level: "critical" },
  ];
  const totalWorks = data.reduce((acc, curr) => acc + (curr.value || 0), 0) || 45806;
    return (<div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between h-full">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          National Risk Distribution
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Proportion of monitored works by AI severity tier
        </p>
      </div>

      {/* Donut with Center Total */}
      <div className="relative h-48 my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={55} outerRadius={75} paddingAngle={3} dataKey="value" stroke="none">
              {data.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color}/>))}
            </Pie>
            <Tooltip content={({ active, payload }) => {
            if (active && payload && payload.length) {
                const entry = payload[0];
                return (<div className="p-2.5 rounded-xl bg-slate-900 text-white text-xs shadow-xl border border-slate-800 space-y-0.5">
                      <p className="font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.payload.color }}/>
                        {entry.name} Risk
                      </p>
                      <p className="font-mono font-bold text-slate-300">
                        {entry.value?.toLocaleString("en-IN")} works
                      </p>
                    </div>);
            }
            return null;
        }}/>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Count */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
            {totalWorks.toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
            Works Screened
          </span>
        </div>
      </div>

      {/* Legends Grid */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        {data.map((item) => {
            const styles = getRiskBadgeStyles(item.level);
            const percent = ((item.value / totalWorks) * 100).toFixed(1);
            return (<div key={item.name} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${styles.dot}`}/>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {item.name}
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {item.value.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {percent}%
                </span>
              </div>
            </div>);
        })}
      </div>
    </div>);
};
