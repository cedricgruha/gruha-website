"use client";

import React, { useRef } from 'react';
import Image from 'next/image';

const cards = [
  {
    id: 1,
    title: "Pick the prompt that sounds like you.",
    text: "Working couple with a toddler? NRI investor? First-time buyer? Pre-built starting points fill in 80% of the obvious. You spend your time on the 20% that makes you you.",
    bg: "bg-[#EBF3EF]", // Soft mint
    img: "/assets/home-search-journal/home-search-journal-card-image (1).png"
  },
  {
    id: 2,
    title: "Goes deeper than BHK.",
    text: "Study, pooja, servant quarter, WFH corner, second balcony for laundry — the rooms you actually need. Capture them once and only the units that have them surface.",
    bg: "bg-[#FBEFEA]", // Soft peach
    img: "/assets/home-search-journal/home-search-journal-card-image (2).png"
  },
  {
    id: 3,
    title: "The dealbreakers brochures skip",
    text: "Pets, Vaastu, vegetarian-only block, aging parents on the ground floor — the constraints that never make a listing. Tell Riya once, and every project we surface has already passed them.",
    bg: "bg-[#F2F4F6]", // Soft slate
    img: "/assets/home-search-journal/home-search-journal-card-image (3).png"
  },
  {
    id: 4,
    title: "Sticker price isn't your budget",
    text: "Registration, GST, parking, club fees, BWSSB, BESCOM, fit-out — another 18-22% on top of the headline price. Tell us what you can actually spend; we work back to what you can actually buy.",
    bg: "bg-[#FCF8F3]", // Soft warm beige
    img: "/assets/home-search-journal/home-search-journal-card-image (4).png"
  }
];

export const HomeSearchJournalSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={sectionRef} className="pt-24 pb-24 bg-[#f8f7f3] relative mt-12 md:mt-24">
      
      {/* Step Indicator - Centered precisely on the section dividing line */}
      <div className="absolute -top-8 left-0 w-full flex justify-center z-20 -translate-y-1/2">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border border-[#84A98C] flex items-center justify-center mb-4 bg-[#f8f7f3]">
            <svg className="w-6 h-6 text-[#2D6A4F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="4" x2="12" y2="15" strokeDasharray="3 3"></line>
              <polyline points="16 14 12 18 8 14"></polyline>
            </svg>
          </div>
          <div className="px-6 py-3 bg-[#E2EBE5] text-[#2D6A4F] rounded-full text-[18px] font-inter font-semibold tracking-wide text-center shadow-sm">
            Step 1 of your journey
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6">

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          
          {/* Left Column (Sticky) */}
          <div className="lg:w-5/12 lg:sticky lg:top-32 flex flex-col pt-10">
            <div className="mb-4 font-fraunces text-6xl text-black">
              01
            </div>
            <h2 className="font-fraunces text-6xl md:text-7xl text-black leading-[1.1] mb-8">
              Home Search<br/>Journal
            </h2>
            <p className="font-inter text-2xl md:text-3xl text-gray-800 leading-[1.4] mb-12">
              Tell Riya who you are.<br/>She finds the home that fits.
            </p>
            
            <div className="relative w-full h-[500px] md:h-[600px] mt-auto">
              <img 
                src="/assets/home-search-journal/left-side-main-character.png" 
                alt="Riya holding journal" 
                className="w-full h-full object-contain object-left-bottom"
              />
            </div>
          </div>

          {/* Right Column (Scrolling Cards) */}
          <div className="lg:w-7/12 flex flex-col gap-12 pb-32">
            {cards.map((card, index) => (
              <div 
                key={card.id}
                className={`w-full rounded-[32px] overflow-hidden ${card.bg} flex flex-col sticky shadow-sm`}
                style={{ 
                  top: `calc(120px + ${index * 30}px)`,
                  zIndex: index + 1
                }}
              >
                {/* Card Text Content */}
                <div className="p-10 md:p-14 pb-0">
                  <h3 className="font-inter font-bold text-3xl md:text-[40px] leading-tight text-black tracking-tight mb-6">
                    {card.title}
                  </h3>
                  <p className="font-inter text-lg md:text-xl text-gray-800 leading-relaxed max-w-[90%] font-medium">
                    {card.text}
                  </p>
                </div>
                
                {/* Card Image */}
                <div className="w-full mt-12 px-6 pb-6 flex justify-center">
                  <img 
                    src={card.img} 
                    alt={card.title} 
                    className="w-full max-w-[95%] h-auto rounded-[20px] shadow-lg"
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
