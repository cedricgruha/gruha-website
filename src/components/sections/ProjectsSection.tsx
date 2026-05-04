"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Curated from 2,000+ projects",
    description: "Every project in bengaluru",
    icon: "/assets/02-projects/Vector.svg"
  },
  {
    title: "Trust, built in",
    description: "RERA verified. OC status. Builder track record.\nNo surprises later.",
    icon: "/assets/02-projects/Vector (1).svg"
  },
  {
    title: "Filtered by your Journal",
    description: "Kabir applies your dealbreakers, preferences\n& priorities.",
    icon: "/assets/02-projects/Vector (2).svg"
  }
];

export const ProjectsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade and slide image from left
      if (imageRef.current) {
        gsap.fromTo(imageRef.current,
          { opacity: 0, x: -50 },
          { 
            opacity: 1, 
            x: 0, 
            duration: 1, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
            }
          }
        );
      }

      // Stagger list items
      if (contentRef.current) {
        gsap.fromTo(contentRef.current.children,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-[#F9F9F9] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 lg:gap-16">
          
          {/* Left Image */}
          <div className="w-full md:w-5/12 flex justify-center items-end">
            <img 
              ref={imageRef}
              src="/assets/02-projects/character-men.png" 
              alt="Kabir - Projects Curator" 
              className="w-full max-w-[280px] md:max-w-[380px] h-auto object-contain"
            />
          </div>
          
          {/* Right Content */}
          <div ref={contentRef} className="w-full md:w-6/12 flex flex-col justify-center">
            
            {/* Header */}
            <div className="mb-6 md:mb-8">
              <h2 className="font-fraunces text-3xl md:text-4xl lg:text-[2.75rem] text-black leading-[1.1] mb-1 tracking-tight">
                02
              </h2>
              <h2 className="font-fraunces text-3xl md:text-4xl lg:text-[2.75rem] text-black leading-[1.1] mb-3 tracking-tight">
                Projects
              </h2>
              
              <div className="w-10 h-0.5 bg-[#FE6235] mb-4 rounded-full"></div>
              
              <p className="font-inter text-base md:text-lg lg:text-xl text-gray-700 leading-[1.4] font-normal">
                Bengaluru is building 2,000+.<br className="hidden md:block" />
                Kabir shows you only yours.
              </p>
            </div>
            
            {/* Features List */}
            <div className="flex flex-col w-full max-w-xl">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`flex items-start py-5 ${index !== features.length - 1 ? 'border-b border-gray-200' : ''}`}
                >
                  {/* Icon */}
                  <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center mr-5 md:mr-6 pt-0.5">
                    <img 
                      src={feature.icon} 
                      alt="" 
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  
                  {/* Text */}
                  <div className="flex flex-col">
                    <h3 className="font-inter text-base md:text-lg font-bold text-black mb-1 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="font-inter text-[0.8125rem] md:text-sm text-gray-700 leading-relaxed font-medium whitespace-pre-line">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
          
        </div>
      </div>
    </section>
  );
};
