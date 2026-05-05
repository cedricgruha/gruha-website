"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { JourneyBadge } from './JourneyBadge';
import { StickySidebar } from './StickySidebar';
import { StackingCard, CardData } from './StackingCard';
import { SectionFeatures, FeatureData } from './SectionFeatures';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface BaseStepSectionProps {
  step: number | string;
  number: string;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  sidebarImage: string;
  cards: CardData[];
  features?: FeatureData[];
  sectionId?: string;
  bgClass?: string;
  topOffset?: number;
  spacing?: number;
  badgeMarginTop?: string;
}

export const BaseStepSection: React.FC<BaseStepSectionProps> = ({
  step,
  number,
  title,
  description,
  sidebarImage,
  cards,
  features,
  sectionId,
  bgClass = "bg-[#F9F9F9]",
  topOffset = 120,
  spacing = 16,
  badgeMarginTop = "-mt-19 md:-mt-23"
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null); // This is the sidebar image container
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade and slide sidebar from left
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

      // Stagger features list items
      if (featuresRef.current) {
        gsap.fromTo(featuresRef.current.children,
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
    <section id={sectionId} ref={sectionRef} className={`py-12 md:py-16 ${bgClass} relative`}>
      {/* <JourneyBadge step={step} className={badgeMarginTop} /> */}

      <div className="max-w-6xl mx-auto px-4 md:px-6 ">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          
          {/* Left Column (Sticky Sidebar) */}
          <div ref={imageRef} className="lg:w-5/12 lg:sticky lg:top-28 flex flex-col pt-8">
            <StickySidebar
              number={number}
              title={title}
              description={description}
              image={sidebarImage}
            />
          </div>

          {/* Right Column (Scrolling Cards) */}
          <div className="lg:w-6/12 flex flex-col gap-5 md:gap-8 pb-12">
            {cards.map((card, index) => (
              <StackingCard 
                key={card.id} 
                card={card} 
                index={index} 
                topOffset={topOffset}
                spacing={spacing}
              />
            ))}
          </div>
        </div>

        {/* Features List */}
        {features && (
          <div ref={featuresRef}>
            <SectionFeatures features={features} />
          </div>
        )}
      </div>
    </section>
  );
};
