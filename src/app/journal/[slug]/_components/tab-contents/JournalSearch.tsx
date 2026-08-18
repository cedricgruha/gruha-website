"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export interface SearchMetric {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: React.ReactNode;
}

export interface ExploredArea {
  title: string;
  description: string;
  projects: number;
  siteVisits: number;
  imageSrc: string;
}

export interface FilterItem {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  value: string;
  description: string;
  isReraVerified?: boolean;
}

export interface JournalSearchProps {
  tagline?: string;
  title: string;
  description: string;
  metrics: SearchMetric[];
  exploredAreasTitle?: string;
  exploredAreas: ExploredArea[];
  consideredAreasLabel?: string;
  filtersTitle?: string;
  filters: FilterItem[];
  filtersFooterLabel?: string;
  insightTitle?: string;
  insightDescription: string;
  insightImage?: string;
}

export const JournalSearch: React.FC<JournalSearchProps> = ({
  tagline = "THE SEARCH",
  title,
  description,
  metrics,
  exploredAreasTitle = "Areas they explored",
  exploredAreas,
  consideredAreasLabel = "Other areas they considered Kanakapura Road • Electronic City • Whitefield",
  filtersTitle = "What they filtered for",
  filters,
  filtersFooterLabel = "They were searching for the right place to begin their family's next chapter with confidence.",
  insightTitle = "What I noticed while we were searching",
  insightDescription,
  insightImage = "/journals/advisor.png",
}) => {
  return (
    <section id="search" className="w-full bg-white text-slate-900  px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-12">

        {/* Header Block */}
        <div className="w-full flex flex-col items-center pt-[24px] gap-[12px] text-center">
          <p className="text-[16px] leading-[19px] font-semibold tracking-[2px] uppercase text-[#64748B] font-inter">
            {tagline}
          </p>
          <h2 className="font-fraunces text-[28px] sm:text-[32px] leading-[34px] sm:leading-[39px] font-normal text-[#1E293B]">
            {title}
          </h2>
          <p className="max-w-[689px] text-[15px] sm:text-[16px] leading-[22px] sm:leading-[24px] font-normal text-[#64748B] font-inter">
            {description}
          </p>
        </div>

        {/* Connected 4-Segment Stats Bar */}
        <div className="w-full h-auto md:h-[64px] grid grid-cols-1 md:grid-cols-4 rounded-xl border border-[#F1F5F9] backdrop-blur-[2px] bg-gradient-to-r from-[#FCFCFC]/80 via-[#FFFFFF]/85 to-[#FCFCFC]/90 overflow-hidden shadow-xs">
          {metrics.map((item, index) => {
            const Icon = item.icon;
            const isFirst = index === 0;
            const isLast = index === metrics.length - 1;

            return (
              <div
                key={index}
                className={`h-[64px] px-4 py-3 flex items-center gap-4 border-b md:border-b-0 md:border-r border-[#F1F5F9]
                  ${isFirst ? "md:rounded-l-[12px]" : ""} 
                  ${isLast ? "border-b-0 md:border-r-0 md:rounded-r-[12px]" : ""}`}
              >
                <div className="w-[18px] h-[18px] flex items-center justify-center flex-shrink-0 text-[#FE5B39]">
                  <Icon className="w-[18px] h-[18px] stroke-[1.75]" />
                </div>
                <div className="flex flex-col gap-[2px] overflow-hidden text-left font-inter">
                  <span className="text-[10px] leading-[14px] font-medium tracking-[1px] uppercase text-[#4B5563] ">
                    {item.label}
                  </span>
                  <span className="text-[14px] leading-[20px] font-medium text-[#1F2937] ">
                    {item.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explored Areas & Filters Panel */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[534px_1fr] gap-6">

          {/* Left Panel: Areas Explored */}
          <div className="w-full border border-[#F1F5F9] rounded-[24px] p-4 sm:p-6 flex flex-col justify-between gap-8 bg-white shadow-xs">
            <div className="flex flex-col gap-6">
              <h3 className="text-[16px] leading-[19px] font-semibold text-[#334155] font-inter">
                {exploredAreasTitle}
              </h3>

              <div className="flex flex-col gap-6">
                {exploredAreas.map((area, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-start gap-[12px] w-full">
                    <div className="flex items-start gap-[12px] w-full sm:w-auto flex-1">
                      <div className="relative w-[92px] h-[93px] rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <Image
                          src={area.imageSrc}
                          alt={area.title}
                          fill
                          className="object-cover mix-blend-darken"
                        />
                      </div>
                      <div className="flex-1 flex flex-col gap-1 font-inter">
                        <h4 className="text-[14px] leading-[17px] font-semibold text-[#1E293B]">
                          {area.title}
                        </h4>
                        <p className="text-[14px] leading-[20px] font-normal text-[#64748B]">
                          {area.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-[12px] flex-shrink-0 items-center justify-end sm:justify-start w-full sm:w-auto self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F1F5F9] font-inter">
                      <div className="flex flex-col items-center">
                        <span className="text-[20px] leading-[24px] font-semibold text-[#FE5B39]">
                          {area.projects}
                        </span>
                        <span className="text-[14px] leading-[18px] font-medium text-[#64748B]">
                          Projects
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[20px] leading-[24px] font-semibold text-[#FE5B39]">
                          {area.siteVisits}
                        </span>
                        <span className="text-[14px] leading-[18px] font-medium text-[#64748B]">
                          Site visits
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full bg-[#F8FAFC] rounded-lg p-4 flex items-center justify-center font-inter">
              <p className="text-[12px] leading-[18px] font-medium text-[#64748B] text-center sm:text-left">
                {consideredAreasLabel}
              </p>
            </div>
          </div>

          {/* Right Panel: What they filtered for */}
          <div className="w-full border border-[#F1F5F9] rounded-[24px] p-4 sm:p-6 flex flex-col justify-between gap-6 bg-white shadow-xs">
            <div className="flex flex-col gap-6">
              <h3 className="text-[16px] leading-[19px] font-semibold text-[#334155] font-inter">
                {filtersTitle}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[12px] gap-y-[24px]">
                {filters.map((filter, idx) => {
                  const Icon = filter.icon;
                  return (
                    <div key={idx} className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[#FE5B39]">
                          <Icon className="w-5 h-5 stroke-[2]" />
                        </div>
                        {filter.isReraVerified && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-[#FEF9F4] rounded-full border border-[#FC3113]/20">
                            <CheckCircle2 className="w-3 h-3 text-[#FC3113]" />
                            <span className="text-[10px] leading-[12px] font-semibold uppercase text-[#FC3113] font-inter">
                              RERA Verified
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 font-inter">
                        <h4 className="text-[14px] leading-[17px] font-semibold text-[#475569]">
                          {filter.title}
                        </h4>
                        <p className="text-[14px] leading-[20px] font-semibold text-[#64748B]">
                          {filter.value}
                        </p>
                        <p className="text-[14px] leading-[20px] font-normal text-[#64748B]">
                          {filter.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="w-full bg-[#F8FAFC] rounded-lg p-4 flex items-center justify-center font-inter">
              <p className="text-[12px] leading-[18px] font-medium text-[#64748B] text-center sm:text-left">
                {filtersFooterLabel}
              </p>
            </div>
          </div>
        </div>

        {/* Insight Highlight Card */}


      </div>
    </section>
  );
};

export default JournalSearch;
