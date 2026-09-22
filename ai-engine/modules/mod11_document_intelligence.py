"""
Module 11: Document Intelligence
Responsibilities: OCR extraction, structural field parsing, and sanction-vs-invoice discrepancy analysis.
"""

from typing import List
from models.schemas import CanonicalWorkProfile, AnomalySignal


class DocumentIntelligenceAI:
    """Module 11: Analyzes uploaded documents, invoices, and certificates."""

    @classmethod
    def evaluate_documents(cls, profile: CanonicalWorkProfile) -> List[AnomalySignal]:
        signals = []
        doc_evidence = [e for e in profile.evidence_items if e.type in ["document", "certificate", "report"]]

        for doc in doc_evidence:
            for field in doc.extracted_fields:
                if not field.get("isConsistent", True):
                    signals.append(
                        AnomalySignal(
                            signal_id=f"DOC-EXTRACTION-MISMATCH-{doc.id}",
                            dimension="document",
                            severity="high",
                            module_name="Document Intelligence AI (OCR) v2.0",
                            score_contribution=80.0,
                            confidence=float(field.get("confidence", 0.90)),
                            finding=f"Document OCR field discrepancy: {field.get('fieldName')} mismatch",
                            explanation=f"Extracted value '{field.get('extractedValue')}' is inconsistent with official sanction registry metadata.",
                            citation="GFR 2017 Rule 238 & Evidence Verification Protocol",
                            evidence_ids=[doc.id],
                        )
                    )

        return signals
