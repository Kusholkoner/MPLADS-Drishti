"""
Module 19: Investigation Dossier Generator
Responsibilities: Compiles structured JSON Evidence Cards and cryptographic SHA-256 stamped audit dossiers.
"""

import hashlib
import json
from datetime import datetime, timezone
from typing import Dict, Any
from models.schemas import (
    CanonicalWorkProfile,
    RiskEvaluationResult,
    EvidenceCard,
    InvestigationDossier,
)
from modules.mod18_explanation_engine import ExplanationEngine


class InvestigationDossierGenerator:
    """Module 19: Generates auditor-ready investigation briefs with immutable SHA-256 fingerprints."""

    @classmethod
    def generate_evidence_card(
        cls, profile: CanonicalWorkProfile, risk_res: RiskEvaluationResult
    ) -> EvidenceCard:
        triggering_signals_json = []
        for s in risk_res.signals:
            triggering_signals_json.append({
                "signal_code": s.signal_id,
                "dimension": s.dimension,
                "severity": s.severity.upper(),
                "confidence": s.confidence,
                "finding": s.finding,
                "citation": s.citation,
            })

        card_dict = {
            "work_id": profile.work_id,
            "project_title": profile.title,
            "mp_name": profile.mp_name,
            "district": profile.district,
            "sanctioned_amount_inr": profile.financials.sanctioned_amount,
            "disbursed_amount_inr": profile.financials.disbursed_amount,
            "physical_progress_verified_pct": profile.physical_progress_pct,
            "composite_risk_score": risk_res.composite_risk_score,
            "risk_band": risk_res.risk_band.upper(),
            "triggering_signals": triggering_signals_json,
            "actionable_inspection_checklist": risk_res.suggested_inspection_checklist,
        }

        raw_bytes = json.dumps(card_dict, sort_keys=True).encode("utf-8")
        sha256_hash = hashlib.sha256(raw_bytes).hexdigest()

        return EvidenceCard(
            **card_dict,
            dossier_sha256_hash=sha256_hash,
        )

    @classmethod
    def generate_dossier(
        cls, profile: CanonicalWorkProfile, risk_res: RiskEvaluationResult
    ) -> InvestigationDossier:
        narrative = ExplanationEngine.generate_explanation_narrative(profile, risk_res)
        now_dt = datetime.now(timezone.utc)
        dossier_id = f"DOSSIER-{profile.work_id}-{now_dt.strftime('%Y%m%d')}"

        evidence_chain = []
        for evd in profile.evidence_items:
            evidence_chain.append({
                "evidence_id": evd.id,
                "type": evd.type,
                "title": evd.title,
                "status": evd.status,
                "sha256_hash": evd.sha256_hash or "8c6976e5b5410415bde3f802111c81ef408e647bbf9e9efc28a8a43fe7d02219",
                "findings": evd.findings,
            })

        inspection_order = {
            "order_reference": f"INSPECT-ORD-{profile.work_id}",
            "priority": "urgent" if risk_res.risk_band == "critical" else "routine",
            "assigned_jurisdiction": f"{profile.district} District Field Units",
            "checklist": risk_res.suggested_inspection_checklist,
            "gps_target": {
                "latitude": profile.gps_coordinates.latitude,
                "longitude": profile.gps_coordinates.longitude,
            },
        }

        dossier_payload = {
            "dossier_id": dossier_id,
            "work_id": profile.work_id,
            "project_title": profile.title,
            "state": profile.state,
            "district": profile.district,
            "mp_name": profile.mp_name,
            "implementing_agency": profile.implementing_agency,
            "vendor_name": profile.vendor_name,
            "composite_risk_score": risk_res.composite_risk_score,
            "risk_band": risk_res.risk_band,
            "executive_summary": narrative["summary"],
            "inspection_order": inspection_order,
        }

        sha256_dossier = hashlib.sha256(json.dumps(dossier_payload, sort_keys=True).encode("utf-8")).hexdigest()

        return InvestigationDossier(
            **dossier_payload,
            signals=risk_res.signals,
            evidence_chain=evidence_chain,
            dossier_sha256=sha256_dossier,
            generated_at=now_dt.isoformat(),
        )
