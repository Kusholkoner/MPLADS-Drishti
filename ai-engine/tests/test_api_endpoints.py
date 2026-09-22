"""
Unit Tests for FastAPI REST Endpoints in MPLADS Sentinel AI Engine
"""

import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from api import app


class TestFastAPIEndpoints(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_root_endpoint(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["active_modules"], 21)
        self.assertEqual(data["status"], "operational")

    def test_health_endpoint(self):
        response = self.client.get("/api/v1/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["modules_loaded"], 21)
        self.assertEqual(data["supabase_cloud_bucket"], "datasets")

    def test_datasets_catalog(self):
        response = self.client.get("/api/v1/datasets")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["total_datasets"], 12)

    def test_analyze_work_endpoint(self):
        payload = {
            "id": "MPL-004821",
            "title": "Construction of Community Hall at Village Khera",
            "category": "Community Infrastructure",
            "district": "New Delhi",
            "state": "Delhi",
            "mp_name": "Smt. Meenakshi Lekhi",
            "implementing_agency": "DSIIDC",
            "vendor_name": "DSIIDC Civil Wing",
            "sanctioned_amount": 3500000.0,
            "disbursed_amount": 3080000.0,
            "financial_progress": 88.0,
            "physical_progress": 52.0,
            "financials": {
                "recommendedAmount": 3500000,
                "sanctionedAmount": 3500000,
                "paidDisbursedAmount": 3080000,
                "comparableMedianAmount": 2600000,
            }
        }
        response = self.client.post("/api/v1/analyze-work", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["data"]["work_id"], "MPL-004821")
        self.assertIn("risk_evaluation", data["data"])
        self.assertIn("evidence_card", data["data"])
        self.assertIn("dossier", data["data"])

    def test_copilot_query_endpoint(self):
        payload = {
            "query": "Which works have high physical financial divergence gap?",
            "user_role": "mospi_officer",
        }
        response = self.client.post("/api/v1/copilot/query", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["intent"], "divergence_query")
        self.assertTrue(len(data["citations"]) > 0)

    def test_vendor_graph_endpoint(self):
        response = self.client.get("/api/v1/vendor-graph/New%20Delhi")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["district"], "New Delhi")
        self.assertTrue(len(data["nodes"]) > 0)
        self.assertTrue(len(data["edges"]) > 0)

    def test_dossier_endpoint(self):
        response = self.client.get("/api/v1/dossier/MPL-004821")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["data"]["work_id"], "MPL-004821")
        self.assertTrue(len(data["data"]["dossier_sha256"]) == 64)

    def test_feedback_disposition_endpoint(self):
        payload = {
            "case_id": "CASE-2026-0891",
            "work_id": "MPL-004821",
            "auditor_id": "AUDITOR-PRIYA",
            "disposition": "confirmed_irregularity",
            "auditor_notes": "Recovery of excess disbursal ordered.",
            "triggered_signals": ["DIV-PROGRESS-GAP", "VEND-IDA-SELF-DEALING"],
        }
        response = self.client.post("/api/v1/feedback/disposition", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")
        self.assertTrue(data["is_confirmed_irregularity"])


if __name__ == "__main__":
    unittest.main()
