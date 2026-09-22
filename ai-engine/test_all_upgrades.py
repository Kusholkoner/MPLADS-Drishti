"""
Comprehensive Multi-Modal AI Surveillance Test Suite
MPLADS 

Validates all 5 newly upgraded surveillance pillars:
1. Multilingual Indic SBERT (Hindi-English cross-lingual duplicate matching)
2. Tabular Financial Isolation Forest (Unsupervised non-linear velocity anomalies)
3. Vision Verifier (64-bit dHash perceptual hashing & deduplication)
4. NetworkX Louvain Modularity (Cartel ring & bid-rigging syndicate detection)
5. Document Forensics (Error Level Analysis - ELA)
"""

import sys
import os
import io
import numpy as np
from PIL import Image

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from services.semantic_engine import SemanticEngine
from services.financial_anomaly_detector import FinancialAnomalyDetector
from services.vision_verifier import VisionVerifier
from services.document_forensics import DocumentForensics
from modules.mod15_graph_intelligence import GraphIntelligenceAI


def run_all_tests():
    print("=" * 70)
    print("MPLADS  - DEEP MULTI-MODAL AI SURVEILLANCE VERIFICATION")
    print("=" * 70)

    # -------------------------------------------------------------
    # Pillar 1: Multilingual & Indic SBERT
    # -------------------------------------------------------------
    print("\n[PILLAR 1: Multilingual Cross-Lingual Semantic Matching]")
    hindi_work = "गाँव खेड़ा में सामुदायिक भवन निर्माण कार्य"
    english_work = "Construction of Community Hall at Village Khera"
    unrelated_work = "Installation of High-Mast Solar Street Lighting"

    sim_cross = SemanticEngine.compute_similarity(hindi_work, english_work)
    sim_unrelated = SemanticEngine.compute_similarity(hindi_work, unrelated_work)

    print(f"Hindi Proposal : '{hindi_work}'")
    print(f"English Sanction: '{english_work}'")
    print(f"Cross-Lingual Overlap Score: {sim_cross:.1%}")
    print(f"Unrelated Asset Overlap Score : {sim_unrelated:.1%}")

    assert sim_cross > 0.50, f"Expected >50% cross-lingual similarity, got {sim_cross:.1%}"
    assert sim_unrelated < 0.25, f"Expected <25% similarity, got {sim_unrelated:.1%}"
    print("  [PASS] Multilingual SBERT accurately maps Hindi proposals to English sanctions.")

    # -------------------------------------------------------------
    # Pillar 2: Tabular Financial Isolation Forest
    # -------------------------------------------------------------
    print("\n[PILLAR 2: Tabular Financial Isolation Forest]")
    # Normal compliant project
    normal_project = {
        "financials": {"sanctionedAmount": 2500000.0, "unreconciledGap": 5000.0, "costDeviationPercent": 4.0},
        "financialProgress": 65.0,
        "physicalProgress": 62.0,
        "milestones": [1, 2, 3],
    }
    res_normal = FinancialAnomalyDetector.analyze_work(normal_project)
    print(f"Compliant Project -> Anomaly: {res_normal['is_anomaly']} (Score: {res_normal['decision_score']})")

    # Fraudulent project (90% spend, only 15% physical progress, extreme divergence)
    fraudulent_project = {
        "financials": {"sanctionedAmount": 4800000.0, "unreconciledGap": 2400000.0, "costDeviationPercent": 48.0},
        "financialProgress": 92.0,
        "physicalProgress": 18.0,
        "milestones": [1],
    }
    res_fraud = FinancialAnomalyDetector.analyze_work(fraudulent_project)
    print(f"Divergent Project -> Anomaly: {res_fraud['is_anomaly']} (Score: {res_fraud['decision_score']})")
    print(f"  Primary Anomaly Driver : '{res_fraud['primary_driver']}' ({res_fraud['driver_deviation_sigma']} sigma)")
    print(f"  Risk Contribution      : {res_fraud['risk_contribution']}/100")

    assert not res_normal["is_anomaly"], "Normal project should not be flagged"
    assert res_fraud["is_anomaly"], "Fraudulent project with 74% gap must be flagged as anomaly"
    print("  [PASS] Isolation Forest accurately isolates multi-dimensional financial anomalies.")

    # -------------------------------------------------------------
    # Pillar 3: Vision Verification (64-bit dHash Deduplication)
    # -------------------------------------------------------------
    print("\n[PILLAR 3: Deep Visual Verification (64-bit dHash)]")
    # Generate a synthetic test image
    img1 = Image.new("RGB", (300, 300), color=(73, 109, 137))
    # Draw a gradient pattern
    pixels = img1.load()
    for i in range(300):
        for j in range(300):
            pixels[i, j] = (i % 256, j % 256, (i + j) % 256)

    # Re-save with JPEG compression (simulating agency re-upload)
    buf = io.BytesIO()
    img1.save(buf, "JPEG", quality=85)
    buf.seek(0)
    img2 = Image.open(buf)

    # Completely different image (black & white checkerboard)
    img3 = Image.new("RGB", (300, 300), color=(255, 255, 255))
    pixels3 = img3.load()
    for i in range(300):
        for j in range(300):
            if (i // 30) % 2 == (j // 30) % 2:
                pixels3[i, j] = (0, 0, 0)

    hash1 = VisionVerifier.compute_dhash(img1)
    hash2 = VisionVerifier.compute_dhash(img2)
    hash3 = VisionVerifier.compute_dhash(img3)

    cmp_same = VisionVerifier.compare_hashes(hash1, hash2)
    cmp_diff = VisionVerifier.compare_hashes(hash1, hash3)

    print(f"Image 1 dHash : {hash1}")
    print(f"Image 2 dHash : {hash2} (Compressed Re-upload)")
    print(f"Image 3 dHash : {hash3} (Distinct Scene)")
    print(f"Re-upload Match Percentage: {cmp_same['similarity_percentage']} (Hamming: {cmp_same['hamming_distance']} bits)")
    print(f"Distinct Scene Match      : {cmp_diff['similarity_percentage']} (Hamming: {cmp_diff['hamming_distance']} bits)")

    assert cmp_same["is_duplicate"], "Compressed re-upload should be identified as duplicate"
    assert not cmp_diff["is_duplicate"], "Distinct image should not be duplicate"
    print("  [PASS] 64-bit dHash perceptual fingerprinting accurately catches recycled imagery.")

    # -------------------------------------------------------------
    # Pillar 4: NetworkX Louvain Modularity Cartel Detection
    # -------------------------------------------------------------
    print("\n[PILLAR 4: NetworkX Louvain Modularity Cartel Detection]")
    syndicate_works = [
        {"mp_name": "MP-North", "implementing_agency": "Agency-Z", "vendor_name": "Apex Civil Ltd", "sanctioned_amount": 2500000.0},
        {"mp_name": "MP-North", "implementing_agency": "Agency-Z", "vendor_name": "Apex Civil Ltd", "sanctioned_amount": 3000000.0},
        {"mp_name": "MP-North", "implementing_agency": "Agency-Z", "vendor_name": "Zenith Infra Corp", "sanctioned_amount": 2800000.0},
        {"mp_name": "MP-North", "implementing_agency": "Agency-Z", "vendor_name": "Zenith Infra Corp", "sanctioned_amount": 3200000.0},
        {"mp_name": "MP-North", "implementing_agency": "Agency-Other", "vendor_name": "Independent Builder", "sanctioned_amount": 500000.0},
    ]
    graph_res = GraphIntelligenceAI.generate_district_graph(syndicate_works, "North District")
    print(f"Total Graph Nodes : {len(graph_res.nodes)}")
    print(f"District HHI Index: {graph_res.hhi_index} ({graph_res.monopoly_level})")
    print(f"Detected Collusion Clusters: {len(graph_res.flagged_collusion_clusters)}")
    for cluster in graph_res.flagged_collusion_clusters:
        print(f"  [FLAG] [{cluster['cluster_id']}] {cluster['risk_verdict']}")
        print(f"     Vendors involved: {cluster['vendors']}")
        print(f"     Spend share     : {cluster['cluster_expenditure_share']}")

    assert graph_res.hhi_index > 2500, "High concentration syndicate must have HHI > 2500"
    assert len(graph_res.flagged_collusion_clusters) >= 1, "Louvain modularity must isolate the 2-vendor syndicate"
    print("  [PASS] Louvain Modularity accurately isolates bid-rigging contractor cartels.")

    # -------------------------------------------------------------
    # Pillar 5: Document Forensics (Error Level Analysis)
    # -------------------------------------------------------------
    print("\n[PILLAR 5: Document Forensics (Error Level Analysis - ELA)]")
    doc_authentic = Image.new("RGB", (600, 800), color=(248, 248, 248))
    ela_res_authentic = DocumentForensics.compute_ela(doc_authentic)
    print(f"Authentic Document ELA -> Tamper Detected: {ela_res_authentic['tamper_detected']}")
    print(f"  Mean Error Level: {ela_res_authentic['mean_error_level']}, Verdict: {ela_res_authentic['verdict']}")
    assert not ela_res_authentic["tamper_detected"], "Uniform document should not be flagged"
    print("  [PASS] Error Level Analysis correctly verifies document structural uniformity.")

    print("\n" + "=" * 70)
    print("[SUCCESS] ALL 5 MULTI-MODAL SURVEILLANCE UPGRADES VERIFIED & PASSED!")
    print("=" * 70)


if __name__ == "__main__":
    run_all_tests()
