"""
Semantic Intelligence Engine — all-MiniLM-L6-v2
Multi-Source Surveillance and Grounded Statutory RAG for MPLADS 

Provides:
- 384-dimensional dense sentence embeddings using sentence-transformers/all-MiniLM-L6-v2
- Fast CPU-based semantic similarity calculation between project work descriptions
- Vector search and RAG retrieval over MoSPI 2023 Guidelines, GFR 2017, and CPWD Norms
- Hybrid fallback ensuring zero-downtime if transformer weights are initializing
"""

import os
import logging
from typing import List, Dict, Any, Tuple, Optional
import numpy as np

logger = logging.getLogger("SemanticEngine")

MODEL_NAME = "all-MiniLM-L6-v2"
_MODEL_INSTANCE = None
_IS_INITIALIZING = False

# Core statutory clauses knowledge base for RAG vector search
STATUTORY_KNOWLEDGE_BASE = [
    {
        "id": "RULE-2023-2.3",
        "title": "Prohibition of Duplicate Sanctions for Identical Asset Scopes",
        "category": "Scope Duplication",
        "source": "MPLADS Scheme Guidelines 2023 §2.3",
        "text": "No project proposal or work recommendation shall be sanctioned if it duplicates or overlaps with an existing sanctioned work, asset under construction, or already completed asset within the same spatial buffer or village boundary.",
    },
    {
        "id": "RULE-2023-3.4",
        "title": "Milestone-Linked Fund Release & Physical-Financial Divergence",
        "category": "Financial Vigilance",
        "source": "MPLADS Scheme Guidelines 2023 §3.4",
        "text": "Subsequent fund installments and running account disbursements shall be strictly released upon certified physical milestone completion of at least 60% of previous tranche, verified through geotagged mobile application evidence.",
    },
    {
        "id": "RULE-2023-ANNEX-II-4",
        "title": "Negative List: Ineligible Commercial & Private Entities",
        "category": "Statutory Eligibility",
        "source": "MPLADS Guidelines 2023 Annexure-II Item 4",
        "text": "Works belonging to or benefiting commercial organizations, private clubs, residential housing societies, or proprietary establishments are strictly prohibited under MPLADS funds.",
    },
    {
        "id": "RULE-2023-ANNEX-II-7",
        "title": "Negative List: Purchase of Movable Inventory & Recurring Expenditure",
        "category": "Statutory Eligibility",
        "source": "MPLADS Guidelines 2023 Annexure-II Item 7",
        "text": "MPLADS funds cannot be utilized for inventory, recurring maintenance, staff salaries, consumables, or assets of temporary nature. Only durable community capital assets are eligible.",
    },
    {
        "id": "RULE-GFR-130",
        "title": "Excess Financial Expenditure Beyond Sanctioned Estimate",
        "category": "Cost Anomaly",
        "source": "General Financial Rules (GFR) 2017 Rule 130",
        "text": "No expenditure shall be incurred against a public works project in excess of the sanctioned estimate without prior formal administrative and revised financial approval from the competent authority.",
    },
    {
        "id": "RULE-GFR-157",
        "title": "Prohibition of Splitting Tenders to Circumvent Competent Authority",
        "category": "Procurement Integrity",
        "source": "General Financial Rules (GFR) 2017 Rule 157",
        "text": "A demand for goods or public works shall not be divided into smaller quantities or split into multiple smaller contracts merely to avoid the necessity of obtaining sanction of higher authority or open competitive bidding.",
    },
    {
        "id": "RULE-CVC-PHOTO",
        "title": "Mandatory Authentic Photographic Evidence for Milestone Certification",
        "category": "Visual Evidence",
        "source": "CVC Vigilance Manual 2021 §7.3 & MoSPI e-SAKSHI Norms",
        "text": "Milestone certification must be accompanied by genuine, unmanipulated geotagged on-site photographs matching project coordinates within 250 meters. Photographic reuse or perceptual hash collision constitutes fraudulent certification.",
    },
]


# Common Indian administrative, civil works & scheme lexicon for cross-lingual alignment
REGIONAL_LEXICON_MAP = {
    "सामुदायिक": "community multipurpose",
    "भवन": "hall building centre bhawan",
    "निर्माण": "construction erection building",
    "सड़क": "road pathway street",
    "मार्ग": "road highway route",
    "प्रकाश": "lighting solar lights luminaire",
    "शौचालय": "toilet sanitation facility",
    "पेयजल": "drinking water pipeline supply",
    "कल्याण": "welfare social",
    "शाला": "school education classroom",
    "दुरुस्ती": "repair renovation maintenance",
    "पुनर्निर्माण": "reconstruction redevelopment",
}


def normalize_regional_text(text: str) -> str:
    """Enhances regional language tokens with cross-lingual concepts for high-accuracy alignment."""
    if not text:
        return ""
    words = text.split()
    normalized = []
    for w in words:
        clean_w = w.strip(".,;:\"'()")
        if clean_w in REGIONAL_LEXICON_MAP:
            normalized.append(f"{clean_w} {REGIONAL_LEXICON_MAP[clean_w]}")
        else:
            normalized.append(clean_w)
    return " ".join(normalized)


class SemanticEngine:
    """Singleton service for all-MiniLM-L6-v2 neural embeddings and vector similarity."""

    @classmethod
    def get_model(cls):
        global _MODEL_INSTANCE, _IS_INITIALIZING
        if _MODEL_INSTANCE is not None:
            return _MODEL_INSTANCE

        if not _IS_INITIALIZING:
            _IS_INITIALIZING = True
            try:
                from sentence_transformers import SentenceTransformer
                logger.info(f"Loading neural embedding model: {MODEL_NAME}...")
                _MODEL_INSTANCE = SentenceTransformer(MODEL_NAME)
                logger.info(f"Successfully loaded {MODEL_NAME} (384-dimensional dense vectors).")
            except Exception as e:
                logger.warning(f"Could not load SentenceTransformer('{MODEL_NAME}'): {e}. Operating in resilient fallback mode.")
                _MODEL_INSTANCE = None
            finally:
                _IS_INITIALIZING = False

        return _MODEL_INSTANCE

    @classmethod
    def encode(cls, texts: List[str]) -> np.ndarray:
        """Encodes a list of texts into 384-dimensional dense embeddings."""
        model = cls.get_model()
        if model is not None:
            try:
                embeddings = model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)
                return embeddings
            except Exception as err:
                logger.warning(f"SentenceTransformer encoding error: {err}")

        # Resilient local fallback using scikit-learn TF-IDF & Character N-Grams
        from sklearn.feature_extraction.text import TfidfVectorizer
        vectorizer = TfidfVectorizer(ngram_range=(1, 3), min_df=1, sublinear_tf=True)
        try:
            mat = vectorizer.fit_transform(texts).toarray()
            # Normalize rows
            norms = np.linalg.norm(mat, axis=1, keepdims=True)
            norms[norms == 0] = 1.0
            return mat / norms
        except Exception:
            # Absolute fallback
            return np.ones((len(texts), 384)) / np.sqrt(384)

    @classmethod
    def compute_similarity(cls, text1: str, text2: str) -> float:
        """
        Computes the cosine semantic similarity between two texts using all-MiniLM-L6-v2 with cross-lingual alignment.
        Returns a float between 0.0 and 1.0.
        """
        if not text1 or not text2:
            return 0.0

        if text1.strip().lower() == text2.strip().lower():
            return 1.0

        t1_norm = normalize_regional_text(text1.strip())
        t2_norm = normalize_regional_text(text2.strip())

        embeddings = cls.encode([t1_norm, t2_norm])
        if embeddings.shape[0] < 2:
            return 0.0

        # Cosine similarity of normalized vectors is the dot product
        sim = float(np.dot(embeddings[0], embeddings[1]))
        return max(0.0, min(1.0, sim))

    @classmethod
    def search_rules(cls, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        """
        Retrieval-Augmented Generation (RAG) vector search over official statutory rulebook.
        Retrieves the top-k most relevant statutory clauses for an auditor query.
        """
        if not query:
            return STATUTORY_KNOWLEDGE_BASE[:top_k]

        rule_texts = [f"{r['title']}. {r['text']} Source: {r['source']}" for r in STATUTORY_KNOWLEDGE_BASE]
        all_texts = [query] + rule_texts

        embeddings = cls.encode(all_texts)
        query_vec = embeddings[0]
        rule_vecs = embeddings[1:]

        # Calculate cosine similarity for all rules
        scores = np.dot(rule_vecs, query_vec)
        top_indices = np.argsort(scores)[::-1][:top_k]

        results = []
        for idx in top_indices:
            rule_copy = dict(STATUTORY_KNOWLEDGE_BASE[idx])
            rule_copy["relevance_score"] = round(float(scores[idx]), 3)
            results.append(rule_copy)

        return results
