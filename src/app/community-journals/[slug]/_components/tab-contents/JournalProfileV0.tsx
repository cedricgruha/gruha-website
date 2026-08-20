"use client";

import React from "react";
import Image from "next/image";
import * as Icons from "lucide-react";
import imgPavan from "@/imports/signal-2026-07-23-12-45-03-735_003.jpg";
import imgShruti from "@/imports/signal-2026-07-23-12-45-03-735_002.jpg";

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
  defaultName = "Briefcase",
  props: any = { className: "w-4 h-4", strokeWidth: 2 }
) => {
  if (!name) return null;
  const Icon = (Icons as any)[name] || (Icons as any)[defaultName] || Icons.HelpCircle;
  return <Icon {...props} />;
};

export interface JournalProfileV0Props {
  aboutLabel?: string;
  title?: string;
  description?: string;
  buyers?: Array<{
    name: string;
    age: number | string;
    role: string;
    tags: string[];
    image?: any;
    img?: any;
  }>;
  sharedVisionTitle?: string;
  sharedVisionDescription?: string;
  stats?: Array<{
    icon?: string | React.ReactNode;
    label: string;
    value: string;
    tag?: string;
  }>;
  prioritiesTitle?: string;
  priorities?: Array<{
    title: string;
    scorePercentage?: number;
    scoreLabel?: string;
    description?: string;
    why?: string;
    score?: number;
    pct?: number;
  }>;
  checklistItems?: Array<string | { title?: string; text?: string; desc?: string }>;
  startHereDescription?: string;
}

export const JournalProfileV0: React.FC<JournalProfileV0Props> = ({
  aboutLabel = "About",
  title = "Who they are",
  description = "Getting to know Pavan & Shruti — their world, their dreams, and what matters most.",
  buyers = [
    { img: imgPavan, name: "Pavan", age: 29, role: "Senior Engineer", tags: ["Responsible", "Practical", "Calm"] },
    { img: imgShruti, name: "Shruti", age: 28, role: "QA", tags: ["Thoughtful", "Organised", "Empathetic"] },
  ],
  sharedVisionTitle = "Shared vision",
  sharedVisionDescription = "Create a safe, comfortable home before their baby arrives. A place where every milestone begins with a sense of belonging, from bringing their newborn home for the first time to celebrating birthdays, festivals and everyday moments together.",
  stats = [
    { icon: "Briefcase", label: "Buyer profile", value: "First-timers" },
    { icon: "Heart", label: "Life stage", value: "Newly married" },
    { icon: "TrendingUp", label: "Search stage", value: "Active explorer" },
    { icon: "Hourglass", label: "Timeline", value: "Before the baby" },
  ],
  prioritiesTitle = "Top priorities right now",
  priorities = [
    { title: "Budget friendly, but future ready", score: 9.5, why: "A wrong financial decision would follow them for years.", pct: 95 },
    { title: "Good connectivity to work", score: 9.0, why: "The daily commute should be easy and stress-free.", pct: 90 },
    { title: "Enough space for their lifestyle", score: 8.0, why: "Room to grow, work and create memories.", pct: 80 },
    { title: "Safe, family-friendly neighbourhood", score: 7.5, why: "A secure environment for their child to grow up in.", pct: 75 },
  ],
  checklistItems,
  startHereDescription,
}) => {
  const displayChecklist = Array.isArray(checklistItems) ? checklistItems : [];

  const singleBuyerFirstName = (() => {
    if (buyers && buyers.length === 1 && buyers[0]?.name) {
      const rawName = buyers[0].name.trim();
      if (!rawName.includes("&") && !/\band\b/i.test(rawName)) {
        return rawName.split(" ")[0];
      }
    }
    return null;
  })();

  const sectionTitle = (title === "Who they are" && singleBuyerFirstName)
    ? `Who is ${singleBuyerFirstName}`
    : title;

  const defaultDescription = singleBuyerFirstName
    ? `Getting to know ${singleBuyerFirstName} — their world, their dreams, and what matters most.`
    : "Getting to know Pavan & Shruti — their world, their dreams, and what matters most.";

  const sectionDescription = description === "Getting to know Pavan & Shruti — their world, their dreams, and what matters most." && singleBuyerFirstName
    ? defaultDescription
    : description;

  return (
    <section id="section-profile" className="pt-0 ">
      <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold leading-[1.1] mb-3" style={{ fontFamily: fd, color: "#111821" }}>
        Is this you?
      </h2>

      <p className="text-base leading-relaxed mb-7" style={{ fontFamily: fu, color: "#6B7280" }}>{startHereDescription}</p>


      {/* Checklist card — only shown when checklist items are provided */}
      {displayChecklist.length > 0 && (
      <div
        className="w-full bg-white border px-6 sm:px-10 py-8 text-left  mb-7"
        style={{
          borderRadius: 14,
          borderColor: "#E4E9EF",
          boxShadow: "0 1px 2px rgba(17,24,33,.04), 0 8px 24px rgba(17,24,33,.05)",
        }}
      >
        {/*<p
          className="text-sm sm:text-base font-semibold tracking-[0.14em] uppercase mb-6"
          style={{ fontFamily: fu, color: "#8A94A1" }}
        >
          {checklistTitle}
        </p>*/}

        {/* Split array into 2 halves for left and right columns */}
        {(() => {
          const midPoint = Math.ceil(displayChecklist.length / 2);
          const leftColumn = displayChecklist.slice(0, midPoint);
          const rightColumn = displayChecklist.slice(midPoint);

          const renderItem = (item: any, i: number) => {
            const text =
              typeof item === "string"
                ? item
                : item?.title || item?.text || item?.desc || "";

            return (
              <div key={i} className="flex items-start gap-3">
                <Icons.BadgeCheck
                  size={15}
                  className="mt-1 flex-none"
                  style={{ color: "#DD5128" }}
                />
                <span
                  className="text-base leading-[1.65]"
                  style={{ fontFamily: fu, color: "#59636F" }}
                >
                  {text}
                </span>
              </div>
            );
          };

          return (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-5">
              {/* Left Column Stack */}
              <div className="flex flex-col gap-y-5">
                {leftColumn.map((item: any, i: number) => renderItem(item, i))}
              </div>

              {/* Right Column Stack */}
              <div className="flex flex-col gap-y-5">
                {rightColumn.map((item: any, i: number) => renderItem(item, i))}
              </div>
            </div>
          );
        })()}
      </div>
      )}

      {/* Section Header */}
      <div className="text-left mb-7">
        <p className="text-md font-semibold tracking-[0.15em] uppercase" style={{ fontFamily: fu, color: "#DD5128" }}>
          {aboutLabel}
        </p>
        <h2 className="mt-2 text-[clamp(28px,3.6vw,40px)] font-semibold leading-[1.08] tracking-[-0.02em]" style={{ fontFamily: fd, color: "#111821" }}>
          {sectionTitle}
        </h2>
        <p className="mt-3 text-sm sm:text-base leading-[1.55]" style={{ fontFamily: fd, color: "#59636F" }}>
          {sectionDescription}
        </p>
      </div>

      {/* Profile stats strip (Exactly 4 Columns) */}
      <div
        className="mb-5 bg-white border grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 overflow-hidden"
        style={{ borderRadius: 14, borderColor: "#E4E9EF", boxShadow: "0 1px 2px rgba(17,24,33,.04), 0 8px 24px rgba(17,24,33,.05)" }}
      >
        {stats.slice(0, 4).map((cell: any, idx: number) => {
          const iconElement =
            typeof cell.icon === "string"
              ? getIcon(cell.icon, "Briefcase", { className: "w-4 h-4 text-[#DD5128]" })
              : cell.icon;

          return (
            <div key={cell.label} className="group flex items-start gap-3.5 px-5 sm:px-6 py-4.5 flex-1 min-w-0 transition-colors">
              <span className="flex-none mt-3.5 text-[#DD5128]">
                {iconElement}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-[0.13em] uppercase mb-1.5" style={{ fontFamily: fu, color: "#8A94A1" }}>
                  {cell.label}
                </p>
                <p
                  className="text-base font-[500] leading-tight"
                  style={{ fontFamily: fd, color: idx === 0 ? "#DD5128" : "#111821" }}
                >
                  {cell.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Personas & Shared Vision */}
      {(() => {
        const renderPersonaCard = (p: any, idx: number) => {
          const personaImg = p.image || p.img || (idx === 0 ? imgPavan : imgShruti);
          const displayDesc = p.description || (Array.isArray(p.tags) ? p.tags.join(", ") : p.tags) || "";

          return (
            <div
              key={p.name}
              className="bg-white border overflow-hidden p-4 sm:p-5 rounded-2xl"
              style={{
                borderColor: "#E4E9EF",
                boxShadow: "0 1px 2px rgba(17,24,33,.04), 0 8px 24px rgba(17,24,33,.05)",
                minHeight: 180,
              }}
            >
              {/* Image stays at the start; text wraps beside/below it like a
                  two-column magazine on every persona (kept on all widths). */}
              <div className="float-left mr-4 rounded-none overflow-hidden bg-[#F7ECE1] relative w-[135px] h-[145px] sm:w-[150px] sm:h-[155px] flex-none">
                <Image
                  src={personaImg}
                  alt={p.name}
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-[20px] font-semibold leading-tight text-[#111821] mb-1" style={{ fontFamily: fd }}>
                  {p.name} ({p.age})
                </h3>
                <p className="text-[15px] text-[#8A94A1] mb-3" style={{ fontFamily: fu }}>
                  {p.role}
                </p>
                <p className="text-sm sm:text-base leading-[1.6] text-[#59636F]" style={{ fontFamily: fu }}>
                  {displayDesc}
                </p>
              </div>
            </div>
          );
        };

        const renderSharedVisionCard = () => (
          <div
            className="bg-white border rounded-2xl p-4 sm:p-5 flex flex-col justify-start"
            style={{ borderColor: "#E4E9EF", boxShadow: "0 1px 2px rgba(17,24,33,.04), 0 8px 24px rgba(17,24,33,.05)" }}
          >
            <h4 className="text-base sm:text-lg font-semibold leading-[1.25]" style={{ fontFamily: fd, color: "#111821" }}>
              {sharedVisionTitle}
            </h4>
            <p className="mt-3 text-sm sm:text-base leading-[1.6]" style={{ fontFamily: fu, color: "#6B7684" }}>
              {sharedVisionDescription}
            </p>
          </div>
        );

        return (
          <div className="flex flex-col gap-6">
            {buyers.length === 1 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {renderPersonaCard(buyers[0], 0)}
                {renderSharedVisionCard()}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {buyers.map((p: any, idx: number) => renderPersonaCard(p, idx))}
                </div>
                {renderSharedVisionCard()}
              </>
            )}
          </div>
        );
      })()}

      {/* Priorities Panel */}
      <div className="mt-5">
        <div
          className="bg-white border p-5"
          style={{ borderRadius: 14, borderColor: "#E4E9EF", boxShadow: "0 1px 2px rgba(17,24,33,.04), 0 8px 24px rgba(17,24,33,.05)" }}
        >
          <p className="text-sm sm:text-base font-semibold tracking-[0.14em] uppercase mb-4" style={{ fontFamily: fu, color: "#8A94A1" }}>
            {prioritiesTitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {priorities.map((p: any) => {
              const displayScore = p.scoreLabel || (p.score ? `${p.score}` : "9.0");
              const displayWhy = p.description || p.why || "";
              const displayPct = p.scorePercentage || p.pct || 90;
              return (
                <div
                  key={p.title}
                  className="flex flex-col justify-between border p-4"
                  style={{ borderRadius: 14, borderColor: "#E4E9EF", boxShadow: "0 1px 3px rgba(17,24,33,.04)" }}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-base font-semibold leading-[1.25]" style={{ fontFamily: fd, color: "#111821" }}>
                        {p.title}
                      </h4>

                    </div>
                    <p className="text-sm sm:text-base leading-[1.5]" style={{ fontFamily: fu, color: "#59636F" }}>
                      {displayWhy}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JournalProfileV0;
