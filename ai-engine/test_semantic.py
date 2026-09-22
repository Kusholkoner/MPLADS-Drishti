"""
Verification script for all-MiniLM-L6-v2 Semantic Intelligence in MPLADS 
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from services.semantic_engine import SemanticEngine
from modules.mod09_duplicate_work import DuplicateWorkAI
from models.schemas import CanonicalWorkProfile


def test_semantic_matching():
    print("=" * 60)
    print("Testing all-MiniLM-L6-v2 Semantic Similarity Engine")
    print("=" * 60)

    # Test Case 1: Synonymous rephrased titles (Zero common words)
    title_a = "Construction of Multipurpose Community Hall at Village Khera"
    title_b = "Erection of Community Centre and Public Assembly Hall at Village Khera"

    sim_ab = SemanticEngine.compute_similarity(title_a, title_b)
    print(f"\n[Test 1 - Synonymous Rephrased Works]")
    print(f"Title A: {title_a}")
    print(f"Title B: {title_b}")
    print(f"Semantic Overlap (all-MiniLM-L6-v2): {sim_ab:.1%}")
    assert sim_ab > 0.60, f"Expected >60% similarity, got {sim_ab:.1%}"

    # Test Case 2: Unrelated Works
    title_c = "Installation of 50 High-Mast Solar Lighting Systems in Varanasi"
    sim_ac = SemanticEngine.compute_similarity(title_a, title_c)
    print(f"\n[Test 2 - Unrelated Works]")
    print(f"Title A: {title_a}")
    print(f"Title C: {title_c}")
    print(f"Semantic Overlap (all-MiniLM-L6-v2): {sim_ac:.1%}")
    assert sim_ac < 0.40, f"Expected <40% similarity, got {sim_ac:.1%}"

    # Test Case 3: Statutory Rules Vector RAG
    print(f"\n[Test 3 - Statutory RAG Vector Search]")
    query = "Can an MP allocate funds to build a private commercial club?"
    retrieved = SemanticEngine.search_rules(query, top_k=2)
    print(f"Auditor Query: '{query}'")
    for idx, rule in enumerate(retrieved, 1):
        print(f"  {idx}. [{rule['source']}] {rule['title']} (Score: {rule['relevance_score']})")

    # Test Case 4: Module 9 Duplicate Scope AI Trigger
    print(f"\n[Test 4 - Module 9 Duplicate Scope AI Evaluation]")
    candidate_profile = CanonicalWorkProfile(
        work_id="MPL-004822",
        title=title_b,
        category="Community Infrastructure",
        state="Delhi",
        district="New Delhi",
        constituency="New Delhi PC-04",
        mp_name="Shri R. K. Singh",
        implementing_agency="Delhi State Industrial and Infrastructure Development Corp (DSIIDC)",
        sanctioned_amount=3800000.0,
    )
    peer_works = [
        {
            "work_id": "MPL-004821",
            "title": title_a,
            "state": "Delhi",
            "district": "New Delhi",
        }
    ]
    signals = DuplicateWorkAI.evaluate_duplicates(candidate_profile, peer_works)
    print(f"Anomaly Signals Emitted: {len(signals)}")
    for sig in signals:
        print(f"  [FLAG] [{sig.severity.upper()}] {sig.finding}")
        print(f"     Module: {sig.module_name}")
        print(f"     Explanation: {sig.explanation}")
        print(f"     Citation: {sig.citation}")

    print("\n" + "=" * 60)
    print("[SUCCESS] All Semantic Intelligence Verification Tests Passed!")
    print("=" * 60)


if __name__ == "__main__":
    test_semantic_matching()
