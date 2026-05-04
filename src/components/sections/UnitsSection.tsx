"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const highlights = [
  {
    icon: "/assets/home-units/icon (2).svg",
    title: "Well ventilated",
    description: "Rooms with natural light"
  },
  {
    icon: "/assets/home-units/icon (3).svg",
    title: "Efficient layouts",
    description: "No wastage of space"
  },
  {
    icon: "/assets/home-units/icon (1).svg",
    title: "Private spaces",
    description: "Balcony, utility & more"
  }
];

export const UnitsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main section entry
      gsap.fromTo(textRef.current, 
        { opacity: 0, x: -50 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 1, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          }
        }
      );

      gsap.fromTo(imageRef.current, 
        { opacity: 0, scale: 0.95 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 1.2, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          }
        }
      );

      // Sequential highlight entry
      if (highlightsRef.current) {
        gsap.fromTo(highlightsRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.2,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: highlightsRef.current,
              start: "top 80%",
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#E5D7C6] overflow-hidden min-h-[700px] flex items-center">
      
      {/* Background Image Layer */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <img 
          src="/assets/home-units/home-units-bg.png" 
          alt="" 
          className="w-full h-full object-cover object-center md:object-right opacity-100"
        />
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10 py-12 md:py-16 lg:py-24">
        <div className="max-w-full md:max-w-xl">
          
          {/* Left Content */}
          <div ref={textRef}>
            <div className="mb-8">
              <h2 className="font-fraunces text-4xl md:text-[2.75rem] text-black leading-[1.1] mb-1 tracking-tight">
                03
              </h2>
              <h2 className="font-fraunces text-4xl md:text-[2.75rem] text-black leading-[1.1] mb-4 tracking-tight">
                 Home &amp; Units
              </h2>
              
              
              <div className="w-12 h-0.5 bg-[#FE6235] mb-6 rounded-full"></div>
              
              <div className="mt-6 md:mt-8">
                <p className="font-inter text-lg md:text-[1.375rem] lg:text-[2rem] font-light text-black leading-[1.1] tracking-tight mb-2">
                  Every space tells a story. <br/>
                  Find yours.
                </p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="font-inter text-sm md:text-base font-bold text-black uppercase mb-6 opacity-90">
                Unit Highlights
              </h3>
              
              <div ref={highlightsRef} className="space-y-5">
                {highlights.map((item, index) => (
                  <div key={index} className="flex items-center gap-5">
                    <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-transparent">
                      <img src={item.icon} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-inter text-base md:text-lg font-regular text-black leading-tight mb-0.5 tracking-tight">
                        {item.title}
                      </h4>
                      <p className="font-inter text-xs md:text-sm text-gray-700 font-medium opacity-80 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
