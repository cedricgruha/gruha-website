"use client";

import React, { type RefObject } from "react";
import Image from "next/image";
import * as Icons from "lucide-react";
import imgHero from "@/imports/testy.jpg";

export const getIcon = (
  name?: string,
  defaultName = "HelpCircle",
  props: any = { className: "w-5 h-5 text-[#FF7E57]", strokeWidth: 2 }
) => {
  if (!name) return null;
  const Icon = (Icons as any)[name] || (Icons as any)[defaultName] || Icons.HelpCircle;
  return <Icon {...props} />;
};

export interface LearningItem {
  icon?: string;
  text: string;
}

export interface JournalHeroV0Props {
  title?: string;
  heroTitle?: string;
  description?: string;
  learningsLabel?: string;
  learnings?: LearningItem[];
  readTime?: string;
  updatedOn?: string;
  heroImage?: any;
  quoteText?: string;
  heroImgWrapRef?: RefObject<HTMLDivElement | null>;
}

export const JournalHeroV0: React.FC<JournalHeroV0Props> = ({
  title,
  heroTitle,
  description,
  learningsLabel = "What you'll learn from this journey",
  learnings,
  readTime = "12 min read",
  updatedOn = "Updated on July 2026",
  heroImage,
  quoteText = `"Everyone says buy. Nobody says how to stop being scared."`,
  heroImgWrapRef,
}) => {
  const displayTitle = heroTitle || title || "The Sixteenth Floor\nDream Journal.";
  const displayDescription =
    description ||
    "The story of Pavan & Shruti Kulal's first home purchase journey in Bengaluru — a young couple navigating budget, fear, and a future built together.";
  const displayHeroImage = heroImage || imgHero;

  const defaultLearnings: LearningItem[] = [
    { icon: "Wallet", text: "Stretch your budget without regret" },
    { icon: "Building2", text: "Decide between ready vs under construction" },
    { icon: "Users", text: "Manage home buying before becoming parents" },
  ];

  const displayLearnings = learnings && learnings.length > 0 ? learnings : defaultLearnings;

  return (
    <div className="w-full flex flex-col items-center pb-8 font-['Inter']">
      {/* Breadcrumb Navigation */}
      <nav className="w-full max-w-[1225px] flex items-center gap-2 text-sm mt-5 mb-6 px-1">
        <a href="/" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors">
          <Icons.Home className="w-4 h-4" />
          Home
        </a>
        <span className="text-slate-300">/</span>
        <a href="/community-journals" className="text-slate-500 hover:text-slate-800 transition-colors">
          All Journals
        </a>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-slate-900 truncate max-w-[280px] md:max-w-[420px]">
          {displayTitle.replace("\n", " ")}
        </span>
      </nav>

      {/* Main Frame Outer Box */}
      <div
        ref={heroImgWrapRef}
        className="relative w-full max-w-[1225px] h-auto min-h-[593px] rounded-[24px] overflow-hidden flex flex-col justify-between p-8 md:p-12 shadow-sm bg-[#FFF9F3] shrink-0 border-none"
      >
        {/* Background Image */}
        <Image
          src={displayHeroImage}
          alt={displayTitle.replace("\n", " ")}
          fill
          className="object-cover object-right z-0"
          priority
        />

        {/* 1. Backdrop Blur Layer (Fades blur out from left to right) */}
        <div
          className="absolute inset-0 z-[5] pointer-events-none backdrop-blur-[12px]"
          style={{
            WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 35%, rgba(0,0,0,0) 65%)",
            maskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 35%, rgba(0,0,0,0) 65%)",
          }}
        />

        {/* 2. Soft Warm Gradient Tint Layer */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(88.46deg, rgba(255, 249, 243, 0.75) 15%, rgba(255, 249, 243, 0.45) 40%, rgba(255, 249, 243, 0) 65%)",
          }}
        />

        {/* Top Floating Tags Container */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 w-full mb-6">
          {/* Category Badges */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-[48px] text-xs font-medium bg-black text-white leading-4">
              Community
            </span>
            <span className="px-3 py-1 rounded-[48px] text-xs font-medium bg-black text-white leading-4">
              The First-EMI Family
            </span>
          </div>

          {/* Read Time & Updated Date Badges */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-[4px] bg-white/80 backdrop-blur-md text-xs font-semibold text-black shadow-xs">
              <Icons.Clock className="w-4 h-4 text-[#334155]" />
              <span>{readTime}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-[4px] bg-white/80 backdrop-blur-md text-xs font-semibold text-black shadow-xs">
              <Icons.CalendarCheck className="w-4 h-4 text-[#334155]" />
              <span>{updatedOn}</span>
            </div>
          </div>
        </div>

        {/* Center Main Content Container */}
        <div className="relative z-20 max-w-[623px] flex flex-col gap-5">
          {/* Main Title & Description Wrapper */}
          <div className="flex flex-col gap-3">
            <h1
              className="text-[40px] md:text-[48px] font-normal leading-[54px] text-black whitespace-pre-line"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              {displayTitle}
            </h1>

            <p className="text-base leading-6 font-medium text-[#334155] max-w-[623px]">
              {displayDescription}
            </p>
          </div>

          {/* Featured Quote */}
          {quoteText && (
            <p
              className="text-base font-normal italic text-[#334155] border-l-[3px] border-[#FF7E57] pl-4 truncate max-w-[500px]"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              {quoteText}
            </p>
          )}
        </div>

        {/* Bottom Glassmorphic Card Container */}
        <div
          className="relative z-20 w-full max-w-[725px] rounded-[12px] p-6 flex flex-col gap-4 mt-8 border border-white/40 shadow-xs"
          style={{
            background:
              "linear-gradient(270.21deg, rgba(240, 253, 250, 0.084) -34.81%, rgba(254, 254, 254, 0.6) 15.1%)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          {/* Header Title */}
          <h4 className="text-sm font-semibold leading-[17px] text-[#FE5B39]">
            {learningsLabel}
          </h4>

          {/* Items Row Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
            {displayLearnings.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 shrink-0">
                  {getIcon(item.icon, "Sparkles", {
                    className: "w-5 h-5 text-[#FF7E57]",
                    strokeWidth: 2,
                  })}
                </div>
                <span className="text-sm font-semibold leading-[17px] text-[#334155]">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalHeroV0;