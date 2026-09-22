"use client";
import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Building, ShieldAlert, ArrowRight, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/common/MetricCard";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { api } from "@/lib/api";
export default function StateAnalyticsPage({ params }) {
    const resolvedParams = use(params);
    const stateSlug = resolvedParams.state;
    const [stateData, setStateData] = useState(null);
    const [districts, setDistricts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function loadStateInfo() {
            setLoading(true);
            try {
                const st = await api.getStateBySlug(stateSlug);
                setStateData(st);
                const allDistricts = await api.getDistrictMetrics();
                if (st) {
                    setDistricts(allDistricts.filter((d) => d.state.toLowerCase() === st.state.toLowerCase()));
                }
            }
            catch (err) {
                console.error("Failed to load state analytics:", err);
            }
            finally {
                setLoading(false);
            }
        }
        loadStateInfo();
    }, [stateSlug]);
    if (loading) {
        return (<AppShell breadcrumbs={[{ label: "Analytics", href: "/app/analytics" }, { label: stateSlug }]}>
        <LoadingSkeleton variant="card" count={3}/>
      </AppShell>);
    }
    const stateName = stateData?.state || stateSlug;
    return (<AppShell breadcrumbs={[
            { label: "Analytics", href: "/app/analytics" },
            { label: stateName },
        ]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                State Performance Profile
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              {stateName} Risk Analytics
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              District-wise anomaly concentration, agency expenditure patterns, and high-risk case distribution
            </p>
          </div>

          <Link href="/app/analytics" className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft className="w-3.5 h-3.5"/>
            <span>National Overview</span>
          </Link>
        </div>

        {/* Metrics */}
        {stateData && (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Monitored Works" value={stateData.totalWorks.toLocaleString("en-IN")} subtitle="Total state portfolio" trend={{ value: "Active surveillance", isPositive: true, isPositiveGood: true }} icon={Building} variant="default"/>
            <MetricCard title="Total Sanctioned" value={`₹${stateData.totalSanctionedCr} Cr`} subtitle={`₹${stateData.totalExpenditureCr} Cr disbursed`} trend={{ value: "PFMS connected", isPositive: true, isPositiveGood: true }} icon={TrendingUp} variant="default"/>
            <MetricCard title="High / Critical Works" value={`${stateData.highRiskWorks + stateData.criticalWorks}`} subtitle={`${stateData.criticalWorks} critical priority`} trend={{ value: "Prioritized audits", isPositive: true, isPositiveGood: false }} icon={ShieldAlert} variant="critical"/>
            <MetricCard title="State Risk Index" value={`${stateData.averageRiskScore} / 100`} subtitle={stateData.primaryRiskFactor.split(" ")[0]} trend={{ value: "State baseline", isPositive: true, isPositiveGood: true }} icon={Building} variant="default"/>
          </div>)}

        {/* District Breakdown Table */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                District Comparison in {stateName}
              </h3>
              <p className="text-xs text-slate-400">
                Expenditure velocity and milestone delay indices by district jurisdiction
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-850/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">District</th>
                  <th className="px-4 py-3">Total Works</th>
                  <th className="px-4 py-3">Sanctioned (Lakhs)</th>
                  <th className="px-4 py-3">High / Critical</th>
                  <th className="px-4 py-3">Delayed Works (%)</th>
                  <th className="px-4 py-3">Avg Risk Score</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {districts.map((d) => (<tr key={d.district} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors group">
                    <td className="px-4 py-3.5 font-sans font-bold text-slate-900 dark:text-white">
                      {d.district}
                    </td>
                    <td className="px-4 py-3.5">{d.totalWorks}</td>
                    <td className="px-4 py-3.5">₹{d.totalSanctionedLakhs.toLocaleString("en-IN")} L</td>
                    <td className="px-4 py-3.5 font-bold text-rose-600 dark:text-rose-400">
                      {d.highRiskWorks + d.criticalWorks} ({d.criticalWorks} Crit.)
                    </td>
                    <td className="px-4 py-3.5 text-amber-600 font-bold">{d.delayedWorksPercent}%</td>
                    <td className="px-4 py-3.5">{d.averageRiskScore}</td>
                    <td className="px-4 py-3.5 text-right font-sans whitespace-nowrap">
                      <Link href={`/app/projects?state=${encodeURIComponent(d.state)}&district=${encodeURIComponent(d.district)}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition-colors">
                        <span>View Projects</span>
                        <ArrowRight className="w-3.5 h-3.5"/>
                      </Link>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>);
}
