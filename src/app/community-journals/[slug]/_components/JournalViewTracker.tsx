"use client";

import { useEffect } from "react";
import { trackJournalView } from "@/lib/analytics";

/**
 * Fires a `journal_viewed` GA4 event whenever a journal details page is visited
 * DIRECTLY / from a shared link (not via an on-site card click).
 *
 * Reservation logic (via sessionStorage so it also survives React StrictMode's
 * double-invocation of effects in dev):
 *  - Card click sets flag = "1" BEFORE navigation. Here we see "1" -> it's a card
 *    click; suppress `journal_viewed`, mark flag as consumed ("0").
 *  - Direct / shared-link visit: no flag. Fire `journal_viewed` once, then mark
 *    the visit handled ("handled") so StrictMode's second effect run doesn't
 *    double-fire.
 *  - "0" or "handled" -> already dealt with for this visit; do nothing.
 */
const FLAG_KEY = "journal_card_clicked";

export function JournalViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    let flag: string | null = null;
    try {
      flag = sessionStorage.getItem(FLAG_KEY);
    } catch {
      // sessionStorage unavailable - fall through and record the view.
    }

    if (flag === "1") {
      // Arrived via a card click - that fired `journal_card_click` already.
      try {
        sessionStorage.setItem(FLAG_KEY, "0");
      } catch {
        // ignore
      }
      return;
    }

    if (flag === "0" || flag === "handled") {
      // Already processed for this visit (StrictMode re-run, or back-navigation).
      return;
    }

    // Direct / shared-link visit: record once and mark handled.
    trackJournalView({ journal: slug });
    try {
      sessionStorage.setItem(FLAG_KEY, "handled");
    } catch {
      // ignore
    }
  }, [slug]);

  return null;
}
