"""
Module 8: Physical-Financial Divergence AI
Responsibilities: Calculates the progress divergence gap between treasury release and verified physical site readiness.
"""

from typing import List
from models.schemas import CanonicalWorkProfile, AnomalySignal


class PhysicalFinancialDivergenceAI:
    """Module 8: Compares cumulative disbursements against verified field inspection milestones."""

    @classmethod
    def evaluate_divergence(cls, profile: CanonicalWorkProfile) -> List[AnomalySignal]:
        signals = []
        fin_pct = profile.financial_progress_pct
        phys_pct = profile.physical_progress_pct
        divergence_gap = fin_pct - phys_pct

        # Divergence Gap threshold >= 25%
        if divergence_gap >= 25.0:
            severity = "critical" if divergence_gap >= 35.0 else "high"
            signals.append(
                AnomalySignal(
                    signal_id="DIV-PROGRESS-GAP",
                    dimension="divergence",
                    severity=severity,
                    module_name="Physical-Financial Divergence AI v2.4",
                    score_contribution=min(98.0, 50.0 + divergence_gap * 1.3),
                    confidence=0.96,
                    finding=f"Severe progress divergence gap of {divergence_gap:.1f}% ({fin_pct:.1f}% disbursed vs {phys_pct:.1f}% physical completion)",
                    explanation=f"Executing agency released {fin_pct:.1f}% of funds (₹{profile.financials.disbursed_amount:,.0f}), but field inspection verifies only {phys_pct:.1f}% on-ground progress.",
                    citation="MPLADS Guidelines 2023 §3.4 — Milestone-linked progressive fund release requirements",
                )
            )

        return signals
