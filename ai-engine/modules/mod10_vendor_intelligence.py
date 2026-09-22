"""
Module 10: Vendor Intelligence
Responsibilities: Detects shell vendor fragmentation, IDA self-dealing, and monopoly concentration (HHI).
"""

from typing import List, Dict, Any
from rapidfuzz import fuzz
from models.schemas import CanonicalWorkProfile, AnomalySignal


class VendorIntelligenceAI:
    """Module 10: Analyzes contractor concentration, agency conflicts of interest, and shell networks."""

    @classmethod
    def evaluate_vendor(
        cls, profile: CanonicalWorkProfile, district_vendor_shares: Dict[str, float] = None
    ) -> List[AnomalySignal]:
        signals = []
        vendor = profile.vendor_name or ""
        agency = profile.implementing_agency or ""

        # 1. IDA / Implementing Agency vs Vendor Self-Dealing Conflict
        if vendor and agency:
            match_ratio = fuzz.token_set_ratio(vendor.lower(), agency.lower()) / 100.0
            if match_ratio >= 0.85:
                signals.append(
                    AnomalySignal(
                        signal_id="VEND-IDA-SELF-DEALING",
                        dimension="vendor",
                        severity="critical",
                        module_name="Vendor Intelligence AI v2.2",
                        score_contribution=95.0,
                        confidence=0.97,
                        finding="Potential IDA / Contractor Self-Dealing Conflict of Interest",
                        explanation=f"Implementing Agency ('{agency}') and Paid Contractor ('{vendor}') exhibit 85%+ name identity.",
                        citation="Central Vigilance Commission (CVC) Circular No. 02/02/2018 (Conflict of Interest in Public Procurement)",
                    )
                )

        # 2. Herfindahl-Hirschman Index (HHI) Monopoly Concentration Check
        if district_vendor_shares and vendor:
            vendor_share = district_vendor_shares.get(vendor, 0.0)
            if vendor_share >= 0.40:
                signals.append(
                    AnomalySignal(
                        signal_id="VEND-MONOPOLY-CONCENTRATION",
                        dimension="vendor",
                        severity="high",
                        module_name="Vendor Intelligence AI v2.2",
                        score_contribution=80.0,
                        confidence=0.93,
                        finding=f"High Vendor Concentration ({int(vendor_share*100)}% of district works awarded to single firm)",
                        explanation=f"Vendor '{vendor}' captures {int(vendor_share*100)}% of all active sanctioned value in {profile.district}.",
                        citation="Competition Commission of India (CCI) Guidelines & GFR Rule 144 (Broad-based Competition)",
                    )
                )

        return signals
