"""
Module 18: Explanation Engine
Responsibilities: Generates transparent, human-readable evidence summaries and statutory citations for audit officers.
"""

from typing import List, Dict, Any
from models.schemas import CanonicalWorkProfile, RiskEvaluationResult


class ExplanationEngine:
    """Module 18: Translates AI model vectors into clear, evidence-backed executive narratives."""

    @classmethod
    def generate_explanation_narrative(
        cls, profile: CanonicalWorkProfile, risk_res: RiskEvaluationResult
    ) -> Dict[str, Any]:
        if not risk_res.signals:
            return {
                "headline": f"Work {profile.work_id} is verified compliant with zero statutory or financial anomalies.",
                "summary": "All lifecycle milestones, payment releases, and photographic evidence match baseline expectations.",
                "key_findings": [],
                "statutory_citations": [],
            }

        sorted_signals = sorted(risk_res.signals, key=lambda s: s.score_contribution, reverse=True)
        primary_signal = sorted_signals[0]

        headline = f"Risk Score {risk_res.composite_risk_score}/100: {primary_signal.finding}"
        
        findings_bullets = []
        citations = []
        for s in sorted_signals:
            findings_bullets.append({
                "dimension": s.dimension.capitalize(),
                "severity": s.severity.upper(),
                "finding": s.finding,
                "detail": s.explanation,
                "citation": s.citation,
            })
            if s.citation and s.citation not in citations:
                citations.append(s.citation)

        summary_text = (
            f"Sentinel Surveillance Engine flagged Project {profile.work_id} ('{profile.title}') in {profile.district}, {profile.state}. "
            f"Composite risk score is {risk_res.composite_risk_score}/100 ({risk_res.risk_band.upper()} band) driven by {len(sorted_signals)} correlated anomaly vectors. "
            f"Primary concern: {primary_signal.explanation}"
        )

        return {
            "headline": headline,
            "summary": summary_text,
            "risk_band": risk_res.risk_band,
            "key_findings": findings_bullets,
            "statutory_citations": citations,
        }
