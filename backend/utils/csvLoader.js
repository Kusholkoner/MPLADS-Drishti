const csv = require("csv-parser");
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const SUPABASE_URL = process.env.SUPABASE_URL || "https://vehldtcasdnmghnoktay.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const BUCKET_NAME = "datasets";

// In-memory cache for parsed dataset rows
const datasetCache = new Map();

// Canonical list of all 12 official datasets
const OFFICIAL_DATASETS_META = [
  {
    id: "DS-01",
    filename: "Works Recommended (Lok Sabha).csv",
    name: "Works Recommended (Lok Sabha)",
    house: "Lok Sabha",
    category: "Works Recommended",
    fileSizeKb: 2232,
    sourceOfficialName: "eSAKSHI & MoSPI Official Registry",
    description: "Official proposals and works recommended by Hon'ble Lok Sabha MPs.",
  },
  {
    id: "DS-02",
    filename: "Works Recommended (Rajya Sabha).csv",
    name: "Works Recommended (Rajya Sabha)",
    house: "Rajya Sabha",
    category: "Works Recommended",
    fileSizeKb: 1376,
    sourceOfficialName: "eSAKSHI & MoSPI Official Registry",
    description: "Official proposals and works recommended by Hon'ble Rajya Sabha MPs.",
  },
  {
    id: "DS-03",
    filename: "Works Sanctioned (Lok Sabha).csv",
    name: "Works Sanctioned (Lok Sabha)",
    house: "Lok Sabha",
    category: "Works Sanctioned",
    fileSizeKb: 1709,
    sourceOfficialName: "eSAKSHI & MoSPI Official Registry",
    description: "Administratively approved works and financial sanctions for Lok Sabha constituencies.",
  },
  {
    id: "DS-04",
    filename: "Works Sanctioned (Rajya Sabha).csv",
    name: "Works Sanctioned (Rajya Sabha)",
    house: "Rajya Sabha",
    category: "Works Sanctioned",
    fileSizeKb: 1855,
    sourceOfficialName: "eSAKSHI & MoSPI Official Registry",
    description: "Administratively approved works and financial sanctions for Rajya Sabha constituencies.",
  },
  {
    id: "DS-05",
    filename: "Works Completed (Lok Sabha).csv",
    name: "Works Completed (Lok Sabha)",
    house: "Lok Sabha",
    category: "Works Completed",
    fileSizeKb: 933,
    sourceOfficialName: "eSAKSHI & MoSPI Official Registry",
    description: "Completion certificates and physical inspection statuses for Lok Sabha works.",
  },
  {
    id: "DS-06",
    filename: "Works Completed (Rajya Sabha).csv",
    name: "Works Completed (Rajya Sabha)",
    house: "Rajya Sabha",
    category: "Works Completed",
    fileSizeKb: 2056,
    sourceOfficialName: "eSAKSHI & MoSPI Official Registry",
    description: "Completion certificates and physical inspection statuses for Rajya Sabha works.",
  },
  {
    id: "DS-07",
    filename: "Expenditure on Completed and On-going Works as on Date (Lok Sabha).csv",
    name: "Expenditure on Completed and On-going Works (Lok Sabha)",
    house: "Lok Sabha",
    category: "Expenditure & Disbursements",
    fileSizeKb: 1993,
    sourceOfficialName: "eSAKSHI & MoSPI Official Registry",
    description: "Itemized treasury and PFMS payment vouchers for Lok Sabha works.",
  },
  {
    id: "DS-08",
    filename: "Expenditure on Completed and On-going Works as on Date (Rajya Sabha).csv",
    name: "Expenditure on Completed and On-going Works (Rajya Sabha)",
    house: "Rajya Sabha",
    category: "Expenditure & Disbursements",
    fileSizeKb: 1937,
    sourceOfficialName: "eSAKSHI & MoSPI Official Registry",
    description: "Itemized treasury and PFMS payment vouchers for Rajya Sabha works.",
  },
  {
    id: "DS-09",
    filename: "Allocated Limit for Honble MPs (Lok Sabha).csv",
    name: "Allocated Limit for Hon'ble MPs (Lok Sabha)",
    house: "Lok Sabha",
    category: "Allocated Limits",
    fileSizeKb: 35,
    sourceOfficialName: "eSAKSHI & MoSPI Official Registry",
    description: "Annual quota entitlements and sanctioned balances for Lok Sabha MPs.",
  },
  {
    id: "DS-10",
    filename: "Allocated Limit for Honble MPs (Rajya Sabha).csv",
    name: "Allocated Limit for Hon'ble MPs (Rajya Sabha)",
    house: "Rajya Sabha",
    category: "Allocated Limits",
    fileSizeKb: 21,
    sourceOfficialName: "eSAKSHI & MoSPI Official Registry",
    description: "Annual quota entitlements and sanctioned balances for Rajya Sabha MPs.",
  },
  {
    id: "DS-11",
    filename: "Amount consented for Calamity (Lok Sabha).csv",
    name: "Amount consented for Calamity (Lok Sabha)",
    house: "Lok Sabha",
    category: "Calamity Consents",
    fileSizeKb: 1,
    sourceOfficialName: "eSAKSHI & MoSPI Official Registry",
    description: "Emergency disaster relief and calamity contribution allocations (Lok Sabha).",
  },
  {
    id: "DS-12",
    filename: "Amount consented for Calamity (Rajya Sabha).csv",
    name: "Amount consented for Calamity (Rajya Sabha)",
    house: "Rajya Sabha",
    category: "Calamity Consents",
    fileSizeKb: 3,
    sourceOfficialName: "eSAKSHI & MoSPI Official Registry",
    description: "Emergency disaster relief and calamity contribution allocations (Rajya Sabha).",
  },
];

/**
 * Loads and parses a CSV dataset strictly from Supabase Cloud Storage (No local storage lookups)
 */
async function loadCSVFile(filename, limit = 1000) {
  const cacheKey = `${filename}_${limit}`;
  if (datasetCache.has(cacheKey)) {
    return datasetCache.get(cacheKey);
  }

  // 1. Fetch directly from Supabase Public Storage URL
  try {
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${encodeURIComponent(filename)}`;
    const response = await fetch(publicUrl);
    if (response.ok) {
      const text = await response.text();
      if (text && !text.includes("NoSuchKey") && !text.includes("error")) {
        const rows = await parseCSVString(text, limit);
        datasetCache.set(cacheKey, rows);
        return rows;
      }
    }
  } catch (err) {
    // Continue to SDK fallback
  }

  // 2. Try Supabase Storage SDK download
  if (supabase) {
    try {
      const { data, error } = await supabase.storage.from(BUCKET_NAME).download(filename);
      if (!error && data) {
        const text = await data.text();
        const rows = await parseCSVString(text, limit);
        datasetCache.set(cacheKey, rows);
        return rows;
      }
    } catch (err) {
      console.warn(`[CSVLoader] Supabase storage error for '${filename}':`, err.message);
    }
  }

  return [];
}

function parseStream(stream, limit) {
  return new Promise((resolve) => {
    const rows = [];
    stream
      .pipe(csv())
      .on("data", (data) => {
        if (rows.length < limit) {
          rows.push(data);
        }
      })
      .on("end", () => resolve(rows))
      .on("error", (err) => {
        console.error(`[CSVLoader] Stream error:`, err.message);
        resolve([]);
      });
  });
}

function parseCSVString(csvContent, limit) {
  const { Readable } = require("stream");
  const s = new Readable();
  s.push(csvContent);
  s.push(null);
  return parseStream(s, limit);
}

/**
 * Returns metadata for all 12 datasets
 */
function getAvailableDatasetsMeta() {
  return OFFICIAL_DATASETS_META;
}

module.exports = {
  loadCSVFile,
  getAvailableDatasetsMeta,
  OFFICIAL_DATASETS_META,
};
