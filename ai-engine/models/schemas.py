"""
Pydantic Schemas for MPLADS Engine
Defines input, output, evidence card, and dossier data transfer objects.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime, timezone


def current_utc_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class GPSCoordinates(BaseModel):
    latitude: float = 0.0
    longitude: float = 0.0


class FinancialRecord(BaseModel):
    recommended_amount: float = 0.0
    sanctioned_amount: float = 0.0
    disbursed_amount: float = 0.0
    verified_expenditure_amount: float = 0.0
    unreconciled_gap: float = 0.0
    comparable_median_amount: float = 0.0
    cost_deviation_pct: float = 0.0
    installment_count: int = 1
    installments: List[Dict[str, Any]] = []


class MilestoneRecord(BaseModel):
    id: str
    sequence: int
    name: str
    status: str = "pending"  # pending, in_progress, completed, delayed
    disbursed_amount: float = 0.0
    completion_percentage: float = 0.0
    target_date: Optional[str] = None
    actual_date: Optional[str] = None


class EvidenceItem(BaseModel):
    id: str
    work_id: str
    type: str  # image, document, payment, certificate, report, gps
    category: str = "General Evidence"
    title: str
    status: str = "verified"  # verified, conflict, review, missing
    file_url: Optional[str] = None
    file_size: Optional[str] = None
    sha256_hash: Optional[str] = None
    phash: Optional[str] = None
    gps_lat: Optional[float] = None
    gps_lng: Optional[float] = None
    geofence_distance_m: Optional[float] = None
    metadata: Dict[str, Any] = {}
    extracted_fields: List[Dict[str, Any]] = []
    findings: List[Dict[str, Any]] = []


class CanonicalWorkProfile(BaseModel):
    work_id: str
    title: str
    category: str
    state: str
    district: str
    constituency: str
    mp_name: str
    mp_house: str = "Lok Sabha"  # Lok Sabha, Rajya Sabha
    implementing_agency: str
    vendor_name: Optional[str] = None
    status: str = "in_progress"  # proposed, sanctioned, in_progress, completed, delayed, stalled, under_audit
    financial_progress_pct: float = 0.0
    physical_progress_pct: float = 0.0
    financials: FinancialRecord = Field(default_factory=FinancialRecord)
    dates: Dict[str, Optional[str]] = {
        "recommended_date": None,
        "sanctioned_date": None,
        "work_order_date": None,
        "expected_completion_date": None,
        "actual_completion_date": None,
    }
    gps_coordinates: GPSCoordinates = Field(default_factory=GPSCoordinates)
    milestones: List[MilestoneRecord] = []
    evidence_items: List[EvidenceItem] = []
    tags: List[str] = []


class AnomalySignal(BaseModel):
    signal_id: str
    dimension: str  # financial, divergence, visual, duplicate, vendor, compliance, timeline, document
    severity: str   # critical, high, medium, low
    module_name: str
    score_contribution: float  # 0 to 100
    confidence: float          # 0.0 to 1.0
    finding: str
    explanation: str
    citation: str
    evidence_ids: List[str] = []
    metadata: Dict[str, Any] = {}


class RiskBreakdown(BaseModel):
    financial_score: float = 0.0
    divergence_score: float = 0.0
    visual_score: float = 0.0
    duplicate_score: float = 0.0
    vendor_score: float = 0.0
    compliance_score: float = 0.0
    timeline_score: float = 0.0
    document_score: float = 0.0


class RiskEvaluationResult(BaseModel):
    work_id: str
    composite_risk_score: float
    risk_band: str  # critical, high, moderate, low
    is_escalated: bool = False
    confirmatory_signal_count: int = 0
    breakdown: RiskBreakdown
    signals: List[AnomalySignal] = []
    recommended_action: str
    suggested_inspection_checklist: List[str] = []
    evaluated_at: str = Field(default_factory=current_utc_iso)


class EvidenceCard(BaseModel):
    work_id: str
    project_title: str
    mp_name: str
    district: str
    sanctioned_amount_inr: float
    disbursed_amount_inr: float
    physical_progress_verified_pct: float
    composite_risk_score: float
    risk_band: str
    triggering_signals: List[Dict[str, Any]]
    actionable_inspection_checklist: List[str]
    dossier_sha256_hash: str


class InvestigationDossier(BaseModel):
    dossier_id: str
    work_id: str
    project_title: str
    state: str
    district: str
    mp_name: str
    implementing_agency: str
    vendor_name: Optional[str]
    composite_risk_score: float
    risk_band: str
    executive_summary: str
    signals: List[AnomalySignal]
    evidence_chain: List[Dict[str, Any]]
    inspection_order: Dict[str, Any]
    dossier_sha256: str
    generated_at: str


class DataQualityReport(BaseModel):
    dataset_name: str
    total_rows: int
    data_quality_score: float
    missing_critical_fields: int
    duplicate_rows_detected: int
    invalid_data_types: int
    normalization_warnings: int
    sample_anomalies: List[Dict[str, Any]]


class AuditCopilotQuery(BaseModel):
    query: str
    user_role: str = "mospi_officer"
    target_state: Optional[str] = None
    target_district: Optional[str] = None
    target_work_id: Optional[str] = None


class AuditCopilotResponse(BaseModel):
    query: str
    intent: str
    answer: str
    citations: List[str]
    matched_works: List[Dict[str, Any]] = []
    suggested_follow_ups: List[str] = []
    confidence: float = 0.95


class VendorGraphNode(BaseModel):
    id: str
    label: str
    type: str  # mp, agency, vendor, work
    risk_score: Optional[float] = 0.0


class VendorGraphEdge(BaseModel):
    source: str
    target: str
    relationship: str
    value_inr: float = 0.0
    count: int = 1


class VendorGraphResponse(BaseModel):
    district: str
    hhi_index: float
    monopoly_level: str  # high_monopoly, moderate, competitive
    nodes: List[VendorGraphNode]
    edges: List[VendorGraphEdge]
    flagged_collusion_clusters: List[Dict[str, Any]]
