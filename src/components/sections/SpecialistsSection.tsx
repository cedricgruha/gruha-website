"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const specialists = [

  {
    name: "Kabir",
    role: "Your projects curator",
    description: "Two thousand projects in Bengaluru. Filters them down to yours.",
    color: "#2B6CB0",
    image: "/assets/team/kabir.png"
  },
  {
    name: "Ananya",
    role: "Your floor plan specialist",
    description: "Reads floor plans the way you wish you could. Scores every unit.",
    color: "#ED8936",
    image: "/assets/team/ananya.png"
  },
  {
    name: "Arjun",
    role: "Your project analyst",
    description: "Sees the project the way a drone sees it — towers, shadows, sun, gates.",
    color: "#84A962",
    image: "/assets/team/arjun.png"
  },
  {
    name: "Karan",
    role: "Your location explorer",
    description: "Walks the streets, drives the commute, checks the floods. Before you ever do.",
    color: "#9F7AEA",
    image: "/assets/team/karan.png"
  },
  {
    name: "Sharon",
    role: "Your lifestyle curator",
    description: "What the brochure won't tell you — the noise, the greenery, the evening crowd.",
    color: "#F56565",
    image: "/assets/team/sharan.png"
  },
  {
    name: "Aisha",
    role: "Your legal specialist",
    description: "Catches the paperwork red flags before you sign. RERA, Khata, all of it.",
    color: "#4A5568",
    image: "/assets/team/aisha.png"
  }
];

export const SpecialistsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in header
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
          }
        }
      );

      // Stagger cards
      if (cardsRef.current) {
        const cards = cardsRef.current.children;
        gsap.fromTo(cards,
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 75%",
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Header */}
        <div ref={headerRef} className="max-w-4xl mb-16 md:mb-20">
          <h2 className="font-fraunces text-5xl md:text-6xl text-black font-normal mb-6 tracking-tight">
            Meet your specialists.
          </h2>
          <p className="font-inter text-2xl md:text-3xl text-gray-900 font-normal leading-snug tracking-tight">
            Each one specialises in one piece of the puzzle — together, they leave nothing to chance.
          </p>
        </div>

        {/* Cards Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialists.map((specialist, idx) => (
            <div 
              key={idx} 
              className="group flex flex-col bg-white rounded-[1.5rem] overflow-hidden transition-all duration-300 cursor-pointer h-full"
              style={{ 
                borderWidth: '1px', 
                borderStyle: 'solid',
                borderColor: specialist.color + '40', // 25% opacity of the theme color
                boxShadow: 'none'
              }}
            >
              {/* Image Container */}
              <div className="relative w-full pt-6 px-6 flex items-center justify-center bg-white">
                {/* Standard img tag used to prevent Next.js build errors for missing assets temporarily */}
                <img 
                  src={specialist.image}
                  alt={specialist.name}
                  className="w-full h-[220px] object-contain transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback if image not found
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = `<div class="h-[220px] w-full flex items-center justify-center text-gray-400 font-inter text-sm bg-gray-50 rounded-xl">[Image: ${specialist.name}]</div>`;
                  }}
                />
              </div>

              {/* Content Container */}
              <div className="p-6 md:p-8 flex flex-col flex-grow bg-white">
                <h3 
                  className="font-fraunces text-[32px] md:text-[36px] font-normal mb-1 leading-none"
                  style={{ color: specialist.color }}
                >
                  {specialist.name}
                </h3>
                
                <p className="font-inter text-[14px] md:text-[15px] text-[#718096] font-medium">
                  {specialist.role}
                </p>
                
                <div className="flex items-end justify-between mt-auto pt-10">
                  <p className="font-inter text-[13px] md:text-[14px] text-[#1A202C] leading-[1.6] pr-4 max-w-[85%] font-medium">
                    {specialist.description}
                  </p>
                  
                  <ChevronRight 
                    size={26} 
                    strokeWidth={2.5} 
                    style={{ color: specialist.color }}
                    className="transform group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0 mb-1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
