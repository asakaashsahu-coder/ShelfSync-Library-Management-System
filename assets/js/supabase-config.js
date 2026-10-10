/*
 * ShelfSync Supabase configuration
 * Use only the Supabase publishable key in frontend code.
 * Never put a secret or service-role key here.
 */

const SUPABASE_URL = "https://hykuytdhjjgqubcwqtwx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_1FVFpDl62s33nU-ZTq4KoA_MHUlDuUv";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
