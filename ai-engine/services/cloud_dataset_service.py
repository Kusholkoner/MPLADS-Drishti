"""
Cloud Dataset Service for MPLADS Sentinel
Streams, parses, and in-memory caches official MPLADS CSV datasets from Supabase Cloud Storage.
"""

import io
import urllib.parse
import pandas as pd
import requests
from typing import Dict, List, Optional, Any
from config import SUPABASE_PUBLIC_STORAGE_URL, CLOUD_DATASETS

_MEMORY_CACHE: Dict[str, pd.DataFrame] = {}


class CloudDatasetService:
    """Service to stream datasets from Supabase Cloud Storage on-demand."""

    @staticmethod
    def get_public_url(filename: str) -> str:
        encoded_filename = urllib.parse.quote(filename)
        return f"{SUPABASE_PUBLIC_STORAGE_URL}/{encoded_filename}"

    @classmethod
    def load_dataset_df(cls, filename: str, limit: Optional[int] = None) -> pd.DataFrame:
        """Downloads/streams CSV dataset from Supabase storage into a pandas DataFrame."""
        if filename in _MEMORY_CACHE:
            df = _MEMORY_CACHE[filename]
            return df.head(limit) if limit else df

        url = cls.get_public_url(filename)
        try:
            resp = requests.get(url, timeout=15)
            if resp.status_code == 200:
                # Read CSV from memory stream
                df = pd.read_csv(io.BytesIO(resp.content), low_memory=False, encoding="utf-8-sig")
                
                # Strip Grand Total / summary footers common in official dumps
                if len(df) > 0:
                    first_col = df.columns[0]
                    df = df[~df[first_col].astype(str).str.lower().str.contains("grand total|total", na=False)]
                
                _MEMORY_CACHE[filename] = df
                return df.head(limit) if limit else df
            else:
                print(f"[CloudDatasetService] Warning: Status {resp.status_code} for {filename}")
                return pd.DataFrame()
        except Exception as e:
            print(f"[CloudDatasetService] Error streaming {filename}: {e}")
            return pd.DataFrame()

    @classmethod
    def list_available_datasets(cls) -> List[Dict[str, Any]]:
        """Returns catalog of all 12 cloud datasets."""
        results = []
        for ds in CLOUD_DATASETS:
            results.append({
                "id": ds["id"],
                "filename": ds["filename"],
                "house": ds["house"],
                "type": ds["type"],
                "public_url": cls.get_public_url(ds["filename"]),
                "cached": ds["filename"] in _MEMORY_CACHE,
            })
        return results

    @classmethod
    def preload_all(cls) -> Dict[str, int]:
        """Preloads all 12 datasets into memory."""
        summary = {}
        for ds in CLOUD_DATASETS:
            df = cls.load_dataset_df(ds["filename"])
            summary[ds["filename"]] = len(df)
        return summary
