import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido." }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    if (!token) throw new Error("Faça login novamente para excluir sua conta.");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: authData, error: authError } = await authClient.auth.getUser(token);
    if (authError || !authData.user) {
      return new Response(JSON.stringify({ error: "Sessão inválida. Entre novamente." }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const password = String(body.password || "");
    if (!password) {
      return new Response(JSON.stringify({ error: "A senha da própria conta é obrigatória." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!authData.user.email) {
      return new Response(JSON.stringify({ error: "Esta conta não possui e-mail para validar a senha." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: verified, error: passwordError } = await authClient.auth.signInWithPassword({
      email: authData.user.email, password,
    });
    if (passwordError || verified.user?.id !== authData.user.id) {
      return new Response(JSON.stringify({ error: "Senha incorreta. A conta não foi excluída." }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const userId = authData.user.id;
    const confirmation = String(body.confirmation_username || "").replace(/^@/, "").trim().toLowerCase();
    const { data: profile, error: profileError } = await admin.from("profiles")
      .select("id, nome, username, cargo").eq("id", userId).maybeSingle();
    if (profileError) throw profileError;
    if (!profile) throw new Error("Perfil não encontrado.");

    const username = String(profile.username || "").replace(/^@/, "").trim().toLowerCase();
    if (!username || confirmation !== username) {
      return new Response(JSON.stringify({ error: "O nick de confirmação não corresponde à conta autenticada." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (String(profile.cargo || "").trim().toLowerCase() === "adm") {
      const { count, error } = await admin.from("profiles").select("id", { count: "exact", head: true }).ilike("cargo", "adm");
      if (error) throw error;
      if ((count || 0) <= 1) {
        return new Response(JSON.stringify({ error: "Esta é a última conta administradora. Promova outra pessoa a ADM antes de excluí-la." }), {
          status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const cleanup = [
      admin.from("feed_posts").delete().eq("author_id", userId),
      admin.from("chat_settings").update({ updated_by: null }).eq("updated_by", userId),
      admin.from("chat_user_mutes").update({ created_by: null }).eq("created_by", userId),
      admin.from("community_feedback_replies").update({ admin_id: null }).eq("admin_id", userId),
      admin.from("convites").update({ usado_por: null }).eq("usado_por", userId),
    ];
    const results = await Promise.all(cleanup);
    const cleanupError = results.find(result => result.error)?.error;
    if (cleanupError) throw cleanupError;

    const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
    if (deleteError) throw deleteError;
    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("delete-account:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Não foi possível excluir a conta." }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});