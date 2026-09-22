"""
Module 5: Cost Anomaly AI
Responsibilities: Statistical outlier detection (Isolation Forest, IQR, Z-Score, MAD) for cost inflation/deflation.
"""

from typing import List, Optional
from models.schemas import CanonicalWorkProfile, AnomalySignal
from services.financial_anomaly_detector import FinancialAnomalyDetector


class CostAnomalyAI:
    """Module 5: Evaluates cost anomalies across unit rates, CPWD baselines, and multi-dimensional IsolationForest."""

    @classmethod
    def evaluate_cost(cls, profile: CanonicalWorkProfile, peer_costs: Optional[List[float]] = None) -> List[AnomalySignal]:
        signals = []
        sanc_amt = profile.financials.sanctioned_amount
        median_amt = profile.financials.comparable_median_amount

        if sanc_amt <= 0:
            return signals

        # 1. Direct Ratio / Deviation Check vs Regional Category Median
        if median_amt > 0:
            dev_pct = ((sanc_amt - median_amt) / median_amt) * 100.0
            if dev_pct >= 30.0:
                signals.append(
                    AnomalySignal(
                        signal_id="COST-OUTLIER-INFLATION",
                        dimension="financial",
                        severity="critical" if dev_pct >= 55.0 else "high",
                        module_name="Cost Anomaly AI (CPWD Median Comparison)",
                        score_contribution=min(30.0, dev_pct * 0.45),
                        confidence=0.94,
                        finding=f"Unit cost is +{dev_pct:.1f}% above regional category median",
                        explanation=f"Project sanctioned at ₹{sanc_amt:,.0f} compared to the median baseline of ₹{median_amt:,.0f} in {profile.district}.",
                        citation="CPWD Cost Index & GFR 2017 Rule 149 (Value for Money)",
                    )
                )

        # 2. Multi-Dimensional Unsupervised Tabular Anomaly Detection via IsolationForest
        try:
            profile_data = {
                "financials": {
                    "sanctionedAmount": sanc_amt,
                    "unreconciledGap": profile.financials.unreconciled_gap,
                    "costDeviationPercent": profile.financials.cost_deviation_percent,
                },
                "financialProgress": profile.financial_progress,
                "physicalProgress": profile.physical_progress,
                "divergenceGap": profile.financial_progress - profile.physical_progress,
                "milestones": profile.milestones,
            }
            det_res = FinancialAnomalyDetector.analyze_work(profile_data)
            if det_res["is_anomaly"]:
                signals.append(
                    AnomalySignal(
                        signal_id="COST-ISOLATION-FOREST-MULTI-DIM",
                        dimension="financial",
                        severity="critical" if det_res["decision_score"] < -0.10 else "high",
                        module_name=det_res["model"],
                        score_contribution=det_res["risk_contribution"],
                        confidence=det_res["confidence"],
                        finding=f"Multi-dimensional financial velocity anomaly (Outlier: {det_res['primary_driver']})",
                        explanation=det_res["explanation"],
                        citation="General Financial Rules (GFR) 2017 Rule 130 & Anomaly Partitioning Standard ISO/IEC 22989",
                    )
                )
        except Exception as err:
            pass

        return signals
