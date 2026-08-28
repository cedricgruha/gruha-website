/**
 * Centralized Google Analytics (GA4) event layer.
 *
 * All app events go through here so event names + parameters stay consistent,
 * typed, and easy to extend. Components never call `window.gtag` directly —
 * they call a named helper in this file. Add new events here, keep the GA4
 * property's custom dimensions in sync with the parameters below.
 */

// Minimal gtag surface used by this app. `window.gtag` is defined by the GA4
// script injected in src/app/layout.tsx. We ignore type errors defensively so
// this never crashes if the snippet fails to load.
type GtagFn = (...args: unknown[]) => void;

function getGtag(): GtagFn | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { gtag?: GtagFn };
  return w.gtag;
}

/** Fire an event only when GA is loaded — silently no-op otherwise. */
function track(eventName: string, params: Record<string, unknown>): void {
  const gtag = getGtag();
  if (!gtag) return;
  try {
    gtag("event", eventName, params);
  } catch (e) {
    // Analytics must never break the UI.
    if (process.env.NODE_ENV !== "production") {
      console.warn("Analytics event failed:", eventName, e);
    }
  }
}

/**
 * CTA click (Join Waitlist / Join Cohort / Adapt this journal …).
 * Fired centrally from WaitlistContext.openModal so every CTA is covered
 * without instrumenting each button. Pass an optional `cta` to distinguish
 * specific CTAs powering the same modal.
 */
export function trackCtaClick(override?: {
  cta?: string;
  source?: string;
  page?: string;
}): void {
  const cta = override?.cta ?? "join_waitlist";
  track("click_cta", {
    cta,
    // The page where the CTA was clicked (fallback: current URL).
    page: override?.page ?? (typeof window !== "undefined" ? window.location.pathname : ""),
    // Specific CTA element, when known (e.g. "header", "hero", "sidebar").
    ...(override?.source ? { source: override.source } : {}),
  });
}

/**
 * Explored-area / map location selection on a journal's Search tab.
 * `journal` is the slug (from the URL), included so same-named areas across
 * different journals stay distinguishable in GA4.
 */
export function trackLocationClick(override?: { area?: string; journal?: string; page?: string }): void {
  const page = override?.page ?? (typeof window !== "undefined" ? window.location.pathname : "");
  track("click_location", {
    area: override?.area ?? "",
    journal: override?.journal ?? journalSlugFromPath(page),
    page,
  });
}

/**
 * Homepage community-journals category card click.
 */
export function trackCategoryClick(override?: { category?: string; page?: string }): void {
  track("click_category", {
    category: override?.category ?? "",
    page: override?.page ?? (typeof window !== "undefined" ? window.location.pathname : ""),
  });
}

// Extract the journal slug from a path like /community-journals/the-quiet-crorepatis
// (or /community-journals/<slug>). Returns "" when not a journal page.
function journalSlugFromPath(page: string): string {
  const m = page.match(/\/community-journals\/([^/?]+)/);
  return m?.[1] ? decodeURIComponent(m[1]) : "";
}
