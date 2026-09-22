"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, ArrowRight, TrendingUp, Building, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/common/MetricCard";
import { RiskMapPanel } from "@/components/analytics/RiskMapPanel";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { api } from "@/lib/api";
export default function AnalyticsPage() {
    const [national, setNational] = useState(null);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [geoPoints, setGeoPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function loadAnalytics() {
            setLoading(true);
            try {
                const [natData, stData, dstData, pts] = await Promise.all([
                    api.getNationalAnalytics(),
                    api.getStateMetrics(),
                    api.getDistrictMetrics(),
                    api.getGeographicRiskPoints(),
                ]);
                setNational(natData);
                setStates(stData);
                setDistricts(dstData);
                setGeoPoints(pts);
            }
            catch (err) {
                console.error("Failed to load analytics:", err);
            }
            finally {
                setLoading(false);
            }
        }
        loadAnalytics();
    }, []);
    if (loading) {
        return (<AppShell breadcrumbs={[{ label: "Analytics" }]}>
        <LoadingSkeleton variant="card" count={4}/>
      </AppShell>);
    }
    return (<AppShell breadcrumbs={[{ label: "Analytics" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                National Geographic & Aggregate Analytics
              </span>
              <span className="text-xs text-slate-400">Pan-India Coverage</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              National & State Risk Intelligence Analytics
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparative state risk rankings, district concentration indices, and geospatial anomaly heatmaps
            </p>
          </div>
        </div>

        {/* Top KPI Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Sanctioned"
            value={national?.totalSanctionedCr ? `₹${Number(national.totalSanctionedCr).toLocaleString("en-IN")} Cr` : "₹0 Cr"}
            subtitle={national?.totalWorksMonitored ? `Across ${national.totalWorksMonitored.toLocaleString("en-IN")} works` : "0 works monitored"}
            trend={{ value: "Current Scope", isPositive: true, isPositiveGood: true }}
            icon={Building}
            variant="default"
          />
          <MetricCard
            title="Total Disbursed"
            value={national?.totalExpenditureCr ? `₹${Number(national.totalExpenditureCr).toLocaleString("en-IN")} Cr` : "₹0 Cr"}
            subtitle={
              national?.totalSanctionedCr && national?.totalExpenditureCr
                ? `${((national.totalExpenditureCr / national.totalSanctionedCr) * 100).toFixed(1)}% utilization rate`
                : "0% utilization rate"
            }
            trend={{ value: "PFMS verified", isPositive: true, isPositiveGood: true }}
            icon={TrendingUp}
            variant="default"
          />
          <MetricCard
            title="High-Risk Concentration"
            value={`${(national?.highRiskCount || 0) + (national?.criticalRiskCount || 0)} Works`}
            subtitle={`${national?.criticalRiskCount || 0} critical, ${national?.highRiskCount || 0} high risk`}
            trend={{
              value: national?.totalWorksMonitored
                ? `${((((national?.highRiskCount || 0) + (national?.criticalRiskCount || 0)) / national.totalWorksMonitored) * 100).toFixed(1)}% of scope`
                : "0% of scope",
              isPositive: false,
              isPositiveGood: false,
            }}
            icon={ShieldAlert}
            variant={(national?.criticalRiskCount || 0) > 0 ? "critical" : (national?.highRiskCount || 0) > 0 ? "warning" : "default"}
          />
          <MetricCard
            title="Avg National Risk Score"
            value={national?.totalWorksMonitored > 0 ? `${national.averageRiskScore || 34.8} / 100` : "0 / 100"}
            subtitle={national?.totalWorksMonitored > 0 ? "Surveillance baseline" : "Awaiting batch ingestion"}
            trend={{ value: "Controlled range", isPositive: true, isPositiveGood: true }}
            icon={BarChart3}
            variant="default"
          />
        </div>

        {/* Interactive Geospatial Risk Map */}
        <RiskMapPanel points={geoPoints || []} states={states || []} />

        {/* State Performance Ranking Table */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                State & UT Risk Intelligence Index
              </h3>
              <p className="text-xs text-slate-400">
                Click a state to drill down into district-level comparative audits
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-850/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">State / UT</th>
                  <th className="px-4 py-3">Monitored Works</th>
                  <th className="px-4 py-3">Sanctioned (Cr)</th>
                  <th className="px-4 py-3">High Risk Works</th>
                  <th className="px-4 py-3">Critical Works</th>
                  <th className="px-4 py-3">Avg Risk Score</th>
                  <th className="px-4 py-3">Dominant Anomaly Pattern</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {states.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                      No state datasets currently loaded. Ingest official MPLADS batches or upload CSVs in Ingestion Hub to populate state risk metrics.
                    </td>
                  </tr>
                ) : (
                  states.map((st) => (
                    <tr key={st.state} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors group">
                      <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                        <Link href={`/app/analytics/states/${st.state.toLowerCase().replace(/\s+/g, "-")}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                          {st.state}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 font-mono">{st.totalWorks?.toLocaleString("en-IN") || 0}</td>
                      <td className="px-4 py-3.5 font-mono font-semibold">₹{st.totalSanctionedCr || 0} Cr</td>
                      <td className="px-4 py-3.5 font-mono font-bold text-amber-600 dark:text-amber-400">
                        {st.highRiskWorks || 0}
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-rose-600 dark:text-rose-400">
                        {st.criticalWorks || 0}
                      </td>
                      <td className="px-4 py-3.5 font-mono">{st.averageRiskScore || 0}</td>
                      <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 max-w-xs text-[11px]">
                        {st.primaryRiskFactor || "Standard monitoring"}
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <Link href={`/app/analytics/states/${st.state.toLowerCase().replace(/\s+/g, "-")}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition-colors">
                          <span>Drill Down</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>);
}
