import type { User } from '@supabase/supabase-js';
import { appPath } from './paths';
import { requireSupabase } from './supabase';

function redirectUrl(path: string) {
  return `${window.location.origin}${appPath(path)}`;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await requireSupabase().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signUp(name: string, email: string, password: string) {
  const { data, error } = await requireSupabase().auth.signUp({
    email,
    password,
    options: { data: { full_name: name }, emailRedirectTo: redirectUrl('/onboarding') },
  });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const { data, error } = await requireSupabase().auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: redirectUrl('/onboarding') },
  });
  if (error) throw error;
  if (data.url) window.location.assign(data.url);
}

export async function signOut() {
  const { error } = await requireSupabase().auth.signOut();
  if (error) throw error;
}

export async function updatePassword(password: string) {
  const { error } = await requireSupabase().auth.updateUser({ password });
  if (error) throw error;
}

export async function sendPasswordReset(email: string) {
  const { error } = await requireSupabase().auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl('/redefinir-senha'),
  });
  if (error) throw error;
}

export async function resendSignupEmail(email: string) {
  const { error } = await requireSupabase().auth.resend({
    type: 'signup',
    email,
  });
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await requireSupabase().auth.getUser();
  if (error) return null;
  return data.user;
}

// Compatibility aliases for the existing authentication screens.
export const login = signIn;
export const register = signUp;
export const continueWithGoogle = signInWithGoogle;
