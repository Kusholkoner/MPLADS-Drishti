import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// Support both old (eyJ...) and new (sb_publishable_...) key formats
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_URL.startsWith("http") &&
    !SUPABASE_URL.includes("your-project-id") &&
    SUPABASE_KEY &&
    SUPABASE_KEY.length > 20 &&
    !SUPABASE_KEY.includes("your-supabase")
);

let supabaseInstance = null;

if (isSupabaseConfigured) {
  try {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "mplads_supabase_session",
      },
    });
    console.log("[Supabase] Client initialized successfully:", SUPABASE_URL);
  } catch (err) {
    console.error("[Supabase Client Init Error]", err);
  }
} else {
  console.warn(
    "[Supabase] Not configured — running in local-only mode. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in frontend/.env"
  );
}

export const supabase = supabaseInstance;

/**
 * Returns supabase client or throws a clear error if not configured.
 */
export function getSupabaseClient() {
  if (!supabaseInstance) {
    throw new Error("Supabase is not configured. Check your environment variables.");
  }
  return supabaseInstance;
}
