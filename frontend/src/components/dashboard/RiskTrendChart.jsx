"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ShieldAlert, Sparkles } from "lucide-react";

const DEFAULT_TREND_DATA = [
  { month: "Sep 2025", screenedWorks: 12400, flaggedAnomalies: 48, avgRiskScore: 24.2 },
  { month: "Oct 2025", screenedWorks: 14100, flaggedAnomalies: 62, avgRiskScore: 26.5 },
  { month: "Nov 2025", screenedWorks: 15300, flaggedAnomalies: 79, avgRiskScore: 28.1 },
  { month: "Dec 2025", screenedWorks: 16200, flaggedAnomalies: 95, avgRiskScore: 30.4 },
  { month: "Jan 2026", screenedWorks: 17100, flaggedAnomalies: 114, avgRiskScore: 31.8 },
  { month: "Feb 2026", screenedWorks: 17800, flaggedAnomalies: 138, avgRiskScore: 33.2 },
  { month: "Mar 2026", screenedWorks: 18200, flaggedAnomalies: 152, avgRiskScore: 34.0 },
  { month: "Apr 2026", screenedWorks: 18432, flaggedAnomalies: 161, avgRiskScore: 34.8 },
];

export const RiskTrendChart = ({ data }) => {
  const [timeRange, setTimeRange] = useState("1Y");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Robust data normalization to handle both legacy and backend monthlyTrends shapes
  const normalizedData = useMemo(() => {
    const rawList = Array.isArray(data) && data.length > 0 ? data : DEFAULT_TREND_DATA;
    return rawList.map((d, index) => {
      const month = d.month || d.date || `P-${index + 1}`;
      const screened = Number(d.screenedWorks ?? d.totalAssessed ?? 100);
      const flagged = Number(d.flaggedAnomalies ?? d.highRisk ?? d.flaggedCount ?? 0);
      const riskScore = Number(
        d.avgRiskScore ??
          (d.highRisk && d.totalAssessed
            ? Math.min(100, Math.round((d.highRisk / d.totalAssessed) * 100 + 20))
            : 32.5)
      );
      const anomalyRate = screened > 0 ? +((flagged / screened) * 100).toFixed(1) : 0;

      return {
        month,
        screened,
        flagged,
        riskScore,
        anomalyRate,
      };
    });
  }, [data]);

  // Dynamic calculation of total flagged events instead of hardcoding
  const totalFlaggedCount = useMemo(() => {
    return normalizedData.reduce((acc, curr) => acc + curr.flagged, 0);
  }, [normalizedData]);

  const displayData = useMemo(() => {
    if (timeRange === "7D") return normalizedData.slice(-3);
    if (timeRange === "30D") return normalizedData.slice(-4);
    if (timeRange === "3M") return normalizedData.slice(-6);
    return normalizedData;
  }, [normalizedData, timeRange]);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between h-full min-h-[360px]">
      {/* Header with Dynamic Metric & Range Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              Risk Screening & Anomaly Velocity
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800 flex items-center gap-1 font-mono">
              <ShieldAlert className="w-3 h-3 shrink-0" />
              {totalFlaggedCount > 0
                ? `${totalFlaggedCount.toLocaleString("en-IN")} Flagged Total`
                : "Active Stream"}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated multi-vector AI screening velocity and anomaly incidence rate
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 self-start sm:self-auto">
          {["7D", "30D", "3M", "1Y"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                timeRange === range
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container with SSR Mount Guard */}
      <div className="h-64 w-full relative">
        {!mounted ? (
          <div className="h-full w-full flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/40 animate-pulse text-xs text-slate-400">
            Initializing Surveillance Metrics...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={displayData}
              margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="flaggedBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="screenedBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                className="dark:opacity-10"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0", className: "dark:stroke-slate-800" }}
              />

              {/* Left Y-Axis: Volumes */}
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
              />

              {/* Right Y-Axis: Risk Score (0 - 100) */}
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}`}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const row = payload[0]?.payload;
                    return (
                      <div className="p-3 rounded-xl bg-slate-900/95 backdrop-blur-md text-white text-xs shadow-xl border border-slate-700 space-y-1.5 min-w-[190px]">
                        <p className="font-bold text-slate-200 border-b border-slate-700/80 pb-1 flex items-center justify-between">
                          <span>{label}</span>
                          <span className="text-[10px] font-mono text-slate-400">
                            Rate: {row?.anomalyRate}%
                          </span>
                        </p>
                        <div className="flex items-center justify-between text-blue-400 font-mono">
                          <span className="text-slate-300">Screened Works:</span>
                          <span className="font-bold">
                            {row?.screened?.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-rose-400 font-mono">
                          <span className="text-slate-300">Flagged Anomalies:</span>
                          <span className="font-bold">
                            {row?.flagged?.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-purple-400 font-mono">
                          <span className="text-slate-300">Composite Risk Index:</span>
                          <span className="font-bold">{row?.riskScore}/100</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Bars: Screened Works Volume */}
              <Bar
                yAxisId="left"
                dataKey="screened"
                fill="url(#screenedBarGradient)"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
                name="Screened Works"
              />

              {/* Bars: Flagged Anomalies */}
              <Bar
                yAxisId="left"
                dataKey="flagged"
                fill="url(#flaggedBarGradient)"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
                name="Flagged Anomalies"
              />

              {/* Spline: Risk Score Index */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="riskScore"
                stroke="#a855f7"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#a855f7", strokeWidth: 1, stroke: "#ffffff" }}
                activeDot={{ r: 6, fill: "#c084fc" }}
                name="Composite Risk Index"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer / Legend */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800 gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500/40 border border-blue-500" />
            Screened Works
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
            Flagged Anomalies
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-purple-500" />
            Composite Risk Index
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Multi-Vector AI Velocity
        </span>
      </div>
    </div>
  );
};

export default RiskTrendChart;
