"use client";
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { MapPin, ArrowRight, Filter, AlertTriangle, ShieldCheck, Layers, ExternalLink } from "lucide-react";
import { RiskBadge } from "../common/RiskBadge";
import { formatIndianCurrency } from "@/lib/formatters";

export const RiskMapPanel = ({ points = [], states = [], className = "" }) => {
  const [selectedPoint, setSelectedPoint] = useState(points[0] || null);
  const [stateFilter, setStateFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  // Keep selected point in sync if points update
  useEffect(() => {
    if (points.length > 0) {
      if (!selectedPoint || !points.some((p) => p.id === selectedPoint.id)) {
        setSelectedPoint(points[0]);
      }
    } else {
      setSelectedPoint(null);
    }
  }, [points]);

  // Calibrated geographic projection for the Vemaps India State Boundaries Map (624 x 468 px, 4:3)
  // Geographic extents of India landmass:
  // Longitude: 68.11° E (Gujarat west) to 97.40° E (Arunachal east) -> X: 116px to 507px
  // Latitude:  37.10° N (Ladakh north) to 8.08° N (Kanyakumari south) -> Y: 24px to 425px
  const getCoordinates = (lat, lon) => {
    const clampedLon = Math.max(68.11, Math.min(97.40, Number(lon) || 77.2));
    const clampedLat = Math.max(8.08, Math.min(37.10, Number(lat) || 28.6));

    const xPx = 116 + ((clampedLon - 68.11) / (97.40 - 68.11)) * (507 - 116);
    const yPx = 24 + ((37.10 - clampedLat) / (37.10 - 8.08)) * (425 - 24);

    return {
      x: `${((xPx / 624) * 100).toFixed(2)}%`,
      y: `${((yPx / 468) * 100).toFixed(2)}%`,
    };
  };

  // Unique list of states for filter dropdown
  const availableStates = useMemo(() => {
    const list = new Set();
    points.forEach((p) => {
      if (p.state) list.add(p.state);
    });
    if (list.size === 0 && Array.isArray(states)) {
      states.forEach((s) => {
        if (s.state) list.add(s.state);
      });
    }
    return Array.from(list).sort();
  }, [points, states]);

  // Filtered points
  const filteredPoints = useMemo(() => {
    return points.filter((p) => {
      if (stateFilter !== "all" && p.state?.toLowerCase() !== stateFilter.toLowerCase()) {
        return false;
      }
      if (riskFilter !== "all" && p.riskLevel?.toLowerCase() !== riskFilter.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [points, stateFilter, riskFilter]);

  const criticalCount = useMemo(() => points.filter((p) => p.riskLevel === "critical").length, [points]);
  const highCount = useMemo(() => points.filter((p) => p.riskLevel === "high").length, [points]);
  const normalCount = useMemo(() => points.filter((p) => p.riskLevel === "low" || p.riskLevel === "medium").length, [points]);

  return (
    <div className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 ${className}`}>
      {/* Header with Title & Legend */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              National Geospatial Project Risk Map
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Geographic anomaly concentration across monitored constituencies mapped on official Indian state boundaries
          </p>
        </div>

        {/* Severity Legend Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setRiskFilter(riskFilter === "critical" ? "all" : "critical")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all text-xs font-medium ${
              riskFilter === "critical"
                ? "bg-rose-600 text-white shadow-sm ring-2 ring-rose-300"
                : "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-600 dark:bg-rose-400 animate-pulse" />
            <span>Critical ({criticalCount})</span>
          </button>

          <button
            onClick={() => setRiskFilter(riskFilter === "high" ? "all" : "high")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all text-xs font-medium ${
              riskFilter === "high"
                ? "bg-amber-600 text-white shadow-sm ring-2 ring-amber-300"
                : "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 hover:bg-amber-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>High ({highCount})</span>
          </button>

          <button
            onClick={() => setRiskFilter(riskFilter === "low" ? "all" : "low")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all text-xs font-medium ${
              riskFilter === "low"
                ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300"
                : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Normal ({normalCount})</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-2 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 dark:text-slate-400 font-medium">State Scope:</span>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All States & UTs ({points.length} Works)</option>
            {availableStates.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <span>
            Displaying <strong className="text-slate-900 dark:text-white font-mono">{filteredPoints.length}</strong> of{" "}
            <strong className="text-slate-900 dark:text-white font-mono">{points.length}</strong> geocoded anomaly points
          </span>
          {(stateFilter !== "all" || riskFilter !== "all") && (
            <button
              onClick={() => {
                setStateFilter("all");
                setRiskFilter("all");
              }}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Interactive Map & Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Map Area */}
        <div className="lg:col-span-8 relative aspect-[4/3] w-full rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center p-3 shadow-inner group">
          {/* Subtle Radar Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-30 dark:opacity-20 pointer-events-none" />

          {/* Calibrated India State Boundaries Map Image (from Vemaps) */}
          <img
            src="/maps/india-states.png"
            alt="National Geospatial Project Risk Map of India"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] transition-opacity"
          />

          {/* Interactive Geospatial Markers Overlay */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            {filteredPoints.map((pt) => {
              const coords = getCoordinates(pt.latitude, pt.longitude);
              const isSelected = selectedPoint?.id === pt.id;
              const isCritical = pt.riskLevel === "critical";
              const isHigh = pt.riskLevel === "high";

              return (
                <button
                  key={pt.id}
                  onClick={() => setSelectedPoint(pt)}
                  style={{ left: coords.x, top: coords.y }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer transition-all duration-200 group/pin ${
                    isSelected ? "z-30 scale-125" : "hover:scale-125 hover:z-20"
                  }`}
                  aria-label={`${pt.projectTitle} - ${pt.riskLevel} risk`}
                >
                  {/* Glowing Radar Pulse for Critical / High Risks */}
                  {isCritical && (
                    <span className="absolute -inset-1.5 rounded-full bg-rose-500/40 animate-ping pointer-events-none" />
                  )}
                  {isHigh && (
                    <span className="absolute -inset-1 rounded-full bg-amber-500/30 animate-pulse pointer-events-none" />
                  )}

                  {/* Marker Pin Icon */}
                  <div
                    className={`relative flex items-center justify-center w-5 h-5 rounded-full shadow-lg transition-transform ${
                      isCritical
                        ? "bg-rose-600 text-white ring-2 ring-rose-400 shadow-rose-950/80"
                        : isHigh
                        ? "bg-amber-500 text-white ring-2 ring-amber-300 shadow-amber-950/80"
                        : "bg-emerald-500 text-white ring-2 ring-emerald-300 shadow-emerald-950/80"
                    } ${isSelected ? "ring-4 ring-white shadow-2xl scale-110" : ""}`}
                  >
                    <MapPin className="w-3 h-3 stroke-[2.5]" />
                  </div>

                  {/* Micro Tooltip on Hover */}
                  <div className="hidden group-hover/pin:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2.5 rounded-xl bg-slate-900/95 backdrop-blur-md text-white text-left shadow-2xl border border-slate-700/80 pointer-events-none z-50">
                    <p className="font-bold text-xs truncate leading-snug">{pt.projectTitle}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {pt.district}, {pt.state}
                    </p>
                    <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-800 text-[10px]">
                      <span
                        className={`font-semibold uppercase ${
                          isCritical ? "text-rose-400" : isHigh ? "text-amber-400" : "text-emerald-400"
                        }`}
                      >
                        {pt.riskLevel} ({pt.riskScore}/100)
                      </span>
                      <span className="font-mono text-slate-300">
                        {formatIndianCurrency(pt.sanctionedAmount)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Empty State Banner if 0 points loaded */}
          {points.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/60 backdrop-blur-[2px] z-20">
              <div className="p-5 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl max-w-sm space-y-3">
                <div className="w-10 h-10 mx-auto rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center ring-1 ring-blue-500/40">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Geospatial Surveillance Standing By</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Zero fake points are plotted. Upload or ingest MPLADS work registers in the Ingestion Hub to detect and pin real geographic risk clusters across India.
                  </p>
                </div>
                <Link
                  href="/app/ingestion"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-sm"
                >
                  <span>Open Ingestion Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Map Footer Metadata & Attribution */}
          <div className="absolute bottom-2.5 left-3 text-[10px] text-slate-600 dark:text-slate-400 font-mono flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Projection: WGS84 Geodetic • Click any pin to inspect anomaly dossier</span>
          </div>

          <div className="absolute bottom-2.5 right-3 text-[10px] text-slate-600 dark:text-slate-400 font-sans font-medium">
            <span>© Vemaps.com</span>
          </div>
        </div>

        {/* Selected Point Inspector Card */}
        <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-4">
          {selectedPoint ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                    {selectedPoint.projectId}
                  </span>
                  <RiskBadge level={selectedPoint.riskLevel} score={selectedPoint.riskScore} size="sm" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 pt-1">
                  {selectedPoint.projectTitle}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedPoint.district}, {selectedPoint.state}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Category:</span>
                  <span className="font-sans font-semibold text-slate-800 dark:text-slate-200">
                    {selectedPoint.category || "Infrastructure"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Sanctioned:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatIndianCurrency(selectedPoint.sanctionedAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Coordinates:</span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300">
                    {selectedPoint.latitude}° N, {selectedPoint.longitude}° E
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-300 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Primary Anomaly Signal:</span>
                </div>
                <p className="text-[11px] text-rose-600 dark:text-rose-400 leading-relaxed">
                  {selectedPoint.primarySignal}
                </p>
              </div>

              <Link
                href={`/app/projects/${selectedPoint.projectId}`}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-sm transition-all"
              >
                <span>Inspect Digital Project Twin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="py-12 px-4 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                No Anomaly Selected
              </h5>
              <p className="text-[11px] text-slate-400 leading-normal">
                {points.length > 0
                  ? "Click on any risk pin on the India map to inspect its real-time digital twin."
                  : "Ingest datasets in Ingestion Hub to analyze geographic risk concentrations."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
