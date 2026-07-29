"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as Icons from "lucide-react";
import imgProj1 from "@/imports/image-1.png";
import imgProj2 from "@/imports/image-2.png";
import imgProj3 from "@/imports/image-3.png";

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
  defaultName = "ShieldCheck",
  props: any = { className: "w-4 h-4 text-slate-400 stroke-[1.5]" }
) => {
  if (!name) return null;
  const Icon = (Icons as any)[name] || (Icons as any)[defaultName] || Icons.HelpCircle;
  return <Icon {...props} />;
};

const defaultProjects = [
  {
    name: "Bhartiya City Nikoo Homes",
    location: "Thanisandra Main Rd",
    tagline: "The launch-window buy",
    priceRange: "₹1.31–2.9 Cr",
    psf: "₹11,950–12,500/sqft",
    possession: "2029",
    possessionColor: "#111821",
    img: imgProj1,
  },
  {
    name: "L&T Raintree Boulevard",
    location: "Hebbal",
    tagline: "Delivered-premium benchmark",
    priceRange: "₹2.6–3.53 Cr",
    psf: "₹17,500–20,400/sqft",
    possession: "Ready",
    possessionColor: "#10B981",
    img: imgProj2,
  },
  {
    name: "Devanahalli Plotted",
    location: "Devanahalli",
    tagline: "The alternative thesis — parked",
    priceRange: "₹38–45L",
    psf: "₹2,100–8,500/sqft",
    possession: "Immediate",
    possessionColor: "#64748B",
    img: imgProj3,
  },
];

const defaultCriteria = [
  { icon: "Shield", text: "Safety & security", sub: "for family", active: false },
  { icon: "GraduationCap", text: "Good schools", sub: "nearby", active: false },
  { icon: "ShieldCheck", text: "Trusted builders", sub: "for quality", active: false },
  { icon: "TrendingUp", text: "Value of money", sub: "for future growth", active: false },
  { icon: "Clock", text: "Possession timeline", sub: "before baby arrives", active: true },
];

export interface JournalProjectsV0Props {
  eyebrow?: string;
  tagline?: string;
  title?: string;
  description?: string;
  projectsTitle?: string;
  projectsCountBadge?: string;
  projects?: any[];
  criteriaTitle?: string;
  prioritiesTitle?: string;
  criteria?: any[];
  priorities?: any[];
}

export const JournalProjectsV0: React.FC<JournalProjectsV0Props> = ({
  eyebrow = "The Projects",
  tagline,
  title = "Where they looked and what they found.",
  description = "From defining non-negotiables to comparing communities and projects, every search brought them one step closer to understanding what truly mattered.",
  projectsTitle = "PROJECTS THEY EXPLORED",
  projectsCountBadge = "19 projects",
  projects = defaultProjects,
  criteriaTitle = "Non-negotiables",
  prioritiesTitle,
  criteria,
  priorities,
}) => {
  const [startIndex, setStartIndex] = useState(0);

  const displayProjects = projects && projects.length > 0 ? projects : defaultProjects;
  const displayCriteria = (priorities && priorities.length > 0)
    ? priorities
    : ((criteria && criteria.length > 0) ? criteria : defaultCriteria);
  const displayCriteriaTitle = prioritiesTitle || criteriaTitle || "What mattered most in their search";

  const prev = () => {
    setStartIndex((prev) => (prev - 1 + displayProjects.length) % displayProjects.length);
  };

  const next = () => {
    setStartIndex((prev) => (prev + 1) % displayProjects.length);
  };

  const sectionTagline = tagline || eyebrow;

  return (
    <section id="section-projects" className="pt-10">
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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-8 items-start">
        {/* Left Column: Projects Carousel & Cards */}
        <div className="min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <p className="text-[9.5px] font-semibold tracking-[0.14em] uppercase" style={{ fontFamily: fu, color: "#8A94A1" }}>
                {projectsTitle}
              </p>
              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full" style={{ fontFamily: fu }}>
                {projectsCountBadge}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer shadow-2xs"
                aria-label="Previous Project"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={next}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer shadow-2xs"
                aria-label="Next Project"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayProjects.slice(startIndex, startIndex + 3).concat(
              displayProjects.slice(0, Math.max(0, startIndex + 3 - displayProjects.length))
            ).slice(0, 3).map((proj: any, idx: number) => {
              const projName = proj.name || proj.title || "";
              const projPrice = proj.price || proj.priceRange || "₹1.31–2.9 Cr";
              const projPossession = proj.possession || proj.status || "2029";
              const projPsf = proj.psf || proj.sqftRate || "₹11,950–12,500/sqft";
              const projImg = getImgSrc(proj.img || proj.image || proj.imageSrc || imgProj1);

              return (
                <div
                  key={`${projName}-${idx}`}
                  className="bg-white rounded-[20px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                >
                  {/* Card Image */}
                  <div className="h-52 relative bg-slate-100 overflow-hidden">
                    <img src={projImg} alt={projName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {proj.isOverlay && (
                      <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-4">
                        <span className="text-[12px] font-semibold tracking-wider uppercase text-[#FF8A65] mb-1 font-mono">
                          {proj.overlayText || "Rejected"}
                        </span>
                        <span className="text-[14px] font-medium text-white font-serif">
                          {proj.overlaySubtext || "Unverified"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4
                        className="text-[17px] font-medium leading-tight mb-1"
                        style={{ fontFamily: fd, color: "#111821" }}
                      >
                        {projName}
                      </h4>
                    </div>

                    <div className="pt-4 border-t border-slate-100/90">
                      <div className="flex items-start justify-between">
                        <div>
                          <p
                            className="text-[9.5px] font-semibold tracking-[0.15em] uppercase mb-1"
                            style={{ fontFamily: fu, color: "#94A3B8" }}
                          >
                            PRICE RANGE
                          </p>
                          <p
                            className="text-[16px] font-semibold leading-none"
                            style={{ fontFamily: fd, color: "#111821" }}
                          >
                            {projPrice}
                          </p>
                        </div>

                        {projPossession && (
                          <div className="text-right">
                            <p
                              className="text-[9.5px] font-semibold tracking-[0.15em] uppercase mb-1"
                              style={{ fontFamily: fu, color: "#94A3B8" }}
                            >
                              POSSESSION
                            </p>
                            <p
                              className="text-[15px] font-medium leading-none"
                              style={{ fontFamily: fu, color: "#111821" }}
                            >
                              {projPossession}
                            </p>
                          </div>
                        )}
                      </div>

                      {projPsf && (
                        <p
                          className="mt-2.5 text-[11px]"
                          style={{ fontFamily: fu, color: "#94A3B8" }}
                        >
                          {projPsf}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Non-Negotiables Criteria / Priorities List */}
        <div className="pt-10 flex flex-col gap-6">
          <p className="text-[9.5px] font-semibold tracking-[0.14em] uppercase mb-1" style={{ fontFamily: fu, color: "#8A94A1" }}>
            {displayCriteriaTitle}
          </p>

          {displayCriteria.map((item: any, idx: number) => {
            const isActive = item.active || idx === 0;
            const iconElement =
              typeof item.icon === "string"
                ? getIcon(item.icon, "ShieldCheck", { className: "w-4 h-4 text-[#DD5128] stroke-[1.8]" })
                : item.icon;

            const itemTitle = item.title || item.text || "";
            const itemSub = item.subtitle || item.sub || "";

            return (
              <div key={itemTitle || idx} className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex-none text-[#DD5128]">{iconElement}</span>
                  <div>
                    <h5 className="text-[15px] font-medium leading-tight" style={{ fontFamily: fd, color: "#111821" }}>
                      {itemTitle}
                    </h5>
                    {itemSub && (
                      <p className="text-[12px] mt-0.5 leading-tight" style={{ fontFamily: fu, color: "#8A94A1" }}>
                        {itemSub}
                      </p>
                    )}
                  </div>
                </div>

                {/* Orange Dot indicator for active item */}
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#DD5128] mt-1.5 flex-none shadow-xs" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JournalProjectsV0;
