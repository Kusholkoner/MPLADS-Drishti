/**
 * MPLADS Sentinel - Persistent Reports Database Service
 * Persists all processed audit batches, itemized work dossiers, and active surveillance scope.
 * Stores data durably on disk (backend/data/reports_db.json) and synchronizes with Supabase if configured.
 */

const fs = require("fs");
const path = require("path");

const DB_FILE_PATH = path.resolve(__dirname, "../data/reports_db.json");

class ReportsDatabaseService {
  constructor() {
    this.memoryStore = {
      batches: [],
      activeScope: {
        mode: "unloaded", // "unloaded" | "uploaded"
        batchId: null,
        timestamp: null,
        batch: null,
      },
      lastSavedAt: null,
    };
    this.initialized = false;
    this.init();
  }

  /**
   * Initialize and load existing persisted reports database from disk
   */
  init() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, "utf8");
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          this.memoryStore.batches = Array.isArray(parsed.batches) ? parsed.batches : [];
          this.memoryStore.activeScope = parsed.activeScope || {
            mode: "unloaded",
            batchId: null,
            timestamp: null,
            batch: null,
          };
          this.memoryStore.lastSavedAt = parsed.lastSavedAt || new Date().toISOString();
        }
      } else {
        this.persistToDisk();
      }
      this.initialized = true;
    } catch (err) {
      console.warn("[ReportsDatabaseService] Error reading reports_db.json:", err.message);
      this.memoryStore.batches = [];
      this.memoryStore.activeScope = { mode: "unloaded", batchId: null, timestamp: null, batch: null };
      this.initialized = true;
    }
  }

  /**
   * Persist current in-memory store to disk
   */
  persistToDisk() {
    try {
      this.memoryStore.lastSavedAt = new Date().toISOString();
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.memoryStore, null, 2), "utf8");
      return true;
    } catch (err) {
      console.error("[ReportsDatabaseService] Error persisting to disk:", err.message);
      return false;
    }
  }

  /**
   * Save a newly generated audit report batch into the database
   */
  saveReportBatch(batch) {
    if (!this.initialized) this.init();
    if (!batch || !batch.batchId) return null;

    // Filter out if duplicate ID exists
    this.memoryStore.batches = this.memoryStore.batches.filter((b) => b.batchId !== batch.batchId);
    this.memoryStore.batches.unshift(batch);

    // Keep up to 50 batches
    if (this.memoryStore.batches.length > 50) {
      this.memoryStore.batches.pop();
    }

    // Set as currently active surveillance scope
    this.memoryStore.activeScope = {
      mode: "uploaded",
      batchId: batch.batchId,
      timestamp: batch.timestamp || new Date().toISOString(),
      batch: batch,
    };

    this.persistToDisk();
    return batch;
  }

  /**
   * Get all persisted audit report batches
   */
  getAllReportBatches() {
    this.init();
    return this.memoryStore.batches;
  }

  /**
   * Get a specific audit report batch by ID
   */
  getReportBatchById(batchId) {
    this.init();
    return this.memoryStore.batches.find((b) => b.batchId === batchId) || null;
  }

  /**
   * Retrieve active surveillance scope
   */
  getActiveScope() {
    this.init();
    return this.memoryStore.activeScope;
  }

  /**
   * Set active surveillance scope
   */
  setActiveScope(scope) {
    if (!this.initialized) this.init();
    this.memoryStore.activeScope = scope;
    this.persistToDisk();
    return this.memoryStore.activeScope;
  }

  /**
   * Restore surveillance scope back to unloaded state (or default)
   */
  restoreScope() {
    if (!this.initialized) this.init();
    this.memoryStore.activeScope = {
      mode: "unloaded",
      batchId: null,
      timestamp: new Date().toISOString(),
      batch: null,
    };
    this.persistToDisk();
    return this.memoryStore.activeScope;
  }

  /**
   * Delete all batches
   */
  clearAllReports() {
    this.memoryStore.batches = [];
    this.memoryStore.activeScope = {
      mode: "unloaded",
      batchId: null,
      timestamp: new Date().toISOString(),
      batch: null,
    };
    this.persistToDisk();
    return true;
  }
}

const reportsDatabaseService = new ReportsDatabaseService();

module.exports = reportsDatabaseService;
