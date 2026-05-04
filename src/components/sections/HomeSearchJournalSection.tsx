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
    <section ref={sectionRef} className="pt-24 pb-16 bg-[#f8f7f3] relative ">
      
      {/* Step Indicator - Centered precisely on the section dividing line */}
      <div className=" left-0 w-full flex justify-center z-20 -translate-y-1/2">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full border border-[#84A98C] flex items-center justify-center mb-3 bg-[#f8f7f3] animate-bounce">
            <svg className="w-5 h-5 text-[#2D6A4F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="4" x2="12" y2="15" strokeDasharray="3 3"></line>
              <polyline points="16 14 12 18 8 14"></polyline>
            </svg>
          </div>
          <div className="px-5 py-2 bg-[#E2EBE5] text-[#2D6A4F] rounded-full text-sm font-inter font-semibold tracking-wide text-center shadow-sm">
            Step 1 of your journey
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 ">

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          
          {/* Left Column (Sticky on lg+) */}
          <div className="lg:w-5/12 lg:sticky lg:top-28 flex flex-col pt-8">
            <div className="mb-2 font-fraunces text-3xl md:text-4xl text-black">
              01
            </div>
            <h2 className="font-fraunces text-3xl md:text-4xl lg:text-5xl text-black leading-[1.1] mb-4">
              Home Search<br/>Journal
            </h2>
            <p className="font-inter text-base md:text-lg text-gray-700 leading-[1.4] mb-6">
              Tell Riya who you are.<br className="hidden md:block"/>She finds the home that fits.
            </p>
            
            {/* Image: hidden on mobile, shown on lg+ */}
            <div className="hidden lg:block relative w-full h-[400px] md:h-[500px] mt-auto ">
              <img 
                src="/assets/home-search-journal/left-side-main-character.png" 
                alt="Riya holding journal" 
                className="w-full h-full object-contain object-left-bottom"
              />
            </div>
          </div>

          {/* Right Column (Scrolling Cards) */}
          <div className="lg:w-7/12 flex flex-col gap-5 md:gap-8 pb-12">
            {cards.map((card, index) => (
              <div 
                key={card.id}
                className={`w-full rounded-[20px] md:rounded-[28px] overflow-hidden ${card.bg} flex flex-col sticky shadow-sm`}
                style={{ 
                  top: `calc(80px + ${index * 16}px)`,
                  zIndex: index + 1
                }}
              >
                {/* Card Text Content */}
                <div className="p-5 md:p-8 lg:p-10 pb-0">
                  <h3 className="font-inter font-bold text-xl md:text-2xl lg:text-[1.875rem] leading-tight text-black tracking-tight mb-3">
                    {card.title}
                  </h3>
                  <p className="font-inter text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed max-w-[95%] font-medium">
                    {card.text}
                  </p>
                </div>
                
                {/* Card Image */}
                <div className="w-full mt-5 md:mt-8  flex justify-center">
                  <img 
                    src={card.img} 
                    alt={card.title} 
                    className="w-full  h-auto "
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
