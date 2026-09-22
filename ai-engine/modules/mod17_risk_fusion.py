"""
Module 17: Multi-Signal Risk Fusion Engine
Responsibilities: Weighted 8-dimension risk aggregation, multi-signal confirmation matrix, and risk band classification.
"""

from typing import List
from config import (
    RISK_THRESHOLD_CRITICAL,
    RISK_THRESHOLD_MODERATE,
    RISK_DIMENSION_WEIGHTS,
    MULTI_SIGNAL_BONUS_MULTIPLIER,
)
from models.schemas import CanonicalWorkProfile, AnomalySignal, RiskEvaluationResult, RiskBreakdown


class RiskFusionEngine:
    """Module 17: Merges multi-modal AI signals into a single calibrated risk score (0 - 100)."""

    @classmethod
    def fuse_risk_signals(cls, profile: CanonicalWorkProfile, signals: List[AnomalySignal]) -> RiskEvaluationResult:
        if not signals:
            return RiskEvaluationResult(
                work_id=profile.work_id,
                composite_risk_score=100.0,
                risk_band="low",
                is_escalated=False,
                confirmatory_signal_count=0,
                breakdown=RiskBreakdown(),
                signals=[],
                recommended_action="Compliance Clearance: Project proceeding within normal baseline parameters",
                suggested_inspection_checklist=["Standard routine milestone audit as per annual MoSPI verification quota."],
            )

        dimension_max: dict = {dim: 0.0 for dim in RISK_DIMENSION_WEIGHTS.keys()}
        confirmatory_severe_signals = 0

        for sig in signals:
            dim = sig.dimension
            if dim in dimension_max:
                weighted_contribution = sig.score_contribution * sig.confidence
                dimension_max[dim] = max(dimension_max[dim], weighted_contribution)
            
            if sig.score_contribution >= 75.0 or sig.severity in ["critical", "high"]:
                confirmatory_severe_signals += 1

        # Active dimensions sum
        active_weights_sum = sum(RISK_DIMENSION_WEIGHTS[dim] for dim, val in dimension_max.items() if val > 0)
        
        # Calculate raw weighted score across active dimensions
        raw_weighted_score = 0.0
        for dim, weight in RISK_DIMENSION_WEIGHTS.items():
            raw_weighted_score += dimension_max[dim] * weight

        # Dynamic composite normalization: if multiple anomalies are active, scale to full risk potential
        if active_weights_sum > 0:
            normalized_score = (raw_weighted_score / max(0.35, active_weights_sum)) * min(1.0, active_weights_sum * 2.2)
        else:
            normalized_score = 0.0

        # Apply multi-signal confirmation bonus if >= 2 independent severe anomalies
        multiplier = MULTI_SIGNAL_BONUS_MULTIPLIER if confirmatory_severe_signals >= 2 else 0.0
        raw_anomaly_score = min(100.0, normalized_score + multiplier)
        
        # Reversed scoring: Higher is better (100 = full compliance/health, 0 = critical anomaly)
        final_score = round(max(0.0, 100.0 - raw_anomaly_score), 1)

        # Classify risk band (higher score = safer / better)
        if final_score <= (100.0 - RISK_THRESHOLD_CRITICAL) and confirmatory_severe_signals >= 2:
            risk_band = "critical"
            is_escalated = True
            rec_action = "Automatic Escalation: Open Vigilance Case & Issue Physical Inspection Warrant"
        elif final_score <= (100.0 - RISK_THRESHOLD_MODERATE) or confirmatory_severe_signals >= 1:
            risk_band = "moderate" if final_score > (100.0 - RISK_THRESHOLD_CRITICAL) else "critical"
            is_escalated = (risk_band == "critical")
            rec_action = "Priority Escalation" if is_escalated else "Desk Audit Advisory: Queue for District Authority Clarification Notice"
        else:
            risk_band = "low"
            is_escalated = False
            rec_action = "Compliance Clearance: Project proceeding within normal baseline parameters"

        # Construct inspection checklist based on triggered signals
        checklist = []
        for sig in signals:
            if "geofence" in sig.finding.lower() or "photo" in sig.finding.lower() or "hash" in sig.finding.lower():
                checklist.append("Conduct physical on-site inspection at registered GPS coordinates with fresh geotagged video.")
            if "divergence" in sig.finding.lower() or "disbursed" in sig.finding.lower():
                checklist.append("Inspect Measurement Book (MB) volume entries against cumulative PFMS disbursement ledger.")
            if "vendor" in sig.finding.lower() or "self-dealing" in sig.finding.lower():
                checklist.append("Verify tender award documents and beneficial ownership master data on MCA21 portal.")
            if "structuring" in sig.finding.lower() or "installment" in sig.finding.lower():
                checklist.append("Audit all contractor invoice vouchers against GFR Rule 157 splitting prohibitions.")
        
        if not checklist:
            checklist.append("Standard routine milestone audit as per annual MoSPI verification quota.")

        breakdown = RiskBreakdown(
            financial_score=round(dimension_max.get("financial", 0.0), 1),
            divergence_score=round(dimension_max.get("divergence", 0.0), 1),
            visual_score=round(dimension_max.get("visual", 0.0), 1),
            duplicate_score=round(dimension_max.get("duplicate", 0.0), 1),
            vendor_score=round(dimension_max.get("vendor", 0.0), 1),
            compliance_score=round(dimension_max.get("compliance", 0.0), 1),
            timeline_score=round(dimension_max.get("timeline", 0.0), 1),
            document_score=round(dimension_max.get("document", 0.0), 1),
        )

        return RiskEvaluationResult(
            work_id=profile.work_id,
            composite_risk_score=final_score,
            risk_band=risk_band,
            is_escalated=is_escalated,
            confirmatory_signal_count=confirmatory_severe_signals,
            breakdown=breakdown,
            signals=signals,
            recommended_action=rec_action,
            suggested_inspection_checklist=list(set(checklist)),
        )
