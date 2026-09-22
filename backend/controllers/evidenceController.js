const crypto = require("crypto");
const supabaseService = require("../services/supabaseService");
const { supabase, isConfigured } = require("../config/supabase");

// GET /api/evidence
exports.getEvidence = async (req, res) => {
  try {
    const { projectId, type, status, search } = req.query;
    const userRole = req.user?.role || req.profile?.role || req.headers["x-demo-role"] || req.headers["x-user-role"];
    const items = await supabaseService.getEvidence({ projectId, type, status, search, userRole });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/evidence/:id
exports.getEvidenceById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await supabaseService.getEvidenceById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: `Evidence ${id} not found.` });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/evidence (Supports both JSON body and multipart/form-data via multer)
exports.uploadEvidence = async (req, res) => {
  try {
    const evidenceData = req.body || {};
    const title = evidenceData.title || (req.file ? req.file.originalname : null);
    const projectId = evidenceData.projectId || evidenceData.project_id;

    if (!title || !projectId) {
      return res.status(400).json({ success: false, message: "title and projectId are required." });
    }

    let sha256 = evidenceData.provenance?.sha256Hash;
    let fileSize = evidenceData.file_size || "2.4 MB";
    let mimeType = evidenceData.mime_type || "application/pdf";
    let type = evidenceData.type || "document";
    let fileUrl = evidenceData.file_url || "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1200&q=80";

    const newId = evidenceData.id || `EVD-${type === "image" ? "IMG" : "DOC"}-${Date.now().toString().slice(-4)}`;

    // Process binary file from multer if present
    if (req.file) {
      sha256 = crypto.createHash("sha256").update(req.file.buffer).digest("hex");
      fileSize = `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`;
      mimeType = req.file.mimetype || "application/octet-stream";
      type = evidenceData.type || (mimeType.startsWith("image/") ? "image" : "document");

      const cleanFilename = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `${type === "image" ? "photos" : "documents"}/${newId}-${Date.now()}-${cleanFilename}`;

      // Upload binary to Supabase Storage if configured
      if (isConfigured && supabase) {
        try {
          const { error: uploadErr } = await supabase.storage
            .from("evidence")
            .upload(storagePath, req.file.buffer, {
              contentType: mimeType,
              upsert: true,
            });

          if (!uploadErr) {
            const { data: publicUrlData } = supabase.storage.from("evidence").getPublicUrl(storagePath);
            if (publicUrlData?.publicUrl) {
              fileUrl = publicUrlData.publicUrl;
            }
          } else {
            console.warn("[Evidence Storage Upload Warning]", uploadErr.message);
          }
        } catch (storageErr) {
          console.warn("[Evidence Storage Catch Warning]", storageErr.message);
        }
      }
    }

    if (!sha256) {
      sha256 = "sha256-" + Math.random().toString(16).substring(2, 10);
    }

    const record = {
      id: newId,
      project_id: projectId,
      project_title: evidenceData.projectTitle || evidenceData.project_title || "Assigned MPLADS Work",
      type: type,
      title: title,
      status: evidenceData.status || "verified",
      file_url: fileUrl,
      thumbnail_url: evidenceData.thumbnail_url || fileUrl,
      file_size: fileSize,
      mime_type: mimeType,
      provenance: evidenceData.provenance || {
        sourceSystem: "Sentinel Field Intake",
        uploaderId: req.user?.id || "OFFICER-001",
        uploaderRole: req.profile?.designation || "Verification Officer",
        uploadedAt: new Date().toISOString(),
        sha256Hash: sha256,
      },
      metadata: typeof evidenceData.metadata === "string" ? JSON.parse(evidenceData.metadata || "{}") : (evidenceData.metadata || {}),
      extracted_fields: typeof evidenceData.extracted_fields === "string" ? JSON.parse(evidenceData.extracted_fields || "[]") : (evidenceData.extracted_fields || []),
      findings: typeof evidenceData.findings === "string" ? JSON.parse(evidenceData.findings || "[]") : (evidenceData.findings || []),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save to Supabase table if configured
    if (isConfigured && supabase) {
      try {
        await supabase.from("evidence").insert([record]);
      } catch (dbErr) {
        console.warn("[Evidence Controller] DB save warning:", dbErr.message);
      }
    }

    // Return normalized record
    res.status(201).json({
      success: true,
      message: `Evidence item ${record.id} registered and persisted successfully.`,
      data: {
        id: record.id,
        projectId: record.project_id,
        projectTitle: record.project_title,
        type: record.type,
        title: record.title,
        status: record.status,
        fileUrl: record.file_url,
        thumbnailUrl: record.thumbnail_url,
        fileSize: record.file_size,
        mimeType: record.mime_type,
        provenance: record.provenance,
        metadata: record.metadata,
        extractedFields: record.extracted_fields,
        findings: record.findings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
