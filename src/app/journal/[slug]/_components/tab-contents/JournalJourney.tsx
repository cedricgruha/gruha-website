"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";

export interface MomentItem {
  id: string;
  title: string;
  desc: React.ReactNode;
  imageSrc: string;
}

export interface RoadmapNode {
  id: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  x: number; // Viewbox X (0 to 1000)
  y: number; // Viewbox Y (0 to 800)
  width: number;
}

export interface MetricItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

export interface QuoteItem {
  text: string;
  author: string;
}

export interface ChatMessage {
  sender: string;
  avatar: string;
  text: string;
  isRiya?: boolean;
}

export interface RealityCheckItem {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
}

export interface TimelineStep {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  tag?: string;
}

export interface JournalJourneyProps {
  tagline?: string;
  title: string;
  description: string;
  metrics: MetricItem[];
  roadmapTitle?: string;
  roadmapNodes: RoadmapNode[];
  timelineTitle?: string;
  timelineSteps: TimelineStep[];
  momentsTitle?: string;
  moments: MomentItem[];
  voicesTitle?: string;
  quotes: QuoteItem[];
  riyaConclusionTitle?: string;
  riyaConclusionImage?: string;
  chatMessages: ChatMessage[];
  audioLabel?: string;
  audioDurationLabel?: string;
  waveformBars?: { height: number; opacity: number }[];
  realityChecksTitle?: string;
  realityChecks: RealityCheckItem[];
}

export const JournalJourney: React.FC<JournalJourneyProps> = ({
  tagline = "THE JOURNEY SO FAR",
  title,
  description,
  metrics,
  roadmapTitle = "How their journey actually unfolded",
  roadmapNodes,
  timelineTitle = "Where they stand today",
  timelineSteps,
  momentsTitle = "Moments that changed everything",
  moments,
  voicesTitle = "Voices around them",
  quotes,
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
  realityChecksTitle = "Reality checks along the way",
  realityChecks,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="journey" className="w-full bg-white text-slate-900   px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1177px] space-y-12">

        {/* Header Section */}
        <div className="w-full max-w-[1177px] mx-auto flex flex-col items-center pb-[30px] gap-[30px]">
          <div className="flex flex-col items-center pt-[24px] gap-[12px] w-full max-w-[580px] text-center">
            <div className="flex flex-col items-center gap-[8px] w-full">
              <p className="text-[16px] leading-[19px] font-semibold tracking-[2px] uppercase text-[#64748B] font-inter">
                {tagline}
              </p>
              <h2 className="text-[32px] leading-[39px] font-fraunces font-normal text-[#1E293B]">
                {title}
              </h2>
            </div>
            <p className="text-[16px] leading-[24px] font-normal text-[#64748B] max-w-[526px] font-inter">
              {description}
            </p>
          </div>
        </div>

        {/* Top Metric Bar */}
        <div className="w-full max-w-[1177px] h-auto min-h-[74px] bg-gradient-to-r from-[#FCFCFC]/80 via-[#FFFFFF]/80 to-[#FCFCFC]/90 backdrop-blur-[2px] rounded-2xl md:rounded-[12px] border border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#F1F5F9] shadow-xs">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div key={idx} className="flex items-center gap-[16px] p-[12px] sm:px-[16px]">
                <div className="flex items-center justify-center w-[18px] h-[18px] text-[#FE5B39] shrink-0">
                  <Icon className="w-full h-full stroke-[2]" />
                </div>
                <div className="flex flex-col justify-center gap-[4px]">
                  <span className="text-[10px] leading-[14px] font-medium tracking-[1px] text-[#4B5563] uppercase font-inter">
                    {metric.label}
                  </span>
                  <span className="text-[14px] leading-[20px] font-medium text-[#1F2937] font-inter">
                    {metric.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Snake Roadmap */}
        <div className="w-full border border-[#F1F5F9] rounded-[24px] bg-white p-5 sm:p-8">
          <div className="flex items-center gap-[10px] mb-6">
            <h3 className="font-bold text-[18px] leading-[22px] text-[#1E293B] font-inter">
              {roadmapTitle}
            </h3>
          </div>

          {/* MOBILE ROADMAP */}
          <div className="flex flex-col gap-6 md:hidden">
            {roadmapNodes.map((stage, idx) => {
              const Icon = stage.icon;
              const isLast = idx === roadmapNodes.length - 1;

              return (
                <div key={stage.id} className="relative flex items-start gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="flex items-center justify-center w-[52px] h-[52px] bg-[#F1F5F9] rounded-[18px] z-10">
                      <Icon className="w-[24px] h-[24px] text-[#475569]" strokeWidth={1.8} />
                    </div>
                    {!isLast && (
                      <div className="w-[2px] bg-slate-200 flex-1 my-2 min-h-[36px]" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1 pt-1">
                    <h4 className="font-semibold text-[15px] leading-[20px] text-[#334155] font-inter">
                      {stage.title}
                    </h4>
                    <p className="font-medium text-[13px] leading-[18px] text-[#64748B] font-inter">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP ROADMAP (SVG Snaking Path) */}
          <div className="hidden md:block relative w-full aspect-[1000/800] max-h-[820px]">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              viewBox="0 0 1000 800"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="7"
                  markerHeight="7"
                  refX="5"
                  refY="3.5"
                  orient="auto"
                >
                  <path
                    d="M 1 1 L 6 3.5 L 1 6"
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </marker>
              </defs>

              {/* Main Path: Top Row */}
              <path
                d="M 130 110 C 190 60, 270 190, 340 160 C 420 120, 480 180, 560 150 C 640 120, 680 140, 740 130 C 820 120, 880 190, 880 290"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="2.2"
                strokeDasharray="6 6"
                strokeLinecap="round"
              />

              {/* Loop under Budget Shock */}
              <path
                d="M 880 290 C 800 370, 860 520, 930 450 C 980 400, 970 330, 950 335"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="2.2"
                strokeDasharray="6 6"
                strokeLinecap="round"
                markerEnd="url(#arrowhead)"
              />

              {/* Path: Budget Shock area to Back to Research */}
              <path
                d="M 880 290 C 830 350, 780 390, 710 400 C 630 410, 580 420, 510 430 C 440 440, 390 440, 330 450"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="2.2"
                strokeDasharray="6 6"
                strokeLinecap="round"
              />

              {/* Teardrop Loop above Back to Research */}
              <path
                d="M 330 450 C 270 370, 320 340, 345 380 C 355 400, 348 415, 345 422"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="2.2"
                strokeDasharray="6 6"
                strokeLinecap="round"
                markerEnd="url(#arrowhead)"
              />

              {/* Path: Back to Research to Current Position */}
              <path
                d="M 330 450 C 240 480, 190 520, 150 580 C 110 650, 230 730, 320 710 C 400 690, 460 760, 530 740"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="2.2"
                strokeDasharray="6 6"
                strokeLinecap="round"
              />
            </svg>

            {roadmapNodes.map((stage) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.id}
                  className="absolute z-10 flex flex-col items-center pointer-events-auto"
                  style={{
                    left: `${(stage.x / 1000) * 100}%`,
                    top: `${(stage.y / 800) * 100}%`,
                    width: `${stage.width}px`,
                    transform: "translate(-50%, -27px)",
                  }}
                >
                  <div
                    className="flex items-center justify-center w-[54px] h-[54px] bg-[#F1F5F9] rounded-[18px] mb-2 shrink-0 transition-transform duration-200 hover:scale-105"
                    style={{ boxShadow: "0 0 0 8px #ffffff" }}
                  >
                    <Icon className="w-[26px] h-[26px] text-[#475569]" strokeWidth={1.75} />
                  </div>
                  <div className="flex flex-col items-center text-center gap-0.5 w-full">
                    <h4 className="font-semibold text-[14px] leading-[18px] text-[#334155] font-inter">
                      {stage.title}
                    </h4>
                    <p className="font-medium text-[13px] leading-[17px] text-[#64748B] font-inter">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Moments & Voices Grid */}
        <div className="w-full max-w-[1177px] mx-auto space-y-6">

          {/* Moments Cards */}
          <div className="w-full border border-[#F1F5F9] rounded-[24px] bg-white p-5 sm:p-6 space-y-6">
            <h3 className="text-[16px] leading-[19px] font-semibold text-[#334155] font-inter">
              {momentsTitle}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {moments.map((moment) => (
                <div key={moment.id} className="flex flex-col gap-2">
                  <div className="relative w-full h-[169.5px] rounded-[16px] overflow-hidden bg-slate-100">
                    <Image
                      src={moment.imageSrc}
                      alt={moment.title}
                      fill
                      className="object-cover grayscale contrast-[1.05]"
                    />
                  </div>
                  <div className="flex flex-col gap-2 pt-1">
                    <h4 className="text-[14px] leading-[17px] font-semibold text-[#1E293B] font-inter">
                      {moment.title}
                    </h4>
                    <p className="text-[14px] leading-[20px] font-normal text-[#64748B] font-inter">
                      {moment.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* where they stand today */}
          <div className="w-full border border-[#F1F5F9] rounded-[24px] bg-white p-6 space-y-6 overflow-hidden">
            <h3 className="text-[16px] leading-[19px] font-semibold text-[#334155] font-inter">
              {timelineTitle}
            </h3>

            {/* Responsive Horizontal Stepper Container */}
            <div className="relative flex items-center justify-between w-full min-h-[85px] overflow-x-auto pb-4 pt-8 scrollbar-none">
              {timelineSteps.map((step, index) => {
                const IconComponent = step.icon;
                const isLast = index === timelineSteps.length - 1;

                return (
                  <React.Fragment key={step.id}>
                    {/* Step Item */}
                    <div className="relative flex flex-col items-center gap-3 min-w-[75px] shrink-0 z-10">

                      {/* Tooltip Active Tag */}
                      {step.tag && (
                        <div className="absolute -top-[34px] left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                          <div className="bg-black text-white text-[12px] leading-[15px] font-semibold px-3 py-1 rounded-[5px] whitespace-nowrap shadow-md font-inter">
                            {step.tag}
                          </div>
                          {/* Downward Arrow Triangle */}
                          <div className="w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-black" />
                        </div>
                      )}

                      {/* Icon Circle Box */}
                      <div
                        className={`flex items-center justify-center w-[56px] h-[56px] rounded-full transition-all duration-300 ${step.active
                          ? 'bg-[#FF7E57] text-white shadow-xs'
                          : 'bg-[#F8FAFC] border border-[#F1F5F9] text-[#64748B]'
                          }`}
                      >
                        <IconComponent className="w-[26px] h-[26px]" />
                      </div>

                      {/* Label */}
                      <span
                        className={`text-[14px] leading-[17px] font-semibold text-center whitespace-nowrap font-inter ${step.active ? 'text-[#475569]' : 'text-[#475569]'
                          }`}
                      >
                        {step.label}
                      </span>
                    </div>

                    {/* Dashed Connecting Line with Arrow head */}
                    {!isLast && (
                      <div className="flex-1 flex items-center justify-center min-w-[30px] sm:min-w-[50px] px-1 mb-[28px] shrink-0">
                        <div className="w-full flex items-center">
                          <div className="w-full border-t-2 border-dashed border-[#94A3B8]" />
                          {/* Arrowhead Indicator */}
                          <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-[#94A3B8] -ml-[2px]" />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Voices & Product Card Section */}
          <div className="w-full max-w-[1177px] min-h-[406.76px] mx-auto flex flex-col lg:flex-row items-stretch gap-6">

            {/* Voices Card */}
            <div className="w-full lg:w-[719px] min-h-[406.76px] border border-[#F1F5F9] bg-white rounded-[24px] p-6 flex flex-col justify-between">
              <h3 className="text-[16px] leading-[19px] font-semibold text-[#334155] font-inter">
                {voicesTitle}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[32px] gap-y-[40px] pt-4 pb-2">
                {quotes.map((quote, idx) => (
                  <div key={idx} className="relative flex flex-col gap-4 w-full max-w-[300px]">
                    <span className="absolute -top-[21px] -left-[18px] text-[82px] leading-none font-bold text-[#FF7E57] opacity-12 pointer-events-none select-none font-serif">
                      “
                    </span>
                    <p className="font-serif text-[18px] leading-[120%] tracking-[-0.02em] text-[#101828] z-10">
                      "{quote.text}"
                    </p>
                    <p className="text-[16px] leading-[150%] font-bold text-[#475569] z-10 font-inter">
                      {quote.author}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Riya Conclusion Chat & Audio */}
            <div className="relative w-full lg:w-[434px] min-h-[406.76px] rounded-[24px] p-5 flex flex-col justify-between overflow-hidden bg-[radial-gradient(60.66%_250.48%_at_15.13%_50.27%,#FAF9FF_0%,rgba(235,231,255,0.75)_100%)] border border-[#F1F5F9]">
              <div className="absolute top-0 right-[10px] w-[184px] h-[123px] pointer-events-none z-0">
                <Image
                  src={riyaConclusionImage}
                  alt="Riya Illustration"
                  fill
                  className="object-contain mix-blend-darken"
                />
              </div>

              <div className="relative z-10 space-y-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[#8B5CF6]">
                  <Image
                    src="/journals/Logo.png"
                    alt="Riya Logo"
                    width={28}
                    height={28}
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <h3 className="text-[16px] leading-[19px] font-semibold text-[#8B5CF6] font-inter">
                  {riyaConclusionTitle}
                </h3>
              </div>

              {/* Chat Thread */}
              <div className="relative z-10 my-4 space-y-3">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2 max-w-[394px] ${msg.isRiya ? "justify-end ml-auto flex-row-reverse" : ""
                      }`}
                  >
                    <div className="relative w-[23.8px] h-[23.8px] rounded-full overflow-hidden border border-black/10 flex-shrink-0 bg-white">
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
                      className={`flex flex-col p-3 text-[14px] leading-[20px] max-w-[335px] relative ${msg.isRiya
                        ? "bg-[#8B5CF6] text-white rounded-l-[12px] rounded-br-[12px] rounded-tr-[12px]"
                        : "bg-[#F2F2F7] text-[#2C2C2E] rounded-r-[12px] rounded-bl-[12px]"
                        }`}
                    >
                      <span className="font-semibold text-[14px] leading-[13px] mb-1 font-inter">
                        {msg.sender}
                      </span>
                      <span className="font-inter font-medium">{msg.text}</span>
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

              <div className="w-full h-[1px] bg-[#DACDF9] my-1" />

              <p className="text-[16px] font-semibold leading-[20px] text-[#475569] m-0 pt-1 font-inter">
                {audioLabel}
              </p>

              {/* Audio Controls */}
              <div className="flex flex-row items-center gap-4 w-full h-[72px]">
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

                  <div className="flex flex-col gap-1 w-full font-inter">
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

        {/* Reality Checks */}
        <div className="w-full max-w-[1177px] border border-[#F1F5F9] bg-white rounded-[24px] p-6 flex flex-col gap-6">
          <h3 className="text-[16px] leading-[19px] font-semibold text-[#334155] font-inter">
            {realityChecksTitle}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
            {realityChecks.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex flex-col items-center gap-4 text-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-8 h-8 text-[#FF7E57] stroke-[1.75]" />
                  </div>
                  <div className="flex flex-col items-center gap-2 w-full">
                    <h4 className="text-[14px] leading-[17px] font-semibold text-[#475569] font-inter">
                      {item.title}
                    </h4>
                    <p className="text-[14px] leading-[20px] font-medium text-[#64748B] font-inter">
                      {item.description}
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

export default JournalJourney;
