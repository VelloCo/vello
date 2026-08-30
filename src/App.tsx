import { useEffect, useState } from "react";
import { VelloLandingMinimal } from "./components/VelloLandingMinimal";
import { AuthPage } from "./components/auth/AuthPage";
import { Onboarding } from "./components/onboarding/Onboarding";
import { PublicCatalog } from "./components/catalog/PublicCatalog";
import { PublicSelection } from "./components/catalog/PublicSelection";
import { DashboardApp } from "./components/dashboard/DashboardApp";
import { LoadingScreen } from "./components/LoadingScreen";
import { appPath } from "./lib/paths";
import { supabase } from "./lib/supabase";

const getLocation = () => ({
  path:
    window.location.pathname.replace(
      import.meta.env.BASE_URL.replace(/\/$/, ""),
      "",
    ) || "/",
  search: window.location.search,
});

function Landing() {
  return <VelloLandingMinimal />;
}

export default function App() {
  const [location, setLocation] = useState(getLocation);
  const [user, setUser] = useState<
    import("@supabase/supabase-js").User | null | undefined
  >(undefined);
  const [onboardingDone, setOnboardingDone] = useState<boolean | undefined>(
    undefined,
  );
  const path = location.path;
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
    const syncLocation = () => setLocation(getLocation());
    window.addEventListener("popstate", syncLocation);
    return () => window.removeEventListener("popstate", syncLocation);
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
    return <LoadingScreen />;
  if (privateRoute && !user) {
    window.location.replace(appPath("/login"));
    return null;
  }
  if (path.startsWith("/dashboard") && user && !onboardingDone) {
    window.location.replace(appPath("/onboarding"));
    return null;
  }
  if (path === "/dashboard/configuracoes" && user) {
    window.location.replace(appPath("/dashboard/perfil"));
    return null;
  }
  if (path === "/onboarding" && user) return <Onboarding user={user} />;
  if (path.startsWith("/dashboard") && user)
    return <DashboardApp user={user} route={path} locationSearch={location.search} />;
  if (path === "/login") return <AuthPage mode="login" />;
  if (path === "/cadastro") return <AuthPage mode="signup" />;
  if (path === "/esqueci-senha") return <AuthPage mode="forgot" />;
  if (path === "/redefinir-senha") return <AuthPage mode="reset" />;
  if (path === "/verificar-email") return <AuthPage mode="verify" />;
  const catalogRoute = path.match(/^\/catalogo\/([^/]+)(?:\/imovel\/([^/]+))?$/);
  if (catalogRoute)
    return <PublicCatalog slug={catalogRoute[1]} propertySlug={catalogRoute[2]} />;
  if (path.startsWith("/selecao/"))
    return <PublicSelection slug={path.replace("/selecao/", "")} />;
  const publicRoute = path.match(/^\/([^/]+)(?:\/imovel\/([^/]+))?$/);
  if (publicRoute)
    return <PublicCatalog slug={publicRoute[1]} propertySlug={publicRoute[2]} />;
  return <Landing />;
}
