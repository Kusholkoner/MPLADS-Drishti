"""
MPLADS Sentinel - 21 AI Detection Modules
Statutory Alignment: MoSPI DIID | SIH26102
"""

from .mod01_data_quality import DataQualityAI
from .mod02_entity_resolution import EntityResolutionAI
from .mod03_proposal_intelligence import ProposalIntelligenceAI
from .mod04_compliance import StatutoryComplianceAI
from .mod05_cost_anomaly import CostAnomalyAI
from .mod06_timeline import TimelineIntelligenceAI
from .mod07_financial import FinancialIntelligenceAI
from .mod08_physical_financial import PhysicalFinancialDivergenceAI
from .mod09_duplicate_work import DuplicateWorkAI
from .mod10_vendor_intelligence import VendorIntelligenceAI
from .mod11_document_intelligence import DocumentIntelligenceAI
from .mod12_document_similarity import DocumentSimilarityAI
from .mod13_visual_verification import VisualVerificationAI
from .mod14_geospatial import GeospatialIntelligenceAI
from .mod15_graph_intelligence import GraphIntelligenceAI
from .mod16_predictive_risk import PredictiveRiskAI
from .mod17_risk_fusion import RiskFusionEngine
from .mod18_explanation_engine import ExplanationEngine
from .mod19_dossier_generator import InvestigationDossierGenerator
from .mod20_audit_copilot import AuditCopilot
from .mod21_active_learning import ActiveLearningFeedback

__all__ = [
    "DataQualityAI",
    "EntityResolutionAI",
    "ProposalIntelligenceAI",
    "StatutoryComplianceAI",
    "CostAnomalyAI",
    "TimelineIntelligenceAI",
    "FinancialIntelligenceAI",
    "PhysicalFinancialDivergenceAI",
    "DuplicateWorkAI",
    "VendorIntelligenceAI",
    "DocumentIntelligenceAI",
    "DocumentSimilarityAI",
    "VisualVerificationAI",
    "GeospatialIntelligenceAI",
    "GraphIntelligenceAI",
    "PredictiveRiskAI",
    "RiskFusionEngine",
    "ExplanationEngine",
    "InvestigationDossierGenerator",
    "AuditCopilot",
    "ActiveLearningFeedback",
]
