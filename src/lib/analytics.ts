const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;
const googleAnalyticsId = "G-X51JZE369J";
let lastPage: string | undefined;
const CONSENT_KEY = "vello-analytics-consent";

/* LGPD: o Google Analytics só carrega depois que o visitante aceita. */
export type Consent = "granted" | "denied";
export function getConsent(): Consent | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}
export function setConsent(value: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Sem armazenamento: vale só para esta visita.
  }
  if (value === "granted") {
    initAnalytics();
    if (lastPage) {
      const page = lastPage;
      lastPage = undefined;
      trackPage(page);
    }
  }
}

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function initAnalytics() {
  if (domain && !document.querySelector('script[data-vello-analytics]')) {
    const script = document.createElement("script");
    script.defer = true;
    script.dataset.domain = domain;
    script.dataset.velloAnalytics = "true";
    script.src = "https://plausible.io/js/script.js";
    document.head.appendChild(script);
  }

  if (googleAnalyticsId && getConsent() === "granted" && !document.querySelector('script[data-vello-ga]')) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer?.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", googleAnalyticsId, { send_page_view: false });
    const script = document.createElement("script");
    script.async = true;
    script.dataset.velloGa = "true";
    script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
    document.head.appendChild(script);
  }
}

export function trackPage(path: string) {
  if (lastPage === path) return;
  lastPage = path;
  window.plausible?.("pageview", { props: { path } });
  window.gtag?.("event", "page_view", {
    page_path: path,
    page_location: window.location.origin + window.location.pathname,
    page_title: document.title,
  });
}

export function trackEvent(name: string, props: Record<string, string> = {}) {
  window.plausible?.(name, { props });
  window.gtag?.("event", name, props);
  window.dispatchEvent(new CustomEvent("vello:analytics", { detail: { name, ...props } }));
}
