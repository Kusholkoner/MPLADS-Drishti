"""
Evidence Ingestion — runs real Vision/Forensics checks and populates EvidenceItem.metadata
before the AI pipeline evaluates it. Call this once per uploaded file, before run_full_pipeline().
"""

import base64
from typing import Optional
from models.schemas import EvidenceItem
from services.vision_verifier import VisionVerifier
from services.document_forensics import DocumentForensics


def enrich_evidence_with_vision(evidence: EvidenceItem, image_bytes: bytes,
                                 archive_hash: Optional[str] = None) -> EvidenceItem:
    """Computes dHash + zero-shot category check for an image evidence item."""
    dhash = VisionVerifier.compute_dhash(image_bytes)
    evidence.metadata["dhash"] = dhash

    if archive_hash:
        evidence.metadata["matchedExistingHash"] = archive_hash
        cmp_res = VisionVerifier.compare_hashes(dhash, archive_hash)
        evidence.metadata["hashComparison"] = cmp_res

    category_check = VisionVerifier.verify_asset_category_zero_shot(image_bytes, claimed_category="asset")
    if category_check.get("anomaly_detected"):
        evidence.metadata["clipCategoryMismatch"] = True
        evidence.metadata["clipCategoryDetail"] = category_check

    return evidence


def enrich_evidence_with_forensics(evidence: EvidenceItem, image_bytes: bytes) -> EvidenceItem:
    """Runs ELA tamper detection for a document/certificate/invoice evidence item."""
    ela_res = DocumentForensics.compute_ela(image_bytes)
    if ela_res.get("tamper_detected"):
        evidence.metadata["elaTampered"] = True
        evidence.metadata["elaDetail"] = ela_res
    return evidence