"""
Unit Tests for all 21 AI Modules in MPLADS Sentinel AI Engine
"""

import unittest
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pandas as pd
from models.schemas import CanonicalWorkProfile, FinancialRecord, EvidenceItem, GPSCoordinates, AuditCopilotQuery
from modules import (
    DataQualityAI,
    EntityResolutionAI,
    ProposalIntelligenceAI,
    StatutoryComplianceAI,
    CostAnomalyAI,
    TimelineIntelligenceAI,
    FinancialIntelligenceAI,
    PhysicalFinancialDivergenceAI,
    DuplicateWorkAI,
    VendorIntelligenceAI,
    DocumentIntelligenceAI,
    DocumentSimilarityAI,
    VisualVerificationAI,
    GeospatialIntelligenceAI,
    GraphIntelligenceAI,
    PredictiveRiskAI,
    RiskFusionEngine,
    ExplanationEngine,
    InvestigationDossierGenerator,
    AuditCopilot,
    ActiveLearningFeedback,
)
from services.pipeline_orchestrator import PipelineOrchestrator


class TestAIModules(unittest.TestCase):

    def setUp(self):
        # Construct a representative high-risk project profile
        self.profile = CanonicalWorkProfile(
            work_id="MPL-004821",
            title="Construction of Community Hall at Village Khera",
            category="Community Infrastructure",
            state="Delhi",
            district="New Delhi",
            constituency="New Delhi PC-04",
            mp_name="Smt. Meenakshi Lekhi",
            mp_house="Lok Sabha",
            implementing_agency="DSIIDC",
            vendor_name="DSIIDC Civil Wing",
            status="in_progress",
            financial_progress_pct=88.0,
            physical_progress_pct=52.0,
            financials=FinancialRecord(
                recommended_amount=3500000.0,
                sanctioned_amount=3500000.0,
                disbursed_amount=3080000.0,
                verified_expenditure_amount=2920000.0,
                unreconciled_gap=160000.0,
                comparable_median_amount=2600000.0,
                cost_deviation_pct=34.6,
                installment_count=22,
            ),
            dates={
                "recommended_date": "2025-06-01",
                "sanctioned_date": "2025-08-15",
            },
            gps_coordinates=GPSCoordinates(latitude=28.5832, longitude=77.1645),
            evidence_items=[
                EvidenceItem(
                    id="EVD-IMG-001",
                    work_id="MPL-004821",
                    type="image",
                    title="Foundation Site Photo",
                    status="conflict",
                    gps_lat=28.7845,
                    gps_lng=77.0892,
                    findings=[{"title": "Perceptual Image Hash Match", "severity": "critical", "confidence": 0.99}],
                )
            ],
        )

    def test_mod01_data_quality(self):
        df = pd.DataFrame([{"work_id": "MPL-1", "amount": 100}, {"work_id": "MPL-1", "amount": 100}])
        report = DataQualityAI.evaluate_dataframe_quality(df, "test_dataset")
        self.assertEqual(report.duplicate_rows_detected, 1)
        self.assertTrue(report.data_quality_score > 0)
        norm_name = DataQualityAI.normalize_vendor_name("M/S ABC CONSTRUCTIONS PVT LTD")
        self.assertEqual(norm_name, "ABC")

    def test_mod02_entity_resolution(self):
        rec1 = {"work_id": "MPL-101", "mp_name": "Rajesh Kumar", "district": "Jaipur", "amount": 500000}
        rec2 = {"work_id": "MPL-101", "mp_name": "Rajesh Kumar", "district": "Jaipur", "amount": 500000}
        match_res = EntityResolutionAI.calculate_match_confidence(rec1, rec2)
        self.assertEqual(match_res["match_confidence"], 1.0)
        self.assertTrue(match_res["is_confident"])

    def test_mod03_proposal_intelligence(self):
        prohibited_profile = CanonicalWorkProfile(
            work_id="MPL-TEST-PROP",
            title="Construction of Temple Swagat Dwar",
            category="Religious Infrastructure",
            state="UP",
            district="Varanasi",
            constituency="Varanasi",
            mp_name="Test MP",
            implementing_agency="Agency",
            financials=FinancialRecord(recommended_amount=5000000.0, comparable_median_amount=2500000.0),
        )
        signals = ProposalIntelligenceAI.evaluate_proposal(prohibited_profile)
        self.assertTrue(any("prohibited asset" in s.finding.lower() for s in signals))

    def test_mod04_compliance(self):
        signals = StatutoryComplianceAI.evaluate_compliance(self.profile)
        self.assertTrue(any("delayed by" in s.finding.lower() for s in signals))

    def test_mod05_cost_anomaly(self):
        signals = CostAnomalyAI.evaluate_cost(self.profile, peer_costs=[2500000, 2600000, 2400000, 2700000, 2500000, 2600000, 2550000, 2650000])
        self.assertTrue(len(signals) > 0)

    def test_mod06_timeline(self):
        old_profile = self.profile.model_copy()
        old_profile.dates = {"sanctioned_date": "2024-01-01"}
        signals = TimelineIntelligenceAI.evaluate_timeline(old_profile)
        self.assertTrue(any("completion" in s.finding.lower() for s in signals))

    def test_mod07_financial(self):
        signals = FinancialIntelligenceAI.evaluate_financials(self.profile)
        self.assertTrue(any("installment structuring" in s.finding.lower() for s in signals))

    def test_mod08_physical_financial_divergence(self):
        signals = PhysicalFinancialDivergenceAI.evaluate_divergence(self.profile)
        self.assertTrue(any("divergence gap" in s.finding.lower() for s in signals))

    def test_mod09_duplicate_work(self):
        peer_works = [{"work_id": "MPL-004822", "title": "Construction of Community Hall at Village Khera Ext", "district": "New Delhi"}]
        signals = DuplicateWorkAI.evaluate_duplicates(self.profile, peer_works)
        self.assertTrue(len(signals) > 0)

    def test_mod10_vendor_intelligence(self):
        signals = VendorIntelligenceAI.evaluate_vendor(self.profile, {"DSIIDC Civil Wing": 0.45})
        self.assertTrue(any("self-dealing" in s.finding.lower() for s in signals))

    def test_mod11_document_intelligence(self):
        doc_profile = self.profile.model_copy()
        doc_profile.evidence_items.append(
            EvidenceItem(
                id="EVD-DOC-01",
                work_id="MPL-004821",
                type="document",
                title="Invoice Bill 01",
                status="conflict",
                extracted_fields=[{"fieldName": "Bill Amount", "extractedValue": "50L", "isConsistent": False}],
            )
        )
        signals = DocumentIntelligenceAI.evaluate_documents(doc_profile)
        self.assertTrue(len(signals) > 0)

    def test_mod12_document_similarity(self):
        doc_profile = self.profile.model_copy()
        doc_profile.evidence_items.append(
            EvidenceItem(
                id="EVD-DOC-02",
                work_id="MPL-004821",
                type="certificate",
                title="Provisional UC",
                metadata={"comparisonSimilarityPercent": 95.5, "comparisonEvidenceId": "EVD-DOC-01"},
            )
        )
        signals = DocumentSimilarityAI.evaluate_similarity(doc_profile)
        self.assertTrue(len(signals) > 0)

    def test_mod13_visual_verification(self):
        signals = VisualVerificationAI.evaluate_visuals(self.profile)
        self.assertTrue(any("hash match" in s.finding.lower() for s in signals))

    def test_mod14_geospatial(self):
        signals = GeospatialIntelligenceAI.evaluate_geospatial(self.profile)
        self.assertTrue(any("geofence" in s.finding.lower() for s in signals))

    def test_mod15_graph_intelligence(self):
        graph_resp = GraphIntelligenceAI.generate_district_graph(
            [{"mp_name": "MP1", "implementing_agency": "AG1", "vendor_name": "V1", "sanctioned_amount": 1000}], "New Delhi"
        )
        self.assertEqual(graph_resp.district, "New Delhi")
        self.assertTrue(len(graph_resp.nodes) > 0)

    def test_mod16_predictive_risk(self):
        signals = PredictiveRiskAI.evaluate_future_risk(self.profile)
        self.assertTrue(len(signals) > 0)

    def test_mod17_risk_fusion(self):
        all_signals = []
        all_signals.extend(PhysicalFinancialDivergenceAI.evaluate_divergence(self.profile))
        all_signals.extend(VisualVerificationAI.evaluate_visuals(self.profile))
        risk_result = RiskFusionEngine.fuse_risk_signals(self.profile, all_signals)
        self.assertTrue(risk_result.composite_risk_score <= 30.0 or risk_result.risk_band == "critical")
        self.assertEqual(risk_result.risk_band, "critical")
        self.assertTrue(risk_result.is_escalated)

    def test_mod18_explanation_engine(self):
        all_signals = PhysicalFinancialDivergenceAI.evaluate_divergence(self.profile)
        risk_result = RiskFusionEngine.fuse_risk_signals(self.profile, all_signals)
        narrative = ExplanationEngine.generate_explanation_narrative(self.profile, risk_result)
        self.assertIn("headline", narrative)
        self.assertIn("summary", narrative)

    def test_mod19_dossier_generator(self):
        all_signals = PhysicalFinancialDivergenceAI.evaluate_divergence(self.profile)
        risk_result = RiskFusionEngine.fuse_risk_signals(self.profile, all_signals)
        card = InvestigationDossierGenerator.generate_evidence_card(self.profile, risk_result)
        dossier = InvestigationDossierGenerator.generate_dossier(self.profile, risk_result)
        self.assertEqual(card.work_id, "MPL-004821")
        self.assertTrue(len(card.dossier_sha256_hash) == 64)
        self.assertTrue(len(dossier.dossier_sha256) == 64)

    def test_mod20_audit_copilot(self):
        query = AuditCopilotQuery(query="Which projects have high divergence gap in Delhi?")
        res = AuditCopilot.answer_query(query)
        self.assertEqual(res.intent, "divergence_query")
        self.assertTrue(len(res.citations) > 0)

    def test_mod21_active_learning(self):
        res = ActiveLearningFeedback.record_auditor_disposition(
            case_id="CASE-001",
            work_id="MPL-004821",
            auditor_id="OFFICER-01",
            disposition="confirmed_irregularity",
            auditor_notes="Field inspection verified 36% progress gap.",
        )
        self.assertEqual(res["status"], "success")
        summary = ActiveLearningFeedback.get_feedback_summary()
        self.assertTrue(summary["total_samples"] >= 1)

    def test_full_pipeline_orchestration(self):
        result = PipelineOrchestrator.run_full_pipeline(self.profile)
        self.assertEqual(result["work_id"], "MPL-004821")
        self.assertIn("risk_evaluation", result)
        self.assertIn("evidence_card", result)
        self.assertIn("dossier", result)
        self.assertEqual(result["risk_evaluation"]["risk_band"], "critical")


if __name__ == "__main__":
    unittest.main()
