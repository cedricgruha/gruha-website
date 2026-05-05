"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useWaitlist } from '@/contexts/WaitlistContext';

export const LastStepCta = () => {
  const { openModal } = useWaitlist();
  
  return (
    <section className="relative w-full bg-[#111111] py-20 md:py-32 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FE6235]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-8 max-w-4xl relative z-10 text-center">
        <h2 className="font-fraunces text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-[1.1] tracking-tight">
          Ready to find your <br className="hidden md:block" />
          <span className="text-[#FE6235]">perfect home</span> in Bengaluru?
        </h2>
        
        <p className="font-inter text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Join the exclusive cohort and let our specialists build your 
          personalized Home Search Journal today.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={openModal}
            className="w-full sm:w-auto bg-[#FE6235] hover:bg-[#E05020] text-white font-inter font-semibold text-lg px-10 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-[#FE6235]/20 hover:-translate-y-1"
          >
            Join the Waitlist
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
        <p className="mt-8 font-inter text-gray-500 text-sm">
          Limited slots available for Cohort 01.
        </p>
      </div>
    </section>
  );
};
