"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const listItems = [
  {
    title: "How efficiently is\nspace used?",
    description: "Measure of usable, functional space\nacross the entire project.",
    image: "/assets/list-after-project/ChatGPT Image May 2, 2026, 12_46_43 PM 1.png"
  },
  {
    title: "Construction\nProgress",
    description: "Measure of usable, functional space\nacross the entire project.",
    image: "/assets/list-after-project/ChatGPT Image May 2, 2026, 12_46_43 PM 2.png"
  },
  {
    title: "Movement &\nAccess",
    description: "Understand real walking distances\nand daily movement inside the\nproject.",
    image: "/assets/list-after-project/ChatGPT Image May 2, 2026, 12_46_43 PM 3.png"
  },
  {
    title: "Sun & Shadow\nSimulation",
    description: "See how sunlight and shadows move\nacross your project and affect your\nselected unit.",
    image: "/assets/list-after-project/ChatGPT Image May 2, 2026, 12_46_43 PM 4.png"
  }
];

export const ProjectListSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      rowsRef.current.forEach((row, index) => {
        if (row) {
          gsap.fromTo(row,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: row,
                start: "top 80%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-16 md:py-24 bg-[#F6F9F8] overflow-hidden w-full">
      <div className="flex flex-col gap-12 md:gap-20 w-full">
          {listItems.map((item, index) => (
            <div 
              key={index}
              ref={el => { rowsRef.current[index] = el; }}
              className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0 w-full"
            >
              {/* Text Content */}
              <div className="w-full md:w-5/12 pl-4 md:pl-[max(2rem,calc((100vw-1152px)/2))] pr-4 md:pr-10 lg:pr-16 flex flex-col justify-center py-4 md:py-0">
                <h2 className="font-inter font-bold text-2xl md:text-xl lg:text-4xl leading-[1.2] tracking-[-0.5px] text-black mb-2 whitespace-pre-line">
                  {item.title}
                </h2>
                <p className="font-inter text-xs md:text-lg leading-[1.5] tracking-[-0.2px] text-black/75 font-normal whitespace-pre-line">
                  {item.description}
                </p>
              </div>

              {/* Image Content */}
              <div className="w-full md:w-7/12 flex justify-end pl-8">
                <img 
                  src={item.image} 
                  alt={item.title.replace(/\n/g, ' ')}
                  className="w-full h-auto object-cover rounded-l-2xl md:rounded-l-[32px] shadow-[0_16px_48px_rgba(0,0,0,0.12)]"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};
