"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    id: "01",
    title: "Real reach - not radius",
    description: "Walk and drive zones that follow actual roads, not perfect circles. Dead ends, one-ways, and missing links included - so you see what's truly reachable in 5, 10, or 15 minutes.",
    image: "/assets/05-location-inteligence/cards/Road-Following Walk & Drive Zones 1.png"
  },
  {
    id: "02",
    title: "Green cover, verified from space",
    description: "A satellite-based vegetation map that reveals actual tree cover - not brochure promises. See where greenery truly exists, and where it doesn't.",
    image: "/assets/05-location-inteligence/cards/Road-Following Walk & Drive Zones 1 (1).png"
  },
  {
    id: "03",
    title: "Flood risk - before it finds you",
    description: "Elevation and water-index data combined into a clear flood risk map. Identify low-lying zones and historically waterlogged areas before you commit.",
    image: "/assets/05-location-inteligence/cards/Road-Following Walk & Drive Zones 1 (2).png"
  },
  {
    id: "04",
    title: "Experience your commute — before you live it",
    description: "Preview your actual daily route through real street-level views - traffic, signals, and all. No stitched maps, just what your mornings will look like.",
    image: "/assets/05-location-inteligence/cards/Road-Following Walk & Drive Zones 1 (3).png"
  },
  {
    id: "05",
    title: "Real commute times that actually hold up",
    description: "Peak-hour travel times to the places that matter - airport, work hubs, stations - based on live traffic, not optimistic estimates.",
    image: "/assets/05-location-inteligence/cards/Road-Following Walk & Drive Zones 1 (4).png"
  }
];

export const LocationCardsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      rowsRef.current.forEach((row, index) => {
        if (row) {
          gsap.fromTo(row,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: row,
                start: "top 80%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="pb-12 md:pb-16 lg:pb-24 bg-[#F5F5F5] overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="flex flex-col gap-12 md:gap-16 lg:gap-24">
          {cards.map((card, index) => {
            const isImageLeft = index % 2 === 0;

            return (
              <div 
                key={index}
                ref={el => { rowsRef.current[index] = el; }}
                className={`flex flex-col ${isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center justify-between gap-6 md:gap-10 lg:gap-16`}
              >
                {/* Image Content */}
                <div className="w-full md:w-7/12 flex justify-center">
                  <img 
                    src={card.image} 
                    alt={card.title}
                    className="w-full h-auto object-cover rounded-2xl md:rounded-[18px] shadow-lg md:shadow-xl"
                    loading="lazy"
                  />
                </div>

                {/* Text Content */}
                <div className="w-full md:w-5/12 flex flex-col justify-center">
                  <span className="font-inter text-xl text-gray-300 font-semibold leading-none tracking-tight">
                    {card.id}
                  </span>
                  <div className="w-8 h-[2px] bg-[#48C4A9] mt-2 mb-4"></div>
                  
                  <h2 className="font-inter font-bold text-2xl md:text-[1.75rem] leading-[1.1] tracking-[-0.5px] text-black mb-4 whitespace-pre-line">
                    {card.title}
                  </h2>
                  <p className="font-inter text-sm md:text-[0.9375rem] leading-[1.5] tracking-[-0.2px] text-gray-700 font-normal">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
