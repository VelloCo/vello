import { lazy, Suspense, useEffect, useState } from "react";
import { LoadingScreen } from "./components/LoadingScreen";
import { ConsentBanner } from "./components/ConsentBanner";
import { appPath } from "./lib/paths";
import { initAnalytics, trackPage } from "./lib/analytics";

const getLocation = () => ({
  path:
    window.location.pathname.replace(
      import.meta.env.BASE_URL.replace(/\/$/, ""),
      "",
    ) || "/",
  search: window.location.search,
});

// Cada área carrega só quando é aberta: quem vê a landing ou a página de uma
// estética não baixa o painel, e vice-versa.
const Landing = lazy(() => import("./components/VelloLandingEstetica").then((m) => ({ default: m.VelloLandingEstetica })));
const AdminApp = lazy(() => import("./components/AdminApp").then((m) => ({ default: m.AdminApp })));
const AcceptInvitePage = lazy(() => import("./components/auth/AcceptInvitePage").then((m) => ({ default: m.AcceptInvitePage })));
const AuthPage = lazy(() => import("./components/auth/AuthPage").then((m) => ({ default: m.AuthPage })));
const Onboarding = lazy(() => import("./components/onboarding/Onboarding").then((m) => ({ default: m.Onboarding })));
const PublicServiceCatalog = lazy(() => import("./components/catalog/PublicServiceCatalog").then((m) => ({ default: m.PublicServiceCatalog })));
const DashboardApp = lazy(() => import("./components/dashboard/DashboardApp").then((m) => ({ default: m.DashboardApp })));
const LegalPage = lazy(() => import("./components/LaunchPages").then((m) => ({ default: m.LegalPage })));
const SupportPage = lazy(() => import("./components/LaunchPages").then((m) => ({ default: m.SupportPage })));
const NotFoundPage = lazy(() => import("./components/LaunchPages").then((m) => ({ default: m.NotFoundPage })));

export default function App() {
  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <Routes />
      </Suspense>
      <ConsentBanner />
    </>
  );
}

/*
 * Links de convite e de recuperação de senha voltam do Supabase com os dados
 * no final do endereço (#access_token=...). Se o Supabase mandar para a raiz
 * (por exemplo, quando o domínio não está na lista de permitidos dele), a
 * pessoa cairia na landing. Aqui levamos ela para a tela certa, sem perder
 * o link.
 */
function rotaDoLinkDeAuth() {
  const hash = window.location.hash;
  if (!hash || hash.length < 2) return null;
  const params = new URLSearchParams(hash.slice(1));
  const tipo = params.get("type");
  const erro = params.get("error_code") || params.get("error");
  if (params.get("access_token") && (tipo === "recovery" || tipo === "invite" || tipo === "signup")) {
    return tipo === "signup" ? "/onboarding" : "/redefinir-senha";
  }
  if (erro && (tipo === "recovery" || tipo === "invite")) return "/redefinir-senha";
  return null;
}

function Routes() {
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
  const privateRoute = path === "/onboarding" || path.startsWith("/dashboard") || path === "/admin";
  const conviteRota = path.startsWith("/convite/");

  useEffect(() => {
    const page = path === "/" ? ["Vello — Agenda online e página de serviços para estéticas", "Página de serviços, agendamento online e agenda organizada para estéticas e profissionais da beleza. Sua cliente agenda sozinha. Teste grátis por 7 dias."]
      : path === "/login" ? ["Entrar | Vello", "Entre para gerenciar sua agenda e seus serviços na Vello."]
      : path === "/cadastro" ? ["Beta fechado | Vello", "A Vello está recebendo as primeiras profissionais por convite."]
      : path === "/onboarding" ? ["Configure sua Vello", "Complete o perfil da sua estética e publique seu primeiro serviço."]
      : path.startsWith("/dashboard") ? ["Painel | Vello", "Gerencie agenda, serviços e a página pública da sua estética."]
      : path === "/admin" ? ["Administração | Vello", "Acompanhe a ativação e o uso da Vello."]
      : path === "/termos" ? ["Termos de Uso | Vello", "Termos de uso da Vello."]
      : path === "/privacidade" ? ["Política de Privacidade | Vello", "Política de privacidade da Vello."]
      : path === "/suporte" ? ["Suporte | Vello", "Fale com o suporte da Vello."]
      : path.startsWith("/convite/") ? ["Seu convite | Vello", "Crie sua senha e entre na Vello."]
      : ["Serviços | Vello", "Conheça os serviços disponíveis nesta estética Vello."];
    document.title = page[0];
    document.querySelector('meta[name="description"]')?.setAttribute("content", page[1]);
    const robots = document.querySelector('meta[name="robots"]');
    const indexable = ["/", "/termos", "/privacidade", "/suporte"].includes(path) || /^\/[A-Za-z0-9-]+\/?$/.test(path);
    robots?.setAttribute("content", authRoute || privateRoute || conviteRota ? "noindex,nofollow" : indexable ? "index,follow" : "noindex,follow");
    document.querySelector('link[rel="canonical"]')?.setAttribute(
      "href",
      `${window.location.origin}${appPath(path)}`,
    );
    const socialImage = `${window.location.origin}${appPath("/og-vello-social-v2.jpg")}`;
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", page[0]);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", page[1]);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", `${window.location.origin}${appPath(path)}`);
    document.querySelector('meta[property="og:image"]')?.setAttribute("content", socialImage);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", page[0]);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", page[1]);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute("content", socialImage);
    initAnalytics();
    trackPage(path);
  }, [authRoute, conviteRota, path, privateRoute]);

  useEffect(() => {
    if (path !== "/") return;
    const destino = rotaDoLinkDeAuth();
    if (destino) window.location.replace(appPath(destino) + window.location.hash);
  }, [path]);

  // O cliente do Supabase só é baixado nas telas que precisam de login;
  // landing e página pública não pagam esse peso.
  const needsAuth = authRoute || privateRoute;
  useEffect(() => {
    if (!needsAuth) return;
    let unsubscribe = () => {};
    let active = true;
    void import("./lib/supabase").then(({ supabase }) => {
      if (!active) return;
      if (!supabase) {
        setUser(null);
        return;
      }
      supabase.auth.getUser().then(({ data }) => active && setUser(data.user));
      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => setUser(session?.user ?? null),
      );
      unsubscribe = () => listener.subscription.unsubscribe();
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [needsAuth]);

  useEffect(() => {
    const syncLocation = () => setLocation(getLocation());
    window.addEventListener("popstate", syncLocation);
    return () => window.removeEventListener("popstate", syncLocation);
  }, []);

  useEffect(() => {
    if (!user) {
      setOnboardingDone(undefined);
      return;
    }
    void import("./lib/supabase").then(({ supabase }) =>
      supabase
        ?.from("profiles")
        .select("onboarding_completed")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) =>
          setOnboardingDone(Boolean(data?.onboarding_completed)),
        ),
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
  if (path === "/onboarding" && user) return <Onboarding user={user} />;
  if (path === "/admin" && user) return <AdminApp />;
  if (path.startsWith("/dashboard") && user)
    return <DashboardApp user={user} route={path} />;
  if (path === "/login") return <AuthPage mode="login" />;
  if (path === "/cadastro") return <AuthPage mode="signup" />;
  if (path === "/esqueci-senha") return <AuthPage mode="forgot" />;
  if (path === "/redefinir-senha") return <AuthPage mode="reset" invited={Boolean(user?.user_metadata?.vello_beta_invite)} />;
  if (path === "/verificar-email") return <AuthPage mode="verify" />;
  if (path === "/termos") return <LegalPage kind="terms" />;
  if (path === "/privacidade") return <LegalPage kind="privacy" />;
  if (path === "/suporte") return <SupportPage />;
  const conviteRoute = path.match(/^\/convite\/([A-Za-z0-9_-]{16,200})$/);
  if (conviteRoute) return <AcceptInvitePage token={conviteRoute[1]} />;
  if (path === "/404") return <NotFoundPage />;
  const publicRoute = path.match(/^\/([A-Za-z0-9-]+)\/?$/);
  if (publicRoute) return <PublicServiceCatalog slug={publicRoute[1].toLowerCase()} />;
  return path === "/" ? <Landing /> : <NotFoundPage />;
}
