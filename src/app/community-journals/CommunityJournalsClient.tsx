"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { FooterVariant } from "@/components/layout/FooterVariant";

const fd = "'Newsreader', Georgia, serif";
const fu = "'Inter Tight', system-ui, sans-serif";

interface JournalCard {
  id: number;
  title: string;
  subtitle: string;
  tags: string[];
  segment: string;
  image: string;
  views?: number;
  copies?: number;
  path?: string;
  location?: string;
}

const FILTERS = [
  "All",
  "Investment",
  "Pre-launch",
  "First Home",
  "Families",
  "Seniors & Downsizers",
  "Plots & Villas",
  "NRI & Returnees",
  "Upgraders",
  "Specialists",
];

const POPULAR_SEARCHES = [
  "Investment",
  "First Home",
  "Families",
  "Seniors & Downsizers",
  "Plots & Villas",
  "NRI & Returnees",
  "Upgraders",
  "Specialists",
];

// Compact group filters derived from the segment field (source of truth).
// Primary personas are matched by the LEADING segment word (startsWith), so
// combined segments like "INVESTORS & WEALTH / NRI" stay under their primary
// group and don't leak into other persona filters. Cross-cutting identities
// (Upgrader) are matched via distinctive tags. "Legacy" and "Lifestyle" fold
// into their primary groups (Families / Investment) rather than getting pills.
const GROUP_FILTER_MAP: Record<string, { segment: string[]; tags: string[] }> = {
  "Investment": { segment: ["investors & wealth"], tags: [] },
  "Pre-launch": { segment: ["pre-launch", "eoi", "pre launch"], tags: ["eoi", "pre-launch", "prelaunch"] },
  "First Home": { segment: ["young professionals"], tags: [] },
  "Families": { segment: ["families"], tags: [] },
  "Seniors & Downsizers": { segment: ["seniors"], tags: [] },
  "Plots & Villas": { segment: ["plot buyers"], tags: [] },
  "NRI & Returnees": { segment: ["nri"], tags: [] },
  "Upgraders": { segment: ["upgraders"], tags: ["upgrader"] },
  "Specialists": { segment: ["special convictions", "primary purchase"], tags: ["special convictions"] },
};

// Persona label used on the card chip, derived from the segment field and the
// same cross-cutting tags so chips stay consistent with the filters above.
function getPersonaLabel(journal: JournalCard): string {
  const seg = (journal.segment || "").trim().toLowerCase();
  const tagsStr = (journal.tags || []).join(" ").toLowerCase();

  // Pre-launch / EOI is a cross-cutting facet — match it first so these journals
  // get the Pre-launch badge rather than their primary segment persona.
  if (seg.startsWith("pre-launch") || seg.startsWith("eoi") || seg.includes("pre-launch") || seg.includes("eoi") || tagsStr.includes("eoi") || tagsStr.includes("pre-launch")) {
    return "Pre-launch";
  }
  if (seg.startsWith("nri")) return "NRI & Returnees";
  if (seg.includes("/ upgrader")) return "Upgraders";
  if (seg.includes("/ legacy") || tagsStr.includes("legacy") || tagsStr.includes("inheritance")) return "Legacy";
  if (seg.includes("/ lifestyle") || tagsStr.includes("lifestyle") || tagsStr.includes("managed farmland")) return "Lifestyle";
  if (seg.startsWith("investors & wealth")) return "Investors & Wealth";
  if (seg.startsWith("plot buyers")) return "Plot Buyers";
  if (seg.startsWith("young professionals")) return "Young Professionals";
  if (seg.startsWith("families")) return "Families";
  if (seg.startsWith("seniors")) return "Seniors & Downsizers";
  if (seg.startsWith("special convictions")) return "Special Convictions";
  if (seg.startsWith("primary purchase")) return "Primary Purchase";
  return "Community";
}

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  "Investors & Wealth": { bg: "bg-white/95", color: "#DD5128" },
  "Pre-launch": { bg: "bg-white/95", color: "#D97706" },
  "Plot Buyers": { bg: "bg-white/95", color: "#B45309" },
  "Young Professionals": { bg: "bg-white/95", color: "#0E7490" },
  "Families": { bg: "bg-white/95", color: "#1D4ED8" },
  "Seniors & Downsizers": { bg: "bg-white/95", color: "#7E22CE" },
  "NRI & Returnees": { bg: "bg-white/95", color: "#6B21A8" },
  "Special Convictions": { bg: "bg-white/95", color: "#15803D" },
  "Primary Purchase": { bg: "bg-white/95", color: "#0369A1" },
  "Lifestyle": { bg: "bg-white/95", color: "#047857" },
  "Legacy": { bg: "bg-white/95", color: "#5347D6" },
  "Upgraders": { bg: "bg-white/95", color: "#B45309" },
  "Community": { bg: "bg-[#FEF0EC]", color: "#DD5128" },
};

function getCategoryBadge(journal: JournalCard): { text: string; bg: string; color: string } {
  const label = getPersonaLabel(journal);
  const style = BADGE_STYLES[label] || BADGE_STYLES.Community;
  return { text: label.toUpperCase(), bg: style.bg, color: style.color };
}

// Helper to determine location string.
// Prefers the card's explicit `location` (journal-sourced real corridor); only
// falls back to keyword inference + a cycled name when `location` is absent.
function getLocationName(journal: JournalCard): string {
  if (journal.location && journal.location.trim()) {
    return journal.location.trim();
  }

  const tagsStr = (journal.tags || []).join(" ").toLowerCase();
  const subStr = (journal.subtitle || "").toLowerCase();

  if (tagsStr.includes("whitefield") || subStr.includes("whitefield")) return "Whitefield";
  if (tagsStr.includes("sarjapur") || subStr.includes("sarjapur")) return "Sarjapur Road";
  if (tagsStr.includes("yelahanka") || subStr.includes("yelahanka")) return "Yelahanka";
  if (tagsStr.includes("thanisandra") || subStr.includes("thanisandra")) return "Thanisandra";
  if (tagsStr.includes("koramangala") || subStr.includes("koramangala")) return "Koramangala";
  if (tagsStr.includes("hebbal") || subStr.includes("hebbal")) return "Hebbal";
  if (tagsStr.includes("bellandur") || subStr.includes("bellandur")) return "Bellandur";
  if (tagsStr.includes("jp nagar") || subStr.includes("jp nagar")) return "JP Nagar";
  if (tagsStr.includes("hsr") || subStr.includes("hsr layout")) return "HSR Layout";
  if (tagsStr.includes("frazer") || subStr.includes("frazer town")) return "Frazer Town";
  if (tagsStr.includes("malleshwaram") || subStr.includes("malleshwaram")) return "Malleshwaram";
  if (tagsStr.includes("basavanagudi") || subStr.includes("basavanagudi")) return "Basavanagudi";
  if (tagsStr.includes("panathur") || subStr.includes("panathur")) return "Panathur";

  const fallbackLocs = ["Whitefield", "Sarjapur Road", "Yelahanka", "Thanisandra", "Koramangala", "Hebbal", "Bellandur"];
  return fallbackLocs[journal.id % fallbackLocs.length];
}

// Helper to get time ago string
function getTimeAgo(idx: number): string {
  if (idx === 0) return "New";
  if (idx === 1) return "New";
  const times = ["2d ago", "3d ago", "5d ago", "6d ago", "7d ago", "8d ago", "9d ago", "10d ago", "11d ago", "12d ago"];
  return times[(idx - 2) % times.length];
}

// Helper to get comments count
function getCommentsCount(journal: JournalCard): number {
  const base = [124, 96, 142, 88, 73, 101, 88, 96, 95, 66, 77, 54, 112, 84, 92];
  return base[journal.id % base.length];
}

// Helper to format views count
function getFormattedViews(journal: JournalCard): string {
  if (journal.views) {
    if (journal.views >= 1000) {
      return (journal.views / 1000).toFixed(1) + "K";
    }
    return journal.views.toString();
  }
  const base = [2.1, 1.8, 3.2, 1.6, 1.3, 2.4, 1.2, 2.0, 1.9, 1.1, 1.5, 0.98];
  const val = base[journal.id % base.length];
  return val >= 1 ? `${val}K` : "980";
}

function matchesFilter(journal: JournalCard, filter: string): boolean {
  if (filter === "All") return true;

  const segment = (journal.segment || "").toLowerCase();
  const tags = (journal.tags || []).map((t) => t.toLowerCase());

  const group = GROUP_FILTER_MAP[filter];
  // Persona groups match their PRIMARY (leading) segment persona, so combined
  // entries like "INVESTORS & WEALTH / NRI" stay under their primary group and
  // don't leak into other persona filters (e.g. NRI & Returnees). Cross-cutting
  // identities are captured via their tag tokens instead.
  const segHit = !!group && group.segment.some((t) => segment.startsWith(t));
  const tagHit = !!group && group.tags.some((t) => tags.some((tag) => tag.includes(t)));
  if (segHit || tagHit) return true;

  // Fallback: badge text and generic tag keyword.
  const filterLower = filter.toLowerCase();
  const catBadge = getCategoryBadge(journal).text.toLowerCase();
  if (catBadge === filterLower) return true;
  return tags.some((t) => t.includes(filterLower));
}

export const CommunityJournalsClient: React.FC<{ journals: JournalCard[] }> = ({ journals }) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(9);
  const [sortBy, setSortBy] = useState("Most Recent");

  const observerRef = useRef<HTMLDivElement | null>(null);

  // Filter pills horizontal scroll: track overflow so the left/right chevrons
  // only appear when the row can actually scroll (scrollbar is hidden via CSS).
  const pillsRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = pillsRef.current;
    if (!el) return;
    const updateArrows = () => {
      const scrollable = el.scrollWidth > el.clientWidth + 2;
      setCanScrollLeft(el.scrollLeft > 1);
      setCanScrollRight(scrollable && el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
    };
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scrollPills = (dir: 1 | -1) => {
    pillsRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  const filtered = useMemo(() => {
    return journals.filter((j) => {
      const matchesSearch =
        !search ||
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        getLocationName(j).toLowerCase().includes(search.toLowerCase());
      return matchesFilter(j, activeFilter) && matchesSearch;
    });
  }, [journals, activeFilter, search]);

  const displayedJournals = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  // Infinite Scroll / Lazy Load Observer Effect
  useEffect(() => {
    if (visibleCount >= filtered.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 9, filtered.length));
        }
      },
      { rootMargin: "200px" }
    );

    const currentTarget = observerRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [visibleCount, filtered.length]);

  return (
    <>
      <Header forceSolid />
      <main className="min-h-screen bg-[#FAFAF8] text-[#111821] antialiased pt-20">

        {/* ── HERO SECTION ──────────────────────────────────────────────── */}
        <section className="relative px-6 md:px-12 pt-10 pb-6 max-w-[1400px] mx-auto overflow-hidden">

          {/* Top Row: Left Header vs Middle Search & Far Right 3D Illustration */}
          <div
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10 bg-none lg:bg-[url('/community-listing-header.png')] bg-no-repeat bg-[position:right_center] bg-contain"
          >

            {/* Left Header Title & Subtitle */}
            <div className="flex flex-col gap-1.5 max-w-xl shrink-0">
              <p
                className="text-[11px] font-extrabold tracking-[0.16em] uppercase"
                style={{ fontFamily: fu, color: "#DD5128" }}
              >
                COMMUNITY JOURNALS
              </p>

              <h1
                className="text-[36px] sm:text-[44px] lg:text-[50px] font-bold leading-[1.05] tracking-[-0.03em] text-[#111827]"
                style={{ fontFamily: fd }}
              >
                Explore all<br />
                <span className="italic font-bold" style={{ color: "#DD5128" }}>
                  Community
                </span>{" "}
                Journals
              </h1>

              <div className="mt-3 space-y-0.5 text-slate-600 font-inter">
                <p className="text-[14px] sm:text-[15px] font-medium text-slate-700">
                  Stories inspired by real homebuying journeys in Bengaluru.
                </p>
                <p className="text-[14px] sm:text-[15px] font-medium text-slate-700">
                  Each journal explores a unique journey, challenge, and perspective.
                </p>
                <p className="text-[12px] font-normal text-slate-500 pl-2.5 border-l-2 border-[#DD5128]/40 mt-2.5 leading-snug">
                  To protect buyer privacy, some names, location details, and audio snippets have been changed.
                </p>
              </div>
            </div>
          </div>

          {/* ── FILTER BAR SECTION ─────────────────────────────────────────── */}
          <div className="mt-10 pt-6 border-t border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">

            {/* Filter Pills List (overflow-aware chevrons) */}
            <div className="flex items-center gap-2.5 relative w-full">
              {canScrollLeft && (
                <button
                  type="button"
                  aria-label="Scroll filters left"
                  onClick={() => scrollPills(-1)}
                  className="flex-none w-9 h-9 -mt-1 rounded-full bg-white border border-slate-200/90 text-slate-600 hover:bg-slate-50 cursor-pointer flex items-center justify-center z-10"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 18l-6-6 6-6" /></svg>
                </button>
              )}

              <div
                ref={pillsRef}
                className="flex items-center gap-2.5 overflow-x-auto hide-scrollbar pb-1 flex-1 min-w-0"
              >
                {/*<button
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/90 rounded-full text-[12.5px] font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer shrink-0 font-inter"
                >
                  <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Filter
                </button>*/}

                {FILTERS.map((filter) => {
                  const isActive = activeFilter === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => {
                        // Analytics instrumentation event
                        if (typeof window !== "undefined" && (window as any).gtag) {
                          (window as any).gtag("event", "filter_pill_click", {
                            filter_name: filter,
                            previous_filter: activeFilter,
                          });
                        }
                        setActiveFilter(filter);
                      }}
                      className={`px-4 py-2 rounded-full text-[12.5px] font-medium transition-all cursor-pointer whitespace-nowrap font-inter shrink-0 ${isActive
                        ? "bg-[#DD5128] text-white shadow-xs"
                        : "bg-white text-slate-700 border border-slate-200/80 hover:border-slate-300 hover:text-slate-900"
                        }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>

              {canScrollRight && (
                <button
                  type="button"
                  aria-label="Scroll filters right"
                  onClick={() => scrollPills(1)}
                  className="flex-none w-9 h-9 -mt-1 rounded-full bg-white border border-slate-200/90 text-slate-600  hover:bg-slate-50 cursor-pointer flex items-center justify-center z-10"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 6l6 6-6 6" /></svg>
                </button>
              )}
            </div>


          </div>
        </section>

        {/* ── JOURNALS CARDS GRID ─────────────────────────────────────────── */}
        <section className="px-6 md:px-12 pb-16 max-w-[1400px] mx-auto w-full">
          {displayedJournals.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 my-6">
              <p className="text-lg font-semibold text-slate-800 font-serif">No journals found</p>
              <p className="text-sm text-slate-500 mt-1 font-inter">Try searching for a different keyword or selecting another filter.</p>
              <button
                onClick={() => {
                  setActiveFilter("All");
                  setSearch("");
                }}
                className="mt-4 px-5 py-2 bg-[#DD5128] text-white rounded-full text-xs font-semibold uppercase tracking-wider font-inter cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {displayedJournals.map((journal, idx) => {
                const targetHref = journal.path
                  ? journal.path.startsWith("/")
                    ? journal.path
                    : `/${journal.path}`
                  : null;

                const category = getCategoryBadge(journal);
                const location = getLocationName(journal);
                const timeAgo = getTimeAgo(idx);
                const comments = getCommentsCount(journal);
                const viewsStr = getFormattedViews(journal);

                const cardInner = (
                  <div
                    className="group relative flex flex-col rounded-[20px] overflow-hidden bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer w-full"
                    style={{ aspectRatio: viewMode === "grid" ? "16 / 14" : "auto" }}
                  >
                    {/* Background Cover Image */}
                    <Image
                      src={journal.image}
                      alt={journal.title}
                      fill
                      className={`object-cover transition-transform duration-700 group-hover:scale-105 object-[right_center]`}
                    />

                    {/* Dark Vignette Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 z-10" />

                    {/* Card Content Wrapper */}
                    <div className={`relative z-20 flex flex-col justify-between h-full p-5 sm:p-6 ${viewMode === "list" ? "min-h-[220px]" : ""}`}>

                      {/* Top Header Row inside Card: Category Tag Pill + Time Badge */}
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[9.5px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-xs ${category.bg}`}
                          style={{ fontFamily: fu, color: category.color }}
                        >
                          {category.text}
                        </span>

                        <span
                          className="px-2.5 py-0.5 rounded-full bg-black/40 text-white/90 border border-white/20 text-[10.5px] font-semibold backdrop-blur-md"
                          style={{ fontFamily: fu }}
                        >
                          {timeAgo}
                        </span>
                      </div>

                      {/* Bottom Content inside Card: Title, Excerpt, Location & Stats */}
                      <div className="mt-auto pt-6">
                        <h3
                          className="text-[19px] sm:text-[21px] font-semibold text-white leading-snug tracking-[-0.01em] group-hover:text-amber-100 transition-colors"
                          style={{ fontFamily: fd }}
                        >
                          {journal.title}
                        </h3>

                        <p
                          className="text-[12px] sm:text-[13px] text-white/80 line-clamp-2 mt-1.5 leading-relaxed"
                          style={{ fontFamily: fu }}
                        >
                          {journal.subtitle}
                        </p>

                        {/* Bottom Metadata Row: Location + Comments & Views */}
                        <div className="flex items-center justify-between pt-3.5 mt-3 border-t border-white/15 text-[11px] text-white/90 font-inter">
                          <div className="flex items-center gap-1.5 font-medium">
                            <svg className="w-3.5 h-3.5 text-white/80 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>{location}</span>
                          </div>

                          {/*<div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 opacity-90">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              {comments}
                            </span>

                            <span className="flex items-center gap-1 opacity-90">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="3" strokeWidth="2" />
                                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              {viewsStr}
                            </span>
                          </div>*/}
                        </div>
                      </div>
                    </div>
                  </div>
                );

                return targetHref ? (
                  <Link key={journal.id} href={targetHref} className="block no-underline">
                    {cardInner}
                  </Link>
                ) : (
                  <React.Fragment key={journal.id}>{cardInner}</React.Fragment>
                );
              })}
            </div>
          )}

          {/* ── LAZY LOADER SENTINEL & COUNTER ───────────────────────────── */}
          {filtered.length > displayedJournals.length ? (
            <div ref={observerRef} className="flex flex-col items-center justify-center mt-12 mb-6 gap-2.5 min-h-[80px]">
              <div className="px-6 py-2.5 bg-white border border-slate-200/90 text-slate-800 text-[13px] font-semibold rounded-full shadow-2xs flex items-center gap-2.5 font-inter">
                <svg className="w-4 h-4 text-[#DD5128] animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Loading more journals...</span>
              </div>

              <span className="text-[12px] text-slate-400 font-medium font-inter">
                Showing 1 – {displayedJournals.length} of {filtered.length} journals
              </span>
            </div>
          ) : (
            <div className="text-center mt-12 mb-6">
              <span className="text-[12px] text-slate-400 font-medium font-inter">
                Showing all {filtered.length} journals
              </span>
            </div>
          )}
        </section>

        {/* ── BOTTOM PERSONA CTA BANNER ───────────────────────────────────── */}
        <section className="px-6 md:px-12 pb-20 max-w-[1400px] mx-auto w-full">
          <div className="relative rounded-[24px] bg-gradient-to-r from-[#FFF5F2] via-[#FEF0EC] to-[#FFF7F5] border border-[#FDBA74]/40 p-8 sm:p-10 shadow-sm overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Left Notebook Graphic */}
            <div className="hidden sm:block shrink-0 w-16 h-16 relative">
              <Image
                src="/assets/journal_notebook_icon.png"
                alt="Notebook Icon"
                fill
                className="object-contain"
              />
            </div>

            {/* Middle Content Text */}
            <div className="flex flex-col gap-1 text-center md:text-left flex-1 max-w-xl">
              <h3
                className="text-[22px] sm:text-[26px] font-semibold text-[#111827] leading-tight"
                style={{ fontFamily: fd }}
              >
                Didn&apos;t find your Persona?
              </h3>
              <p
                className="text-[13px] sm:text-[14px] text-slate-600 leading-relaxed font-inter"
              >
                Our AI can synthesize a custom journal based on your unique investment DNA, lifestyle needs, and location preferences.
              </p>
            </div>

            {/* CTA Button */}
            <button
              className="px-5 py-3 rounded-xl bg-[#DD5128] hover:bg-[#C8441F] text-white font-medium text-[14px] flex items-center gap-2.5 shadow-2xs hover:shadow-xs transition-all shrink-0 cursor-pointer font-inter"
            >
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" />
                <path d="M19 14L19.6 16.2L21.8 16.8L19.6 17.4L19 19.6L18.4 17.4L16.2 16.8L18.4 16.2L19 14Z" />
              </svg>
              <span>Generate your own journal</span>
            </button>

            {/* Right Homebuyers Group Graphic */}
            <div className="hidden lg:block shrink-0 w-[220px] h-[100px] relative">
              <Image
                src="/assets/footer-group-trans.png"
                alt="Gruha Homebuyers Team"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </section>

      </main>
      <FooterVariant />
      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

      `}} />
    </>
  );
};
