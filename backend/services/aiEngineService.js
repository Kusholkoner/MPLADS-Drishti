/**
 * MPLABS Drishti - AI Engine Client Service
 * Bridges Node.js Express backend with the Python FastAPI AI Engine (Local or Cloud-deployed).
 * Full integration with all 21 AI Modules and 10+ REST endpoints.
 */

const AI_ENGINE_BASE_URL = process.env.AI_ENGINE_URL || "http://localhost:8000";

class AIEngineService {
  static getBaseUrl() {
    return process.env.AI_ENGINE_URL || "http://localhost:8000";
  }

  static async checkHealth() {
    try {
      const resp = await fetch(`${this.getBaseUrl()}/api/v1/health`, { signal: AbortSignal.timeout(3000) });
      return await resp.json();
    } catch (e) {
      return { status: "offline", error: e.message };
    }
  }

  // Mod 01-19: Complete Pipeline Orchestrator (21 Modules)
  static async analyzeWork(workPayload) {
    try {
      const resp = await fetch(`${this.getBaseUrl()}/api/v1/analyze-work`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workPayload),
        signal: AbortSignal.timeout(10000),
      });
      return await resp.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // Mod 09: Semantic Similarity using all-MiniLM-L6-v2 (384-dim Sentence-BERT)
  static async computeSemanticSimilarity(text1, text2) {
    try {
      const resp = await fetch(`${this.getBaseUrl()}/api/v1/semantic/similarity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text1, text2 }),
        signal: AbortSignal.timeout(5000),
      });
      return await resp.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // Mod 04: Statutory Rules Vector Search (RAG)
  static async searchRules(query, top_k = 3) {
    try {
      const resp = await fetch(`${this.getBaseUrl()}/api/v1/semantic/rules-search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, top_k }),
        signal: AbortSignal.timeout(5000),
      });
      return await resp.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // Mod 05: IsolationForest Financial Anomaly Detection (100 Trees)
  static async analyzeFinancialIsolationForest(payload) {
    try {
      const resp = await fetch(`${this.getBaseUrl()}/api/v1/financial/isolation-forest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      });
      return await resp.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // Mod 13: Perceptual Difference Hash (dHash) Image Comparison
  static async compareDhash(hash1, hash2) {
    try {
      const resp = await fetch(`${this.getBaseUrl()}/api/v1/vision/dhash-compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash1, hash2 }),
        signal: AbortSignal.timeout(5000),
      });
      return await resp.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // Mod 11/12: Error Level Analysis (ELA) Document Tamper Detection
  static async checkDocumentTampering(payload) {
    try {
      const resp = await fetch(`${this.getBaseUrl()}/api/v1/forensics/document-tamper-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      });
      return await resp.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // Mod 20: Grounded Audit Copilot (Gemini 2.0/2.5 Flash + RAG)
  static async queryCopilot(queryObj) {
    try {
      const resp = await fetch(`${this.getBaseUrl()}/api/v1/copilot/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(queryObj),
        signal: AbortSignal.timeout(12000),
      });
      return await resp.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // Mod 10 & 15: NetworkX Bipartite Vendor Collusion Graph
  static async getVendorGraph(district) {
    try {
      const encoded = encodeURIComponent(district || "New Delhi");
      const resp = await fetch(`${this.getBaseUrl()}/api/v1/vendor-graph/${encoded}`, {
        signal: AbortSignal.timeout(6000),
      });
      return await resp.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // Mod 19: Investigation Dossier & Cryptographic SHA-256 Evidence Card
  static async getDossier(workId) {
    try {
      const resp = await fetch(`${this.getBaseUrl()}/api/v1/dossier/${encodeURIComponent(workId)}`, {
        signal: AbortSignal.timeout(6000),
      });
      return await resp.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // Mod 21: Active Learning Auditor Feedback Disposition
  static async submitFeedbackDisposition(payload) {
    try {
      const resp = await fetch(`${this.getBaseUrl()}/api/v1/feedback/disposition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      });
      return await resp.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // 12 Official Cloud Datasets List
  static async listDatasets() {
    try {
      const resp = await fetch(`${this.getBaseUrl()}/api/v1/datasets`, { signal: AbortSignal.timeout(5000) });
      return await resp.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

module.exports = AIEngineService;
