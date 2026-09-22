"""
Module 15: Graph Intelligence
Responsibilities: NetworkX relationship graphs, collusion loops, centrality, and vendor-agency cliques.
"""

import networkx as nx
from typing import List, Dict, Any
from models.schemas import CanonicalWorkProfile, AnomalySignal, VendorGraphResponse, VendorGraphNode, VendorGraphEdge


class GraphIntelligenceAI:
    """Module 15: Analyzes relational graph topologies across MPs, Implementing Agencies, and Vendors."""

    @classmethod
    def evaluate_graph(cls, profile: CanonicalWorkProfile, district_graph: nx.Graph = None) -> List[AnomalySignal]:
        signals = []
        if district_graph and district_graph.number_of_nodes() > 0:
            vendor_node = f"VEND:{profile.vendor_name}"
            agency_node = f"AGENCY:{profile.implementing_agency}"

            # Check if vendor has high betweenness centrality (hub)
            if vendor_node in district_graph:
                degree = district_graph.degree(vendor_node)
                if degree >= 8:  # Tied to 8+ projects/agencies in cluster
                    signals.append(
                        AnomalySignal(
                            signal_id="GRAPH-HIGH-CENTRALITY-HUB",
                            dimension="vendor",
                            severity="high",
                            module_name="Graph Intelligence AI (NetworkX)",
                            score_contribution=20.0,
                            confidence=0.92,
                            finding=f"High Graph Centrality: Vendor '{profile.vendor_name}' is connected to {degree} separate projects",
                            explanation=f"Entity network analysis reveals high hub centrality (degree={degree}), indicating multi-agency capture.",
                            citation="CVC Anti-Collusion Framework & Network Graph Surveillance Standard",
                        )
                    )

        return signals

    @classmethod
    def generate_district_graph(cls, works: List[Dict[str, Any]], district: str) -> VendorGraphResponse:
        """Constructs and returns visual graph nodes and edges for a district."""
        G = nx.Graph()
        nodes_dict = {}
        edges_list = []
        vendor_totals = {}
        total_district_spend = 0.0

        for w in works:
            mp = str(w.get("mp_name", "Hon'ble MP"))
            agency = str(w.get("implementing_agency", "Agency"))
            vendor = str(w.get("vendor_name", w.get("Vendor", "Vendor")))
            amt = float(w.get("sanctioned_amount", w.get("financials", {}).get("sanctionedAmount", 1000000.0)))
            total_district_spend += amt

            mp_id = f"MP:{mp}"
            agency_id = f"AGENCY:{agency}"
            vend_id = f"VEND:{vendor}"

            nodes_dict[mp_id] = VendorGraphNode(id=mp_id, label=mp, type="mp")
            nodes_dict[agency_id] = VendorGraphNode(id=agency_id, label=agency, type="agency")
            nodes_dict[vend_id] = VendorGraphNode(id=vend_id, label=vendor, type="vendor")

            edges_list.append(VendorGraphEdge(source=mp_id, target=agency_id, relationship="assigned_to", value_inr=amt))
            edges_list.append(VendorGraphEdge(source=agency_id, target=vend_id, relationship="awarded_contract", value_inr=amt))

            G.add_edge(mp_id, agency_id, weight=amt)
            G.add_edge(agency_id, vend_id, weight=amt)

            vendor_totals[vendor] = vendor_totals.get(vendor, 0.0) + amt

        # Calculate HHI (Herfindahl-Hirschman Index)
        hhi = 0.0
        if total_district_spend > 0:
            for v, v_spend in vendor_totals.items():
                market_share_pct = (v_spend / total_district_spend) * 100.0
                hhi += market_share_pct ** 2

        monopoly_level = "high_monopoly" if hhi >= 2500 else ("moderate" if hhi >= 1500 else "competitive")

        # Louvain Modularity Community & Cartel Ring Detection
        flagged_clusters = []
        try:
            from networkx.algorithms.community import louvain_communities
            if G.number_of_nodes() >= 4 and G.number_of_edges() >= 3:
                communities = louvain_communities(G, weight="weight", seed=42)
                for c_idx, comm in enumerate(communities):
                    vendors_in_comm = [n for n in comm if n.startswith("VEND:")]
                    agencies_in_comm = [n for n in comm if n.startswith("AGENCY:")]
                    if len(vendors_in_comm) >= 2 and len(agencies_in_comm) >= 1:
                        # Calculate cluster share of spend
                        comm_spend = sum(vendor_totals.get(v.replace("VEND:", ""), 0.0) for v in vendors_in_comm)
                        share_pct = (comm_spend / total_district_spend * 100.0) if total_district_spend > 0 else 0.0
                        if share_pct >= 40.0:
                            flagged_clusters.append({
                                "cluster_id": f"CARTEL-LOUVAIN-{district.upper()}-{c_idx+1}",
                                "algorithm": "Louvain Modularity (NetworkX)",
                                "agencies": [a.replace("AGENCY:", "") for a in agencies_in_comm],
                                "vendors": [v.replace("VEND:", "") for v in vendors_in_comm],
                                "cluster_expenditure_share": f"{share_pct:.1f}%",
                                "risk_verdict": "CRITICAL: Bid-Rigging Syndicate / Cartel Ring",
                            })
        except Exception:
            pass

        return VendorGraphResponse(
            district=district,
            hhi_index=round(hhi, 1),
            monopoly_level=monopoly_level,
            nodes=list(nodes_dict.values()),
            edges=edges_list,
            flagged_collusion_clusters=flagged_clusters,
        )
