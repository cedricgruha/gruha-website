"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Play, Pause, ArrowRight, ArrowDown } from "lucide-react";

export interface LearningStat {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
}

export interface LessonItem {
  title: string;
  description: string;
  imageSrc: string;
}

export interface ComparisonItem {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  text: string;
}

export interface ActionCardItem {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
}

export interface ChatMessage {
  sender: string;
  avatar: string;
  text: string;
  isRiya?: boolean;
}

export interface JournalLearningsProps {
  tagline?: string;
  title: string;
  description: string;
  metrics: LearningStat[];
  lessonsTitle?: string;
  lessons: LessonItem[];
  beforeTitle?: string;
  beforeItems: ComparisonItem[];
  afterTitle?: string;
  afterItems: ComparisonItem[];
  differentlyTitle?: string;
  differentlyCards: ActionCardItem[];
  riyaConclusionTitle?: string;
  riyaConclusionImage?: string;
  chatMessages: ChatMessage[];
  audioLabel?: string;
  audioDurationLabel?: string;
  waveformBars?: { height: number; opacity: number }[];
  adviceTitle?: string;
  adviceStoryboardImage?: string;
  adviceDescription: string;
}

export const JournalLearnings: React.FC<JournalLearningsProps> = ({
  tagline = "LEARNINGS",
  title,
  description,
  metrics,
  lessonsTitle = "Lessons they learned",
  lessons,
  beforeTitle = "BEFORE",
  beforeItems,
  afterTitle = "AFTER",
  afterItems,
  differentlyTitle = "What they'd do differently",
  differentlyCards,
  riyaConclusionTitle = "Looking back",
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
  adviceTitle = "Advice for people like them",
  adviceStoryboardImage = "/journals/journey-storyboard.png",
  adviceDescription,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="learnings" className="w-full bg-white text-slate-900    px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-12">

        {/* Header Block */}
        <div className="w-full flex flex-col items-center pt-[24px] gap-[12px] text-center">
          <p className="text-[16px] leading-[19px] font-semibold tracking-[2px] uppercase text-[#64748B] font-inter">
            {tagline}
          </p>
          <h2 className="font-fraunces text-[28px] sm:text-[32px] leading-[34px] sm:leading-[39px] font-normal text-[#1E293B]">
            {title}
          </h2>
          <p className="max-w-[626px] text-[15px] sm:text-[16px] leading-[22px] sm:leading-[24px] font-normal text-[#64748B] font-inter">
            {description}
          </p>
        </div>

        {/* Segmented Stats Bar */}
        <div className="w-full h-auto md:h-[64px] grid grid-cols-1 md:grid-cols-4 rounded-xl border border-[#F1F5F9] backdrop-blur-[2px] bg-gradient-to-r from-[#FCFCFC]/80 via-[#FFFFFF]/85 to-[#FCFCFC]/90 overflow-hidden shadow-xs">
          {metrics.map((stat, index) => {
            const Icon = stat.icon;
            const isLast = index === metrics.length - 1;

            return (
              <div
                key={index}
                className={`h-[64px] p-3 flex flex-row items-center gap-4 border-b md:border-b-0 md:border-r border-[#F1F5F9] ${isLast ? "border-b-0 md:border-r-0" : ""
                  }`}
              >
                <div className="w-[17.45px] h-[17.45px] flex items-center justify-center shrink-0 text-[#FE5B39]">
                  <Icon className="w-[17.45px] h-[17.45px] stroke-[1.5]" />
                </div>
                <div className="flex flex-col justify-center items-start gap-1 min-w-0 flex-1 font-inter">
                  <span className="text-[10px] font-medium leading-[14px] tracking-[1px] text-[#4B5563] uppercase  w-full">
                    {stat.label}
                  </span>
                  <span className="text-[14px] font-medium leading-[20px] text-[#1F2937]  w-full">
                    {stat.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lessons Learned Card */}
        <div className="w-full p-[24px_20px] bg-white border border-[#F1F5F9] rounded-[24px] flex flex-col items-center gap-6 shadow-xs font-inter">
          <div className="w-full flex flex-row items-center gap-[10px]">
            <h3 className="text-[16px] font-semibold text-[#334155] leading-[19px] m-0">
              {lessonsTitle}
            </h3>
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {lessons.map((lesson, index) => (
              <div key={index} className="w-full max-w-[254.25px] mx-auto flex flex-col items-center gap-2">
                <div className="relative w-full h-[169.5px] rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  <Image
                    src={lesson.imageSrc}
                    alt={lesson.title}
                    fill
                    className="object-cover grayscale mix-blend-darken"
                  />
                </div>
                <div className="w-full flex flex-col justify-center items-start gap-2 py-2">
                  <h4 className="text-[14px] font-semibold text-[#1E293B] leading-[17px] m-0">
                    {lesson.title}
                  </h4>
                  <p className="text-[14px] font-normal text-[#64748B] leading-[20px] m-0">
                    {lesson.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Before / After Comparison Side-by-Side */}
        <div className="w-full flex flex-col md:flex-row items-center md:items-stretch justify-between gap-[16px] md:gap-[24px] font-inter">
          {/* Before Card */}
          <div className="w-full md:w-[534.5px] bg-[#FFF0F0] border border-[#FFDDDD] rounded-[12px] p-[16px] sm:p-[24px] flex flex-col gap-[20px] box-border shadow-xs">
            <span className="font-semibold text-[18px] leading-tight tracking-[0.6px] text-[#FF2323]">
              {beforeTitle}
            </span>
            <div className="flex flex-col gap-[16px]">
              {beforeItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="min-h-[44px] h-auto flex flex-row items-center gap-[16px]">
                    <div className="w-[44px] h-[44px] bg-[#FFDDDD] rounded-[32px] flex items-center justify-center shrink-0">
                      <Icon className="w-[24px] h-[24px] text-[#FF2323]" strokeWidth={2} />
                    </div>
                    <span className="font-semibold text-[15px] sm:text-[16px] leading-[22px] sm:leading-[24px] text-[#B10303]">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center justify-between h-[224px] w-[44px] my-auto shrink-0">
            {[...Array(4)].map((_, i) => (
              <ArrowRight key={i} className="w-[24px] h-[24px] text-[#CBD5E1]" strokeWidth={2.5} />
            ))}
          </div>

          <div className="flex md:hidden items-center justify-center py-1">
            <ArrowDown className="w-[24px] h-[24px] text-[#CBD5E1]" strokeWidth={2.5} />
          </div>

          {/* After Card */}
          <div className="w-full md:w-[534.5px] bg-[#ECFFF6] border border-[#A9FFD7] rounded-[12px] p-[16px] sm:p-[24px] flex flex-col gap-[20px] box-border shadow-xs">
            <span className="font-semibold text-[18px] leading-tight tracking-[0.6px] text-[#16A34A]">
              {afterTitle}
            </span>
            <div className="flex flex-col gap-[16px]">
              {afterItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="min-h-[44px] h-auto flex flex-row items-center gap-[16px]">
                    <div className="w-[44px] h-[44px] bg-[#DCFCE7] rounded-[32px] flex items-center justify-center shrink-0">
                      <Icon className="w-[24px] h-[24px] text-[#22C55E]" strokeWidth={2} />
                    </div>
                    <span className="font-semibold text-[15px] sm:text-[16px] leading-[22px] sm:leading-[24px] text-[#007D3F]">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* What they would do differently & Audio bubble card */}
        <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-[24px] font-inter">

          {/* Left panel: what they'd do differently */}
          <div className="w-full lg:w-[773px] bg-white border border-[#F1F5F9] rounded-[24px] p-4 sm:p-[24px] flex flex-col items-center gap-[24px] shadow-xs">
            <div className="w-full flex flex-row items-center gap-[10px]">
              <h3 className="text-[16px] font-semibold text-[#334155] leading-[19px] m-0">
                {differentlyTitle}
              </h3>
            </div>

            <div className="w-full flex flex-col sm:flex-row sm:flex-wrap items-start content-start gap-[16px]">
              {differentlyCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div
                    key={index}
                    className="w-full sm:w-[calc(50%-16px)] lg:w-[340px] min-h-[150px] bg-[#F8FAFC] border border-[#F1F5F9] rounded-[8px] p-[16px] flex flex-col justify-center items-start gap-[16px] shrink-0"
                  >
                    <div className="w-[44px] h-[44px] bg-[#FEF9F4] rounded-[12px] flex items-center justify-center shrink-0">
                      <Icon className="w-[24px] h-[24px] text-[#FE5B39]" strokeWidth={2} />
                    </div>
                    <div className="w-full flex flex-col items-start gap-[8px]">
                      <h4 className="text-[14px] font-semibold text-[#1F2937] leading-[20px] m-0">
                        {card.title}
                      </h4>
                      <p className="text-[14px] font-normal text-[#64748B] leading-[20px] m-0">
                        {card.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel: Looking back Audio panel */}
          <div
            className="relative w-full max-w-[380px] lg:w-[380px] min-h-[580px] p-[20px] rounded-[24px] flex flex-col justify-between overflow-hidden border border-[#F1F5F9] shadow-xs shrink-0 select-none gap-6 lg:gap-0"
            style={{
              background: "radial-gradient(60.66% 250.48% at 15.13% 50.27%, #FAF9FF 0%, rgba(235, 231, 255, 0.75) 100%)",
            }}
          >
            <div className="absolute w-[157px] h-[121px] right-0 top-[7px] z-0 mix-blend-darken pointer-events-none">
              <Image
                src={riyaConclusionImage}
                alt="Illustration"
                width={157}
                height={121}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="relative z-10 flex flex-col gap-[12px] w-full">
              <div className="flex flex-col justify-center items-start gap-[12px] w-full">
                <div className="w-[40px] h-[40px] flex items-center justify-center shrink-0 text-[#744FFF]">
                  <Sparkles className="w-[40px] h-[40px] stroke-[1.5]" />
                </div>
                <h3 className="w-full h-[19px] text-[16px] font-semibold leading-[19px] text-[#744FFF] m-0 flex items-center">
                  {riyaConclusionTitle}
                </h3>
              </div>

              {/* Chat messages */}
              <div className="flex flex-col items-start pt-[20px] gap-[12px] w-full">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-[4px] w-full ${msg.isRiya ? "justify-end flex-row-reverse" : ""
                      }`}
                  >
                    <div className="relative w-[32px] h-[32px] bg-white rounded-full overflow-hidden border border-black/10 shrink-0">
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
                      className={`flex flex-col justify-center items-start pl-2 pr-2 py-[4px] relative ${msg.isRiya
                        ? "bg-[#744FFF] text-white rounded-[6px] rounded-tr-[0px] p-[8px] px-[12px] max-w-[280px]"
                        : "bg-transparent text-[#2C2C2E] pl-2 pr-2 py-[4px]"
                        }`}
                    >
                      {!msg.isRiya && (
                        <span className="text-[14px] font-semibold leading-[18px] text-[#2C2C2E] block">
                          {msg.sender}
                        </span>
                      )}
                      <p className="text-[14px] font-normal leading-[20px] m-0">
                        {msg.text}
                      </p>
                      {msg.isRiya && (
                        <svg
                          className="absolute -right-[6px] top-0 text-[#744FFF]"
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
            <div className="relative z-10 w-full flex flex-col gap-[8px] pt-4">
              <div className="w-full h-[1px] bg-[#DACDF9]" />
              <p className="text-[16px] font-semibold leading-[20px] text-[#475569] m-0">
                {audioLabel}
              </p>
              <div className="flex flex-row items-center py-[16px] gap-[12px] sm:gap-[16px] w-full">
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

                <div className="flex flex-col justify-start items-start gap-[4px] w-full max-w-[284px] h-[51px] overflow-hidden">
                  <div className="flex flex-row justify-between items-end gap-[1px] sm:gap-[2px] w-full h-[32px]">
                    {waveformBars.map((bar, index) => (
                      <div
                        key={index}
                        className="bg-[#744FFF] rounded-full shrink-0"
                        style={{
                          width: "11px",
                          height: `${bar.height}px`,
                          opacity: isPlaying ? bar.opacity : bar.opacity * 0.7,
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex flex-col gap-[2px] w-full">
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

        {/* Advice for people like them */}
        <div className="box-border flex flex-col items-center p-4 sm:p-6 gap-4 sm:gap-6 w-full border border-[#F1F5F9] rounded-[24px] bg-white shadow-xs font-inter">
          <div className="flex flex-row items-center p-0 gap-[10px] w-full shrink-0">
            <h3 className="text-[16px] font-semibold leading-[19px] text-[#334155] m-0">
              {adviceTitle}
            </h3>
          </div>
          <div className="w-full h-[200px] sm:h-[280px] lg:h-[325.65px] relative shrink-0 overflow-hidden flex items-center justify-center rounded-xl bg-slate-50">
            <Image
              src={adviceStoryboardImage}
              alt="Advice storyboard"
              fill
              className="object-contain lg:object-cover lg:object-top grayscale mix-blend-darken"
            />
          </div>
          <p className="w-full text-[15px] sm:text-[16px] font-normal leading-[22px] sm:leading-[24px] text-[#64748B] m-0">
            {adviceDescription}
          </p>
        </div>

      </div>
    </section>
  );
};

export default JournalLearnings;
