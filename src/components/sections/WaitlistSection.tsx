"use client";

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useWaitlist } from '@/contexts/WaitlistContext';

export const WaitlistSection = () => {
  const { openModal } = useWaitlist();
  return (
    <section className="relative w-full bg-[#111111] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 bottom-0 left-[-40%] right-[-40%] md:inset-0 z-0 opacity-40 pointer-events-none">
        <Image 
          src="/assets/looper-1.png"
          alt=""
          fill
          className="object-contain md:object-cover object-center"
        />
      </div>
      
      <div className="max-w-6xl mx-auto px-6 md:px-8 pt-16 pb-28 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          
          {/* Text Content */}
          <div className="flex flex-col max-w-xl">
            <h2 className="font-inter text-2xl md:text-3xl lg:text-[32px] font-bold text-white mb-3 tracking-tight leading-[1.2]">
              Be the first to see what matters.
            </h2>
            <p className="font-inter text-sm md:text-[15px] text-gray-400 leading-relaxed font-normal">
              Join the waitlist and get early access to Bengaluru&apos;s smartest way to find, filter, and finalise your home.
            </p>
          </div>
          
          {/* CTA Button */}
          <div className="flex-shrink-0 w-full md:w-auto">
            <button onClick={openModal} className="w-full md:w-auto bg-[#FE6235] hover:bg-[#E05020] text-white font-inter font-semibold text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors duration-300 group shadow-lg shadow-[#FE6235]/20">
              Join the Waitlist
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
};

