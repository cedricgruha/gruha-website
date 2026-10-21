"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const FeatureSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const mediaWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  // 1. Detect desktop breakpoint (sm: 640px+) so mobile never mounts/downloads video
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 640px)');
    setIsDesktop(mql.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // 2. Lazy-load the video only on desktop when media wrapper comes near viewport
  useEffect(() => {
    if (!isDesktop) return;

    const target = mediaWrapperRef.current;
    if (!target) return;

    if (!('IntersectionObserver' in window)) {
      setShouldLoadVideo(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px 0px' }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [isDesktop]);

  // 3. When video src is attached on desktop, start playback safely
  useEffect(() => {
    if (shouldLoadVideo && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Handle autoplay policy/abort gracefully if needed
      });
    }
  }, [shouldLoadVideo]);

  useEffect(() => {
    let ctx: gsap.Context | undefined;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
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

      // Fade in the media wrapper
      if (mediaWrapperRef.current) {
        gsap.fromTo(mediaWrapperRef.current,
          { opacity: 0, y: 40 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1.2, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: mediaWrapperRef.current,
              start: "top 85%",
            }
          }
        );
      }
    }, containerRef);
    }, 500);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className="py-16 bg-[#FFF] md:bg-[#f1eff1] overflow-hidden">
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
        
        <div ref={mediaWrapperRef} className="w-full max-w-4xl flex justify-center">
          {/* Desktop only: autoplay video (lazy-loaded as user scrolls near) */}
          {isDesktop && (
            <video
              ref={videoRef}
              src={shouldLoadVideo ? "/assets/white-4_001.mp4" : undefined}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              className="w-full h-auto object-contain hidden sm:block"
            />
          )}
          {/* Mobile: static image */}
          <Image
            src="/assets/hero-mobile-bg.jpeg"
            width={600}
            height={400}
            sizes="(max-width: 640px) 450px, 600px"
            className="w-full h-auto object-contain sm:hidden"
            alt="How we built Gruha.ai ?"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};
