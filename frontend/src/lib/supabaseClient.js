import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";
export const isSupabaseConfigured = Boolean(SUPABASE_URL &&
    SUPABASE_URL.startsWith("http") &&
    !SUPABASE_URL.includes("your-project-id") &&
    SUPABASE_KEY &&
    SUPABASE_KEY.length > 20 &&
    !SUPABASE_KEY.includes("your-supabase"));
let supabaseInstance = null;
if (isSupabaseConfigured) {
    try {
        supabaseInstance = createClient(SUPABASE_URL, SUPABASE_KEY, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
            },
        });
    }
    catch (err) {
        console.error("[Supabase Client Init Error]", err);
    }
}
export const supabase = supabaseInstance;
