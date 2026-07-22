"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Play, Pause } from "lucide-react";

export interface ProjectMetric {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
}

export interface SearchPriority {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  subtitle: string;
}

export interface ChatMessage {
  sender: string;
  avatar: string;
  text: string;
  isRiya?: boolean;
}

export interface ExploredProject {
  title: string;
  imageSrc: string;
  isOverlay?: boolean;
  overlayText?: string;
  overlaySubtext?: string;
}

export interface RejectedReason {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  count: string;
}

export interface JournalProjectsProps {
  tagline?: string;
  title: string;
  description: string;
  metrics: ProjectMetric[];
  prioritiesTitle?: string;
  priorities: SearchPriority[];
  riyaConclusionTitle?: string;
  riyaConclusionImage?: string;
  chatMessages: ChatMessage[];
  audioLabel?: string;
  audioDurationLabel?: string;
  waveformBars?: { height: number; opacity: number }[];
  whereTheySearchedTitle?: string;
  mapImageSrc?: string;
  projectsTitle?: string;
  projectsCountBadge?: string;
  projects: ExploredProject[];
  rejectedTitle?: string;
  rejectedReasons: RejectedReason[];
  suggestionTitle?: string;
  suggestionDescription: string;
  suggestionImageSrc?: string;
}

export const JournalProjects: React.FC<JournalProjectsProps> = ({
  tagline = "THE PROJECTS",
  title,
  description,
  metrics,
  prioritiesTitle = "What mattered most in their search",
  priorities,
  riyaConclusionTitle = "Why Riya concluded this",
  riyaConclusionImage = "/journals/riya.png",
  chatMessages,
  audioLabel = "Hear entire conversation (94 sec)",
  audioDurationLabel = "1:32",
  waveformBars = [
    { height: 12, opacity: 0.4 },
    { height: 12, opacity: 0.4 },
    { height: 20, opacity: 1.0 },
    { height: 20, opacity: 1.0 },
    { height: 28, opacity: 1.0 },
    { height: 28, opacity: 1.0 },
    { height: 16, opacity: 1.0 },
    { height: 16, opacity: 1.0 },
    { height: 24, opacity: 1.0 },
    { height: 24, opacity: 1.0 },
    { height: 32, opacity: 1.0 },
    { height: 32, opacity: 1.0 },
    { height: 20, opacity: 0.6 },
    { height: 20, opacity: 0.6 },
    { height: 20, opacity: 0.6 },
    { height: 20, opacity: 0.6 },
    { height: 12, opacity: 0.4 },
    { height: 12, opacity: 0.4 },
    { height: 12, opacity: 0.4 },
    { height: 24, opacity: 0.3 },
    { height: 24, opacity: 0.3 },
  ],
  whereTheySearchedTitle = "Where they searched",
  mapImageSrc = "/journals/search-map.png",
  projectsTitle = "Projects they explored",
  projectsCountBadge = "19 projects",
  projects,
  rejectedTitle = "Why some projects didn't make the cut",
  rejectedReasons,
  suggestionTitle = "Riya's suggestion",
  suggestionDescription,
  suggestionImageSrc = "/journals/advisor.png",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="projects" className="w-full bg-white text-slate-900  px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-12">

        {/* Header content */}
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
            const isLast = index === metrics.length - 1;

            return (
              <div
                key={index}
                className={`h-[64px] flex flex-row items-center p-3 gap-4 border-b md:border-b-0 md:border-r border-[#F1F5F9] ${isLast ? "border-b-0 md:border-r-0" : ""
                  }`}
              >
                <div className="w-[18px] h-[18px] flex items-center justify-center text-[#FE5B39] flex-shrink-0">
                  <Icon className="w-[18px] h-[18px] stroke-[1.75]" />
                </div>
                <div className="flex flex-col items-start gap-[2px] text-left overflow-hidden font-inter">
                  <span className="text-[10px] leading-[14px] font-medium text-[#4B5563] tracking-[1px] uppercase truncate">
                    {item.label}
                  </span>
                  <span className="text-[14px] leading-[20px] font-medium text-[#1F2937] truncate">
                    {item.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Priorities & Conversation Card Row */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-6 font-inter">

          {/* Left Panel: What mattered most */}
          <div className="w-full lg:w-[719px] min-h-[417.84px] p-6 bg-white border border-[#F1F5F9] rounded-[24px] flex flex-col justify-start items-start gap-6 shadow-xs">
            <h3 className="text-[16px] font-semibold text-[#334155] leading-[19px]">
              {prioritiesTitle}
            </h3>

            <div className="w-full max-w-[671px] grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6 pt-2">
              {priorities.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="w-full h-[91px] flex flex-col items-center gap-3 rounded-[16px]">
                    <div className="w-[30px] h-[30px] flex items-center justify-center rounded-full text-[#FF7E57]">
                      <Icon className="w-[20px] h-[20px] stroke-[2]" />
                    </div>
                    <div className="w-full h-[45px] flex flex-col items-center gap-[2px]">
                      <span className="text-[14px] font-semibold text-[#475569] leading-[17px] text-center">
                        {item.title}
                      </span>
                      <span className="text-[14px] font-medium text-[#64748B] leading-[20px] text-center">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Riya Conclusion Chat & Audio */}
          <div
            className="relative w-full lg:w-[434px] min-h-[417.84px] p-5 rounded-[24px] flex flex-col justify-between overflow-hidden border border-[#F1F5F9] shadow-xs"
            style={{
              background: "radial-gradient(60.66% 250.48% at 15.13% 50.27%, #FAF9FF 0%, rgba(235, 231, 255, 0.75) 100%)",
            }}
          >
            <div className="absolute top-0 right-0 w-[147px] h-[98px] pointer-events-none z-10 mix-blend-darken">
              <Image
                src={riyaConclusionImage}
                alt="Riya Illustration"
                width={147}
                height={98}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="relative z-20 flex flex-col gap-3 w-full">
              <div className="flex flex-col items-start gap-2 w-full">
                <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[#8B5CF6]">
                  <Sparkles className="w-[28px] h-[28px] stroke-[1.75]" />
                </div>
                <h3 className="text-[16px] font-semibold leading-[19px] text-[#8B5CF6]">
                  {riyaConclusionTitle}
                </h3>
              </div>

              {/* Chat Thread */}
              <div className="flex flex-col items-start gap-3 w-full pt-1">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2.5 w-full ${msg.isRiya ? "justify-end flex-row-reverse" : ""
                      }`}
                  >
                    <div className="relative w-[32px] h-[32px] shrink-0 bg-white rounded-full overflow-hidden border border-black/10">
                      <Image
                        src={msg.avatar}
                        alt={msg.sender}
                        fill
                        className={
                          msg.isRiya
                            ? "object-cover object-[50%_15%] scale-[2.3] origin-top"
                            : "object-cover"
                        }
                      />
                    </div>
                    <div
                      className={`flex flex-col p-3 max-w-[320px] relative ${msg.isRiya
                          ? "bg-[#8B5CF6] text-white rounded-2xl rounded-tr-none"
                          : "bg-[#F2F2F7] text-[#2C2C2E] rounded-2xl rounded-tl-none"
                        }`}
                    >
                      <span className="text-[14px] font-semibold leading-[14px] mb-1">
                        {msg.sender}
                      </span>
                      <p className="text-[14px] font-normal leading-[20px] m-0">
                        {msg.text}
                      </p>
                      {msg.isRiya && (
                        <svg
                          className="absolute -right-[6px] top-0 text-[#8B5CF6]"
                          width="15"
                          height="12"
                          viewBox="0 0 15 12"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M6.00034 0C6.00034 0 11.7383 0 13.2003 0C14.6624 0 15.0003 1.5 13.6503 3C12.3003 4.5 6.4997 9.5 6.00034 11C5.50098 12.5 6.00034 0 6.00034 0Z" />
                          <rect width="6" height="12" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audio Scrubber */}
            <div className="relative z-20 w-full flex flex-col gap-2 pt-2">
              <div className="w-full h-[1px] bg-[#DACDF9]" />
              <p className="text-[16px] font-semibold leading-[20px] text-[#475569] m-0 pt-1">
                {audioLabel}
              </p>
              <div className="flex flex-row items-center gap-4 w-full h-[52px]">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-[40px] h-[40px] rounded-full bg-[#744FFF] shadow-sm flex items-center justify-center shrink-0 border-none cursor-pointer hover:bg-[#622BFC] transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-[12px] h-[14px] fill-white text-white" />
                  ) : (
                    <Play className="w-[12px] h-[14px] fill-white text-white translate-x-[1px]" />
                  )}
                </button>

                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="flex flex-row justify-between items-end h-[32px] w-full gap-[2px]">
                    {waveformBars.map((bar, index) => (
                      <div
                        key={index}
                        className="flex-1 bg-[#744FFF] rounded-full"
                        style={{
                          height: `${bar.height}px`,
                          opacity: isPlaying ? bar.opacity : bar.opacity * 0.7,
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <div className="relative w-full h-[4px] bg-[#DCD0FB] rounded-full overflow-hidden">
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-[#622BFC] rounded-full transition-all duration-300"
                        style={{ width: isPlaying ? "66%" : "33%" }}
                      />
                    </div>
                    <div className="flex justify-between items-center w-full text-[10px] font-bold text-[#64748B]">
                      <span>{isPlaying ? "1:01" : "0:32"}</span>
                      <span>{audioDurationLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map & Explored Projects Row */}
        <div className="w-full flex flex-col lg:flex-row justify-start items-stretch gap-6 font-inter">

          {/* Left panel: Where they searched */}
          <div className="w-full lg:w-[506px] h-[523.38px] p-6 bg-white border border-[#F1F5F9] rounded-[24px] flex flex-col justify-between items-center shadow-xs shrink-0">
            <div className="w-full flex flex-row justify-between items-center h-[19px] mb-4">
              <h3 className="text-[16px] font-semibold text-[#334155] leading-[19px] m-0">
                {whereTheySearchedTitle}
              </h3>
            </div>
            <div className="relative w-full h-[417.47px] rounded-[16px] overflow-hidden bg-[#F8FAFC]">
              <Image
                src={mapImageSrc}
                alt="Where they searched map"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right panel: Projects they explored */}
          <div className="w-full lg:w-[647px] h-[523.38px] p-6 bg-white border border-[#F1F5F9] rounded-[24px] flex flex-col justify-between items-center shadow-xs flex-1">
            <div className="w-full flex flex-col gap-6">
              <div className="w-full flex flex-row justify-between items-center h-[24px]">
                <h3 className="text-[16px] font-semibold text-[#334155] leading-[19px] m-0">
                  {projectsTitle}
                </h3>
                <div className="px-2 py-1 bg-[#F1F5F9] rounded-[48px] flex items-center justify-center">
                  <span className="text-[12px] font-medium text-[#334155] leading-[16px]">
                    {projectsCountBadge}
                  </span>
                </div>
              </div>

              {/* Projects Grid Container (2x2 Grid) */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 w-full h-[335.38px]">
                {projects.map((proj, idx) => (
                  <div key={idx} className="flex flex-col gap-[8.33px] w-full">
                    <div className="relative w-full h-[134.36px] rounded-[13.23px] overflow-hidden bg-[#F1F5F9]">
                      <Image
                        src={proj.imageSrc}
                        alt={proj.title}
                        fill
                        className="object-cover"
                      />
                      {proj.isOverlay && (
                        <div className="absolute inset-0 bg-gradient-to-b from-[#64748B]/95 to-[#334155]/95 flex flex-col items-center justify-center text-white">
                          <span className="text-[40px] font-semibold leading-[48px] tracking-tight">
                            {proj.overlayText}
                          </span>
                          <span className="text-[16px] font-semibold leading-[19px]">
                            {proj.overlaySubtext}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-[14px] font-semibold text-[#475569] leading-[17px] text-center m-0">
                      {proj.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full h-[68px] bg-[#F8FAFC] rounded-[4px] p-4 flex flex-row items-center gap-[10px] box-border">
              <div className="w-[32px] h-[32px] bg-[#E2E8F0] rounded-[8.73px] flex items-center justify-center shrink-0 text-[#64748B]">
                <svg
                  className="w-[17.45px] h-[17.45px] stroke-[1.8]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-1.769-1.019l-9.351-9.351a2.25 2.25 0 013.182-3.182l9.351 9.351a2.25 2.25 0 01-3.182 3.182z"
                  />
                </svg>
              </div>
              <p className="text-[12px] font-medium text-[#64748B] leading-[18px] m-0 flex-1">
                They compared each project on location, price, amenities, builder reputation, possession timeline and more.
              </p>
            </div>
          </div>
        </div>

        {/* Why some projects didn't make the cut */}
        <div className="w-full h-auto lg:h-[155px] p-6 bg-white border border-[#F1F5F9] rounded-[24px] flex flex-col justify-between items-start gap-6 shadow-xs font-inter">
          <h3 className="text-[16px] font-semibold text-[#334155] leading-[19px] m-0">
            {rejectedTitle}
          </h3>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {rejectedReasons.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="w-full h-[64px] px-3 py-3 bg-[#F8FAFC] border border-[#F1F5F9] rounded-[8px] flex flex-row items-center gap-4 box-border"
                >
                  <div className="w-[17.45px] h-[17.45px] flex items-center justify-center shrink-0 text-[#FE5B39]">
                    <Icon className="w-[17.45px] h-[17.45px] stroke-[1.5]" />
                  </div>
                  <div className="flex flex-col justify-center items-start gap-1 flex-1 min-w-0">
                    <span className="text-[12px] font-semibold text-[#4B5563] leading-[14px] truncate w-full">
                      {item.title}
                    </span>
                    <span className="text-[14px] font-medium text-[#1F2937] leading-[20px] truncate w-full">
                      {item.count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Advisor Suggestion Card */}
        <div
          className="relative w-full rounded-[24px] p-5 overflow-hidden flex flex-row items-center justify-between border border-[#F1F5F9] shadow-xs font-inter"
          style={{
            background: "radial-gradient(60.66% 250.48% at 15.13% 50.27%, #FAF9FF 0%, rgba(235, 231, 255, 0.75) 100%)",
          }}
        >
          <div className="relative z-10 w-full max-w-[772px] flex flex-col justify-center items-start gap-3">
            <div className="w-[40px] h-[40px] flex items-center justify-center shrink-0">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 3.33334L18.88 12.4533L28 15.3333L18.88 18.2133L16 27.3333L13.12 18.2133L4 15.3333L13.12 12.4533L16 3.33334Z"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.33331 4L6.50664 7.70667L10.2133 8.88L6.50664 10.0533L5.33331 13.76L4.15998 10.0533L0.453308 8.88L4.15998 7.70667L5.33331 4Z"
                  fill="#8B5CF6"
                />
              </svg>
            </div>
            <h3 className="text-[16px] font-semibold text-[#8B5CF6] leading-[19px] m-0">
              {suggestionTitle}
            </h3>
            <p className="text-[14px] font-medium text-[#8B5CF6] leading-[22px] m-0">
              {suggestionDescription}
            </p>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-[278px] h-full pointer-events-none hidden md:block">
            <Image
              src={suggestionImageSrc}
              alt="Riya Advisor"
              fill
              className="object-contain object-bottom mix-blend-multiply"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default JournalProjects;
