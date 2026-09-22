/**
 * Privacy-friendly analytics via GoatCounter: no cookies, no personal data,
 * just page paths and a few named link events.
 */

declare global {
  interface Window {
    goatcounter?: {
      count: (vars: { path: string; title?: string; event?: boolean }) => void;
    };
  }
}

/** Count a named event (resume download, contact clicks). */
export function trackEvent(name: string) {
  window.goatcounter?.count({ path: name, event: true });
}

/** Count an SPA pageview after a client-side navigation. */
export function trackPageview(path: string) {
  window.goatcounter?.count({ path });
}
