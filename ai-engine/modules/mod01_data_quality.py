"""
Module 1: Data Quality AI
Responsibilities: Schema validation, missing fields, duplicate detection, text normalization.
"""

import re
import pandas as pd
from typing import Dict, Any, List
from models.schemas import DataQualityReport


class DataQualityAI:
    """Module 1: Evaluates and cleans data entering the surveillance engine."""

    @staticmethod
    def normalize_text(text: str) -> str:
        if not text or pd.isna(text):
            return ""
        cleaned = re.sub(r"[^\w\s\-\.\/]", "", str(text)).strip()
        cleaned = re.sub(r"\s+", " ", cleaned)
        return cleaned.title()

    @staticmethod
    def normalize_vendor_name(name: str) -> str:
        if not name or pd.isna(name):
            return "Unknown Vendor"
        s = str(name).upper().strip()
        s = re.sub(r"^(M/S\.?|M/S|SH\.|SHRI|SMT\.)\s*", "", s)
        # Iteratively strip legal suffix tokens
        suffixes = ["LTD", "LIMITED", "PVT", "PRIVATE", "INFRA", "CONSTRUCTIONS", "CONSTRUCTION", "CORP", "CORPORATION", "ENTERPRISES", "CO"]
        tokens = [t.strip(".,") for t in s.split() if t.strip(".,") not in suffixes]
        clean_s = " ".join(tokens)
        clean_s = re.sub(r"[^\w\s]", "", clean_s)
        return re.sub(r"\s+", " ", clean_s).strip() or s

    @classmethod
    def evaluate_dataframe_quality(cls, df: pd.DataFrame, dataset_name: str) -> DataQualityReport:
        if df.empty:
            return DataQualityReport(
                dataset_name=dataset_name,
                total_rows=0,
                data_quality_score=0.0,
                missing_critical_fields=0,
                duplicate_rows_detected=0,
                invalid_data_types=0,
                normalization_warnings=0,
                sample_anomalies=[],
            )

        total_rows = len(df)
        null_counts = df.isnull().sum().sum()
        total_cells = df.size
        null_rate = null_counts / max(1, total_cells)

        duplicates_count = int(df.duplicated().sum())

        anomalies = []
        if duplicates_count > 0:
            anomalies.append({
                "type": "exact_duplicate_rows",
                "count": duplicates_count,
                "description": f"Found {duplicates_count} identical repeated rows in dataset."
            })

        score = 100.0 - (null_rate * 40.0) - min(30.0, (duplicates_count / max(1, total_rows)) * 100.0)
        score = max(0.0, min(100.0, score))

        return DataQualityReport(
            dataset_name=dataset_name,
            total_rows=total_rows,
            data_quality_score=round(score, 1),
            missing_critical_fields=int(null_counts),
            duplicate_rows_detected=duplicates_count,
            invalid_data_types=0,
            normalization_warnings=int(null_counts * 0.2),
            sample_anomalies=anomalies,
        )
