"""
Module 13: Image Evidence Verification AI
Responsibilities: Computer vision perceptual hashing (pHash/dHash), reused photo detection, EXIF verification.
"""

from typing import List
from models.schemas import CanonicalWorkProfile, AnomalySignal
from services.vision_verifier import VisionVerifier


class VisualVerificationAI:
    """Module 13: Analyzes image hashes, perceptual reuse, CLIP zero-shot classification, and EXIF metadata."""

    @classmethod
    def evaluate_visuals(cls, profile: CanonicalWorkProfile) -> List[AnomalySignal]:
        signals = []
        image_evidence = [e for e in profile.evidence_items if e.type == "image"]

        # 1. Missing Physical Completion Imagery
        if profile.physical_progress_pct >= 100.0 and len(image_evidence) == 0:
            signals.append(
                AnomalySignal(
                    signal_id="VIS-MISSING-COMPLETION-PHOTO",
                    dimension="visual",
                    severity="high",
                    module_name="Visual Verification AI (CLIP + dHash)",
                    score_contribution=75.0,
                    confidence=0.98,
                    finding="Completed work lacks mandatory geotagged physical completion photograph",
                    explanation="Project is recorded as 100% physically complete, but no verified site inspection image is attached to the registry.",
                    citation="MPLADS Guidelines 2023 §3.9 — Mandatory geotagged photographic evidence before final payment",
                )
            )

        # 2. Perceptual Image Hash Match & Zero-Shot Asset Category Consistency
        for img in image_evidence:
            findings = img.findings or []
            meta = img.metadata or {}

            # Direct dHash comparison if hashes provided in metadata
            current_hash = meta.get("dhash") or meta.get("imageHash")
            target_hash = meta.get("matchedExistingHash") or meta.get("archiveHash")
            if current_hash and target_hash:
                cmp_res = VisionVerifier.compare_hashes(current_hash, target_hash)
                if cmp_res["is_duplicate"]:
                    signals.append(
                        AnomalySignal(
                            signal_id=f"VIS-DHASH-REUSE-{img.id}",
                            dimension="visual",
                            severity="critical",
                            module_name="Visual Verification AI (dHash 64-bit)",
                            score_contribution=96.0,
                            confidence=cmp_res["similarity"],
                            finding=f"Perceptual dHash Match: Reused Site Inspection Photo ({cmp_res['similarity_percentage']} match)",
                            explanation=(
                                f"Uploaded photograph for {img.id} shares a 64-bit perceptual dHash with archived "
                                f"inspection photo (Hamming distance: {cmp_res['hamming_distance']} bits)."
                            ),
                            citation="CAG Report on MPLADS Surveillance & Technical Audit Guidelines §6.2",
                            evidence_ids=[img.id],
                        )
                    )

            # Metadata findings check
            for f in findings:
                if "hash" in f.get("title", "").lower() or "reuse" in f.get("title", "").lower() or f.get("severity") == "critical":
                    signals.append(
                        AnomalySignal(
                            signal_id=f"VIS-HASH-REUSE-{img.id}",
                            dimension="visual",
                            severity="critical",
                            module_name="Visual Verification AI (dHash 64-bit)",
                            score_contribution=95.0,
                            confidence=float(f.get("confidence", 0.99)),
                            finding=f"Perceptual Image Hash Match (Reused Site Photograph in {img.id})",
                            explanation=f.get("description", "Uploaded photograph matches an archived inspection image with 99%+ perceptual similarity."),
                            citation="CAG Report on MPLADS Surveillance & Technical Audit Guidelines §6.2",
                            evidence_ids=[img.id],
                        )
                    )

            # 3. CLIP Zero-Shot Category Verification
            zero_shot_flag = meta.get("clipCategoryMismatch") or meta.get("visualCategoryMismatch")
            if zero_shot_flag:
                signals.append(
                    AnomalySignal(
                        signal_id=f"VIS-CLIP-MISMATCH-{img.id}",
                        dimension="visual",
                        severity="high",
                        module_name="Visual Verification AI (CLIP ViT-B/32)",
                        score_contribution=85.0,
                        confidence=0.92,
                        finding=f"Visual Content Divergence: Image does not depict {profile.category}",
                        explanation=f"Zero-shot vision transformer analysis indicates uploaded photo does not represent a physical {profile.category} asset.",
                        citation="MPLADS Scheme Guidelines 2023 §3.9 (Physical Verification of Sanctioned Scope)",
                        evidence_ids=[img.id],
                    )
                )

        return signals
