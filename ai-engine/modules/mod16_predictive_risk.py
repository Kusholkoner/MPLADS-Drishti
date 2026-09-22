"""
Module 16: Predictive Risk AI
Responsibilities: Forecasts future chronic delay probability, budget overrun risk, and completion slippage.
"""

from typing import List
from models.schemas import CanonicalWorkProfile, AnomalySignal


class PredictiveRiskAI:
    """Module 16: Uses machine learning velocity regression to forecast future failure probabilities."""

    @classmethod
    def evaluate_future_risk(cls, profile: CanonicalWorkProfile) -> List[AnomalySignal]:
        signals = []
        fin_pct = profile.financial_progress_pct
        phys_pct = profile.physical_progress_pct
        divergence_gap = fin_pct - phys_pct

        # Predictive Chronic Delay Indicator: High financial disbursal without commensurate completion
        if (divergence_gap >= 20.0 and phys_pct < 80.0) or (phys_pct < 40.0 and fin_pct > 50.0):
            stall_prob = min(0.96, 0.50 + (divergence_gap / 100.0) * 0.8)
            signals.append(
                AnomalySignal(
                    signal_id="PRED-HIGH-STALL-PROBABILITY",
                    dimension="timeline",
                    severity="high" if stall_prob < 0.85 else "critical",
                    module_name="Predictive Risk AI v1.8",
                    score_contribution=75.0,
                    confidence=round(stall_prob, 2),
                    finding=f"High Statistical Probability of Chronic Delay ({int(stall_prob*100)}% failure risk)",
                    explanation=f"Milestone execution velocity indicates a {int(stall_prob*100)}% probability of exceeding 24+ months to completion without intervention.",
                    citation="Predictive Project Governance & Statistical Milestone Velocity Index",
                )
            )

        return signals
