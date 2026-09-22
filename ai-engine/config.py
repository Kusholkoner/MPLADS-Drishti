"""
MPLADS - AI Engine Configuration
Statutory Alignment: MoSPI DIID
"""

import os
from typing import Dict, List
from dotenv import load_dotenv

load_dotenv()

# Service Configuration
HOST = os.getenv("AI_ENGINE_HOST", "0.0.0.0")
PORT = int(os.getenv("AI_ENGINE_PORT", 8000))
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# Supabase Storage Base URL & Bucket for Cloud Datasets
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://qpfffrxbayfbdvqsdfxg.supabase.co")
SUPABASE_DATASETS_BUCKET = "datasets"
SUPABASE_PUBLIC_STORAGE_URL = f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_DATASETS_BUCKET}"

# Risk Scoring Thresholds
RISK_THRESHOLD_CRITICAL = 75.0
RISK_THRESHOLD_MODERATE = 40.0

# 8-Dimensional Multi-Signal Risk Weights (Sum = 1.0)
RISK_DIMENSION_WEIGHTS: Dict[str, float] = {
    "financial": 0.25,          # Mod 7: Financial & Split Payments
    "divergence": 0.20,         # Mod 8: Physical-Financial Divergence
    "visual": 0.15,             # Mod 13: Image Evidence Integrity
    "duplicate": 0.15,          # Mod 9: Duplicate & Ghost Works
    "vendor": 0.10,             # Mod 10: Vendor Monopoly & Shell Splitting
    "compliance": 0.05,         # Mod 4: Statutory Compliance & Quotas
    "timeline": 0.05,           # Mod 6: Timeline & SLA Breaches
    "document": 0.05,           # Mod 11/12: Document Authenticity & OCR
}

# Multi-Signal Confirmation Multiplier: Injected when >= 2 independent severe anomaly signals exceed 80
MULTI_SIGNAL_SEVERE_THRESHOLD = 80.0
MULTI_SIGNAL_BONUS_MULTIPLIER = 15.0

# Statutory Policy Thresholds (MPLADS Guidelines 2023 & GFR 2017)
SANCTION_SLA_DAYS_LIMIT = 45
COMPLETION_SLA_DAYS_LIMIT = 365
OUTSIDE_CONSTITUENCY_ANNUAL_CAP_INR = 2500000.0  # ₹25 Lakhs / year
REPAIR_RENOVATION_ANNUAL_CAP_INR = 5000000.0     # ₹50 Lakhs / year
CALAMITY_CONSENT_ANNUAL_CAP_INR = 10000000.0     # ₹1.00 Crore / calamity
MIN_SC_ALLOCATION_PCT = 15.0                     # 15% SC mandatory allocation
MIN_ST_ALLOCATION_PCT = 7.5                      # 7.5% ST mandatory allocation

# Payment Structuring Thresholds (Split Invoicing)
STRUCTURING_SPLIT_THRESHOLD_INR = 20000.0        # ₹19,990 repeat vouchers
STRUCTURING_MIN_INSTALLMENTS = 15

# Canonical 12 Cloud Datasets Manifest
CLOUD_DATASETS = [
    {"id": "DS-01", "filename": "Works Recommended (Lok Sabha).csv", "house": "Lok Sabha", "type": "recommended"},
    {"id": "DS-02", "filename": "Works Recommended (Rajya Sabha).csv", "house": "Rajya Sabha", "type": "recommended"},
    {"id": "DS-03", "filename": "Works Sanctioned (Lok Sabha).csv", "house": "Lok Sabha", "type": "sanctioned"},
    {"id": "DS-04", "filename": "Works Sanctioned (Rajya Sabha).csv", "house": "Rajya Sabha", "type": "sanctioned"},
    {"id": "DS-05", "filename": "Works Completed (Lok Sabha).csv", "house": "Lok Sabha", "type": "completed"},
    {"id": "DS-06", "filename": "Works Completed (Rajya Sabha).csv", "house": "Rajya Sabha", "type": "completed"},
    {"id": "DS-07", "filename": "Expenditure on Completed and On-going Works as on Date (Lok Sabha).csv", "house": "Lok Sabha", "type": "expenditure"},
    {"id": "DS-08", "filename": "Expenditure on Completed and On-going Works as on Date (Rajya Sabha).csv", "house": "Rajya Sabha", "type": "expenditure"},
    {"id": "DS-09", "filename": "Allocated Limit for Honble MPs (Lok Sabha).csv", "house": "Lok Sabha", "type": "allocated"},
    {"id": "DS-10", "filename": "Allocated Limit for Honble MPs (Rajya Sabha).csv", "house": "Rajya Sabha", "type": "allocated"},
    {"id": "DS-11", "filename": "Amount consented for Calamity (Lok Sabha).csv", "house": "Lok Sabha", "type": "calamity"},
    {"id": "DS-12", "filename": "Amount consented for Calamity (Rajya Sabha).csv", "house": "Rajya Sabha", "type": "calamity"},
]

# Non-Permissible / Prohibited Asset Keyword Lexicon
PROHIBITED_ASSET_KEYWORDS: List[str] = [
    "temple", "mandir", "masjid", "mosque", "church", "gurudwara", "ashram",
    "memorial", "statue", "welcome gate", "swagat dwar", "commemoration",
    "private residence", "commercial complex", "shopping mall", "office building for private",
    "land acquisition", "compensation", "revenue expenditure", "staff salary",
    "inventory purchase", "vehicle purchase for officer", "club house for private"
]
