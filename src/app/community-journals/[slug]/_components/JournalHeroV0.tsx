"use client";

import React, { type RefObject } from "react";
import Image from "next/image";
import * as Icons from "lucide-react";
import imgHero from "@/imports/testy.jpg";

const fd = "'Newsreader', Georgia, serif";
const fu = "'Inter Tight', system-ui, sans-serif";

export const getIcon = (
  name?: string,
  defaultName = "HelpCircle",
  props: any = { className: "w-4 h-4", strokeWidth: 2 }
) => {
  if (!name) return null;
  const Icon = (Icons as any)[name] || (Icons as any)[defaultName] || Icons.HelpCircle;
  return <Icon {...props} />;
};

export interface JournalHeroV0Props {
  title?: string;
  heroTitle?: string;
  description?: string;
  learningsLabel?: string;
  learnings?: Array<{ icon?: string; text: string } | string>;
  readTime?: string;
  updatedOn?: string;
  heroImage?: any;
  startJournalText?: string;
  adaptJournalText?: string;
  heroImgWrapRef?: RefObject<HTMLDivElement | null>;
  onStartJournal?: () => void;
  onAdaptJournal?: () => void;
}

export const JournalHeroV0: React.FC<JournalHeroV0Props> = ({
  title,
  heroTitle,
  description,
  learningsLabel = "What you'll learn from this journey",
  learnings = [],
  readTime = "14 min read",
  updatedOn = "Updated on July 2026",
  heroImage,
  heroImgWrapRef,
}) => {
  const displayTitle = heroTitle || title || "The Twelve Keys Journal";
  const displayDescription =
    description ||
    "Priyanka Bhat's (35) micro-stay portfolio expansion across HSR, Bellandur & Manyata — underwriting ready builder-held studios against 7%+ net yields, RWA bye-laws, and corporate demand.";
  const displayHeroImage = heroImage || imgHero;

  const defaultLearnings = [
    { icon: "TrendingUp", text: "Underwrite net-yield at 7%+ post-OTA, housekeeping, and maintenance fees" },
    { icon: "ShieldCheck", text: "Audit RWA bye-laws and last 3 AGM minutes before submitting token advance" },
    { icon: "Layers", text: "Split inventory across ORR and Manyata corridors to cut hybrid-work concentration risk" },
  ];

  const displayLearnings = learnings.length > 0 ? learnings : defaultLearnings;

  return (
    <div className="w-full flex flex-col items-center pb-8">
      {/* Breadcrumb Navigation (Constrained to 1376px) */}
      <nav className="w-full max-w-[1376px] flex items-center gap-2 text-sm mt-5 mb-6 px-2" style={{ fontFamily: fu }}>
        <a href="/" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          Home
        </a>
        <span className="text-slate-300">/</span>
        <a href="/community-journals" className="text-slate-500 hover:text-slate-800 transition-colors">All Journals</a>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-slate-900 truncate max-w-[280px] md:max-w-[420px]">
          {displayTitle.replace("\n", " ")}
        </span>
      </nav>

      {/* Hero Banner Box - Locked to 1376x768 Dimensions without outer border */}
      <div
        ref={heroImgWrapRef}
        className="relative w-full max-w-[1376px] aspect-[1376/768] rounded-[32px] overflow-hidden flex flex-col justify-between p-8 md:p-12 shadow-sm bg-white shrink-0 border-none"
      >
        {/* Background Cover Image */}
        <Image
          src={displayHeroImage}
          alt={displayTitle.replace("\n", " ")}
          fill
          className="object-cover object-right z-0"
          priority
        />

        {/* Dynamic White Overlay: Smooth gradient that blends without a vertical seam */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 via-30% to-transparent z-10 w-full pointer-events-none" />

        {/* Top Header Bar */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 w-full">
          {/* Category Badges */}
          <div className="flex items-center gap-2">
            <span
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-black text-white"
              style={{ fontFamily: fu }}
            >
              Community
            </span>
            <span
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-black text-white"
              style={{ fontFamily: fu }}
            >
              The First-EMI Family
            </span>
          </div>

          {/* Read Time & Updated Date */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-xs border border-white/80">
              <Icons.Clock className="w-3.5 h-3.5 text-slate-700" />
              <span>{readTime}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-xs border border-white/80">
              <Icons.Calendar className="w-3.5 h-3.5 text-slate-700" />
              <span>{updatedOn}</span>
            </div>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="relative z-20 my-auto max-w-xl pr-4">
          <h1
            className="text-4xl sm:text-5xl lg:text-[52px] font-normal leading-[1.12] tracking-tight text-slate-900 mb-5 whitespace-pre-line"
            style={{ fontFamily: fd }}
          >
            {displayTitle}
          </h1>

          <p
            className="text-base leading-relaxed text-slate-800 font-normal mb-6 max-w-lg"
            style={{ fontFamily: fu }}
          >
            {displayDescription}
          </p>

          {/* Featured Quote */}
          <div className="border-l-2 border-[#DD5128] pl-4 py-0.5 italic text-slate-800 text-lg font-serif">
            "Everyone says buy. Nobody says how to stop being scared."
          </div>
        </div>

        {/* Bottom Banner Card: What You'll Learn */}
        <div className="relative z-20 w-full lg:max-w-[660px] bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-white/80 shadow-sm">
          <p
            className="text-[12px] font-bold tracking-wider uppercase text-[#DD5128] mb-3"
            style={{ fontFamily: fu }}
          >
            {learningsLabel}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {displayLearnings.map((item: any, i: number) => {
              const text = typeof item === "string" ? item : item.text;
              const iconName = typeof item === "object" ? item.icon : undefined;

              return (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-orange-100/70 text-[#DD5128] shrink-0 mt-0.5">
                    {getIcon(iconName, "Sparkles", { className: "w-4 h-4", strokeWidth: 2 })}
                  </div>
                  <span
                    className="text-xs font-medium leading-snug text-slate-900"
                    style={{ fontFamily: fu }}
                  >
                    {text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalHeroV0;