"""
Module 14: Geospatial Intelligence
Responsibilities: Haversine distance geofencing, boundary checks, spatial clustering.
"""

import math
from typing import List
from models.schemas import CanonicalWorkProfile, AnomalySignal


class GeospatialIntelligenceAI:
    """Module 14: Validates GPS coordinates, EXIF geolocations, and geofence offsets."""

    @staticmethod
    def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculates great-circle distance between two points on earth in meters."""
        R = 6371000.0  # Earth radius in meters
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)

        a = math.sin(delta_phi / 2.0) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        return R * c

    @classmethod
    def evaluate_geospatial(cls, profile: CanonicalWorkProfile) -> List[AnomalySignal]:
        signals = []
        reg_lat = profile.gps_coordinates.latitude
        reg_lng = profile.gps_coordinates.longitude

        if reg_lat == 0.0 and reg_lng == 0.0:
            return signals

        # Validate against uploaded evidence EXIF coordinates
        for evd in profile.evidence_items:
            evd_lat = evd.gps_lat or evd.metadata.get("gpsLatitude")
            evd_lng = evd.gps_lng or evd.metadata.get("gpsLongitude")

            if evd_lat and evd_lng:
                distance_m = cls.haversine_distance_meters(reg_lat, reg_lng, float(evd_lat), float(evd_lng))
                if distance_m > 250.0:  # > 250 meters away from registered asset
                    dist_km = distance_m / 1000.0
                    severity = "critical" if distance_m > 5000.0 else "high"
                    signals.append(
                        AnomalySignal(
                            signal_id=f"GEO-GEOFENCE-BREACH-{evd.id}",
                            dimension="visual",
                            severity=severity,
                            module_name="Geospatial Intelligence AI v2.0",
                            score_contribution=85.0,
                            confidence=0.97,
                            finding=f"Geofence Offset Breach ({dist_km:.2f} km offset from registered site in {evd.id})",
                            explanation=f"Evidence geotag ({evd_lat:.4f}, {evd_lng:.4f}) is {dist_km:.2f} km away from registered project site ({reg_lat:.4f}, {reg_lng:.4f}).",
                            citation="eSAKSHI Geotagging Standard & NIC Geofencing Protocol §3.1",
                            evidence_ids=[evd.id],
                        )
                    )

        return signals
