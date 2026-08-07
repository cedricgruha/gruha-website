"use client";

import React from "react";
import Image from "next/image";
import { Clock, Calendar, Wallet, Building2, Users } from "lucide-react";

export interface JournalHeroProps {
  /** Category tags shown as pill badges top-left */
  tags: string[];
  /** Large article headline */
  title: string;
  /** Short descriptive subheadline below the title */
  description: string;
  /** Pull-quote shown with a left accent border */
  quote: string;
  /** Label above the "what you'll learn" feature rows */
  learningsLabel?: string;
  /** Up to 3 learning outcomes shown as icon + text rows */
  learnings: { icon: React.ReactNode; text: string }[];
  /** Estimated read time, e.g. "12 min read" */
  readTime: string;
  /** Update date label, e.g. "Updated on July 2026" */
  updatedOn: string;
}

export const JournalHeroSection: React.FC<JournalHeroProps> = ({
  tags,
  title,
  description,
  quote,
  learningsLabel = "What you'll learn from this journey",
  learnings,
  readTime,
  updatedOn,
}) => {
  return (
    <section className="relative mx-auto w-full max-w-[1440px] px-4  mb-2 mt-5 " aria-label="Journal hero">
      {/* Hero Outer Wrapper */}
      <div className="relative w-full max-w-[1425px] min-h-[593px] md:h-[593px] mx-auto rounded-[1.5rem] shadow-sm flex flex-col">

        <div className="relative w-full min-h-[593px] md:h-full flex-1 rounded-[1.5rem] overflow-hidden flex flex-col">
          {/* Background Image Container */}
          <div className="absolute inset-0 w-full h-full z-0">
            <Image
              src="/journals/hero-img.png"
              alt={title}
              fill
              priority
              className="object-cover object-right sm:object-center"
            />

            <div className="absolute inset-y-0 left-0 pointer-events-none z-10 flex">

              <div className="relative h-full w-7 flex-shrink-0">
                <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-r from-white/80 via-white/40 to-transparent z-20" />
                <div className="absolute inset-y-0 left-[2px] w-full bg-gradient-to-r from-black/20 via-black/8 to-transparent" />
              </div>
              <div className="relative h-full w-[12px] flex-shrink-0 flex items-center">
                <div className="absolute inset-y-0 left-[5px] w-[7px] bg-gradient-to-r from-black/5 via-black/25 to-transparent blur-[0.5px]" />
                <div className="absolute inset-y-0 left-[1px] w-[7px] bg-gradient-to-r from-black/15 via-black/5 to-transparent blur-[1.5px]" />

              </div>
              <div className="w-8 h-full bg-gradient-to-r from-black/8 to-transparent" />

            </div>
            <div className="absolute inset-0 z-10 pointer-events-none" />
          </div>
          <div className="absolute top-[24px] sm:top-[40px] right-[24px] sm:right-[48px] z-20 flex flex-wrap items-center justify-end gap-2 max-w-[calc(100%-48px)]">

            <div className="flex items-center gap-2 px-3 py-[6px] bg-white/80 backdrop-blur-md rounded-[4px] border border-white/60">
              <Clock className="w-4 h-4 text-[#334155]" strokeWidth={2} />
              <span className="text-[12px] font-semibold text-black leading-none font-inter">
                {readTime}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-[6px] bg-white/80 backdrop-blur-md rounded-[4px] border border-white/60">
              <Calendar className="w-4 h-4 text-[#334155]" strokeWidth={2} />
              <span className="text-[12px] font-semibold text-black leading-none font-inter">
                {updatedOn}
              </span>
            </div>
          </div>
          <div className="relative z-20 w-full flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-[48px_56px] gap-8 md:gap-4">

            <div className="max-w-[623px] flex flex-col gap-[12px] mt-16 sm:mt-4">

              <div className="flex items-center gap-2 flex-wrap">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center justify-center px-3 py-1 bg-black text-white text-[12px] font-medium leading-none rounded-[48px] font-inter"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Main Headline */}
              <h1 className="font-fraunces text-[28px] sm:text-[44px] lg:text-[48px] font-normal text-black leading-[1.12] tracking-tight text-balance">
                {title}
              </h1>

              {/* Subtitle Description */}
              <p className="font-inter text-[15px] sm:text-[16px] font-medium leading-[24px] text-[#334155] max-w-[623px]">
                {description}
              </p>

              <div className="border-l-[4px] border-[#FF7E57] pl-4 sm:pl-6 py-0.5 mt-2 max-w-[500px]">
                <blockquote className="font-fraunces italic text-[16px] sm:text-[20px] font-normal leading-[24px] sm:leading-[28px] text-[#334155]">
                  {quote}
                </blockquote>
              </div>
            </div>

            <div className="w-full max-w-[725px] h-auto rounded-[12px] p-4 sm:p-6 backdrop-blur-[12px] bg-[linear-gradient(270.21deg,rgba(240,253,250,0.084)-34.81%,rgba(254,254,254,0.65)15.1%)] border border-white/60 shadow-xs">
              <h4 className="text-[13px] sm:text-[14px] font-semibold text-[#FE5B39] leading-[17px] mb-3 font-inter">
                {learningsLabel}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-start sm:items-center">
                {learnings.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 sm:gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center text-[#FF7E57] mt-0.5">
                      {item.icon}
                    </div>
                    <span className="text-[12px] xs:text-[13px] sm:text-[14px] font-semibold text-[#334155] leading-[1.3] font-inter">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Book Ribbon Fixed (Positioned outside overflow container) */}
        <div className="absolute left-10 lg:left-12 -bottom-5 translate-y-1/2 z-30 pointer-events-none drop-shadow-md">
          <div
            className="w-6 h-10 bg-gradient-to-b from-[#E0482B] to-[#FF6B4A]"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
            }}
          />
        </div>

      </div>
    </section>
  );
};

export const journalDefaultLearningIcons = {
  wallet: <Wallet className="h-5 w-5" strokeWidth={2} />,
  building: <Building2 className="h-5 w-5" strokeWidth={2} />,
  users: <Users className="h-5 w-5" strokeWidth={2} />,
};
