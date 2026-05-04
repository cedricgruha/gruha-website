"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, ShieldCheck, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
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
          { y: 0, opacity: 1, duration: 1, stagger: 0.1 }
        );
      }

      // Fade in subheadline and button
      tl.fromTo([subheadlineRef.current, btnRef.current],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2 },
        "-=0.5"
      );

      // Features fade in
      if (featuresRef.current) {
        const featureItems = featuresRef.current.children;
        tl.fromTo(featureItems,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.6, stagger: 0.2 },
          "-=0.4"
        );
      }

      // Cards slide up
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.feature-card');
        tl.fromTo(cards,
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.02 },
          "-=0.4"
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
      <span key={idx} className="word inline-block mr-[0.3em]">{word}</span>
    ));
  };

  const featureHighlights = [
    { icon: <Layers size={20} strokeWidth={1.5} />, text: "Feature rich\nplatform" },
    { icon: <ShieldCheck size={20} strokeWidth={1.5} className="text-blue-400" />, text: "Privacy & Home buyer\nfirst" },
    { icon: <Users size={20} strokeWidth={1.5} className="text-gray-300" />, text: "Agents (Human + AI)\nworking for you" }
  ];

  const bottomCards = [
    { src: "/assets/hero-cards/Property details (1).png", alt: "Privacy Score" },
    { src: "/assets/hero-cards/Property details (1) (1).png", alt: "Master Plan Intelligence" },
    { src: "/assets/hero-cards/Property details (1) (2).png", alt: "Sunlight & Orientation" },
    { src: "/assets/hero-cards/Property details (1) (3).png", alt: "Floor Plan Space Analysis" },
    { src: "/assets/hero-cards/Property details (1) (4).png", alt: "Location & Traffic Intelligence" },
    { src: "/assets/hero-cards/Property details (1) (5).png", alt: "Smart Property Services" },
  ];

  const bottomRowCards = [
    { src: "/assets/hero-cards/About 2 (1).png", alt: "About" },
    { src: "/assets/hero-cards/Price plan 3 (1).png", alt: "Price Plan" },
    { src: "/assets/hero-cards/Property (1).png", alt: "Property" },
    { src: "/assets/hero-cards/Property (1) - Copy.png", alt: "Property Details" },
    { src: "/assets/hero-cards/hm2.png", alt: "Home Match" },
    { src: "/assets/hero-cards/hm2 - Copy.png", alt: "Home Match Details" },
  ];

  return (
    <section ref={containerRef} className="relative min-h-screen pt-32  overflow-hidden bg-black flex flex-col justify-between">
      {/* Background Image */}
      <div className="hero-bg absolute inset-0 z-0">
        <Image 
          src="/assets/hero/hero-background.png"
          alt="Hero Background"
          fill
          className="object-cover opacity-70"
          priority
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex-grow flex flex-col items-center justify-center text-center mt-12 md:mt-0">
        <h1 
          ref={headlineRef} 
          className="font-fraunces text-white max-w-5xl mb-6 font-normal text-center"
          style={{ fontSize: '60px', lineHeight: '61px', letterSpacing: '-1.5px', verticalAlign: 'middle' }}
        >
          {renderHeadline()}
        </h1>
        
        <p 
          ref={subheadlineRef}
          className="font-inter text-lg md:text-2xl text-gray-200 max-w-3xl mb-10 font-light"
        >
          Property search is a painful task. We are here to show,<br className="hidden md:block"/> that it does not have to be painful.
        </p>

        <button 
          ref={btnRef}
          className="bg-[#D8A76B] text-black hover:bg-[#D8A76B]/90 font-inter font-medium px-8 py-3.5 rounded-lg text-base transition-all duration-300 mb-16 inline-flex items-center gap-2"
        >
          Join Waitlist <span className="text-xl leading-none">↗</span>
        </button>

        {/* Feature Highlights */}
        <div ref={featuresRef} className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mt-8">
          {featureHighlights.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-full border border-gray-600/50 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
                {feature.icon}
              </div>
              <p className="text-sm md:text-base text-gray-200 font-inter whitespace-pre-line leading-snug">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Cards Carousel/Grid */}
      <div ref={cardsRef} className="relative z-10 w-full mt-16 pb-0 overflow-hidden">
        {/* First Row (Right to Left) */}
        <div className="flex pb-2 md:pb-4 w-full">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {[...bottomCards, ...bottomCards, ...bottomCards, ...bottomCards].map((card, idx) => (
              <div key={`row1-${idx}`} className="flex-none pr-4 md:pr-6">
                <div className="feature-card relative shrink-0 w-[280px] md:w-[320px] aspect-[16/10] rounded-xl overflow-hidden border border-gray-800 bg-black/40 group cursor-pointer">
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
        <div className="flex pb-0 w-full mt-2 md:mt-4">
          <div className="flex w-max animate-marquee-reverse hover:[animation-play-state:paused]">
            {[...bottomRowCards, ...bottomRowCards, ...bottomRowCards, ...bottomRowCards].map((card, idx) => (
              <div key={`row2-${idx}`} className="flex-none pr-4 md:pr-6">
                <div className="feature-card relative shrink-0 w-[280px] md:w-[320px] aspect-[16/10] rounded-xl overflow-hidden border border-gray-800 bg-black/40 group cursor-pointer">
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
        <div className="absolute bottom-0 left-0 right-0 h-[200px] md:h-[240px] bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-20"></div>
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
