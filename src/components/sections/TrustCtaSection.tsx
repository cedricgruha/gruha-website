"use client";

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useWaitlist } from '@/contexts/WaitlistContext';

export const TrustCtaSection = () => {
  const { openModal } = useWaitlist();
  return (
    <section className="relative w-full bg-[#1A1B1A] overflow-hidden pt-12 pb-24 md:py-16">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-60 pointer-events-none"
        style={{
          backgroundImage: 'url("/assets/3-cta/bg.svg")',
          backgroundSize: 'auto',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat'
        }}
      />
      
      <div className="container mx-auto px-6 md:px-8 max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6">
          
          {/* Left: Icon and Text */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 w-full md:w-3/4">
            <div className="flex-shrink-0 pt-0.5 md:pt-1">
              <Image 
                src="/assets/3-cta/Vector.svg" 
                alt="Trust Icon" 
                width={56}
                height={56}
                className="w-12 md:w-14 h-auto object-contain"
              />
            </div>
            
            <div className="flex flex-col text-center md:text-left">
              <h2 className="font-fraunces text-[28px] md:text-[36px] lg:text-[38px] font-medium text-white mb-3 tracking-[-0.5px] leading-[1.1]">
                Trust in every detail.
              </h2>
              <p className="font-inter text-sm md:text-[14px] text-gray-400 leading-[1.6] tracking-[-0.1px] font-normal whitespace-pre-line">
                RERA verified. OC status. Builder track record.<br className="hidden md:block" />
                No surprises later.
              </p>
            </div>
          </div>
          
          {/* Right: CTA Button */}
          <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-end">
            <button onClick={openModal} className="w-full md:w-auto bg-[#8BD8BE] hover:bg-[#74C9AD] text-[#111] font-inter font-medium text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors duration-300">
              Join the Waitlist
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
};

