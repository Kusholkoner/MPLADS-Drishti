"""
Module 4: Statutory Compliance AI
Responsibilities: Deterministic statutory rulebook enforcement (MPLADS Guidelines 2023 & GFR 2017).
"""

from typing import List
from datetime import datetime
from config import (
    SANCTION_SLA_DAYS_LIMIT,
    REPAIR_RENOVATION_ANNUAL_CAP_INR,
)
from models.schemas import CanonicalWorkProfile, AnomalySignal


class StatutoryComplianceAI:
    """Module 4: Evaluates statutory limits, SLAs, and entitlement caps."""

    @classmethod
    def evaluate_compliance(cls, profile: CanonicalWorkProfile) -> List[AnomalySignal]:
        signals = []
        dates = profile.dates or {}
        rec_date_str = dates.get("recommended_date")
        sanc_date_str = dates.get("sanctioned_date")

        # 1. 45-Day Sanction SLA Breach & 0-Day Rubber-Stamping
        if rec_date_str and sanc_date_str:
            try:
                rec_dt = datetime.strptime(rec_date_str, "%Y-%m-%d")
                sanc_dt = datetime.strptime(sanc_date_str, "%Y-%m-%d")
                delta_days = (sanc_dt - rec_dt).days

                if delta_days > SANCTION_SLA_DAYS_LIMIT:
                    signals.append(
                        AnomalySignal(
                            signal_id="COMP-SANCTION-SLA-BREACH",
                            dimension="compliance",
                            severity="medium",
                            module_name="Statutory Compliance AI v2.0",
                            score_contribution=70.0,
                            confidence=0.99,
                            finding=f"Administrative sanction delayed by {delta_days} days (SLA: {SANCTION_SLA_DAYS_LIMIT} days)",
                            explanation=f"Sanction took {delta_days} days from MP recommendation, violating the mandated 45-day SLA limit.",
                            citation="MPLADS Guidelines 2023 §2.6 — Mandated 45-day administrative sanction turnaround",
                        )
                    )
                elif delta_days == 0:
                    signals.append(
                        AnomalySignal(
                            signal_id="COMP-ZERO-DAY-SANCTION",
                            dimension="compliance",
                            severity="medium",
                            module_name="Statutory Compliance AI v2.0",
                            score_contribution=60.0,
                            confidence=0.88,
                            finding="Zero-day instantaneous sanction without technical vetting interval",
                            explanation="Administrative approval was issued on the exact same date as proposal submission without recorded scrutiny gap.",
                            citation="MPLADS Operational Manual §4.1 — Mandatory technical scrutiny prior to sanction",
                        )
                    )
            except Exception:
                pass

        # 2. Repair & Renovation Cap Check (> ₹50 Lakhs)
        if "repair" in profile.title.lower() or "renovation" in profile.title.lower() or "maintenance" in profile.title.lower():
            if profile.financials.sanctioned_amount > REPAIR_RENOVATION_ANNUAL_CAP_INR:
                signals.append(
                    AnomalySignal(
                        signal_id="COMP-REPAIR-CAP-BREACH",
                        dimension="compliance",
                        severity="high",
                        module_name="Statutory Compliance AI v2.0",
                        score_contribution=85.0,
                        confidence=0.96,
                        finding=f"Repair/Renovation sanction (₹{profile.financials.sanctioned_amount:,.0f}) exceeds ₹50 Lakh annual ceiling",
                        explanation="Expenditure for repair and maintenance of community assets exceeds the statutory ₹50 Lakhs threshold.",
                        citation="MPLADS Guidelines 2023 §5.3 — Ceiling on repair and renovation works",
                    )
                )

        return signals
