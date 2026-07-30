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
}

const FILTERS = [
  "All",
  "First Home",
  "Investment",
  "Family Living",
  "Premium",
  "Gated Community",
  "Under Construction",
  "Villas",
  "Renovation",
];

const POPULAR_SEARCHES = [
  "First Home",
  "Investment",
  "Family Living",
  "Premium",
  "Gated Community",
  "Under Construction",
  "Villas",
  "Renovation",
];

// Helper to determine category tag badge string
function getCategoryBadge(journal: JournalCard): { text: string; bg: string; color: string } {
  const segment = (journal.segment || "").toLowerCase();
  const tagsStr = (journal.tags || []).join(" ").toLowerCase();
  const id = journal.id;

  if (segment.includes("nri") || tagsStr.includes("nri") || id === 3 || id === 18) {
    return { text: "PREMIUM", bg: "bg-white/95", color: "#6B21A8" };
  }
  if (segment.includes("investor") || tagsStr.includes("investor") || id === 1 || id === 2 || id === 5 || id === 7) {
    return { text: "INVESTMENT", bg: "bg-[#FEF0EC]", color: "#DD5128" };
  }
  if (segment.includes("young") || segment.includes("first") || tagsStr.includes("first-timer") || id === 14 || id === 15) {
    return { text: "FIRST HOME", bg: "bg-white/95", color: "#DD5128" };
  }
  if (segment.includes("family") || segment.includes("families") || tagsStr.includes("multigenerational") || id === 22 || id === 24) {
    return { text: "FAMILY LIVING", bg: "bg-white/95", color: "#1D4ED8" };
  }
  if (segment.includes("plot") || tagsStr.includes("plot") || id === 4 || id === 9 || id === 12) {
    return { text: "VILLAS", bg: "bg-white/95", color: "#B45309" };
  }
  if (segment.includes("primary") || tagsStr.includes("under construction") || id === 38 || id === 39) {
    return { text: "UNDER CONSTRUCTION", bg: "bg-white/95", color: "#0369A1" };
  }
  if (segment.includes("senior") || tagsStr.includes("downsizing") || id === 29 || id === 30) {
    return { text: "RENOVATION", bg: "bg-white/95", color: "#7E22CE" };
  }

  const defaults = [
    { text: "FIRST HOME", bg: "bg-white/95", color: "#DD5128" },
    { text: "INVESTMENT", bg: "bg-[#FEF0EC]", color: "#DD5128" },
    { text: "FAMILY LIVING", bg: "bg-white/95", color: "#1D4ED8" },
    { text: "LIFESTYLE", bg: "bg-white/95", color: "#047857" },
    { text: "RENOVATION", bg: "bg-white/95", color: "#7E22CE" },
    { text: "PREMIUM", bg: "bg-white/95", color: "#6B21A8" },
  ];
  return defaults[id % defaults.length];
}

// Helper to determine location string
function getLocationName(journal: JournalCard): string {
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

  const catBadge = getCategoryBadge(journal).text.toLowerCase();
  const filterLower = filter.toLowerCase();

  if (catBadge === filterLower) return true;

  const segment = (journal.segment || "").toLowerCase();
  const tags = (journal.tags || []).map((t) => t.toLowerCase());

  return segment.includes(filterLower) || tags.some((t) => t.includes(filterLower));
}

export const CommunityJournalsClient: React.FC<{ journals: JournalCard[] }> = ({ journals }) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(9);
  const [sortBy, setSortBy] = useState("Most Recent");

  const observerRef = useRef<HTMLDivElement | null>(null);

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
                  Real stories. Real decisions. From Bengaluru.
                </p>
                <p className="text-[14px] sm:text-[15px] font-medium text-slate-700">
                  Every journal captures a unique journey, challenge, and insight.
                </p>
              </div>
            </div>
          </div>

          {/* ── FILTER BAR SECTION ─────────────────────────────────────────── */}
          <div className="mt-10 pt-6 border-t border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">

            {/* Filter Pills List */}
            <div className="flex items-center gap-2.5 overflow-x-auto hide-scrollbar pb-1">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/90 rounded-full text-[12.5px] font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer shrink-0 font-inter"
              >
                <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Filter
              </button>

              {FILTERS.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-full text-[12.5px] font-medium transition-all cursor-pointer whitespace-nowrap font-inter ${isActive
                      ? "bg-[#DD5128] text-white shadow-xs"
                      : "bg-white text-slate-700 border border-slate-200/80 hover:border-slate-300 hover:text-slate-900"
                      }`}
                  >
                    {filter}
                  </button>
                );
              })}
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
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
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

                          <div className="flex items-center gap-3">
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
                          </div>
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
    </>
  );
};
