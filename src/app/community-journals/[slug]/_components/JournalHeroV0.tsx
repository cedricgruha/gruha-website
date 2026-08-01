"use client";

import React, { type RefObject } from "react";
import Image from "next/image";
import * as Icons from "lucide-react";
import imgHero from "@/imports/testy.jpg";

const fd = "'Newsreader', Georgia, serif";
const fu = "'Inter Tight', system-ui, sans-serif";

const getImgSrc = (img: any): string => {
  if (!img) return "";
  if (typeof img === "string") return img;
  if (typeof img === "object" && img.src) return img.src;
  return String(img);
};

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
  heroImage,
  startJournalText = "Start your journal",
  adaptJournalText = "Adapt this journal",
  heroImgWrapRef,
  onStartJournal,
  onAdaptJournal,
}) => {
  const displayTitle = heroTitle || title || "The Sixteenth Floor\nDream Journal.";
  const displayDescription =
    description ||
    "The story of Pavan & Shruti Kalsi's first home purchase journey in Bengaluru — a young couple navigating budget, fear, and a future built together.";
  const displayHeroImage = heroImage || imgHero;

  const defaultLearnings = [
    { text: "Stretch your budget without regret" },
    { text: "Decide between ready vs under construction" },
    { text: "Manage home buying before becoming parents" },
  ];

  const displayLearnings = learnings.length > 0 ? learnings : defaultLearnings;

  return (
    <div className="w-full pb-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] mt-6 mb-5" style={{ fontFamily: fu }}>
        <a href="/" className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
          Home
        </a>
        <span className="text-slate-300">/</span>
        <a href="/community-journals" className="text-slate-400 hover:text-slate-700 transition-colors">All Journals</a>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-slate-900  max-w-[280px] md:max-w-[420px]">
          {displayTitle.replace("\n", " ")}
        </span>
      </nav>

      <div className="w-full grid grid-cols-1 md:grid-cols-[460px_1fr] gap-8 md:gap-10 items-center pb-8 pt-0 md:pt-8 bg-white">
        {/* Col 1 — Hero Image (Widescreen Landscape) */}
        <div ref={heroImgWrapRef} className="relative rounded-2xl overflow-hidden aspect-[10/16] max-h-[350px] border border-slate-200/80 shadow-md w-full max-w-[460px] mx-auto sm:mx-0 flex-none">
          <Image
            src={displayHeroImage}
            alt={displayTitle.replace("\n", " ")}
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Col 2 — Title, Subtitle, Learnings & Actions */}
        <div className="flex flex-col gap-4 justify-center  min-w-0">
          <h1
            className="text-[clamp(24px,2.2vw,38px)] font-semibold leading-[1.12] tracking-[-0.02em] whitespace-pre-line break-words"
            style={{ fontFamily: fd, color: "#111821" }}
          >
            {displayTitle}
          </h1>

          <p className="text-[14.5px] leading-[1.55]" style={{ fontFamily: fu, color: "#59636F", maxWidth: 520 }}>
            {displayDescription}
          </p>

          <div className="grid grid-cols-1  gap-6 items-start mt-2">
            <div>
              <p className="text-sm font-semibold tracking-[0.14em] uppercase mb-3" style={{ fontFamily: fu, color: "#8A94A1" }}>
                {learningsLabel}
              </p>
              <div className="flex flex-col gap-2.5">
                {displayLearnings.map((item: any, i: number) => {
                  const text = typeof item === "string" ? item : item.text;
                  return (
                    <div key={i} className="flex items-start gap-3 w-full">
                      <span className="text-[11px] font-semibold flex-none mt-0.5" style={{ fontFamily: fd, color: "#DD5128" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[14.5px] leading-[1.45]" style={{ fontFamily: fu, color: "#59636F" }}>
                        {text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalHeroV0;
