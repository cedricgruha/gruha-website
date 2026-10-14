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

// Only these hosts are allowed to send events (production domain).
const ALLOWED_HOSTS = new Set(["gruha.ai", "www.gruha.ai"]);

function isAllowedHost(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return ALLOWED_HOSTS.has(window.location.hostname.toLowerCase());
  } catch {
    return false;
  }
}

function getGtag(): GtagFn | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { gtag?: GtagFn };
  return w.gtag;
}

/** Fire an event only when GA is loaded AND on the production domain. */
function track(eventName: string, params: Record<string, unknown>): void {
  // Never send events from localhost/staging/preview domains.
  if (!isAllowedHost()) return;

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
    // Which CTA section was clicked (e.g. "header", "hero", "sidebar",
    // "mobile_bottom_bar"). Named `cta_source` (not `source`) to avoid colliding
    // with GA4's traffic-source `source` parameter. Register `cta` + `cta_source`
    // as event-scoped custom dimensions in GA4 to report per-section counts.
    ...(override?.source ? { cta_source: override.source } : {}),
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

/**
 * Journal card click on the listing page (card -> details navigation).
 */
export function trackJournalCardClick(override?: {
  journal_id?: string | number;
  journal_title?: string;
  location?: string;
  filter?: string;
}): void {
  track("journal_card_click", {
    journal_id: override?.journal_id ?? null,
    journal_title: override?.journal_title ?? "",
    location: override?.location ?? "",
    filter: override?.filter ?? "",
    page: typeof window !== "undefined" ? window.location.pathname : "",
  });
}

/**
 * Journal details page view. Fired on mount of a slug page so EVERY visit is
 * captured (card click, direct link, social share, refresh) with the slug as a
 * structured parameter — complementary to the automatic GA4 page_view.
 */
export function trackJournalView(override?: { journal?: string; page?: string }): void {
  const page = override?.page ?? (typeof window !== "undefined" ? window.location.pathname : "");
  track("journal_viewed", {
    journal: override?.journal ?? journalSlugFromPath(page),
    page,
  });
}

/**
 * Filter pill selection on the Journals listing page.
 */
export function trackFilterClick(override?: { filter?: string; previous_filter?: string }): void {
  track("filter_pill_click", {
    filter_name: override?.filter ?? "",
    previous_filter: override?.previous_filter ?? "",
  });
}

/**
 * "Explore Projects" CTA click in the hero section or elsewhere.
 */
export function trackExploreProjectsClick(override?: { source?: string; page?: string }): void {
  track("click_explore_projects", {
    cta: "explore_projects",
    cta_source: override?.source ?? "hero",
    page: override?.page ?? (typeof window !== "undefined" ? window.location.pathname : ""),
  });
}

/**
 * "Explore Community Journals" button click in the homepage carousel header.
 */
export function trackExploreCommunityJournalsClick(override?: { source?: string; page?: string }): void {
  track("click_explore_community_journals", {
    cta: "explore_community_journals",
    cta_source: override?.source ?? "homepage_carousel",
    page: override?.page ?? (typeof window !== "undefined" ? window.location.pathname : ""),
  });
}

/**
 * Chapter selection in "The Gruha Way · From conversation to keys" tour.
 * (01 Understand, 02 Recommend, 03 Explore & refine, 04 Connect)
 */
export function trackExplainerChapterClick(params: {
  chapter_index: number | string;
  chapter_name: string;
  chapter_time?: number;
}): void {
  track("explainer_chapter_click", {
    chapter_index: params.chapter_index,
    chapter_name: params.chapter_name,
    chapter_time: params.chapter_time ?? 0,
    section: "gruha_explainer",
  });
}

/**
 * Agent avatar click in the Gruha Explainer interactive team rail.
 */
export function trackExplainerAgentClick(params: {
  agent_name: string;
  agent_role?: string;
  agent_index?: number;
}): void {
  track("explainer_agent_click", {
    agent_name: params.agent_name,
    agent_role: params.agent_role ?? "",
    agent_index: params.agent_index ?? 0,
    section: "gruha_explainer",
  });
}

/**
 * "Replay tour" button click in the Gruha Explainer.
 */
export function trackExplainerReplayClick(): void {
  track("explainer_replay_click", {
    action: "replay",
    section: "gruha_explainer",
  });
}

/**
 * Play / Pause button toggle in the Gruha Explainer.
 */
export function trackExplainerPlayToggle(params: { action: "play" | "pause" }): void {
  track("explainer_play_toggle", {
    action: params.action,
    section: "gruha_explainer",
  });
}

/**
 * Successful waitlist form submission.
 */
export function trackWaitlistSubmitSuccess(override?: { source?: string }): void {
  track("waitlist_submitted", {
    status: "success",
    source: override?.source ?? "modal",
  });
}

// Extract the journal slug from a path like /community-journals/the-quiet-crorepatis
// (or /community-journals/<slug>). Returns "" when not a journal page.
function journalSlugFromPath(page: string): string {
  const m = page.match(/\/community-journals\/([^/?]+)/);
  return m?.[1] ? decodeURIComponent(m[1]) : "";
}
