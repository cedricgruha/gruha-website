"use client";

import React from "react";
import * as Icons from "lucide-react";
import imgSearchMap from "@/imports/Container.png";

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
  defaultName = "MapPin",
  props: any = { className: "w-4 h-4", strokeWidth: 2 }
) => {
  if (!name) return null;
  const Icon = (Icons as any)[name] || (Icons as any)[defaultName] || Icons.HelpCircle;
  return <Icon {...props} />;
};

const defaultCostOfSearchStats = [
  { icon: "CalendarX", value: "11 months", label: "Total duration" },
  { icon: "LayoutGrid", value: "47 spreadsheets", label: "Tabs, models & comparisons" },
  { icon: "MapPin", value: "18 site visits", label: "Across 3 corridors" },
  { icon: "Sun", value: "5 Sundays", label: "Lost to research marathons" },
  { icon: "Car", value: "20 traffic hours", label: "Whitefield ↔ Sarjapur loops" },
  { icon: "TrendingUp", value: "₹35L appreciation", label: "Missed while deciding" },
];

const defaultExploredAreas = [
  {
    id: "hosa-road",
    name: "Hosa Road",
    desc: "Good connectivity & better value within reach",
    projectsCount: 3,
    visitsCount: 2,
    dotColor: "rgb(59, 130, 246)",
    image: imgSearchMap,
    ovalLeft: "8%",
    ovalTop: "38%",
    ovalWidth: "220px",
    ovalHeight: "115px",
    ovalFill: "rgba(59, 130, 246, 0.12)",
    left: "10%",
    top: "10%",
  },
  {
    id: "chandapura-attibele",
    name: "Chandapura-Attibele",
    desc: "Lower budget, but larger units",
    projectsCount: 3,
    visitsCount: 3,
    dotColor: "rgb(16, 185, 129)",
    image: imgSearchMap,
    ovalLeft: "34%",
    ovalTop: "62%",
    ovalWidth: "240px",
    ovalHeight: "120px",
    ovalFill: "rgba(16, 185, 129, 0.12)",
    left: "37%",
    top: "36%",
  },
  {
    id: "outer-sarjapur-road",
    name: "Outer Sarjapur Road",
    desc: "Strongest match on builder trust & school proximity",
    projectsCount: 5,
    visitsCount: 4,
    dotColor: "#DD5128",
    isTopChoice: true,
    image: imgSearchMap,
    ovalLeft: "62%",
    ovalTop: "42%",
    ovalWidth: "270px",
    ovalHeight: "145px",
    ovalFill: "rgba(239, 68, 68, 0.14)",
    left: "64%",
    top: "8%",
  },
];

export interface JournalSearchV0Props {
  eyebrow?: string;
  tagline?: string;
  title?: string;
  description?: string;
  metrics?: Array<{
    icon?: string | React.ReactNode;
    label: string;
    value: string;
  }>;
  exploredAreasTitle?: string;
  exploredAreas?: Array<any>;
  googleMapQuery?: string;
  searchMapImage?: any;
  costOfSearchTitle?: string;
  filtersTitle?: string;
  filters?: Array<any>;
  filtersFooterLabel?: string;
  costOfSearchStats?: Array<{
    icon?: string | React.ReactNode;
    value: string;
    label: string;
  }>;
  costOfSearchQuote?: string;
}

export const JournalSearchV0: React.FC<JournalSearchV0Props> = ({
  eyebrow = "The Search",
  tagline,
  title = "Where they looked and what they found.",
  description = "From defining non-negotiables to comparing communities and projects, every search brought them one step closer to understanding what truly mattered.",
  metrics = [
    { icon: "MapPin", label: "Location Preference", value: "Sarjapur" },
    { icon: "Home", label: "Home Configuration", value: "2.5 BHK" },
    { icon: "Sun", label: "Sundays Sacrificed", value: "5 Sundays" },
    { icon: "Car", label: "Lost to Traffic", value: "20+ Hours" },
  ],
  exploredAreasTitle = "Areas they explored",
  exploredAreas = defaultExploredAreas,
  googleMapQuery = "Sarjapur Road, Bengaluru",
  searchMapImage = imgSearchMap,
  costOfSearchTitle = "The Cost of Searching",
  filtersTitle,
  filters,
  filtersFooterLabel,
  costOfSearchStats = defaultCostOfSearchStats,
  costOfSearchQuote = "Not just time. It was the cost of waiting.",
}) => {
  const exploredAreasList = exploredAreas && exploredAreas.length > 0 ? exploredAreas : defaultExploredAreas;
  const sectionTagline = tagline || eyebrow;

  const sectionTitle = filtersTitle || costOfSearchTitle || "The Cost of Searching";
  const displayFilterStats = (filters && filters.length > 0)
    ? filters
    : ((costOfSearchStats && costOfSearchStats.length > 0) ? costOfSearchStats : defaultCostOfSearchStats);

  return (
    <section id="section-search" className="pt-10 ">
      <div className="text-left mb-7">
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase" style={{ fontFamily: fu, color: "#DD5128" }}>
          {sectionTagline}
        </p>
        <h2 className="mt-2 text-[clamp(28px,3.6vw,40px)] font-semibold leading-[1.08] tracking-[-0.02em]" style={{ fontFamily: fd, color: "#111821" }}>
          {title}
        </h2>
        <p className="mt-3 text-[17px] leading-[1.55]" style={{ fontFamily: fd, color: "#59636F" }}>
          {description}
        </p>
      </div>

      {/* Metrics Header Strip */}
      <div
        className="mb-5 bg-white border flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-100"
        style={{ borderRadius: 14, borderColor: "#E4E9EF", boxShadow: "0 1px 2px rgba(17,24,33,.04), 0 8px 24px rgba(17,24,33,.05)" }}
      >
        {metrics.map((cell: any) => {
          const iconElement =
            typeof cell.icon === "string"
              ? getIcon(cell.icon, "MapPin", { className: "w-4 h-4 text-[#DD5128]" })
              : cell.icon;

          return (
            <div key={cell.label} className="flex items-center gap-4 px-6 sm:px-8 py-5 flex-1">
              <span className="flex-none text-[#DD5128]">{iconElement}</span>
              <div>
                <p className="text-[9.5px] font-semibold tracking-[0.13em] uppercase mb-1" style={{ fontFamily: fu, color: "#8A94A1" }}>
                  {cell.label}
                </p>
                <p className="text-[17px] font-[500] leading-tight" style={{ fontFamily: fd, color: "#111821" }}>
                  {cell.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Map illustration container */}
      <div className="w-full mt-5">
        <p
          className="text-[9.5px] font-semibold tracking-[0.14em] uppercase mb-4"
          style={{ fontFamily: fu, color: "rgb(138, 148, 161)" }}
        >
          {exploredAreasTitle}
        </p>

        <div className="relative w-full rounded-[24px] border border-slate-200/80 overflow-hidden min-h-[580px] bg-[#F4F6F8] shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          {/* Real Google Map Background */}
          <iframe
            title="Explored Areas Google Map"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(googleMapQuery || "Sarjapur Road, Bengaluru")}&t=m&z=12&output=embed&iwloc=near`}
            className="absolute inset-0 w-full h-full border-none transition-opacity pointer-events-none"
            style={{ filter: "grayscale(100%) contrast(92%) brightness(106%)", opacity: 0.88 }}
            loading="lazy"
          />

          {/* Light Canvas Overlay */}
          <div className="absolute inset-0 bg-white/20 pointer-events-none z-1" />

          {/* Dynamic Dotted Oval Filled Shapes for Area Locations */}
          <div className="relative z-10 w-full h-full min-h-[580px] pointer-events-none">
            {exploredAreasList.map((area: any, idx: number) => {
              const defaultOvalPos = [
                { left: "8%", top: "38%", width: "220px", height: "115px", fill: "rgba(59, 130, 246, 0.12)", border: "rgb(59, 130, 246)" },
                { left: "34%", top: "62%", width: "240px", height: "120px", fill: "rgba(16, 185, 129, 0.12)", border: "rgb(16, 185, 129)" },
                { left: "62%", top: "42%", width: "270px", height: "145px", fill: "rgba(239, 68, 68, 0.14)", border: "rgb(239, 68, 68)" },
              ];
              const def = defaultOvalPos[idx % defaultOvalPos.length];

              return (
                <div
                  key={`oval-${area.id || idx}`}
                  className="absolute rounded-[50%] pointer-events-none transition-all z-5"
                  style={{
                    left: area.ovalLeft || def.left,
                    top: area.ovalTop || def.top,
                    width: area.ovalWidth || def.width,
                    height: area.ovalHeight || def.height,
                    backgroundColor: area.ovalFill || def.fill,
                    border: `2px dashed ${area.dotColor || def.border}`,
                  }}
                />
              );
            })}

            {/* Area Info Marker Cards */}
            {exploredAreasList.map((area: any, idx: number) => {
              const areaName = area.name || area.title || "";
              const areaDesc = area.desc || area.description || "";
              const projectsCount = area.projectsCount || area.projects || 0;
              const visitsCount = area.visitsCount || area.siteVisits || 0;
              const dotColor = area.dotColor || "#DD5128";
              const areaImage = getImgSrc(area.image || area.imageSrc || searchMapImage);

              return (
                <div
                  key={area.id || idx}
                  className="absolute z-10 pointer-events-auto transition-transform hover:scale-[1.03]"
                  style={{
                    left: area.left || (idx === 0 ? "10%" : idx === 1 ? "37%" : "64%"),
                    top: area.top || (idx === 0 ? "10%" : idx === 1 ? "36%" : "8%"),
                  }}
                >
                  <div
                    className="w-[190px] sm:w-[200px] rounded-xl overflow-hidden relative"
                    style={{
                      background: "rgba(255, 255, 255, 0.96)",
                      backdropFilter: "blur(12px)",
                      boxShadow: "rgba(0, 0, 0, 0.12) 0px 4px 20px",
                      border: area.isTopChoice ? "2px solid #DD5128" : "none",
                    }}
                  >
                    {area.isTopChoice && (
                      <span className="absolute top-2 left-2 z-10 bg-[#DD5128] text-white text-[9px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-md shadow-md font-inter">
                        TOP CHOICE
                      </span>
                    )}

                    <div className="h-[80px] overflow-hidden relative">
                      <img
                        src={areaImage}
                        alt={areaName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="px-3 py-2.5">
                      <p
                        className="text-[13px] font-semibold leading-tight mb-0.5"
                        style={{ fontFamily: fd, color: "rgb(17, 24, 33)" }}
                      >
                        {areaName}
                      </p>
                      <p
                        className="text-[11px] leading-[1.45] mb-2"
                        style={{ fontFamily: fu, color: "rgb(89, 99, 111)" }}
                      >
                        {areaDesc}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-none"
                          style={{ background: dotColor }}
                        />
                        <span
                          className="text-[10px] font-semibold"
                          style={{ fontFamily: fu, color: "rgb(138, 148, 161)" }}
                        >
                          {projectsCount} Projects · {visitsCount} Visits
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Filters & Search Criteria Grid */}
      <div className="mt-5">
        <div
          className="bg-white border p-6 sm:p-8"
          style={{ borderRadius: 14, borderColor: "#E4E9EF", boxShadow: "0 1px 2px rgba(17,24,33,.04), 0 8px 24px rgba(17,24,33,.05)" }}
        >
          <p className="text-[9.5px] font-semibold tracking-[0.14em] uppercase mb-6" style={{ fontFamily: fu, color: "#8A94A1" }}>
            {sectionTitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayFilterStats.map((item: any, idx: number) => {
              const iconElement =
                typeof item.icon === "string"
                  ? getIcon(item.icon, "MapPin", { className: "w-4 h-4 text-[#DD5128]" })
                  : item.icon;

              const itemTitle = item.title || item.label || `Filter #${idx + 1}`;
              const itemValue = item.value || "";
              const itemDesc = item.description || item.subtext || "";

              return (
                <div key={itemTitle + idx} className="rounded-xl border border-slate-100 p-5 flex flex-col gap-2 bg-[#f8fafc]">
                  <span className="text-[#DD5128]">{iconElement}</span>
                  <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#8A94A1]" style={{ fontFamily: fu }}>
                    {itemTitle}
                  </p>
                  <p className="text-[16.5px] font-medium leading-snug text-[#111821]" style={{ fontFamily: fd }}>
                    {itemValue}
                  </p>
                  {itemDesc && (
                    <p className="text-[12.5px] leading-relaxed text-[#59636F] mt-1" style={{ fontFamily: fu }}>
                      {itemDesc}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {(filtersFooterLabel || costOfSearchQuote) && (
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-[14.5px] italic font-medium" style={{ fontFamily: fd, color: "#4B5563" }}>
                "{filtersFooterLabel || costOfSearchQuote}"
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default JournalSearchV0;
