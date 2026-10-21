"use client";

import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
  Layers,
  ShieldCheck,
  Users,
  Zap
} from 'lucide-react';
import { useWaitlist } from '@/contexts/WaitlistContext';
import { trackExploreProjectsClick } from '@/lib/analytics';

const GruhaExplainerSection = dynamic(
  () => import('./gruha-explainer/GruhaExplainerSection').then(mod => mod.GruhaExplainerSection),
  { ssr: true }
);

const CommunityJournalsSection = dynamic(
  () => import('./CommunityJournalsSection').then(mod => mod.CommunityJournalsSection),
  { ssr: true }
);

export { CommunityJournalsSection };

/* ─────────────────────────────────────────────────────────────────────────────
   1. HERO SECTION (Light Hero Stage - Crisp Text Fix)
   ───────────────────────────────────────────────────────────────────────────── */
export const HeroSection = () => {
  const { openModal } = useWaitlist();

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === "development" ? "http://localhost:3100" : "https://app.gruha.ai");

  const renderHeadline = () => {
    const text = "Better way to search, shortlist, evaluate and select your home";
    return text.split(' ').map((word, idx) => {
      const isOrange = word.toLowerCase().includes("your") || word.toLowerCase().includes("home");
      return (
        <span
          key={idx}
          style={{ animationDelay: `${idx * 0.04}s` }}
          className={`word inline-block mr-[0.28em] animate-hero-word ${
            isOrange ? 'text-[#fc7c54] font-medium' : 'text-white md:text-black font-normal'
          }`}
        >
          {word}
        </span>
      );
    });
  };

  const featureHighlights = [
    { icon: <Layers size={18} strokeWidth={1.8} />, text: "Feature rich platform" },
    { icon: <ShieldCheck size={18} strokeWidth={1.8} />, text: "Privacy & Home buyer first" },
    { icon: <Users size={18} strokeWidth={1.8} />, text: "Agents (Human + AI) working for you" },
    { icon: <Zap size={18} strokeWidth={1.8} />, text: "Data driven evaluation" }
  ];

  return (
    <>
      <section className="relative pt-24 pb-8 sm:pb-20 bg-white text-black overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          {/* Mobile background */}
          <Image
            src="/assets/hero/hero-background.png"
            alt="Hero Background"
            fill
            className="object-cover object-top sm:hidden"
            priority
            fetchPriority="high"
            sizes="(max-width: 640px) 100vw, 1px"
          />
          {/* Mobile gradient overlay (below md) — classic bottom-dark hero gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 md:hidden pointer-events-none" />
          {/* Desktop background (sm and up) */}
          <Image
            src="/assets/hero/hero.png"
            alt="Hero Background"
            fill
            className="object-cover object-top hidden sm:block"
            sizes="100vw"
          />
        </div>

        {/* Hero Main Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 text-center pt-12 md:pt-16">
          <h1
            className="font-fraunces text-white md:text-slate-900 max-w-3xl mx-auto mb-5 font-normal tracking-tight"
            style={{ fontSize: 'clamp(32px, 5vw, 54px)', lineHeight: '1.15' }}
          >
            {renderHeadline()}
          </h1>

          <p
            style={{ animationDelay: '0.2s' }}
            className="font-inter text-sm md:text-base text-white md:text-black max-w-lg mx-auto mb-8 animate-hero-fade"
          >
            Property search is a painful task. We are here to show that it does not have to be painful.
          </p>

          <div
            style={{ animationDelay: '0.3s' }}
            className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-6 sm:gap-8 md:gap-10 mb-8 md:mb-16 max-w-3xl mx-auto animate-hero-fade"
          >
            {/* Primary CTA */}
            <div className="flex flex-col items-center text-center w-full sm:w-[280px] md:w-[310px]">
              <button
                onClick={() => openModal("hero")}
                className="w-full sm:w-auto min-w-[200px] bg-[#fc7c54] text-white font-medium px-8 py-3.5 rounded-xl text-sm transition-all duration-300 shadow-md hover:bg-[#fc7c54]/90 hover:scale-105 active:scale-95 cursor-pointer"
              >
                Join Waitlist
              </button>
              <p className="mt-2.5 font-inter text-xs md:text-[13px] text-white md:text-slate-900 font-medium leading-relaxed max-w-[280px] sm:max-w-none drop-shadow-xs md:drop-shadow-none">
                Be among the first to experience a smarter way to find your home.
              </p>
            </div>

            {/* Secondary CTA */}
            <div className="flex flex-col items-center text-center w-full sm:w-[280px] md:w-[310px]">
              <a
                href={appUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackExploreProjectsClick({ source: "hero" })}
                className="w-full sm:w-auto min-w-[200px] inline-flex items-center justify-center bg-amber-500 hover:bg-amber-400 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-all duration-300 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              >
                Explore Projects
              </a>
              <p className="mt-2.5 font-inter text-xs md:text-[13px] text-white md:text-slate-900 font-medium leading-relaxed max-w-[280px] sm:max-w-none drop-shadow-xs md:drop-shadow-none">
                See real project data, explore, and join the waitlist when you&apos;re ready.
              </p>
            </div>
          </div>

          {/* Feature Highlights Grid — hidden on mobile, shown md+ */}
          <div className="hidden md:flex md:flex-row items-center justify-center gap-6 md:gap-12 w-full">
            {featureHighlights.map((feature, idx) => (
              <div
                key={idx}
                style={{ animationDelay: `${0.35 + idx * 0.08}s` }}
                className="flex items-center gap-3 text-left animate-hero-fade"
              >
                <div className="w-10 h-10 rounded-full border border-white/5 bg-white/10 backdrop-blur-sm flex items-center justify-center text-black shrink-0">
                  {feature.icon}
                </div>
                <span className="text-xs text-black font-inter leading-snug max-w-[120px]">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. WHAT GRUHA STANDS FOR — interactive explainer */}
      <GruhaExplainerSection />

      {/* 3. COMMUNITY JOURNALS SECTION */}
      <CommunityJournalsSection />
    </>
  );
};