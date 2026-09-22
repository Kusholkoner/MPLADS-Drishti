"""
Module 3: Proposal Intelligence
Responsibilities: Pre-sanction screening, non-permissible scope detection, cost benchmark deviation.
"""

from typing import List
from config import PROHIBITED_ASSET_KEYWORDS
from models.schemas import CanonicalWorkProfile, AnomalySignal


class ProposalIntelligenceAI:
    """Module 3: Evaluates new project recommendations before administrative approval."""

    @classmethod
    def evaluate_proposal(cls, profile: CanonicalWorkProfile) -> List[AnomalySignal]:
        signals = []
        desc_lower = f"{profile.title} {profile.category}".lower()

        # 1. Non-Permissible Prohibited Asset Check
        for kw in PROHIBITED_ASSET_KEYWORDS:
            if kw in desc_lower:
                signals.append(
                    AnomalySignal(
                        signal_id=f"PROP-NONPERM-{kw.replace(' ', '_').upper()}",
                        dimension="compliance",
                        severity="critical",
                        module_name="Proposal Intelligence AI v1.0",
                        score_contribution=95.0,
                        confidence=0.98,
                        finding=f"Proposal contains prohibited asset keyword: '{kw}'",
                        explanation=f"Project description mentions '{kw}', which is classified as non-permissible under MPLADS Guidelines 2023.",
                        citation="MPLADS Guidelines 2023 Annexure-II (Negative List of Ineligible Works)",
                    )
                )
                break

        # 2. Pre-Sanction Cost Deviation vs Category Median
        rec_cost = profile.financials.recommended_amount
        median_cost = profile.financials.comparable_median_amount
        if rec_cost > 0 and median_cost > 0:
            deviation_pct = ((rec_cost - median_cost) / median_cost) * 100.0
            if deviation_pct >= 35.0:
                signals.append(
                    AnomalySignal(
                        signal_id="PROP-COST-INFLATION",
                        dimension="financial",
                        severity="high" if deviation_pct < 60.0 else "critical",
                        module_name="Proposal Intelligence AI v1.0",
                        score_contribution=min(95.0, 50.0 + deviation_pct * 0.8),
                        confidence=0.92,
                        finding=f"Proposed cost is +{deviation_pct:.1f}% above regional category benchmark",
                        explanation=f"Estimated amount (₹{rec_cost:,.0f}) significantly deviates from the median baseline (₹{median_cost:,.0f}) for {profile.category}.",
                        citation="GFR 2017 Rule 130 & CPWD Schedule of Rates Benchmarking",
                    )
                )

        return signals
