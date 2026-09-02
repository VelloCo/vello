import { createClient } from '@supabase/supabase-js';

// These values are intentionally the public client configuration. They are safe
// to ship to the browser; authorization is enforced by Supabase Auth and RLS.
// Environment variables still take priority when configured on Vercel.
const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  "https://scqlyropbykktnzlsdwh.supabase.co";
const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  "sb_publishable_Cz7swhcvYp4183x-OprW9Q_RvQ0oNHa";

export const supabase = url && key ? createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
}) : null;

export function requireSupabase() {
  if (!supabase) throw new Error('A conexão da Vello ainda não foi configurada.');
  return supabase;
}
