/**
 * MPLADS Sentinel - Resilient Column & Title Normalizer
 * Dynamically resolves diverse, messy, or changing CSV column headers from e-SAKSHI & State Portals
 */

// Precise canonical header priorities (evaluated in ordered sequence)
const PRIORITY_RULES = [
  {
    key: "work_id",
    exact: ["work id", "work_id", "workid", "workcode", "work code", "proposal id", "proposal_id", "project id", "project_id"],
    includes: ["work id", "work_id", "work code", "workcode"],
  },
  {
    key: "category",
    exact: ["work category", "work_category", "category", "sector", "head of development", "work type", "scheme sector"],
    includes: ["work category", "category", "sector"],
  },
  {
    key: "status",
    exact: ["work status", "work_status", "status", "payment status", "project status", "current status"],
    includes: ["work status", "payment status"],
  },
  {
    key: "implementing_agency",
    exact: ["ida", "implementing agency", "implementing_agency", "executing agency", "agency name", "department", "executing authority"],
    includes: ["implementing agency", "executing agency", "ida"],
  },
  {
    key: "vendor_name",
    exact: ["vendor name", "vendor_name", "contractor name", "contractor", "firm name"],
    includes: ["vendor", "contractor"],
  },
  {
    key: "calamity_name",
    exact: ["calamity name", "disaster name", "calamity incident"],
    includes: ["calamity name", "disaster name"],
  },
  {
    key: "calamity_type",
    exact: ["calamity type", "disaster type"],
    includes: ["calamity type", "disaster type"],
  },
  {
    key: "mp_name",
    exact: [
      "hon'ble members of parliament",
      "honble members of parliament",
      "hon'ble members of parliaments",
      "honble members of parliaments",
      "hon'ble mp",
      "honble mp",
      "mp name",
      "mp_name",
      "member of parliament",
      "name of mp",
      "name of honble mp",
    ],
    includes: ["members of parliament", "member of parliament", "honble mp", "hon'ble mp", "mp name"],
  },
  {
    key: "recommended_amount",
    exact: ["recommended amount", "recommended_amount", "proposed amount", "estimated amount"],
    includes: ["recommended amount", "proposed amount"],
  },
  {
    key: "sanction_amount",
    exact: ["sanction amount", "sanction_amount", "sanctioned amount", "sanctioned cost", "approved cost", "cost"],
    includes: ["sanction amount", "sanctioned amount", "sanction cost", "sanctioned cost"],
  },
  {
    key: "disbursed_amount",
    exact: ["amount disbursed", "fund disbursed amount", "expenditure", "expenditure amount", "paid amount", "total disbursed"],
    includes: ["amount disbursed", "fund disbursed", "expenditure"],
  },
  {
    key: "allocated_amount",
    exact: ["allocated amount", "allocated limit", "entitlement quota", "annual limit"],
    includes: ["allocated amount", "allocated limit"],
  },
  {
    key: "calamity_amount",
    exact: ["consent amount", "calamity contribution", "relief amount"],
    includes: ["consent amount", "calamity contribution"],
  },
  {
    key: "recommended_date",
    exact: ["recommended date", "recommended_date", "date of recommendation", "proposal date"],
    includes: ["recommended date", "recommendation date"],
  },
  {
    key: "sanction_date",
    exact: ["sanction date", "sanction_date", "date of sanction", "sanctioned date", "administrative sanction date"],
    includes: ["sanction date", "date of sanction"],
  },
  {
    key: "completion_date",
    exact: ["completion date", "completion_date", "date of completion", "actual completion date"],
    includes: ["completion date", "date of completion"],
  },
  {
    key: "expenditure_date",
    exact: ["expenditure date", "expenditure_date", "payment date", "disbursement date"],
    includes: ["expenditure date", "payment date", "disbursement date"],
  },
  {
    key: "constituency",
    exact: ["constituency", "constituency name", "constituency_name", "parliamentary constituency", "pc name", "ls constituency"],
    includes: ["constituency", "pc name"],
  },
  {
    key: "district",
    exact: ["district", "district name", "district_name", "nodal district"],
    includes: ["district"],
  },
  {
    key: "state",
    exact: ["state", "state name", "state_name", "state / ut", "state/ut", "state ut"],
    includes: ["state"],
  },
  {
    key: "title",
    exact: ["work description", "work_description", "work description / title", "work name", "work_name", "name of work", "description", "title", "subject", "work"],
    includes: ["work description", "work name", "description", "title", "work"],
  },
];

/**
 * Strips formatting, currency symbols, and noise to match header aliases
 */
function cleanHeader(header) {
  if (!header) return "";
  return String(header)
    .toLowerCase()
    .replace(/[₹\?\(\)\[\]\.\/\-_,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Parses Indian currency and messy numerical strings into standard numbers
 */
function parseCurrency(value) {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return isNaN(value) ? 0 : value;
  const str = String(value)
    .replace(/[₹\?\s,]/g, "")
    .replace(/[^\d.-]/g, "");
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

/**
 * Extracts clean work ID and title if combined in a single string
 * e.g. "WS/MP620/2024-2025/133166-Construction of buildings..."
 */
function extractWorkIdAndTitle(rawString) {
  if (!rawString) return { id: null, title: null };
  const str = String(rawString).trim();

  // Pattern matching MPLADS Work ID format: WS/... or MP...
  const match = str.match(/^(WS\/[^\-]+|\bMP[\w\d\/]+)\s*[-:]\s*(.*)$/i);
  if (match) {
    return {
      id: match[1].trim().replace(/\s+/g, ""),
      title: match[2].trim(),
    };
  }

  // If starts with Work ID without title
  if (str.startsWith("WS/") || str.match(/^MP\d+/i)) {
    return { id: str.replace(/\s+/g, ""), title: null };
  }

  return { id: null, title: str };
}

/**
 * Maps raw headers of a CSV to canonical fields using priority matching
 */
function mapHeaders(headers) {
  const mapping = {};
  const unmapped = [];
  const assignedCanonical = new Set();

  if (!headers || !Array.isArray(headers)) {
    return { mapping, unmapped };
  }

  // Phase 1: Try exact rule matches in priority order
  headers.forEach((rawHeader) => {
    if (!rawHeader) return;
    const cleaned = cleanHeader(rawHeader);
    let matchedKey = null;

    for (const rule of PRIORITY_RULES) {
      if (rule.exact.includes(cleaned)) {
        matchedKey = rule.key;
        break;
      }
    }

    if (!matchedKey) {
      for (const rule of PRIORITY_RULES) {
        if (rule.includes.some((inc) => cleaned === inc || cleaned.includes(inc))) {
          matchedKey = rule.key;
          break;
        }
      }
    }

    if (matchedKey) {
      mapping[rawHeader] = matchedKey;
      assignedCanonical.add(matchedKey);
    } else {
      unmapped.push(rawHeader);
    }
  });

  return { mapping, unmapped };
}

/**
 * Normalizes an array of raw CSV rows into standardized objects
 */
function normalizeDatasetRows(rows, slotType = "generic") {
  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    return {
      normalizedRows: [],
      schemaInfo: {
        totalRows: 0,
        detectedHeaders: [],
        mappedHeaders: {},
        unmappedHeaders: [],
        missingCrucial: [],
        confidenceScore: 0,
      },
    };
  }

  // Filter out any non-object, null, or undefined rows
  const cleanRows = rows.filter((r) => r && typeof r === "object" && Object.keys(r).length > 0);
  if (cleanRows.length === 0) {
    return {
      normalizedRows: [],
      schemaInfo: {
        totalRows: 0,
        detectedHeaders: [],
        mappedHeaders: {},
        unmappedHeaders: [],
        missingCrucial: [],
        confidenceScore: 0,
      },
    };
  }

  const rawHeaders = Object.keys(cleanRows[0] || {});
  const { mapping, unmapped } = mapHeaders(rawHeaders);

  const mappedCanonicalFields = new Set(Object.values(mapping || {}));
  const crucialFieldsBySlot = {
    recommended: ["title", "state", "mp_name", "recommended_amount"],
    sanctioned: ["title", "state", "sanction_amount", "implementing_agency"],
    completed: ["title", "state", "completion_date"],
    expenditure: ["state", "disbursed_amount"],
    limits: ["state", "mp_name", "allocated_amount"],
    calamity: ["calamity_name", "mp_name", "calamity_amount"],
    generic: ["state"],
  };

  const expectedCrucial = crucialFieldsBySlot[slotType] || crucialFieldsBySlot.generic;
  const missingCrucial = expectedCrucial.filter((f) => !mappedCanonicalFields.has(f));
  const confidenceScore = Math.round(
    ((expectedCrucial.length - missingCrucial.length) / Math.max(1, expectedCrucial.length)) * 100
  );

  const normalizedRows = cleanRows.map((row, index) => {
    const norm = {
      _sourceRowIndex: index + 1,
      _customFields: {},
    };

    let extractedId = null;
    let extractedTitle = null;

    if (row && typeof row === "object") {
      Object.entries(row).forEach(([rawCol, val]) => {
        if (!rawCol) return;
        const canonicalKey = mapping ? mapping[rawCol] : null;
        if (canonicalKey) {
          if (canonicalKey.includes("amount") || canonicalKey === "cost") {
            norm[canonicalKey] = parseCurrency(val);
          } else {
            norm[canonicalKey] = val !== null && val !== undefined ? String(val).trim() : "";
          }

          // Check if rawCol was the composite "Work" column
          if (rawCol.toLowerCase() === "work" && val) {
            const { id, title } = extractWorkIdAndTitle(val);
            if (id) extractedId = id;
            if (title) extractedTitle = title;
          }
        } else {
          norm._customFields[rawCol] = val;
        }
      });
    }

    // If explicit work_id wasn't in its own column, use the one extracted from composite Work string
    if (!norm.work_id || norm.work_id === "") {
      if (extractedId) norm.work_id = extractedId;
      else norm.work_id = `WORK-${slotType.toUpperCase()}-${String(index + 1).padStart(5, "0")}`;
    }

    // If title was overwritten by generic Work column, prefer specific Work description if present
    if (extractedTitle && (!norm.title || norm.title.length < extractedTitle.length)) {
      norm.title = extractedTitle;
    }

    return norm;
  });

  return {
    normalizedRows,
    schemaInfo: {
      totalRows: normalizedRows.length,
      detectedHeaders: rawHeaders,
      mappedHeaders: mapping || {},
      unmappedHeaders: unmapped || [],
      missingCrucial: missingCrucial || [],
      confidenceScore: isNaN(confidenceScore) ? 0 : confidenceScore,
    },
  };
}

module.exports = {
  cleanHeader,
  parseCurrency,
  extractWorkIdAndTitle,
  mapHeaders,
  normalizeDatasetRows,
};
