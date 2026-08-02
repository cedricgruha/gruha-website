"use client";

import React from "react";
import Image from "next/image";
import * as Icons from "lucide-react";
import imgClosure1 from "@/imports/1-1.png";
import imgClosure2 from "@/imports/2-1.png";
import imgClosure3 from "@/imports/4.png";

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
  defaultName = "Lightbulb",
  props: any = { className: "w-4 h-4", strokeWidth: 2 }
) => {
  if (!name) return null;
  const Icon = (Icons as any)[name] || (Icons as any)[defaultName] || Icons.HelpCircle;
  return <Icon {...props} />;
};

const defaultInsights = [
  { icon: "Lightbulb", label: "Biggest Lesson", value: "Decide the trigger, then obey it" },
  { icon: "Target", label: "Biggest Priority", value: "Cash flows over corridor stories" },
  { icon: "AlertTriangle", label: "Biggest Mistake", value: "Right on direction, wrong on timing" },
  { icon: "Trophy", label: "Biggest Win", value: "One filter killed half the shortlist" },
];

const defaultMonthlyLearnings = [
  {
    month: "Month 2",
    headline: "'Proposed' is a story. 'Tendered' is a catalyst.",
    body: "That one filter on infrastructure status correctly killed half his shortlist.",
    turning: false,
  },
  {
    month: "Month 4",
    headline: "Early-bird pricing is real, not free money.",
    body: "8-12% below post-launch, but it's compensation for delivery risk. Price the risk, or skip the discount.",
    turning: false,
  },
  {
    month: "Month 6",
    headline: "Right on direction, wrong on timing, every time.",
    body: "His own 2021 predictions back-tested correctly on where, but 2+ years off on when. Corridors arrive late, always.",
    turning: true,
  },
  {
    month: "Month 9",
    headline: "The flat he didn't buy appreciated ₹35L.",
    body: "The lesson isn't buy fast. It's: decide what would make you act, write it down, and obey it.",
    turning: false,
  },
  {
    month: "Month 11",
    headline: "Deepa's rule was an investment filter all along.",
    body: "'Not a second job' turns out to disqualify any asset that needs weekly attention.",
    turning: false,
  },
];

const defaultThinkingChanged = [
  { before: "More diligence lowers risk", after: "Cash flows matter more than narrative" },
  { before: "The corridor's story is the thesis", after: "A written trigger beats endless analysis" },
  { before: "Splitting three ways is safe", after: "Conviction beats split mediocrity" },
  { before: "Timing the market is possible", after: "Corridors arrive late; build in the lag" },
];

const defaultClosureLessons = [
  { title: "Markets don't wait.", description: "Prices rose ₹35–55L in two years. Starting earlier would have unlocked far more flexibility.", imageSrc: imgClosure1 },
  { title: "Shortlists beat browsing.", description: "More options didn't help. Focusing on a few well-matched communities made decisions easier.", imageSrc: imgClosure2 },
  { title: "Buy for tomorrow.", description: "Becoming parents shifted everything. Schools, hospitals, and safety beat luxury finishes.", imageSrc: imgClosure3 },
];

export interface JournalLearningsV0Props {
  eyebrow?: string;
  title?: string;
  description?: string;
  insights?: Array<{
    icon?: string | React.ReactNode;
    label: string;
    value: string;
  }>;
  metrics?: Array<{
    icon?: string | React.ReactNode;
    label: string;
    value: string;
  }>;
  monthlyLearningsTitle?: string;
  monthlyLearnings?: Array<{
    month: string;
    headline: string;
    body: string;
    turning?: boolean;
  }>;
  thinkingChangedTitle?: string;
  thinkingChanged?: Array<{
    before: string;
    after: string;
  }>;
  beforeItems?: Array<{ icon?: string; text: string }>;
  afterItems?: Array<{ icon?: string; text: string }>;
  differentlyCards?: Array<{ icon?: string; title: string; description: string }>;
  lessonsTitle?: string;
  lessons?: Array<{
    title: string;
    description?: string;
    body?: string;
    imageSrc?: any;
    img?: any;
  }>;
}

export const JournalLearningsV0: React.FC<JournalLearningsV0Props> = ({
  eyebrow = "Learnings",
  title = "What their journey taught them.",
  description = "Key insights, mindset shifts, and lessons learned along the home-buying journey.",
  insights,
  metrics,
  monthlyLearningsTitle = "Lessons learned along the way",
  monthlyLearnings,
  thinkingChangedTitle = "How their thinking changed",
  thinkingChanged,
  beforeItems,
  afterItems,
  differentlyCards,
  lessonsTitle = "Key takeaways",
  lessons,
}) => {
  const displayInsights = (insights && insights.length > 0)
    ? insights
    : (metrics && metrics.length > 0)
      ? metrics
      : defaultInsights;

  const displayMonthly = (monthlyLearnings && monthlyLearnings.length > 0)
    ? monthlyLearnings
    : null;

  // Build thinking changed list from beforeItems + afterItems if thinkingChanged is not provided
  let displayThinking = (thinkingChanged && thinkingChanged.length > 0) ? thinkingChanged : null;
  if (!displayThinking && beforeItems && beforeItems.length > 0 && afterItems && afterItems.length > 0) {
    displayThinking = beforeItems.map((bItem, idx) => ({
      before: typeof bItem === "string" ? bItem : bItem.text,
      after: typeof afterItems[idx] === "string" ? afterItems[idx] : afterItems[idx]?.text || "",
    }));
  }
  if (!displayThinking) {
    displayThinking = defaultThinkingChanged;
  }

  const displayLessons = (lessons && lessons.length > 0)
    ? lessons
    : defaultClosureLessons;

  return (
    <section id="section-learnings" className="pt-0 sm:pt-10 pb-10">
      <div className="text-left mb-7">
        <p className="text-md font-semibold tracking-[0.15em] uppercase" style={{ fontFamily: fu, color: "#DD5128" }}>
          {eyebrow}
        </p>
        <h2 className="mt-2 text-[clamp(28px,3.6vw,40px)] font-semibold leading-[1.08] tracking-[-0.02em]" style={{ fontFamily: fd, color: "#111821" }}>
          {lessonsTitle || title}
        </h2>
        <p className="mt-3 text-base leading-[1.55]" style={{ fontFamily: fd, color: "#59636F" }}>
          {description}
        </p>
      </div>

      {/* Insights strip */}
      <div
        className="bg-white border flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-100"
        style={{ borderRadius: 14, borderColor: "#E4E9EF", boxShadow: "0 1px 2px rgba(17,24,33,.04), 0 8px 24px rgba(17,24,33,.05)" }}
      >
        {displayInsights.map((cell: any) => {
          const iconElement =
            typeof cell.icon === "string"
              ? getIcon(cell.icon, "Lightbulb", { className: "w-4 h-4 text-[#DD5128]" })
              : cell.icon;

          return (
            <div key={cell.label} className="flex items-start gap-4 px-6 sm:px-8 py-5 flex-1 min-w-0">
              {/* Icon aligned with the first line of the value text */}
              <span className="flex-none text-[#DD5128] mt-[22px]">
                {iconElement}
              </span>

              {/* Text block top-aligned so all labels share the top row */}
              <div className="min-w-0 flex-1">
                <p
                  className="text-xs font-semibold tracking-[0.10em] uppercase mb-1.5"
                  style={{ fontFamily: fu, color: "#8A94A1" }}
                >
                  {cell.label}
                </p>
                <p
                  className="text-sm sm:text-base font-[500] leading-tight"
                  style={{ fontFamily: fd, color: "#111821" }}
                >
                  {cell.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-5">
        {/* Month-by-month timeline OR Core Lessons */}
        {displayMonthly ? (
          <div
            className="bg-white border px-6 sm:px-10 py-8"
            style={{ borderRadius: 14, borderColor: "#E4E9EF", boxShadow: "0 1px 2px rgba(17,24,33,.04), 0 8px 24px rgba(17,24,33,.05)" }}
          >
            <p className="text-sm sm:text-base font-semibold tracking-[0.14em] uppercase mb-8" style={{ fontFamily: fu, color: "#8A94A1" }}>
              {monthlyLearningsTitle}
            </p>

            <div className="relative">
              <div className="absolute left-[5px] top-2 bottom-2 w-px" style={{ background: "#E4E9EF" }} />
              <div className="flex flex-col gap-0">
                {displayMonthly.map((item: any, i: number) => (
                  <div key={i} className="relative flex gap-6 sm:gap-8 pb-10 last:pb-0">
                    <div className="relative flex-none" style={{ width: 11, paddingTop: 4 }}>
                      <div
                        className="w-[11px] h-[11px] rounded-full border-2"
                        style={{
                          background: item.turning ? "#DD5128" : "white",
                          borderColor: item.turning ? "#DD5128" : "#CBD5E1",
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0" style={{ paddingTop: 1 }}>
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-sm sm:text-base font-semibold tracking-[0.12em] uppercase" style={{ fontFamily: fu, color: item.turning ? "#DD5128" : "#8A94A1" }}>
                          {item.month || `LESSON 0${i + 1}`}
                        </p>
                        {item.turning && (
                          <span className="text-xs sm:text-sm font-semibold px-2 py-0.5 rounded-full tracking-wide" style={{ background: "#FEF0EC", color: "#DD5128", fontFamily: fu }}>
                            Turning point
                          </span>
                        )}
                      </div>
                      <h4 className="text-[18px] leading-[1.3] mb-1.5" style={{ fontFamily: fd, color: "#111821", fontWeight: 500 }}>
                        {item.headline || item.title}
                      </h4>
                      <p className="text-base leading-[1.65]" style={{ fontFamily: fu, color: "#59636F" }}>
                        {item.body || item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* How thinking changed */}
        <div
          className="bg-white border px-6 sm:px-8 py-8"
          style={{ borderRadius: 14, borderColor: "#E4E9EF", boxShadow: "0 1px 2px rgba(17,24,33,.04), 0 8px 24px rgba(17,24,33,.05)" }}
        >
          <p className="text-sm sm:text-base font-semibold tracking-[0.14em] uppercase mb-6" style={{ fontFamily: fu, color: "#8A94A1" }}>
            {thinkingChangedTitle}
          </p>

          <div className="grid grid-cols-[1fr_16px_1fr] gap-3 mb-4 pb-3 border-b border-slate-100">
            <p className="text-sm sm:text-base font-semibold tracking-[0.12em] uppercase text-right" style={{ fontFamily: fu, color: "#8A94A1" }}>
              What they believed
            </p>
            <div />
            <p className="text-sm sm:text-base font-semibold tracking-[0.12em] uppercase" style={{ fontFamily: fu, color: "#DD5128" }}>
              What they know now
            </p>
          </div>

          <div className="flex flex-col divide-y divide-slate-100">
            {displayThinking.map(({ before, after }: any) => (
              <div key={before} className="grid grid-cols-[1fr_16px_1fr] gap-3 items-center py-5">
                <p className="text-base leading-[1.4] text-right line-through decoration-slate-300" style={{ fontFamily: fd, color: "#94A3B8" }}>
                  {before}
                </p>
                <p className="text-center text-sm sm:text-base" style={{ color: "#CBD5E1" }}>
                  →
                </p>
                <p className="text-base leading-[1.4]" style={{ fontFamily: fd, color: "#111821", fontWeight: 500 }}>
                  {after}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Closure cards */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {displayLessons.slice(0, 3).map(({ img, imageSrc, title: cardTitle, body, description: desc }: any, idx: number) => {
          const cardImg = img || imageSrc || (idx === 0 ? imgClosure1 : idx === 1 ? imgClosure2 : imgClosure3);
          const displayBody = body || desc || "";
          return (
            <div
              key={cardTitle}
              className="bg-white border overflow-hidden flex flex-col"
              style={{ borderRadius: 14, borderColor: "#E4E9EF", boxShadow: "0 1px 2px rgba(17,24,33,.04), 0 8px 24px rgba(17,24,33,.05)" }}
            >
              <div className="h-[180px] overflow-hidden bg-slate-50 flex items-center justify-center p-4 relative">
                <Image src={cardImg} alt={cardTitle} fill className="object-contain rounded-lg p-4" />
              </div>
              <div className="px-6 py-5">
                <h4 className="text-base sm:text-lg leading-tight mb-2" style={{ fontFamily: fd, color: "#111821", fontWeight: 500 }}>
                  {cardTitle}
                </h4>
                <p className="text-base leading-[1.6]" style={{ fontFamily: fu, color: "#59636F" }}>
                  {displayBody}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default JournalLearningsV0;
