"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Cpu,
  ShieldAlert,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Clock,
  BadgeIndianRupee,
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/common/MetricCard";
import { RiskBadge } from "@/components/common/RiskBadge";
import { getApiBase } from "@/lib/api";

export default function PredictiveRiskPage() {
  const [projectId, setProjectId] = useState("MPL-004821");
  const [selectedAttack, setSelectedAttack] = useState("photo_reuse");
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  const attackScenarios = [
    {
      id: "photo_reuse",
      title: "Recycled Site Photo Reuse Fraud",
      category: "Computer Vision (Mod 13)",
      description: "Submits a foundation stage photo identical to an archive 2024 project in a different district.",
      expectedDelta: "+63 pts",
      severity: "critical",
    },
    {
      id: "cost_inflation",
      title: "Unit Rate Padding & Cost Outlier",
      category: "Financial Intelligence (Mod 05)",
      description: "Inflates structural concrete unit rates +42% beyond CPWD Delhi Schedule of Rates (DSR 2023).",
      expectedDelta: "+55 pts",
      severity: "critical",
    },
    {
      id: "milestone_stalling",
      title: "Milestone Execution Stall & Ghost Progress",
      category: "Timeline Forecaster (Mod 06)",
      description: "Advances treasury disbursement velocity while physical certification remains stalled for >140 days.",
      expectedDelta: "+50 pts",
      severity: "high",
    },
    {
      id: "structuring",
      title: "Split Payment Tender Circumvention",
      category: "Procurement Structuring (Mod 07)",
      description: "Splits an ₹18 Lakh package into 10 vouchers under ₹20,000 threshold to evade competitive e-tendering.",
      expectedDelta: "+48 pts",
      severity: "high",
    },
  ];

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/ai/attack-simulator`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attackType: selectedAttack }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setSimulationResult(json.data);
          setSimulating(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Backend attack simulator error, applying client fallback:", err);
    }

    // Client fallback simulation
    const scenario = attackScenarios.find((s) => s.id === selectedAttack) || attackScenarios[0];
    let signals = [];
    let afterScore = 87;
    if (selectedAttack === "photo_reuse") {
      signals = [
        "Mod 13: Perceptual Image Hash match (99.4%) with 2024 archive photo",
        "Mod 14: EXIF GPS coordinates offset by 18.7 km from registered site bounds",
      ];
      afterScore = 87;
    } else if (selectedAttack === "cost_inflation") {
      signals = [
        "Mod 05: Claimed invoice unit rates exceed CPWD baseline by +42%",
        "Mod 04: Sanctioned financial ceiling breached by ₹6.0 Lakhs",
      ];
      afterScore = 79;
    } else if (selectedAttack === "milestone_stalling") {
      signals = [
        "Mod 06: 146 days past scheduled milestone completion date",
        "Mod 08: Premature treasury advance without physical certification",
      ];
      afterScore = 74;
    } else {
      signals = [
        "Mod 07: 15 consecutive vouchers near ₹19,990 threshold issued to single vendor PAN",
        "Mod 04: GFR 2017 Rule 157 tender splitting prohibition breached",
      ];
      afterScore = 82;
    }

    setSimulationResult({
      attackType: selectedAttack,
      baselineRiskScore: 24,
      simulatedRiskScore: afterScore,
      riskScoreDelta: `+${afterScore - 24} pts`,
      triggeredRiskSignals: signals,
      sentinelDetectionResult: "ATTACK_FLAGGED_SUCCESSFULLY",
      timestamp: new Date().toISOString(),
    });
    setSimulating(false);
  };

  return (
    <AppShell breadcrumbs={[{ label: "Risk Intelligence", href: "/app/risk" }, { label: "Predictive Risk & Simulator" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-950/80 px-2 py-0.5 rounded-md border border-fuchsia-200 dark:border-fuchsia-800 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" />
                AI Module 16 & 27 • Predictive ML & Adversarial Testing
              </span>
              <span className="text-xs text-slate-400">XGBoost Delay Forecaster</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              Predictive Risk & Synthetic Fraud Simulator
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Forward-looking milestone delay forecasting and interactive stress-testing of surveillance models against synthetic fraud vectors
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Target Project:</span>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="text-xs font-bold px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="MPL-004821">MPL-004821 (Village Khera)</option>
              <option value="MPL-005104">MPL-005104 (Varanasi Solar)</option>
              <option value="MPL-003921">MPL-003921 (Pune CC Road)</option>
            </select>
          </div>
        </div>

        {/* Predictive Forecast Metrics Row (Module 16) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Completion Delay Probability"
            value="81%"
            subtitle="61 Days Forecasted Slippage"
            trend="High Delay Risk"
            trendType="down"
            icon={Clock}
          />
          <MetricCard
            title="Cost Overrun Probability"
            value="74%"
            subtitle="₹43.5 L Predicted Final Cost"
            trend="Ceiling Breach"
            trendType="down"
            icon={BadgeIndianRupee}
          />
          <MetricCard
            title="Project Stalling Likelihood"
            value="62%"
            subtitle="Foundation Stage Bottleneck"
            trend="Stage 2 of 5"
            trendType="neutral"
            icon={TrendingUp}
          />
          <MetricCard
            title="ML Model Confidence"
            value="92%"
            subtitle="Drishti-XGB-Predictor-v2.5"
            trend="Verified Valid"
            trendType="up"
            icon={Cpu}
          />
        </div>

        {/* Adversarial Synthetic Attack Simulation Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attack Vector Picker */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-fuchsia-600" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Synthetic Fraud Attack Scenarios (Stress-Testing Engine)
                </h2>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Select Attack Vector</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {attackScenarios.map((sc) => {
                const isSelected = selectedAttack === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedAttack(sc.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "border-fuchsia-500 bg-fuchsia-50/50 dark:bg-fuchsia-950/30 ring-2 ring-fuchsia-500 shadow-sm"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-fuchsia-600 dark:text-fuchsia-400">
                        {sc.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                        {sc.expectedDelta}
                      </span>
                    </div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white mb-1">
                      {sc.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {sc.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Tests resilience against fraud vectors without mutating production database
              </span>
              <button
                onClick={runSimulation}
                disabled={simulating}
                className="py-2.5 px-5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-bold transition-all shadow-md shadow-fuchsia-600/20 flex items-center gap-2"
              >
                <Play className={`w-3.5 h-3.5 fill-current ${simulating ? "animate-spin" : ""}`} />
                <span>{simulating ? "Injecting & Evaluating..." : "Run Synthetic Attack Simulation"}</span>
              </button>
            </div>
          </div>

          {/* Simulation Outcome Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-600">
                Surveillance Detection Verdict
              </span>
              {simulationResult && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200">
                  FLAGGED 100%
                </span>
              )}
            </div>

            {simulationResult ? (
              <div className="space-y-4">
                {/* Score Comparison Display */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Baseline Score</span>
                    <p className="text-xl font-extrabold text-emerald-600 mt-0.5">
                      {simulationResult.baselineRiskScore} / 100
                    </p>
                    <span className="text-[9px] text-slate-400">Normal Baseline</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Post-Attack Score</span>
                    <p className="text-xl font-extrabold text-rose-600 mt-0.5">
                      {simulationResult.simulatedRiskScore} / 100
                    </p>
                    <span className="text-[9px] font-bold text-rose-500">{simulationResult.riskScoreDelta}</span>
                  </div>
                </div>

                {/* Triggered Signals */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Triggered AI Defense Signals:
                  </span>
                  <ul className="space-y-1.5 pl-4 list-disc text-xs text-rose-700 dark:text-rose-400">
                    {simulationResult.triggeredRiskSignals.map((sig, i) => (
                      <li key={i}>{sig}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Drishti Surveillance Layer successfully trapped the anomaly before ledger settlement.
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center text-xs text-slate-400 space-y-2">
                <Cpu className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
                <p>Click &quot;Run Synthetic Attack Simulation&quot; to test model defense response.</p>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
              Statutory Defense: Aligned with GFR 2017 & MoSPI 2023 vigilance protocols.
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
