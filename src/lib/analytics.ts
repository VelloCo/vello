const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

export function initAnalytics() {
  if (!domain || document.querySelector('script[data-vello-analytics]')) return;
  const script = document.createElement("script");
  script.defer = true;
  script.dataset.domain = domain;
  script.dataset.velloAnalytics = "true";
  script.src = "https://plausible.io/js/script.js";
  document.head.appendChild(script);
}

export function trackPage(path: string) {
  window.plausible?.("pageview", { props: { path } });
}

export function trackEvent(name: string, props: Record<string, string> = {}) {
  window.plausible?.(name, { props });
  window.dispatchEvent(new CustomEvent("vello:analytics", { detail: { name, ...props } }));
}
