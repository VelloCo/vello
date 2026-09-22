import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const productionOrigin = "https://velloesteticas.vercel.app";
const allowedOrigins = new Set([productionOrigin, "http://localhost:5173", "http://127.0.0.1:5173"]);

function headers(origin: string | null) {
  return {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Origin": origin && allowedOrigins.has(origin) ? origin : productionOrigin,
    "Content-Type": "application/json",
    "Vary": "Origin",
  };
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), { status, headers: headers(origin) });
}

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: headers(origin) });
  if (request.method !== "POST") return json({ error: "Método não permitido." }, 405, origin);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const publishableKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const authorization = request.headers.get("authorization");
  if (!supabaseUrl || !publishableKey || !serviceRoleKey || !authorization) {
    return json({ error: "Acesso não autorizado." }, 401, origin);
  }

  const callerClient = createClient(supabaseUrl, publishableKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: caller, error: callerError } = await callerClient.auth.getUser();
  if (callerError || caller.user?.app_metadata?.vello_role !== "admin") {
    return json({ error: "Acesso restrito ao administrador." }, 403, origin);
  }

  let payload: { email?: unknown; name?: unknown };
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Dados inválidos." }, 400, origin);
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const name = typeof payload.name === "string" ? payload.name.trim().slice(0, 120) : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return json({ error: "Informe um e-mail válido." }, 400, origin);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await adminClient.auth.admin.generateLink({
    type: "invite",
    email,
    options: {
      data: { full_name: name || email.split("@")[0], vello_beta_invite: true },
      redirectTo: `${productionOrigin}/redefinir-senha`,
    },
  });

  if (error || !data.properties?.action_link) {
    console.error("create-invite failed", error?.message);
    const existing = error?.message.toLowerCase().includes("already") || error?.message.toLowerCase().includes("registered");
    return json({ error: existing ? "Esse e-mail já possui uma conta na Vello." : "Não foi possível gerar o convite agora." }, 400, origin);
  }

  return json({ email, invite_link: data.properties.action_link }, 200, origin);
});
