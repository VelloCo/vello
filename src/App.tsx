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
import { getSession, logout } from './lib/auth';

function Dashboard() {
  const user = getSession();
  if (!user) {
    window.location.replace('/login');
    return null;
  }
  return <main className="min-h-screen bg-paper px-6 py-8"><div className="mx-auto max-w-5xl"><div className="flex items-center justify-between"><p className="font-display text-2xl font-semibold text-ink">Olá, {user.name.split(' ')[0]}.</p><button onClick={() => { logout(); window.location.href = '/login'; }} className="rounded-full border border-line px-4 py-2 font-body text-sm text-ash">Sair</button></div><div className="mt-16 rounded-[24px] border border-line bg-white p-8"><p className="font-mono text-[10px] uppercase tracking-[0.12em] text-stone">Seu espaço Vello</p><h1 className="mt-4 font-display text-4xl font-semibold text-ink">Seu catálogo começa aqui.</h1><p className="mt-3 max-w-lg font-body text-ash">A área de gestão está pronta para receber seus imóveis e o onboarding do corretor.</p></div></div></main>;
}

function App() {
  const path = window.location.pathname;
  if (path === '/login') return <AuthPage mode="login" />;
  if (path === '/cadastro') return <AuthPage mode="signup" />;
  if (path === '/esqueci-senha') return <AuthPage mode="forgot" />;
  if (path === '/redefinir-senha') return <AuthPage mode="reset" />;
  if (path === '/verificar-email') return <AuthPage mode="verify" />;
  if (path === '/dashboard') return <Dashboard />;
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <main>
        <Hero />
        <Problem />
        <Catalog />
        <Benefits />
        <HowItWorks />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
