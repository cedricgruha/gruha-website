"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, ShieldCheck, Users, Zap, MapPin } from 'lucide-react';
import { useWaitlist } from '@/contexts/WaitlistContext';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { openModal } = useWaitlist();
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Staggered word animation for headline
      if (headlineRef.current) {
        const chars = headlineRef.current.querySelectorAll('.word');
        tl.fromTo(chars, 
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.04 }
        );
      }

      // Fade in subheadline and button
      tl.fromTo([subheadlineRef.current, btnRef.current],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
        "-=0.4"
      );

      // Features fade in
      if (featuresRef.current) {
        const featureItems = featuresRef.current.children;
        tl.fromTo(featureItems,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.4, stagger: 0.08 },
          "-=0.3"
        );
      }

      // Cards slide up
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.feature-card');
        tl.fromTo(cards,
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.01 },
          "-=0.3"
        );
      }

      // Removed parallax effect as requested
    }, containerRef);

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  // Split headline into words for stagger effect
  const renderHeadline = () => {
    const text = "Better way to search, shortlist, evaluate and select your home";
    return text.split(' ').map((word, idx) => (
      <span key={idx} className="word inline-block mr-[0.3em] opacity-100">{word}</span>
    ));
  };

  const featureHighlights = [
    { icon: <Layers size={20} strokeWidth={1.5} />, text: "Feature rich\nplatform" },
    { icon: <ShieldCheck size={20} strokeWidth={1.5} className="text-white" />, text: "Privacy & Home buyer\nfirst" },
    { icon: <Users size={20} strokeWidth={1.5} className="text-white" />, text: "Agents (Human + AI)\nworking for you" },
    { icon: <Zap size={20} strokeWidth={1.5} className="text-white" />, text: "Data driven\nevaluation" }
  ];

  const bottomCards = [
    { src: "/assets/hero-cards/1.png", alt: "Privacy Score" },
    { src: "/assets/hero-cards/2.png", alt: "Master Plan Intelligence" },
    { src: "/assets/hero-cards/3.png", alt: "Sunlight & Orientation" },
    { src: "/assets/hero-cards/4.png", alt: "Floor Plan Space Analysis" },
    { src: "/assets/hero-cards/5.png", alt: "Location & Traffic Intelligence" },
    { src: "/assets/hero-cards/6.png", alt: "Smart Property Services" },
  ];

  const bottomRowCards = [
    { src: "/assets/hero-cards/7.png", alt: "About" },
    { src: "/assets/hero-cards/8.png", alt: "Price Plan" },
    { src: "/assets/hero-cards/9.png", alt: "Property" },
    { src: "/assets/hero-cards/10.png", alt: "Property Details" },
    { src: "/assets/hero-cards/1.png", alt: "Home Match" },
    { src: "/assets/hero-cards/2.png", alt: "Home Match Details" },
  ];

  return (
    <section ref={containerRef} className="relative min-h-screen 2xl:min-h-0 2xl:h-[900px] pt-24 overflow-hidden bg-black flex flex-col justify-between">
      {/* Background Image */}
      <div className="hero-bg absolute inset-0 z-0">
        <div className=" absolute inset-0">
          <Image 
            src="/assets/hero/hero-background.png"
            alt="Hero Background"
            fill
            className="object-cover opacity-70"
            priority
            sizes="100vw"
          />
        </div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 w-full flex-grow flex flex-col items-center justify-center text-center mt-8 md:mt-0">
        <h1 
          ref={headlineRef} 
          className="font-fraunces text-white max-w-4xl mb-4 font-normal text-center"
          style={{ fontSize: 'clamp(28px, 6vw, 46px)', lineHeight: '1.1', letterSpacing: '-1px' }}
        >
          {renderHeadline()}
        </h1>
        
        <p 
          ref={subheadlineRef}
          className="font-inter text-sm md:text-base text-gray-300 max-w-xl mb-6 font-light px-2"
        >
          Property search is a painful task. We are here to show that it does not have to be painful.
        </p>

        <button 
          ref={btnRef}
          onClick={openModal}
          className="bg-[#fc7c54] text-black hover:bg-[#fc7c54]/90 font-inter font-medium px-6 py-3 rounded-lg text-sm transition-all duration-300 mb-8 inline-flex items-center gap-2"
        >
          Join Waitlist 
        </button>

        {/* Feature Highlights — 2-col grid on mobile, row on desktop */}
        <div ref={featuresRef} className="grid grid-cols-2 md:flex md:flex-row md:items-center justify-center gap-4 md:gap-12 mt-2 w-full max-w-sm md:max-w-none">
          {featureHighlights.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 md:gap-3 text-left">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-gray-600/50 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
                {feature.icon}
              </div>
              <p className="text-[0.6875rem] md:text-sm text-gray-300 font-inter whitespace-pre-line leading-snug">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Cards Carousel/Grid */}
      <div ref={cardsRef} className="relative z-10 w-full mt-10 pb-0 overflow-hidden">
        {/* First Row (Right to Left) */}
        <div className="flex pb-2 md:pb-3 w-full">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {[...bottomCards, ...bottomCards, ...bottomCards, ...bottomCards].map((card, idx) => (
              <div key={`row1-${idx}`} className="flex-none pr-3 md:pr-4">
                <div className="feature-card relative shrink-0 w-[200px] md:w-[280px] aspect-[13/9] rounded-xl overflow-hidden border border-gray-800 bg-black/40 group ">
                  <Image 
                    src={card.src}
                    alt={card.alt}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Second Row (Left to Right) */}
        <div className="flex pb-0 w-full mt-2 md:mt-3">
          <div className="flex w-max animate-marquee-reverse hover:[animation-play-state:paused]">
            {[...bottomRowCards, ...bottomRowCards, ...bottomRowCards, ...bottomRowCards].map((card, idx) => (
              <div key={`row2-${idx}`} className="flex-none pr-3 md:pr-4">
                <div className="feature-card relative shrink-0 w-[200px] md:w-[280px] lg:w-[320px] aspect-[16/10] rounded-xl overflow-hidden border border-gray-800 bg-black/40 group ">
                  <Image 
                    src={card.src}
                    alt={card.alt}
                    fill
                    className="object-cover opacity-30 group-hover:opacity-50 transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gradient black shade to hide 2nd row */}
        <div className="absolute bottom-0 left-0 right-0 h-[160px] md:h-[240px] bg-gradient-to-t from-black via-black/10 to-transparent pointer-events-none z-20"></div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 60s linear infinite;
        }
      `}} />
    </section>
  );
};
