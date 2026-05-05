"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const specialists = [
  {
    name: "Riya",
    role: "Your home search agent",
    description: "Captures who you actually are. Translates it into the home that fits.",
    color: "#2D9E8E",
    image: "/assets/team/1.png"
  },
  {
    name: "Kabir",
    role: "Your projects curator",
    description: "Two thousand projects in Bengaluru. Filters them down to yours.",
    color: "#2B6CB0",
    image: "/assets/team/2.png"
  },
  {
    name: "Ananya",
    role: "Your floor plan specialist",
    description: "Reads floor plans the way you wish you could. Scores every unit.",
    color: "#ED8936",
    image: "/assets/team/3.png"
  },
  {
    name: "Arjun",
    role: "Your project analyst",
    description: "Sees the project the way a drone sees it — towers, shadows, sun, gates.",
    color: "#84A962",
    image: "/assets/team/4.png"
  },
  {
    name: "Karan",
    role: "Your location explorer",
    description: "Walks the streets, drives the commute, checks the floods. Before you ever do.",
    color: "#9F7AEA",
    image: "/assets/team/5.png"
  },
  {
    name: "Sharon",
    role: "Your lifestyle curator",
    description: "What the brochure won't tell you — the noise, the greenery, the evening crowd.",
    color: "#F56565",
    image: "/assets/team/6.png"
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
    <section ref={containerRef} className="py-12 md:py-16 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div ref={headerRef} className="max-w-3xl mb-8 md:mb-10 lg:mb-12">
          <h2 className="font-fraunces text-2xl md:text-3xl lg:text-4xl text-black font-normal mb-3 tracking-tight">
            Meet your specialists.
          </h2>
          <p className="font-inter text-sm md:text-base lg:text-xl text-gray-600 font-normal leading-snug tracking-tight">
            Each one specialises in one piece of the puzzle — together, they leave nothing to chance.
          </p>
        </div>

        {/* Cards Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {specialists.map((specialist, idx) => (
            <div 
              key={idx} 
              className="group flex flex-col bg-white rounded-[1.5rem] overflow-hidden transition-all duration-300  h-full"
              style={{ 
                borderWidth: '1px', 
                borderStyle: 'solid',
                borderColor: specialist.color + '40', // 25% opacity of the theme color
                boxShadow: 'none'
              }}
            >
              {/* Image Container */}
              <div className="relative flex justify-center   sm:justify-start w-full pt-3 md:pt-4 px-4  items-end  bg-white overflow-visible">
                <img 
                  src={specialist.image}
                  alt={specialist.name}
                  className="h-[320px] sm:h-[250px] md:h-[280px] w-auto max-w-full object-contain object-left sm:object-center transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = `<div class="h-[180px] w-full flex items-center justify-start sm:justify-center text-gray-400 font-inter text-sm bg-gray-50 rounded-xl">[Image: ${specialist.name}]</div>`;
                  }}
                />
              </div>

              {/* Content Container */}
              <div className="p-4 md:p-5 lg:p-6 flex flex-col flex-grow bg-transparent">
                <h3 
                  className="font-fraunces text-xl md:text-2xl lg:text-[1.75rem] font-normal mb-0.5 leading-none"
                  style={{ color: specialist.color }}
                >
                  {specialist.name}
                </h3>
                
                <p className="font-inter text-[0.8125rem] text-[#718096] font-medium">
                  {specialist.role}
                </p>
                
                <div className="flex items-end justify-between mt-auto pt-6">
                  <p className="font-inter text-xs md:text-[0.8125rem] text-[#1A202C] leading-[1.6] pr-4 max-w-[85%] font-medium">
                    {specialist.description}
                  </p>
                  
                  <ChevronRight 
                    size={20} 
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
