"use client";

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useWaitlist } from '@/contexts/WaitlistContext';

export const CtaSection = () => {
  const { openModal } = useWaitlist();
  return (
    <section className="relative w-full bg-[#121622] overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[100%] md:w-[58%] h-full pointer-events-none select-none z-0">
        <Image
          src="/assets/cta-bg.png"
          alt=""
          aria-hidden="true"
          fill
          className="object-contain object-right-bottom"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      
      <div className="container mx-auto px-6 md:px-8 max-w-6xl relative z-10 pt-16 pb-32 md:py-32">
        <div className="flex flex-col items-start max-w-3xl">
          <h2 className="font-inter text-3xl md:text-[2.5rem] lg:text-[2.75rem] font-bold text-white mb-7 tracking-tight leading-[1.15]">
            Be the first to experience<br className="hidden md:block" />
          the <span className="text-[#8B5CF6]">future of real estate</span> decisions.
        </h2>

          <button onClick={openModal} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-inter font-semibold text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors duration-300">
          Join the Waitlist
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      </div>
    </section>
  );
};
