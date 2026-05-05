"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const FinalCtaSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );

      gsap.fromTo(buttonRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full pt-10 pb-10 md:py-14 lg:py-0 lg:pb-5 bg-[#F6F7F9] overflow-hidden border-1 border-[#bce0d4] "
    >
      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          
          {/* Left Content */}
          <div ref={contentRef} className="w-full md:w-4/6 flex flex-col items-start">
            <h2 className="font-fraunces text-[1.375rem] md:text-[1.75rem] lg:text-[2.25rem] leading-[1.1] font-semibold text-black tracking-[-0.5px] mb-3 md:mb-4">
              Make your next home decision <br className="hidden md:block" />
              with <span className="text-[#3DBCA6]">real data</span>.
            </h2>
            
            <div className="w-10 h-[2px] bg-[#3DBCA6] mb-4"></div>
            
            <p className="font-inter text-xs md:text-sm lg:text-[0.9375rem] text-gray-600 leading-relaxed max-w-[400px]">
              Stop guessing. Start seeing the reality around every property.
            </p>
          </div>

          {/* Right Content / Image & Button */}
          <div className="w-full md:w-3/6 flex flex-col items-center justify-center gap-4 md:gap-5 mt-2 md:mt-0">
            <img 
              src="/assets/CTA-last.png" 
              alt="Data visualization"
              className="w-full max-w-[240px] md:max-w-[380px] lg:max-w-[420px] h-auto object-contain pointer-events-none"
            />
            <button 
              ref={buttonRef}
              className="w-full md:w-auto bg-[#3DBCA6] hover:bg-[#32A893] text-white font-inter font-medium text-sm px-10 py-3 rounded-md shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative z-20"
            >
              Join the waitlist
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
};
