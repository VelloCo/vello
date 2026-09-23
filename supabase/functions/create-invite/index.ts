import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

/*
 * Gera um convite do beta fechado. O convite é só um código com validade:
 * a conta da profissional nasce quando ela escolhe a senha (accept-invite).
 * Assim dá para reconvidar o mesmo e-mail e abrir o link sem consumi-lo.
 */
const productionOrigin = "https://velloesteticas.vercel.app";
const allowedOrigins = new Set([productionOrigin, "http://localhost:5173", "http://127.0.0.1:5173"]);
const HORAS_PADRAO = 48;

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

function novoToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hash(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
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

  let payload: { email?: unknown; name?: unknown; hours?: unknown };
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Dados inválidos." }, 400, origin);
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const name = typeof payload.name === "string" ? payload.name.trim().slice(0, 120) : "";
  const horas = Math.min(Math.max(Number(payload.hours) || HORAS_PADRAO, 1), 720);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return json({ error: "Informe um e-mail válido." }, 400, origin);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: status, error: statusError } = await admin.rpc("beta_user_status", { p_email: email });
  if (statusError) {
    console.error("beta_user_status", statusError.message);
    return json({ error: "Não foi possível gerar o convite agora." }, 500, origin);
  }
  if (status === "active") {
    return json({ error: "Esse e-mail já tem conta ativa na Vello." }, 400, origin);
  }

  // Um convite válido por e-mail: os anteriores são cancelados.
  await admin
    .from("beta_invites")
    .update({ revoked_at: new Date().toISOString() })
    .is("used_at", null)
    .is("revoked_at", null)
    .ilike("email", email);

  const token = novoToken();
  const expiresAt = new Date(Date.now() + horas * 3600_000).toISOString();
  const { error: insertError } = await admin.from("beta_invites").insert({
    email,
    name,
    token_hash: await hash(token),
    expires_at: expiresAt,
    created_by: caller.user?.id ?? null,
  });
  if (insertError) {
    console.error("insert invite", insertError.message);
    return json({ error: "Não foi possível gerar o convite agora." }, 500, origin);
  }

  return json(
    {
      email,
      name,
      hours: horas,
      expires_at: expiresAt,
      invite_link: `${productionOrigin}/convite/${token}`,
    },
    200,
    origin,
  );
});
