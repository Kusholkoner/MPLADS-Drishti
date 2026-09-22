const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL.includes("your-project-id")) {
  console.error("❌ SUPABASE_URL or key is missing in backend/.env.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATASETS_DIR = path.resolve(__dirname, "../../frontend/Data/Datasets");
const BUCKET_NAME = "datasets";

async function ensureBucket() {
  console.log(`\n🔍 Checking Supabase Storage bucket '${BUCKET_NAME}'...`);
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
  
  if (listErr) {
    console.warn("⚠️ Warning checking buckets:", listErr.message);
  }

  const exists = buckets && buckets.some((b) => b.name === BUCKET_NAME);
  if (!exists) {
    console.log(`📦 Creating public bucket '${BUCKET_NAME}'...`);
    const { data: created, error: createErr } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 52428800, // 50MB
    });

    if (createErr) {
      console.warn(`⚠️ Could not automatically create bucket via API (${createErr.message}).`);
      console.warn(`👉 Please ensure bucket '${BUCKET_NAME}' is created in Supabase Dashboard -> Storage -> New Bucket (Public).`);
    } else {
      console.log(`✅ Bucket '${BUCKET_NAME}' created successfully.`);
    }
  } else {
    console.log(`✅ Bucket '${BUCKET_NAME}' is ready.`);
  }
}

async function uploadDatasets() {
  if (!fs.existsSync(DATASETS_DIR)) {
    console.error(`❌ Local datasets directory not found at: ${DATASETS_DIR}`);
    return;
  }

  await ensureBucket();

  const files = fs.readdirSync(DATASETS_DIR).filter((f) => f.endsWith(".csv"));
  console.log(`\n🚀 Found ${files.length} dataset files to upload to Supabase Storage...\n`);

  let successCount = 0;
  let failCount = 0;
  const manifest = [];

  for (const filename of files) {
    const filePath = path.join(DATASETS_DIR, filename);
    const stats = fs.statSync(filePath);
    const fileBuffer = fs.readFileSync(filePath);
    const sizeKb = (stats.size / 1024).toFixed(1);

    console.log(`📤 Uploading '${filename}' (${sizeKb} KB)...`);

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, fileBuffer, {
        upsert: true,
        contentType: "text/csv",
      });

    if (error) {
      console.error(`   ❌ Failed to upload '${filename}':`, error.message);
      failCount++;
    } else {
      const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filename);
      console.log(`   ✅ Success! URL: ${publicUrlData?.publicUrl}`);
      successCount++;
      manifest.push({
        filename,
        sizeBytes: stats.size,
        sizeKb: Math.round(stats.size / 1024),
        publicUrl: publicUrlData?.publicUrl,
        uploadedAt: new Date().toISOString(),
      });
    }
  }

  console.log(`\n=================================================`);
  console.log(`📊 Upload Summary: ${successCount} successful, ${failCount} failed.`);
  console.log(`=================================================`);

  if (successCount > 0) {
    const manifestPath = path.resolve(__dirname, "../config/datasets_manifest.json");
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
    console.log(`📄 Saved cloud datasets manifest to: ${manifestPath}`);
  }
}

uploadDatasets().catch((err) => {
  console.error("Fatal error during dataset upload:", err);
});
