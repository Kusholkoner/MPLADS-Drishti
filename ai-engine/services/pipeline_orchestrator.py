"""
Pipeline Orchestrator for MPLADS 
Executes the full 21-module AI surveillance pipeline on project profiles.
"""

from typing import Dict, Any, List, Optional
from models.schemas import (
    CanonicalWorkProfile,
    RiskEvaluationResult,
    EvidenceCard,
    InvestigationDossier,
)
from modules import (
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
)


class PipelineOrchestrator:
    """Coordinates end-to-end multi-module surveillance execution."""

    @classmethod
    def run_full_pipeline(
        cls,
        profile: CanonicalWorkProfile,
        peer_works: Optional[List[Dict[str, Any]]] = None,
        peer_costs: Optional[List[float]] = None,
        district_vendor_shares: Optional[Dict[str, float]] = None,
    ) -> Dict[str, Any]:
        all_signals = []

        # 1. Proposal Intelligence (Mod 3)
        all_signals.extend(ProposalIntelligenceAI.evaluate_proposal(profile))

        # 2. Statutory Compliance (Mod 4)
        all_signals.extend(StatutoryComplianceAI.evaluate_compliance(profile))

        # 3. Cost Anomaly AI (Mod 5)
        all_signals.extend(CostAnomalyAI.evaluate_cost(profile, peer_costs))

        # 4. Timeline Intelligence (Mod 6)
        all_signals.extend(TimelineIntelligenceAI.evaluate_timeline(profile))

        # 5. Financial Intelligence (Mod 7)
        all_signals.extend(FinancialIntelligenceAI.evaluate_financials(profile))

        # 6. Physical-Financial Divergence (Mod 8)
        all_signals.extend(PhysicalFinancialDivergenceAI.evaluate_divergence(profile))

        # 7. Duplicate / Split Work (Mod 9)
        all_signals.extend(DuplicateWorkAI.evaluate_duplicates(profile, peer_works))

        # 8. Vendor Intelligence (Mod 10)
        all_signals.extend(VendorIntelligenceAI.evaluate_vendor(profile, district_vendor_shares))

        # 9. Document Intelligence (Mod 11)
        all_signals.extend(DocumentIntelligenceAI.evaluate_documents(profile))

        # 10. Document Similarity (Mod 12)
        all_signals.extend(DocumentSimilarityAI.evaluate_similarity(profile))

        # 11. Visual Verification (Mod 13)
        all_signals.extend(VisualVerificationAI.evaluate_visuals(profile))

        # 12. Geospatial Intelligence (Mod 14)
        all_signals.extend(GeospatialIntelligenceAI.evaluate_geospatial(profile))

        # 13. Graph Intelligence (Mod 15)
        all_signals.extend(GraphIntelligenceAI.evaluate_graph(profile))

        # 14. Predictive Risk (Mod 16)
        all_signals.extend(PredictiveRiskAI.evaluate_future_risk(profile))

        # 15. Multi-Signal Risk Fusion (Mod 17)
        risk_result: RiskEvaluationResult = RiskFusionEngine.fuse_risk_signals(profile, all_signals)

        # 16. Explanation Narrative (Mod 18)
        narrative = ExplanationEngine.generate_explanation_narrative(profile, risk_result)

        # 17. Evidence Card & Investigation Dossier (Mod 19)
        evidence_card: EvidenceCard = InvestigationDossierGenerator.generate_evidence_card(profile, risk_result)
        dossier: InvestigationDossier = InvestigationDossierGenerator.generate_dossier(profile, risk_result)

        return {
            "work_id": profile.work_id,
            "profile": profile.model_dump(),
            "risk_evaluation": risk_result.model_dump(),
            "explanation": narrative,
            "evidence_card": evidence_card.model_dump(),
            "dossier": dossier.model_dump(),
        }
