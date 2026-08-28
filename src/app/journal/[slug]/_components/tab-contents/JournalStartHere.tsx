"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export interface StartStep {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
  imageHeight?: string;
  goalHeight?: string;
  descHeight?: string;
}

export interface ValuePropItem {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

export interface JournalStartHereProps {
  tagline?: string;
  title: string;
  description: string;
  stepsTitle?: string;
  steps: StartStep[];
  valuePropsTitle?: string;
  valueProps: ValuePropItem[];
  blankTitle?: string;
  blankDescription: string;
  blankActionText?: string;
  blankImageSrc?: string;
  ctaTitle?: string;
  ctaDescription: string;
  ctaButtonText?: string;
  ctaCharacterImage?: string;
}

export const JournalStartHere: React.FC<JournalStartHereProps> = ({
  tagline = "START HERE",
  title,
  description,
  stepsTitle = "Your conversation becomes your journal",
  steps,
  valuePropsTitle = "What mattered most in their search",
  valueProps,
  blankTitle = "This page is still blank.",
  blankDescription,
  blankActionText = "Let's write it together.",
  blankImageSrc = "/journals/open-book-illustration.png",
  ctaTitle = "Ready to write your story?",
  ctaDescription,
  ctaButtonText = "Copy Journal",
  ctaCharacterImage = "/journals/riya-full-character.png",
}) => {
  return (
    <section id="start-here" className="w-full bg-white text-slate-900  px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-12">

        {/* Header Block */}
        <div className="w-full flex flex-col items-center pt-4 lg:pt-[24px] gap-[12px] text-center">
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

        {/* Steps Flow Box */}
        <div className="w-full p-4 sm:px-[20px] sm:py-[24px] gap-[24px] border border-[#F1F5F9] rounded-[24px] bg-white shadow-xs font-inter flex flex-col">
          <div className="w-full flex flex-row items-center gap-[10px]">
            <h3 className="text-[16px] font-semibold text-[#334155] leading-[19px] m-0">
              {stepsTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row items-start gap-[16px] w-full">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex flex-col items-center gap-[8px] w-full lg:w-[272.25px] min-h-[320px] bg-[#F8FAFC] rounded-[12px] overflow-hidden shrink-0 flex-1 border border-[#F8FAFC] shadow-2xs"
              >
                <div className="relative w-full h-[180px] shrink-0 overflow-hidden bg-transparent">
                  <Image
                    src={step.imageSrc}
                    alt={step.title}
                    fill
                    className="object-contain mix-blend-darken grayscale"
                  />
                </div>
                <div className="flex flex-col p-4 gap-[8px] w-full">
                  <h4 className="text-[14px] font-semibold text-[#1E293B] leading-[17px] m-0">
                    {step.title}
                  </h4>
                  <p className="text-[14px] font-normal text-[#64748B] leading-[20px] m-0">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Value Props Bar */}
        <div className="w-full p-6 sm:p-8 gap-6 border border-slate-100 rounded-[24px] bg-white font-inter shadow-xs flex flex-col">
          <h3 className="text-base sm:text-lg font-semibold text-slate-700 m-0 text-center sm:text-left">
            {valuePropsTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-4 w-full">
            {valueProps.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex flex-col items-center p-2 gap-3 w-full text-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-50 shrink-0 text-[#FE5B39]">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div className="flex flex-col items-center gap-1.5 w-full">
                    <h4 className="text-sm font-semibold leading-snug text-slate-700 m-0">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm font-normal leading-relaxed text-slate-500 m-0">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Blank Page Section */}
        <div className="flex flex-col-reverse md:flex-row justify-center items-center md:items-start w-full bg-[#F8FAFC] border border-[#F1F5F9] rounded-[24px] overflow-hidden shadow-xs font-inter">
          <div className="flex flex-col justify-center items-start p-6 sm:p-8 gap-[16px] sm:gap-[24px] w-full md:w-[668px] h-full flex-1">
            <h3 className="w-full font-semibold text-[20px] sm:text-[24px] leading-[26px] sm:leading-[29px] text-[#334155] m-0">
              {blankTitle}
            </h3>
            <div className="w-full text-[15px] sm:text-[16px] leading-[22px] sm:leading-[24px] text-[#64748B] flex flex-col gap-3">
              <p className="font-normal m-0">
                {blankDescription}
              </p>
              <p className="font-semibold text-[#FE5B39] m-0">
                {blankActionText}
              </p>
            </div>
          </div>
          <div className="relative w-full md:w-[509px] h-[220px] sm:h-[297px] shrink-0 p-4 md:p-0">
            <Image
              src={blankImageSrc}
              alt="Blank journal book illustration"
              fill
              className="object-contain mix-blend-darken grayscale"
            />
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="flex flex-col md:flex-row justify-between items-stretch w-full bg-[#7142F1] rounded-[24px] overflow-hidden shadow-xs font-inter text-white">
          <div className="relative w-full md:w-[349px] h-[250px] md:h-[309px] shrink-0">
            <div className="absolute inset-0 bg-gradient-to-t from-[#7142F1] via-transparent to-transparent z-10 md:hidden" />
            <Image
              src={ctaCharacterImage}
              alt="Riya Advisor"
              fill
              className="object-cover object-top"
              priority
            />
          </div>

          <div className="flex flex-col justify-center items-start p-6 sm:p-8 gap-[20px] md:gap-[32px] flex-1">
            <div className="flex flex-col items-start gap-[12px] w-full">
              <h3 className="font-semibold text-[26px] sm:text-[32px] leading-[32px] sm:leading-[39px] m-0">
                {ctaTitle}
              </h3>
              <p className="font-normal text-[15px] sm:text-[16px] leading-[22px] sm:leading-[26px] text-white/90 m-0">
                {ctaDescription}
              </p>
            </div>

            <button className="flex flex-row items-center justify-center p-[16px] gap-[8px] bg-white text-[#7142F1] font-semibold text-[14px] leading-[20px] rounded-[8px] border-none cursor-pointer hover:bg-slate-50 transition-colors shrink-0">
              <span>{ctaButtonText}</span>
              <ArrowRight className="w-[16px] h-[16px]" strokeWidth={2.8} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default JournalStartHere;
