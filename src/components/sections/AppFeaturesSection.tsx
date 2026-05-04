"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Not all 1200 sq ft are\ncreated equal.",
    description: "Your floor plan colour-coded into usable space, circulation, and dead space — with an efficiency score. See exactly what you're paying for, and what's eating into your carpet area.",
    image: "/assets/features/ChatGPT Image May 2, 2026, 09_44_47 AM 1.png",
    imageFirst: false
  },
  {
    title: "Vaastu-aligned? We\ncheck every room — not\njust the main door.",
    description: "Every unit evaluated against classical Vaastu principles — main door, kitchen, master bedroom, pooja room, toilets, and the Brahmasthan. You get a compliance score with specific passes and deviations.",
    image: "/assets/features/ChatGPT Image May 2, 2026, 09_44_47 AM 1 (1).png",
    imageFirst: true
  },
  {
    title: "Pick your appliances. We'll\nshow you the kitchens\nthat actually fit them.",
    description: "Tell Gruha what goes in your kitchen — OTG, built-in oven, dishwasher, tall fridge, coffee machine, chimney size — and every unit's kitchen is scored for counter space, ventilation, plug points, and storage.",
    image: "/assets/features/ChatGPT Image May 2, 2026, 09_44_47 AM 1 (2).png",
    imageFirst: false
  },
  {
    title: "Overlook & Privacy Check",
    description: "Every nearby building — PGs, residential towers, offices, schools — measured against your unit's window lines. See which of your windows are overlooked, from what angle, and by what kind of building, before you commit to a flat where the curtains never come off.",
    image: "/assets/features/ChatGPT Image May 2, 2026, 09_44_47 AM 1 (3).png",
    imageFirst: true
  },
  {
    title: "The NE flat and the SW flat\nare not the same. Now\nyou'll see why.",
    description: "Direct sunlight calculated on your specific window facings, per season. Two units in the same tower can get very different sun — this is the number that tells you which is which.",
    image: "/assets/features/ChatGPT Image May 2, 2026, 09_44_47 AM 1 (4).png",
    imageFirst: false
  }
];

export const AppFeaturesSection = () => {
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
    <section ref={containerRef} className="py-12 md:py-16 lg:py-24 bg-[#F9F0E5] overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="flex flex-col gap-12 md:gap-16 lg:gap-28">
          {features.map((feature, index) => (
            <div 
              key={index}
              ref={el => { rowsRef.current[index] = el; }}
              className={`flex flex-col ${feature.imageFirst ? 'md:flex-row-reverse' : 'md:flex-row'} items-center justify-between gap-6 md:gap-10 lg:gap-16`}
            >
              {/* Text Content */}
              <div className="w-full md:w-5/12 flex flex-col justify-center">
                <h2 className="font-inter font-bold text-2xl md:text-[1.75rem] leading-[1.2] tracking-[-0.5px] text-black mb-3 whitespace-pre-line">
                  {feature.title}
                </h2>
                <p className="font-inter text-sm md:text-[0.9375rem] leading-[1.6] tracking-[-0.2px] text-black/70 font-normal">
                  {feature.description}
                </p>
              </div>

              {/* Image Content - always shows first on mobile */}
              <div className="w-full md:w-1/2 flex justify-center order-first md:order-none">
                <img 
                  src={feature.image} 
                  alt={feature.title.replace(/\n/g, ' ')}
                  className="w-full max-w-[360px] md:max-w-[480px] h-auto object-contain rounded-xl shadow-xl"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
