"use client";

import React, { useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const CohortSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in content from left
      if (contentRef.current) {
        gsap.fromTo(contentRef.current.children,
          { opacity: 0, x: -30 },
          { 
            opacity: 1, 
            x: 0, 
            duration: 0.8, 
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
            }
          }
        );
      }

      // Slide image up from bottom
      if (imageRef.current) {
        gsap.fromTo(imageRef.current,
          { opacity: 0, y: 100 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="bg-[#1A222E] pt-24 pb-0 overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          
          {/* Left Content */}
          <div ref={contentRef} className="md:w-1/2 flex flex-col z-10 pb-24">
            <p className="text-[#3BAE8B] font-inter font-medium text-sm md:text-base tracking-widest uppercase mb-8">
              Cohort 01 . Bengaluru . Open
            </p>
            
            <h2 className="font-fraunces text-5xl md:text-[64px] text-white leading-[1.1] mb-8">
              Eight Specialists.<br />
              One Journal.<br />
              Cohort 01.
            </h2>
            
            <p className="font-inter text-xl md:text-2xl text-gray-300 leading-relaxed max-w-xl mb-12 font-light">
              We&apos;re rolling out Bengaluru one cohort at a time — so every Journal
              gets the full team&apos;s attention.
            </p>
            
            <div>
              <button className="bg-[#EE7456] hover:bg-[#E06548] text-white font-inter font-medium text-lg px-8 py-4 rounded-xl flex items-center gap-3 transition-colors duration-300 group shadow-lg shadow-[#EE7456]/20">
                Join Cohort 01
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="md:w-1/2 flex justify-end items-end h-full pt-10 md:pt-0 self-end">
            <img 
              ref={imageRef}
              src="/assets/cohort-1/Frame%201597884646.png" 
              alt="Gruha.ai Specialist" 
              className="w-full max-w-[600px] h-auto object-contain object-bottom relative -mb-1"
              style={{ maxHeight: '600px' }}
            />
          </div>
          
        </div>
      </div>
    </section>
  );
};
