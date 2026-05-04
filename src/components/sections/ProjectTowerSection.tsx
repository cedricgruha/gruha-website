"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Master Plan",
    description: "Understand the entire layout at a glance.",
    icon: "/assets/04-project-tower/Vector.svg"
  },
  {
    title: "Tower Plans",
    description: "Compare towers, floors and unit configurations.",
    icon: "/assets/04-project-tower/Vector (1).svg"
  },
  {
    title: "Amenities",
    description: "See everything you'll love, inside & out.",
    icon: "/assets/04-project-tower/Vector (2).svg"
  },
  {
    title: "Construction updates",
    description: "See everything you'll love, inside & out.",
    icon: "/assets/04-project-tower/Vector (3).svg"
  }
];

export const ProjectTowerSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in the main text block
      gsap.fromTo(textRef.current,
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

      // Stagger in the feature items
      gsap.fromTo(featuresRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 60%",
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 md:py-16 lg:py-24 bg-[#FFF] overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
          
          {/* Left Video/Character */}
          <div className="w-full md:w-4/12 flex justify-center md:justify-start">
            <img
              src="/assets/drone.png" 
              className="w-full max-w-[280px] md:max-w-[380px] h-auto object-contain"
            />
          </div>

          {/* Right Content */}
          <div className="w-full md:w-8/12 flex flex-col items-start pt-0 md:pt-6">
            <div ref={textRef} className="w-full">
              <h2 className="font-fraunces font-semibold text-[1.75rem] md:text-[2.25rem] lg:text-[2.75rem] leading-none text-black mb-1">
                04
              </h2>
              
              <h2 className="font-fraunces font-semibold text-2xl md:text-[2.375rem] lg:text-[3.25rem] leading-[1.05] tracking-[-1px] md:tracking-[-1.5px] text-black mb-4 md:mb-5">
                Project <span className="font-normal italic">&</span> Tower<br />
                Intelligence
              </h2>
              
              <div className="w-10 md:w-16 h-0.5 bg-[#FE6235] mb-5 md:mb-8"></div>
              
              <p className="font-inter text-base md:text-xl lg:text-[1.75rem] text-gray-700 font-light leading-[1.2] tracking-[-0.5px] mb-6 md:mb-10">
                Big decisions need the full<br className="hidden md:block" /> picture.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 w-full">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  ref={el => { featuresRef.current[index] = el; }}
                  className="flex flex-col items-start"
                >
                  <div className="mb-3 h-9 flex items-end">
                    <img 
                      src={feature.icon} 
                      alt={feature.title} 
                      className="w-8 h-auto object-contain"
                    />
                  </div>
                  <h3 className="font-inter text-[1rem] font-semibold text-black mb-1 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="font-inter text-[0.875rem] text-gray-500 leading-[1.4]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
            
          </div>
          
        </div>
      </div>
    </section>
  );
};
