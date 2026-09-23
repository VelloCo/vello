import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

/*
 * Aceita um convite do beta: valida o código, cria (ou libera) a conta com a
 * senha escolhida e marca o convite como usado. Abrir o link não consome
 * nada — só esta chamada consome.
 */
const productionOrigin = "https://velloesteticas.vercel.app";
const allowedOrigins = new Set([productionOrigin, "http://localhost:5173", "http://127.0.0.1:5173"]);
const MAX_TENTATIVAS = 10;

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

async function hash(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: headers(origin) });
  if (request.method !== "POST") return json({ error: "Método não permitido." }, 405, origin);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return json({ error: "Serviço indisponível." }, 500, origin);

  let payload: { token?: unknown; password?: unknown; name?: unknown; check?: unknown };
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Dados inválidos." }, 400, origin);
  }

  const token = typeof payload.token === "string" ? payload.token.trim() : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  const nome = typeof payload.name === "string" ? payload.name.trim().slice(0, 120) : "";
  const apenasConferir = payload.check === true;
  if (!token || token.length > 200) return json({ error: "Convite inválido." }, 400, origin);

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: convite } = await admin
    .from("beta_invites")
    .select("id, email, name, expires_at, used_at, revoked_at, attempts, allow_existing")
    .eq("token_hash", await hash(token))
    .maybeSingle();

  if (!convite) return json({ error: "Convite não encontrado.", motivo: "invalido" }, 404, origin);
  if (convite.used_at) return json({ error: "Este convite já foi usado.", motivo: "usado" }, 409, origin);
  if (convite.revoked_at) return json({ error: "Este convite foi cancelado.", motivo: "cancelado" }, 409, origin);
  if (new Date(convite.expires_at) < new Date()) {
    return json({ error: "Este convite expirou. Peça um novo à equipe Vello.", motivo: "expirado" }, 410, origin);
  }
  if ((convite.attempts ?? 0) >= MAX_TENTATIVAS) {
    return json({ error: "Muitas tentativas neste convite. Peça um novo.", motivo: "bloqueado" }, 429, origin);
  }

  // A tela abre o convite só para mostrar o e-mail: não consome nada.
  if (apenasConferir) {
    return json({ email: convite.email, name: convite.name, expires_at: convite.expires_at }, 200, origin);
  }

  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    await admin.from("beta_invites").update({ attempts: (convite.attempts ?? 0) + 1 }).eq("id", convite.id);
    return json({ error: "A senha precisa ter no mínimo 8 caracteres, uma letra e um número." }, 400, origin);
  }

  const { data: status } = await admin.rpc("beta_user_status", { p_email: convite.email });
  const metadata = { full_name: nome || convite.name || convite.email.split("@")[0], vello_beta_invite: true };

  if (status === "active" && !convite.allow_existing) {
    return json({ error: "Esse e-mail já tem conta ativa. Entre pelo login." }, 409, origin);
  }

  if (status === "pending" || status === "active") {
    // Conta já existente (convite antigo ou liberada pelo admin): define a senha.
    const { data: lista, error: listError } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const existente = lista?.users.find((user) => user.email?.toLowerCase() === convite.email.toLowerCase());
    if (listError || !existente) {
      console.error("listUsers", listError?.message);
      return json({ error: "Não foi possível concluir o convite." }, 500, origin);
    }
    const { error } = await admin.auth.admin.updateUserById(existente.id, {
      password,
      email_confirm: true,
      user_metadata: { ...existente.user_metadata, ...metadata },
    });
    if (error) {
      console.error("updateUser", error.message);
      return json({ error: "Não foi possível concluir o convite." }, 500, origin);
    }
  } else {
    const { error } = await admin.auth.admin.createUser({
      email: convite.email,
      password,
      email_confirm: true,
      user_metadata: metadata,
    });
    if (error) {
      console.error("createUser", error.message);
      return json({ error: "Não foi possível concluir o convite." }, 500, origin);
    }
  }

  await admin.from("beta_invites").update({ used_at: new Date().toISOString(), name: nome || convite.name }).eq("id", convite.id);
  return json({ email: convite.email }, 200, origin);
});
