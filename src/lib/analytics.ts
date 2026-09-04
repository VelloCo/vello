const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;
const googleAnalyticsId = "G-X51JZE369J";

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

  if (googleAnalyticsId && !document.querySelector('script[data-vello-ga]')) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
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
  window.plausible?.("pageview", { props: { path } });
  window.gtag?.("event", "page_view", { page_path: path, page_title: document.title });
}

export function trackEvent(name: string, props: Record<string, string> = {}) {
  window.plausible?.(name, { props });
  window.gtag?.("event", name, props);
  window.dispatchEvent(new CustomEvent("vello:analytics", { detail: { name, ...props } }));
}
