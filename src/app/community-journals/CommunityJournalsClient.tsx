"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
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

const FILTERS = ["All", "Investors", "Families", "NRI", "Sustainability", "Young Professionals", "Seniors", "Plot Buyers"];

function normalizeSegment(segment: string): string {
  const s = segment.toLowerCase();
  if (s.includes("investor") || s.includes("wealth")) return "Investors";
  if (s.includes("famil") || s.includes("legacy")) return "Families";
  if (s.includes("nri")) return "NRI";
  if (s.includes("sustain")) return "Sustainability";
  if (s.includes("young") || s.includes("pro")) return "Young Professionals";
  if (s.includes("senior")) return "Seniors";
  if (s.includes("plot")) return "Plot Buyers";
  return segment;
}

function matchesFilter(journal: JournalCard, filter: string): boolean {
  if (filter === "All") return true;
  const normalized = normalizeSegment(journal.segment);
  return normalized === filter;
}

export const CommunityJournalsClient: React.FC<{ journals: JournalCard[] }> = ({ journals }) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return journals.filter((j) => {
      const matchesSearch =
        !search ||
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.subtitle.toLowerCase().includes(search.toLowerCase());
      return matchesFilter(j, activeFilter) && matchesSearch;
    });
  }, [journals, activeFilter, search]);

  return (
    <>
      <Header forceSolid />
      <main className="min-h-screen bg-[#F3F6F9] text-[#111821] antialiased pt-16">

        {/* Header Section */}
        <section className="relative px-4 sm:px-8 py-16 sm:py-20 overflow-hidden">
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "rgba(124,58,237,0.04)", filter: "blur(100px)" }} />
          <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "rgba(221,81,40,0.04)", filter: "blur(80px)" }} />

          <div className="relative z-10 max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="w-12 h-[1px] bg-[#DD5128]" />
                <span className="text-[11px] font-bold tracking-[0.15em] uppercase" style={{ fontFamily: fu, color: "#DD5128" }}>
                  Curated Intelligence
                </span>
              </div>
              <h1 className="text-[clamp(32px,5vw,48px)] font-semibold leading-[1.08] tracking-[-0.02em] max-w-2xl" style={{ fontFamily: fd }}>
                Explore all <span className="italic" style={{ color: "#DD5128" }}>Community Journals</span>
              </h1>
              <p className="text-[16px] leading-[1.6] max-w-lg" style={{ fontFamily: fu, color: "#59636F" }}>
                Real home-buying journeys from Bengaluru. Every journal captures a unique strategy, budget, and life stage.
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full md:w-96">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeWidth="2" />
                  <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search journals..."
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-[14px] outline-none transition-all focus:border-[#DD5128] focus:ring-2 focus:ring-[#DD5128]/10 placeholder:text-slate-400"
                  style={{ fontFamily: fu }}
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {FILTERS.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className="px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.1em] uppercase transition-colors cursor-pointer"
                    style={{
                      fontFamily: fu,
                      background: activeFilter === filter ? "#DD5128" : "#FFFFFF",
                      color: activeFilter === filter ? "#FFFFFF" : "#59636F",
                      border: activeFilter === filter ? "none" : "1px solid #E2E8F0",
                    }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Journal Grid */}
        <section className="px-4 sm:px-8 pb-24 max-w-[1400px] mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filtered.map((journal, idx) => {
              const stagger = [0, 48, 0, -32, 48, 0, -48, 32];
              const mt = stagger[idx % stagger.length];
              const targetHref = journal.path ? (journal.path.startsWith("/") ? journal.path : `/${journal.path}`) : null;

              const cardContent = (
                <div className="group relative flex flex-col cursor-pointer" style={{ marginTop: mt }}>
                  {/* Card */}
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden transition-transform duration-500 group-hover:-translate-y-2 shadow-xl bg-white">
                    {/* Spine effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-6 z-20" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.25), transparent)" }} />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 35%, transparent 60%)" }} />

                    {/* Image */}
                    <img
                      src={journal.image}
                      alt={journal.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Content overlay */}
                    <div className="absolute inset-0 z-30 p-8 flex flex-col justify-end">
                      <div className="mb-4 space-y-2">
                        {journal.segment && (
                          <span
                            className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-[0.1em] uppercase backdrop-blur-md"
                            style={{ fontFamily: fu, background: "rgba(221,81,40,0.2)", color: "#FF8A65", border: "1px solid rgba(221,81,40,0.3)" }}
                          >
                            {journal.segment}
                          </span>
                        )}
                        <h3 className="text-[18px] font-semibold leading-tight text-white" style={{ fontFamily: fd }}>
                          {journal.title}
                        </h3>
                        <p className="text-[11px] leading-[1.5] text-white/70 line-clamp-2" style={{ fontFamily: fu }}>
                          {journal.subtitle}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 pt-4 border-t border-white/15">
                        <span className="flex items-center gap-1.5 text-[10px] text-white/50" style={{ fontFamily: fu }}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2"/></svg>
                          {journal.views ? (journal.views / 1000).toFixed(1) + 'k' : ''}
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] text-white/50" style={{ fontFamily: fu }}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" strokeWidth="2"/></svg>
                          {journal.copies || ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tags below card */}
                  <div className="mt-4 flex gap-2">
                    {journal.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-md"
                        style={{ fontFamily: fu, background: "#E8E0F5", color: "#5B21B6" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );

              return targetHref ? (
                <Link key={journal.id} href={targetHref} className="block no-underline">
                  {cardContent}
                </Link>
              ) : (
                <React.Fragment key={journal.id}>{cardContent}</React.Fragment>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative bg-white py-24 px-4 sm:px-8 overflow-hidden border-t border-slate-100">
          <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center gap-6 relative z-10">
            <h2 className="text-[clamp(28px,4vw,40px)] font-semibold leading-[1.08] tracking-[-0.02em]" style={{ fontFamily: fd }}>
              Didn&apos;t find your Persona?
            </h2>
            <p className="text-[16px] leading-[1.6] max-w-xl" style={{ fontFamily: fu, color: "#59636F" }}>
              Our AI can synthesize a custom Journal based on your unique investment DNA, financial goals, and lifestyle requirements.
            </p>
            <button
              className="group flex items-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-[13px] tracking-[0.05em] uppercase transition-all hover:shadow-[0_0_20px_rgba(221,81,40,0.3)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{ background: "#DD5128", fontFamily: fu }}
            >
              Generate Custom Journal
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </section>
      </main>
      <FooterVariant />
    </>
  );
};
