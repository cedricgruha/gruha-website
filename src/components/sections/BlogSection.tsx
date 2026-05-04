"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const blogCards = [
  {
    title: "2,000+ projects. One screen. The whole city.",
    description: "Every active and upcoming project in Bengaluru, dropped on a real satellite map. Pan, zoom, and see what's actually being built around the localities you're shortlisting.",
    image: "/assets/blog/Rectangle%2034626212.png"
  },
  {
    title: "Your Journal becomes your filter — automatically.",
    description: "The requirements captured in your Home Search Journal apply to the map without you lifting a finger. Projects that fit light up; projects that don't fade out.",
    image: "/assets/blog/Rectangle%2034626212%20(1).png"
  },
  {
    title: "Make the Map Work Your Way",
    description: "Three control axes. Toggle map + panel or grid. Filter by stage, builder, RERA, possession, or availability—skip '2031' when you need December. Switch to satellite or 3D for context.",
    image: "/assets/blog/Rectangle%2034626212%20(2).png"
  },
  {
    title: "Side-by-Side Project Compare",
    description: "Four projects, one screen—no spreadsheets. Pin any four and compare price, sun, privacy, commute, vaastu, greenery, and RERA. Differences are instantly clear.",
    image: "/assets/blog/Rectangle%2034626212%20(3).png"
  },
  {
    title: "New launches in your area? You'll hear first.",
    description: "Save any map view as a watch. Get alerts for new listings, price drops, or when a flagged unit becomes available.",
    image: "/assets/blog/Rectangle%2034626212%20(4).png"
  }
];

export const BlogSection = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only apply GSAP horizontal scroll on md+ screens (768px+)
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        if (sectionRef.current && scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          
          const getScrollAmount = () => {
            const containerWidth = container.scrollWidth;
            return -(containerWidth - window.innerWidth);
          };

          const tween = gsap.to(container, {
            x: getScrollAmount,
            ease: "none"
          });

          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${getScrollAmount() * -1}`,
            pin: true,
            animation: tween,
            scrub: true,
            invalidateOnRefresh: true
          });
        }
      }, wrapperRef);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="w-full relative block">
      {/* Mobile: vertical card list */}
      <div className="md:hidden py-12 px-4 bg-white">
        <div className="flex flex-col gap-6">
          {blogCards.map((card, index) => (
            <div
              key={index}
              className="w-full bg-[#F8F7F3] rounded-2xl overflow-hidden flex flex-col shadow-md"
            >
              <div className="w-full aspect-[4/3] relative bg-[#111]">
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-t-2xl"
                />
              </div>
              <div className="p-5 bg-[#FAF7F2]">
                <h3 className="font-inter text-lg font-bold text-black mb-2 leading-tight tracking-tight">
                  {card.title}
                </h3>
                <p className="font-inter text-sm text-gray-700 leading-[1.5] font-normal">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: GSAP horizontal scroll */}
      <section ref={sectionRef} className="hidden md:flex py-16 2xl:py-10 bg-white overflow-hidden min-h-screen 2xl:min-h-0 flex-col justify-center">
        <div className="w-full relative">
          <div 
            ref={scrollContainerRef}
            className="flex flex-nowrap gap-8 md:gap-12 pb-12 pt-4 px-6 md:px-12 w-max"
            style={{
              paddingLeft: 'max(1.5rem, calc((100vw - 1152px) / 2 + 3rem))',
              paddingRight: 'max(1.5rem, calc((100vw - 1152px) / 2 + 3rem))',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {blogCards.map((card, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 snap-start bg-[#F8F7F3] rounded-3xl overflow-hidden flex flex-col shadow-xl select-none"
                style={{
                  width: 'calc((100vw - 96px) / 2.25)',
                  minWidth: '320px',
                  maxWidth: '520px',
                }}
              >
                <div className="w-full bg-[#111] border-b border-gray-200 aspect-[4/3] relative pointer-events-none">
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="absolute inset-0 w-full h-full object-cover rounded-t-3xl"
                    draggable={false}
                  />
                </div>
                
                <div className="p-8 md:p-10 flex flex-col flex-grow bg-[#FAF7F2]">
                  <h3 className="font-inter text-2xl md:text-[1.75rem] font-bold text-black mb-4 leading-[1.15] tracking-tight">
                    {card.title}
                  </h3>
                  <p className="font-inter text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.5] font-normal tracking-[-0.01em]">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
};
