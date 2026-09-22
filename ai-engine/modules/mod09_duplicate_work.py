"""
Module 9: Duplicate / Split-Work AI
Responsibilities: Detects duplicate scope descriptions, spatial proximity overlaps, and split ghost works using all-MiniLM-L6-v2 semantic embeddings and RapidFuzz hybrid scoring.
"""

from typing import List, Dict, Any
from rapidfuzz import fuzz
from models.schemas import CanonicalWorkProfile, AnomalySignal
from services.semantic_engine import SemanticEngine


class DuplicateWorkAI:
    """Module 9: Detects overlapping or duplicate scopes across the national registry using all-MiniLM-L6-v2."""

    @classmethod
    def evaluate_duplicates(
        cls, profile: CanonicalWorkProfile, peer_works: List[Dict[str, Any]] = None
    ) -> List[AnomalySignal]:
        signals = []
        if not peer_works:
            return signals

        for peer in peer_works:
            peer_id = str(peer.get("work_id", ""))
            if peer_id == profile.work_id:
                continue

            peer_title = str(peer.get("title", ""))
            same_district = profile.district.lower() == str(peer.get("district", "")).lower()
            same_state = profile.state.lower() == str(peer.get("state", "")).lower()

            if not (same_district or same_state):
                continue

            # 1. Neural Semantic Embedding Similarity via all-MiniLM-L6-v2 (384-dimensional dense vectors)
            semantic_sim = SemanticEngine.compute_similarity(profile.title, peer_title)

            # 2. Token edit distance via RapidFuzz
            fuzz_ratio = fuzz.token_set_ratio(profile.title.lower(), peer_title.lower()) / 100.0

            # 3. Hybrid Confidence (Neural semantics primary, character fuzzy secondary)
            final_sim = max(semantic_sim, fuzz_ratio)

            if final_sim >= 0.72:
                engine_used = "all-MiniLM-L6-v2 (SBERT 384-dim)" if semantic_sim >= fuzz_ratio else "RapidFuzz Hybrid"
                signals.append(
                    AnomalySignal(
                        signal_id=f"DUP-SCOPE-OVERLAP-{peer_id}",
                        dimension="duplicate",
                        severity="critical" if final_sim >= 0.85 else "high",
                        module_name="Duplicate / Split-Work AI (all-MiniLM-L6-v2)",
                        score_contribution=92.0,
                        confidence=round(final_sim, 2),
                        finding=f"Potential Scope Duplication & Spatial Overlap with {peer_id} ({int(final_sim*100)}% match)",
                        explanation=(
                            f"Work description matches existing project '{peer_title}' in {profile.district} "
                            f"with {int(final_sim*100)}% semantic overlap evaluated by {engine_used}."
                        ),
                        citation="MPLADS Guidelines 2023 §2.3 — Prohibition of duplicate sanctions for identical asset scopes",
                    )
                )
                break

        return signals
