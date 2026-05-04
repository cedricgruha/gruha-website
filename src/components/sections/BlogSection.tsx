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
    const ctx = gsap.context(() => {
      // Horizontal Scroll
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
          scrub: true, // changed from 1 to true to remove floating parallax feel
          invalidateOnRefresh: true
        });
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="w-full relative block">
      <section ref={sectionRef} className="py-16 bg-white overflow-hidden min-h-screen flex flex-col justify-center">

      {/* Horizontal Scroll Container */}
      <div className="w-full relative">
        <div 
          ref={scrollContainerRef}
          className="flex flex-nowrap gap-8 md:gap-12 pb-12 pt-4 px-6 md:px-12 w-max"
          style={{
            // Use padding left to align with container on large screens
            paddingLeft: 'max(1.5rem, calc((100vw - 1400px) / 2 + 3rem))',
            paddingRight: 'max(1.5rem, calc((100vw - 1400px) / 2 + 3rem))',
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none',  /* IE and Edge */
          }}
        >
          {blogCards.map((card, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 snap-start bg-[#F8F7F3] rounded-3xl overflow-hidden flex flex-col shadow-xl select-none"
              style={{
                // Calculate width to show exactly 2.25 cards in the viewport width
                // Adjusting for gaps (gap-12 = 48px)
                width: 'calc((100vw - 96px) / 2.25)',
                minWidth: '320px', // Fallback for very small screens
                maxWidth: '600px', // Prevent being ridiculously large on ultrawides
              }}
            >
              {/* Card Image - Fixed Aspect Ratio for even height */}
              <div className="w-full bg-[#111] border-b border-gray-200 aspect-[1.15] md:aspect-[4/3] relative pointer-events-none">
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="absolute inset-0 w-full h-full object-cover rounded-t-3xl"
                  draggable={false}
                />
              </div>
              
              {/* Card Content */}
              <div className="p-8 md:p-10 flex flex-col flex-grow bg-[#FAF7F2]">
                <h3 className="font-inter text-3xl md:text-[34px] font-bold text-black mb-5 leading-[1.15] tracking-tight">
                  {card.title}
                </h3>
                <p className="font-inter text-[17px] md:text-[20px] text-gray-800 leading-[1.5] font-normal tracking-[-0.01em]">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inject styles for hiding scrollbar in WebKit */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
    </div>
  );
};
