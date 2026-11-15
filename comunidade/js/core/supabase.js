const SUPABASE_URL = "https://lhhoqahzpuohhhnbwgfp.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";

if (!window.supabase?.createClient) {
    throw new Error("A biblioteca do Supabase não foi carregada.");
}

export const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLIC_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storage: window.localStorage
        }
    }
);