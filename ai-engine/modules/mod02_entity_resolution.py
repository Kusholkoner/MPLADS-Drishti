"""
Module 2: Cross-Dataset Entity Intelligence
Responsibilities: Join and resolve the same real-world work across disparate datasets.
"""

from typing import Dict, Any, Optional
from rapidfuzz import fuzz
from models.schemas import CanonicalWorkProfile, FinancialRecord, GPSCoordinates


class EntityResolutionAI:
    """Module 2: Reconciles records across datasets into a single canonical Work Profile."""

    @staticmethod
    def calculate_match_confidence(rec1: Dict[str, Any], rec2: Dict[str, Any]) -> Dict[str, Any]:
        """Calculates multi-key entity match confidence between two records."""
        # 1. Exact Work ID Match
        id1 = str(rec1.get("work_id", "")).strip().upper()
        id2 = str(rec2.get("work_id", "")).strip().upper()
        if id1 and id2 and id1 == id2:
            return {
                "match_confidence": 1.0,
                "match_method": "exact_work_id",
                "matched_fields": ["work_id"],
                "is_confident": True,
            }

        # 2. Secondary Compound Keys: MP + District + Amount
        matched_fields = []
        confidence_score = 0.0

        # MP Name fuzzy match
        mp1 = str(rec1.get("mp_name", "")).lower()
        mp2 = str(rec2.get("mp_name", "")).lower()
        mp_ratio = fuzz.token_sort_ratio(mp1, mp2) / 100.0
        if mp_ratio >= 0.85:
            matched_fields.append("mp_name")
            confidence_score += 0.35

        # District / State exact match
        dist1 = str(rec1.get("district", "")).lower()
        dist2 = str(rec2.get("district", "")).lower()
        if dist1 and dist2 and dist1 == dist2:
            matched_fields.append("district")
            confidence_score += 0.25

        # Sanction / Estimated Amount match within 5%
        amt1 = float(rec1.get("sanctioned_amount", 0.0) or rec1.get("recommended_amount", 0.0))
        amt2 = float(rec2.get("sanctioned_amount", 0.0) or rec2.get("recommended_amount", 0.0))
        if amt1 > 0 and amt2 > 0:
            diff_pct = abs(amt1 - amt2) / max(amt1, amt2)
            if diff_pct <= 0.05:
                matched_fields.append("amount")
                confidence_score += 0.25

        # Description text similarity
        desc1 = str(rec1.get("title", "") or rec1.get("description", "")).lower()
        desc2 = str(rec2.get("title", "") or rec2.get("description", "")).lower()
        desc_ratio = fuzz.token_set_ratio(desc1, desc2) / 100.0
        if desc_ratio >= 0.80:
            matched_fields.append("description")
            confidence_score += 0.15

        confidence_score = round(min(1.0, confidence_score), 2)
        return {
            "match_confidence": confidence_score,
            "match_method": "composite_secondary_keys" if confidence_score >= 0.70 else "low_confidence_unresolved",
            "matched_fields": matched_fields,
            "is_confident": confidence_score >= 0.75,
        }

    @classmethod
    def build_canonical_profile(cls, raw_data: Dict[str, Any]) -> CanonicalWorkProfile:
        """Constructs a validated CanonicalWorkProfile from arbitrary ingestion payloads."""
        work_id = str(raw_data.get("id") or raw_data.get("work_id") or "MPL-UNKNOWN").strip()
        title = str(raw_data.get("title") or raw_data.get("Work description") or "Untitled MPLADS Work").strip()
        category = str(raw_data.get("category") or raw_data.get("Work category") or "Community Infrastructure").strip()
        state = str(raw_data.get("state") or raw_data.get("State") or "Delhi").strip()
        district = str(raw_data.get("district") or raw_data.get("IDA") or "Central").strip()
        constituency = str(raw_data.get("constituency") or raw_data.get("Constituency") or district).strip()
        mp_name = str(raw_data.get("mp_name") or raw_data.get("Hon'ble Members of Parliament") or "Hon'ble MP").strip()
        agency = str(raw_data.get("implementing_agency") or raw_data.get("IDA") or "District Development Authority").strip()
        vendor = str(raw_data.get("vendor_name") or raw_data.get("Vendor") or "").strip() or None

        # Financial values
        fin_dict = raw_data.get("financials", {})
        rec_amt = float(fin_dict.get("recommendedAmount", raw_data.get("recommended_amount", 0.0)) or 0.0)
        sanc_amt = float(fin_dict.get("sanctionedAmount", raw_data.get("Sanction Amount ( ₹ )", raw_data.get("sanctioned_amount", 0.0))) or 0.0)
        disb_amt = float(fin_dict.get("paidDisbursedAmount", raw_data.get("disbursed_amount", 0.0)) or 0.0)
        verified_exp = float(fin_dict.get("verifiedExpenditureAmount", raw_data.get("verified_expenditure_amount", disb_amt)) or 0.0)

        fin_progress = float(raw_data.get("financial_progress", (disb_amt / max(1.0, sanc_amt)) * 100.0 if sanc_amt > 0 else 0.0))
        phys_progress = float(raw_data.get("physical_progress", 0.0))

        gps_data = raw_data.get("gps_coordinates", {})
        gps = GPSCoordinates(
            latitude=float(gps_data.get("latitude", 28.6139)),
            longitude=float(gps_data.get("longitude", 77.2090)),
        )

        return CanonicalWorkProfile(
            work_id=work_id,
            title=title,
            category=category,
            state=state,
            district=district,
            constituency=constituency,
            mp_name=mp_name,
            mp_house=str(raw_data.get("mp_house", "Lok Sabha")),
            implementing_agency=agency,
            vendor_name=vendor,
            status=str(raw_data.get("status", "in_progress")),
            financial_progress_pct=round(fin_progress, 1),
            physical_progress_pct=round(phys_progress, 1),
            financials=FinancialRecord(
                recommended_amount=rec_amt,
                sanctioned_amount=sanc_amt,
                disbursed_amount=disb_amt,
                verified_expenditure_amount=verified_exp,
                unreconciled_gap=abs(disb_amt - verified_exp),
                comparable_median_amount=float(fin_dict.get("comparableMedianAmount", sanc_amt * 0.85)),
                cost_deviation_pct=float(fin_dict.get("costDeviationPercent", 0.0)),
            ),
            gps_coordinates=gps,
        )
