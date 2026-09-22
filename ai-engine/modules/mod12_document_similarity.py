"""
Module 12: Document Similarity AI
Responsibilities: Detects recycled, reused, or duplicated certificates and invoice layouts.
"""

from typing import List
from models.schemas import CanonicalWorkProfile, AnomalySignal
from services.document_forensics import DocumentForensics


class DocumentSimilarityAI:
    """Module 12: Identifies cross-project document recycling, layout collisions, and forensic tampering (ELA)."""

    @classmethod
    def evaluate_similarity(cls, profile: CanonicalWorkProfile) -> List[AnomalySignal]:
        signals = []
        for doc in profile.evidence_items:
            if doc.type in ["document", "certificate", "invoice"]:
                comp_id = doc.metadata.get("comparisonEvidenceId")
                sim_pct = float(doc.metadata.get("comparisonSimilarityPercent", 0.0))

                # 1. Structural Layout & Duplicate Document Match
                if sim_pct >= 90.0:
                    signals.append(
                        AnomalySignal(
                            signal_id=f"DOC-SIMILARITY-COLLISION-{doc.id}",
                            dimension="document",
                            severity="critical",
                            module_name="Document Similarity AI (Layout Hashing)",
                            score_contribution=92.0,
                            confidence=round(sim_pct / 100.0, 3),
                            finding=f"High Document Layout / Text Collision ({sim_pct:.1f}% match with {comp_id or 'Archive'})",
                            explanation=f"Uploaded certificate exhibits {sim_pct:.1f}% structural layout and text hash match with previously uploaded document.",
                            citation="Vigilance Manual 2021 §7.3 — Forged / Recycled Utilization Documentation",
                            evidence_ids=[doc.id],
                        )
                    )

                # 2. Digital Tampering via Error Level Analysis (ELA)
                if doc.metadata.get("elaTampered") or doc.metadata.get("digitalAlterationDetected") or doc.metadata.get("tamperDetected"):
                    signals.append(
                        AnomalySignal(
                            signal_id=f"DOC-ELA-TAMPER-{doc.id}",
                            dimension="document",
                            severity="critical",
                            module_name="Document Forensics AI (Error Level Analysis - ELA)",
                            score_contribution=95.0,
                            confidence=0.96,
                            finding=f"Digital Alteration & Splicing Detected in Document {doc.id}",
                            explanation="Forensic Error Level Analysis detected compression artifact variance spikes indicating digitally edited monetary figures or forged stamps.",
                            citation="CVC Guidelines on Technical Examination of Public Procurement Records §4.1",
                            evidence_ids=[doc.id],
                        )
                    )

        return signals
