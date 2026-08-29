"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import {
  Layers,
  ShieldCheck,
  Users,
  Zap,
  ArrowRight,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useWaitlist } from '@/contexts/WaitlistContext';
import { trackCategoryClick } from '@/lib/analytics';
import allJournals from '@/data/community-journals.json';

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

/* ─────────────────────────────────────────────────────────────────────────────
   1. HERO SECTION (Light Hero Stage - Crisp Text Fix)
   ───────────────────────────────────────────────────────────────────────────── */
export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const { openModal } = useWaitlist();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (headlineRef.current) {
        const chars = headlineRef.current.querySelectorAll('.word');
        tl.fromTo(
          chars,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.04 }
        );
      }

      tl.fromTo(
        [subheadlineRef.current, btnRef.current],
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
        "-=0.4"
      );

      if (featuresRef.current) {
        tl.fromTo(
          featuresRef.current.children,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 },
          "-=0.3"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const renderHeadline = () => {
    const text = "Better way to search, shortlist, evaluate and select your home";
    return text.split(' ').map((word, idx) => {
      const isOrange = word.toLowerCase().includes("your") || word.toLowerCase().includes("home");
      return (
        <span
          key={idx}
          className={`word inline-block mr-[0.28em] ${
            isOrange ? 'text-[#fc7c54] font-medium' : 'text-white md:text-black font-normal'
          }`}
        >
          {word}
        </span>
      );
    });
  };

  const featureHighlights = [
    { icon: <Layers size={18} strokeWidth={1.8} />, text: "Feature rich platform" },
    { icon: <ShieldCheck size={18} strokeWidth={1.8} />, text: "Privacy & Home buyer first" },
    { icon: <Users size={18} strokeWidth={1.8} />, text: "Agents (Human + AI) working for you" },
    { icon: <Zap size={18} strokeWidth={1.8} />, text: "Data driven evaluation" }
  ];

  return (
    <>
      <section ref={containerRef} className="relative pt-24 pb-8 sm:pb-20 bg-white text-black overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          {/* Mobile background */}
          <Image
            src="/assets/hero/hero-background.png"
            alt="Hero Background"
            fill
            className="object-cover object-top sm:hidden"
            priority
            sizes="100vw"
          />
          {/* Mobile gradient overlay (below md) — classic bottom-dark hero gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 md:hidden pointer-events-none" />
          {/* Desktop background (sm and up) */}
          <Image
            src="/assets/hero/hero.png"
            alt="Hero Background"
            fill
            className="object-cover object-top hidden sm:block"
            priority
            sizes="100vw"
          />
        </div>

        {/* Hero Main Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 text-center pt-12 md:pt-16">
          <h1
            ref={headlineRef}
            className="font-fraunces text-white md:text-slate-900 max-w-3xl mx-auto mb-5 font-normal tracking-tight"
            style={{ fontSize: 'clamp(32px, 5vw, 54px)', lineHeight: '1.15' }}
          >
            {renderHeadline()}
          </h1>

          <p
            ref={subheadlineRef}
            className="font-inter text-sm md:text-base text-white md:text-black max-w-lg mx-auto mb-8"
          >
            Property search is a painful task. We are here to show that it does not have to be painful.
          </p>

          <button
            ref={btnRef}
            onClick={() => openModal("hero")}
            className="bg-[#fc7c54] text-black md:text-white font-medium px-8 py-3.5 rounded-xl text-sm transition-all duration-300 mb-8 md:mb-16 shadow-md hover:bg-[#fc7c54]/90 hover:scale-105 active:scale-95 cursor-pointer"
          >
            Join Waitlist
          </button>

          {/* Feature Highlights Grid — hidden on mobile, shown md+ */}
          <div ref={featuresRef} className="hidden md:flex md:flex-row items-center justify-center gap-6 md:gap-12 w-full">
            {featureHighlights.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-full border border-white/5 bg-white/10 backdrop-blur-sm flex items-center justify-center text-black shrink-0">
                  {feature.icon}
                </div>
                <span className="text-xs text-black font-inter leading-snug max-w-[120px]">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. COMMUNITY JOURNALS SECTION */}
      <CommunityJournalsSection />
    </>
  );
};
/* ─────────────────────────────────────────────────────────────────────────────
   2. COMMUNITY JOURNALS CAROUSEL SECTION
   ───────────────────────────────────────────────────────────────────────────── */
// The 9 categories exactly match the Community Journals page filter pills
// (order mirrors that page). Counts are computed per-filter with the same
// matching rules as the journal page, so the hero count equals the filter count
// (a journal can appear under more than one filter on the page).
const CATEGORY_FILTERS = [
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

// Group-matching config identical to the journals page GROUP_FILTER_MAP.
const CATEGORY_GROUP: Record<string, { segment: string[]; tags: string[] }> = {
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

// Does a journal belong to a filter given its current search/match state?
function journalMatchesFilter(journal: JournalCard, filter: string): boolean {
  if (filter === "All") return true;
  const segment = (journal.segment || "").toLowerCase();
  const tags = (journal.tags || []).map((t) => t.toLowerCase());
  const group = CATEGORY_GROUP[filter];
  const segHit = !!group && group.segment.some((t) => segment.startsWith(t));
  const tagHit = !!group && group.tags.some((t) => tags.some((tag) => tag.includes(t)));
  if (segHit || tagHit) return true;
  // Fallback: generic tag keyword (mirrors the journal page).
  const filterLower = filter.toLowerCase();
  return tags.some((t) => t.includes(filterLower));
}

export const CommunityJournalsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const categoriesList = useMemo(() => {
    const journals = allJournals as JournalCard[];
    return CATEGORY_FILTERS.map((title) => {
      const matching = journals.filter((j) => journalMatchesFilter(j, title));
      return { title, count: matching.length, image: matching[0]?.image || "/journals/default.png" };
    });
  }, []);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <section className="bg-white text-slate-900 py-8 sm:py-10 border-t border-slate-100">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 sm:mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#fc7c54] block mb-1">
              COMMUNITY JOURNALS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-slate-900">
              Stories inspired by real homebuying journeys
            </h2>
            <p className="text-sm text-slate-600 mt-2 font-light">
              Explore experiences across {categoriesList.length}+ categories and {allJournals.length}+ journals shared by 1,000+ home seekers.
            </p>
          </div>

          <Link
            href="/community-journals"
            className="border border-[#fc7c54] text-[#fc7c54] hover:bg-[#fc7c54]/10 text-xs sm:text-sm font-medium px-5 py-2.5 rounded-md inline-flex items-center gap-2 transition-all self-start md:self-auto shrink-0"
          >
            <span>Explore Community Journals</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Carousel Deck */}
        <div className="relative group">
          {/* Navigation Arrows */}
          {canScrollLeft && (
            <button
              onClick={() => handleScroll('left')}
              className="absolute -left-1 sm:-left-4 xl:-left-14 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white text-slate-800 shadow-lg border border-slate-100 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => handleScroll('right')}
              className="absolute -right-1 sm:-right-4 xl:-right-14 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white text-slate-800 shadow-lg border border-slate-100 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
            </button>
          )}

          {/* Cards Track */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar scroll-smooth py-6"
          >
            {categoriesList.map((cat) => {
              return (
                <Link
                  key={cat.title}
                  href={`/community-journals?filter=${encodeURIComponent(cat.title)}`}
                  onClick={() => trackCategoryClick({ category: cat.title })}
                  className="group/card relative min-w-[140px] sm:min-w-[210px] md:min-w-[230px] h-[170px] sm:h-[200px] md:h-[220px] rounded-2xl overflow-hidden shrink-0 bg-slate-900 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] select-none"
                >
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover object-right transition-transform duration-700 group-hover/card:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />

                  <div className="absolute bottom-0 inset-x-0 p-4 z-20">
                    <h3 className="font-semibold text-white text-sm sm:text-base leading-snug line-clamp-2 group-hover/card:text-[#fc7c54] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-[11px] text-white/70 mt-1 font-normal">
                      {cat.count} {cat.count === 1 ? "journal" : "journals"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Counter Subtitle */}
        <p className="text-center text-sm text-slate-600 mt-10 font-normal">
          <span className="text-[#fc7c54] font-bold">{allJournals.length}+</span> journals across{" "}
          <span className="text-[#fc7c54] font-bold">{categoriesList.length}+</span> categories shared by{" "}
          <span className="text-[#fc7c54] font-bold">1,000+</span> home seekers.
        </p>

      </div>

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
    </section>
  );
};