"""
Module 6: Timeline Intelligence
Responsibilities: Detects execution delays, milestone progress lags, and chronic project stalling.
"""

from typing import List
from datetime import datetime, timezone
from config import COMPLETION_SLA_DAYS_LIMIT
from models.schemas import CanonicalWorkProfile, AnomalySignal


class TimelineIntelligenceAI:
    """Module 6: Monitors lifecycle milestones and detects chronic project stalling."""

    @classmethod
    def evaluate_timeline(cls, profile: CanonicalWorkProfile) -> List[AnomalySignal]:
        signals = []
        dates = profile.dates or {}
        sanc_date_str = dates.get("sanctioned_date")

        # 1. 1-Year Completion SLA Violation
        if sanc_date_str:
            try:
                sanc_dt = datetime.strptime(sanc_date_str, "%Y-%m-%d").replace(tzinfo=timezone.utc)
                now_dt = datetime.now(timezone.utc)
                elapsed_days = (now_dt - sanc_dt).days

                if elapsed_days > COMPLETION_SLA_DAYS_LIMIT and profile.physical_progress_pct < 100.0:
                    stall_months = elapsed_days // 30
                    severity = "critical" if elapsed_days > 730 else ("high" if elapsed_days > 500 else "medium")
                    signals.append(
                        AnomalySignal(
                            signal_id="TIME-COMPLETION-SLA-EXCEEDED",
                            dimension="timeline",
                            severity=severity,
                            module_name="Timeline Intelligence AI v1.2",
                            score_contribution=min(90.0, (elapsed_days / COMPLETION_SLA_DAYS_LIMIT) * 45.0),
                            confidence=0.97,
                            finding=f"Completion SLA Breached: Ongoing after {elapsed_days} days ({stall_months} months post-sanction)",
                            explanation=f"Project remains at {profile.physical_progress_pct:.0f}% physical progress past the mandated 1-year completion timeline.",
                            citation="MPLADS Guidelines 2023 §3.8 — Maximum 12-month completion window from sanction date",
                        )
                    )
            except Exception:
                pass

        # 2. Delayed Milestone Cascading
        if profile.milestones:
            delayed_count = sum(1 for m in profile.milestones if m.status == "delayed")
            if delayed_count >= 2:
                signals.append(
                    AnomalySignal(
                        signal_id="TIME-CASCADING-MILESTONE-DELAY",
                        dimension="timeline",
                        severity="medium",
                        module_name="Timeline Intelligence AI v1.2",
                        score_contribution=65.0,
                        confidence=0.92,
                        finding=f"{delayed_count} structural milestones are flagged as delayed",
                        explanation="Sequential dependencies broken due to chronic milestone backlog in execution phase.",
                        citation="CPWD Works Manual §14.2 — Milestone progress tracking",
                    )
                )

        return signals
