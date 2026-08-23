import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Problem } from "./components/Problem";
import { HowItWorks } from "./components/HowItWorks";
import { Catalog } from "./components/Catalog";
import { Benefits } from "./components/Benefits";
import { Pricing } from "./components/Pricing";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { AuthPage } from "./components/auth/AuthPage";
import { Onboarding } from "./components/onboarding/Onboarding";
import { PublicCatalog } from "./components/catalog/PublicCatalog";
import { PublicSelection } from "./components/catalog/PublicSelection";
import { DashboardApp } from "./components/dashboard/DashboardApp";
import { appPath } from "./lib/paths";
import { supabase } from "./lib/supabase";

function Landing() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Catalog />
        <Problem />
        <Benefits />
        <HowItWorks />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const [user, setUser] = useState<
    import("@supabase/supabase-js").User | null | undefined
  >(undefined);
  const [onboardingDone, setOnboardingDone] = useState<boolean | undefined>(
    undefined,
  );
  const path =
    window.location.pathname.replace(
      import.meta.env.BASE_URL.replace(/\/$/, ""),
      "",
    ) || "/";
  const authRoute = [
    "/login",
    "/cadastro",
    "/esqueci-senha",
    "/redefinir-senha",
    "/verificar-email",
  ].includes(path);
  const privateRoute = path === "/onboarding" || path.startsWith("/dashboard");

  useEffect(() => {
    if (!supabase) {
      setUser(null);
      return;
    }
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null),
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !supabase) {
      setOnboardingDone(undefined);
      return;
    }
    supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) =>
        setOnboardingDone(Boolean(data?.onboarding_completed)),
      );
  }, [user]);

  if (
    (user === undefined || (user && onboardingDone === undefined)) &&
    (authRoute || privateRoute)
  )
    return (
      <main className="grid min-h-screen place-items-center bg-paper">
        <span className="font-body text-sm text-ash">Carregando…</span>
      </main>
    );
  if (privateRoute && !user) {
    window.location.replace(appPath("/login"));
    return null;
  }
  if (path.startsWith("/dashboard") && user && !onboardingDone) {
    window.location.replace(appPath("/onboarding"));
    return null;
  }
  if (path === "/onboarding" && user) return <Onboarding user={user} />;
  if (path.startsWith("/dashboard") && user)
    return <DashboardApp user={user} route={path} />;
  if (path === "/login") return <AuthPage mode="login" />;
  if (path === "/cadastro") return <AuthPage mode="signup" />;
  if (path === "/esqueci-senha") return <AuthPage mode="forgot" />;
  if (path === "/redefinir-senha") return <AuthPage mode="reset" />;
  if (path === "/verificar-email") return <AuthPage mode="verify" />;
  if (path.startsWith("/catalogo/"))
    return <PublicCatalog slug={path.replace("/catalogo/", "")} />;
  if (path.startsWith("/selecao/"))
    return <PublicSelection slug={path.replace("/selecao/", "")} />;
  return <Landing />;
}
