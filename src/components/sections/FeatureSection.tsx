"use client";

import  { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const FeatureSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in the title and text
      gsap.fromTo([titleRef.current, textRef.current],
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          }
        }
      );

      // Fade in the video
      gsap.fromTo(videoRef.current,
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: videoRef.current,
            start: "top 85%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-16 bg-[#FFF] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        <h2 
          ref={titleRef}
          className="font-fraunces text-3xl md:text-5xl text-black font-normal text-center mb-6 pb-4"
        >
          How we built Gruha.ai ?
        </h2>
        
        <p 
          ref={textRef}
          className="font-inter text-base md:text-2xl text-gray-700 font-normal text-center max-w-3xl mb-10 leading-relaxed"
          style={{ letterSpacing: '-0.2px' }}
        >
          Built from the ground up with AI at its core. Our focus is bringing you
          <br className="hidden md:block" /> closer to your dream home and experiences.
        </p>
        
        <div className="w-full max-w-4xl flex justify-center">
          <img 
            src="/assets/hero-bg.jpeg"
            className="w-full h-auto object-contain hidden sm:block"
            alt="How we built Gruha.ai ?"
          />
          <img 
            src="/assets/hero-mobile-bg.jpeg"
            className="w-full h-auto object-contain sm:hidden"
            alt="How we built Gruha.ai ?"
          />
        </div>
      </div>
    </section>
  );
};
