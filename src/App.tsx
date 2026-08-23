import type { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { HowItWorks } from './components/HowItWorks';
import { Catalog } from './components/Catalog';
import { Benefits } from './components/Benefits';
import { Pricing } from './components/Pricing';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { AuthPage } from './components/auth/AuthPage';
import { Onboarding } from './components/onboarding/Onboarding';
import { PublicCatalog } from './components/catalog/PublicCatalog';
import { appPath } from './lib/paths';
import { signOut } from './lib/auth';
import { supabase } from './lib/supabase';

function Dashboard({ user }: { user: User }) {
  const [name, setName] = useState('');
  useEffect(() => { supabase?.from('profiles').select('professional_name').eq('user_id', user.id).maybeSingle().then(({ data }) => setName(data?.professional_name || user.user_metadata.full_name || '')); }, [user.id, user.user_metadata.full_name]);
  return <main className="min-h-screen bg-paper px-6 py-8"><div className="mx-auto max-w-5xl"><div className="flex items-center justify-between"><p className="font-display text-2xl font-semibold text-ink">Olá, {String(name).split(' ')[0] || 'corretor'}.</p><button onClick={async () => { await signOut(); window.location.href = appPath('/login'); }} className="rounded-full border border-line px-4 py-2 font-body text-sm text-ash">Sair</button></div><div className="mt-16 rounded-[24px] border border-line bg-white p-8"><p className="font-mono text-[10px] uppercase tracking-[0.12em] text-stone">Seu espaço Vello</p><h1 className="mt-4 font-display text-4xl font-semibold text-ink">Seu catálogo começa aqui.</h1><p className="mt-3 max-w-lg font-body text-ash">A área de gestão está pronta para receber seus imóveis e o onboarding do corretor.</p></div></div></main>;
}

function Landing() { return <><Header /><main><Hero /><Catalog /><Problem /><Benefits /><HowItWorks /><Pricing /><FinalCTA /></main><Footer /></>; }

export default function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const path = window.location.pathname.replace(import.meta.env.BASE_URL.replace(/\/$/, ''), '') || '/';
  const authRoute = ['/login', '/cadastro', '/esqueci-senha', '/redefinir-senha', '/verificar-email'].includes(path);
  const privateRoute = ['/onboarding', '/dashboard'].includes(path);

  useEffect(() => {
    if (!supabase) { setUser(null); return; }
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  if (user === undefined && (authRoute || privateRoute)) return <main className="grid min-h-screen place-items-center bg-paper"><span className="font-body text-sm text-ash">Carregando…</span></main>;
  if (privateRoute && !user) { window.location.replace(appPath('/login')); return null; }
  if (path === '/onboarding' && user) return <Onboarding user={user} />;
  if (path === '/dashboard' && user) return <Dashboard user={user} />;
  if (path === '/login') return <AuthPage mode="login" />;
  if (path === '/cadastro') return <AuthPage mode="signup" />;
  if (path === '/esqueci-senha') return <AuthPage mode="forgot" />;
  if (path === '/redefinir-senha') return <AuthPage mode="reset" />;
  if (path === '/verificar-email') return <AuthPage mode="verify" />;
  if (path.startsWith('/catalogo/')) return <PublicCatalog slug={path.replace('/catalogo/', '')} />;
  return <Landing />;
}
