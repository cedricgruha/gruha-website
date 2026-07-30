"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import imgRiya from "@/imports/signal-2026-07-23-17-18-39-504.jpg";
import imgKabir from "@/imports/signal-2026-07-23-17-32-02-937_005.jpg";
import imgAnanya from "@/imports/signal-2026-07-23-17-32-02-937_004.jpg";
import imgArjun from "@/imports/signal-2026-07-23-17-32-02-937_003.jpg";
import imgKaran from "@/imports/signal-2026-07-23-17-32-02-937_002.jpg";
import imgSharon from "@/imports/signal-2026-07-23-17-32-02-937.jpg";

export interface AgentCardItem {
  id: number | string;
  name: string;
  status: string;
  role: string;
  description: string;
  image: string;
  grad: [string, string];
  active?: boolean;
}

export const defaultAgentCards: AgentCardItem[] = [
  {
    id: 1,
    name: "Riya",
    status: "Active",
    role: "AI Real Estate Companion",
    description: "Understands your needs, guides you with clarity, and helps you make the right move.",
    image: imgRiya.src,
    grad: ["#9B6EF3", "#C4B5FD"],
    active: true,
  },
  {
    id: 2,
    name: "Kabir",
    status: "Active",
    role: "Projects Curator",
    description: "Handpicks projects that match your stage of life, budget, and builder trust score.",
    image: imgKabir.src,
    grad: ["#3B82F6", "#93C5FD"],
    active: true,
  },
  {
    id: 3,
    name: "Ananya",
    status: "Active",
    role: "Floor Plan Specialist",
    description: "Reads layouts for liveability - light, flow, future-proofing, and what the brochure won't tell you.",
    image: imgAnanya.src,
    grad: ["#10B981", "#6EE7B7"],
    active: true,
  },
  {
    id: 4,
    name: "Arjun",
    status: "Not at this stage",
    role: "Project Analyst",
    description: "Stress-tests builder credibility, delivery timelines, and project-level risks before you commit.",
    image: imgArjun.src,
    grad: ["#F59E0B", "#FCD34D"],
    active: false,
  },
  {
    id: 5,
    name: "Karan",
    status: "Not at this stage",
    role: "Location Explorer",
    description: "Maps micro-market dynamics, commute realities, school catchments, and neighbourhood trajectories.",
    image: imgKaran.src,
    grad: ["#F43F5E", "#FDA4AF"],
    active: false,
  },
  {
    id: 6,
    name: "Sharon",
    status: "Not at this stage",
    role: "Lifestyle Curator",
    description: "Matches the neighbourhood's social fabric to how you actually live, not how you wish you did.",
    image: imgSharon.src,
    grad: ["#14B8A6", "#5EEAD4"],
    active: false,
  },
];

export interface AgentCardSliderProps {
  cards?: AgentCardItem[];
  className?: string;
}

export const AgentCardSlider: React.FC<AgentCardSliderProps> = ({
  cards: initialCards,
  className = "",
}) => {
  const cardsToRender = initialCards && initialCards.length > 0 ? initialCards : defaultAgentCards;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const n = cardsToRender.length;

  const getStackStyle = (offset: number) => {
    let rotation = 0;
    let xOffset = 0;
    let scale = 1;
    let opacity = 1;
    let zIndex = n - offset;

    if (offset === 0) {
      rotation = 0;
      xOffset = 0;
      scale = 1;
      zIndex = 10;
    } else if (offset === 1) {
      rotation = -7;
      xOffset = -18;
      scale = 0.94;
      zIndex = 8;
    } else if (offset === 2) {
      rotation = 7;
      xOffset = 18;
      scale = 0.94;
      zIndex = 6;
    } else {
      rotation = 0;
      xOffset = 0;
      scale = 0.88;
      opacity = 0;
      zIndex = 1;
    }

    return { rotation, xOffset, scale, opacity, zIndex };
  };

  useLayoutEffect(() => {
    cardsToRender.forEach((_, idx) => {
      const card = cardsRef.current[idx];
      if (!card) return;

      const offset = (idx - activeIndex + n) % n;
      const target = getStackStyle(offset);

      gsap.to(card, {
        x: target.xOffset,
        y: 0,
        rotation: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
        zIndex: target.zIndex,
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  }, [activeIndex, cardsToRender, n]);

  const nextSlide = () => {
    if (isAnimating || n <= 1) return;
    setIsAnimating(true);

    const currentCardEl = cardsRef.current[activeIndex];
    if (!currentCardEl) {
      setIsAnimating(false);
      return;
    }

    gsap.to(currentCardEl, {
      x: 150,
      y: -10,
      rotation: 16,
      opacity: 0,
      scale: 0.88,
      duration: 0.28,
      ease: "power2.in",
      onComplete: () => {
        const targetBack = getStackStyle(n - 1);
        gsap.set(currentCardEl, {
          x: targetBack.xOffset + 15,
          y: 0,
          rotation: targetBack.rotation,
          scale: 0.88,
          opacity: 0,
          zIndex: targetBack.zIndex,
        });

        setActiveIndex((prev) => (prev + 1) % n);
        setIsAnimating(false);
      },
    });
  };

  const prevSlide = () => {
    if (isAnimating || n <= 1) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + n) % n);
    setIsAnimating(false);
  };

  const handlePrevClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    prevSlide();
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    nextSlide();
  };

  const fd = "'Newsreader', Georgia, serif";
  const fu = "'Inter Tight', system-ui, sans-serif";

  return (
    <div
      className={`group relative flex flex-col items-center justify-center w-full h-full min-h-[410px] p-4 overflow-hidden select-none cursor-pointer ${className}`}
      onClick={nextSlide}
    >
      <div className="relative w-[235px] sm:w-[245px] h-[340px]" ref={containerRef}>
        {/* Hover Navigation Arrows (Small White Round Buttons) */}
        {n > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous card"
              onClick={handlePrevClick}
              className="absolute -left-4 sm:-left-5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 shadow-md hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              type="button"
              aria-label="Next card"
              onClick={handleNextClick}
              className="absolute -right-4 sm:-right-5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 shadow-md hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}
        {cardsToRender.map((card, index) => {
          const offset = (index - activeIndex + n) % n;
          const displayNum = offset + 1;
          const isActive = card.active !== false;

          return (
            <div
              key={card.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="absolute inset-0 rounded-[24px] flex flex-col overflow-hidden shadow-2xl"
              style={{
                background: `linear-gradient(160deg, ${card.grad[0]}, ${card.grad[1]})`,
              }}
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between px-4 pt-4">
                <span
                  className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.25)", color: "white", fontFamily: fu }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full inline-block"
                    style={{ background: isActive ? "#86EFAC" : "rgba(255,255,255,0.4)" }}
                  />
                  {isActive ? "Active" : "Not at this stage"}
                </span>
                <span className="text-[10px]" style={{ fontFamily: fu, color: "rgba(255,255,255,0.7)" }}>
                  {displayNum} of {n}
                </span>
              </div>

              {/* Profile Image */}
              <div className="flex justify-center mt-4">
                <div
                  className="rounded-full overflow-hidden flex-none"
                  style={{
                    width: 100,
                    height: 100,
                    border: "3px solid rgba(255,255,255,0.4)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                  }}
                >
                  <Image
                    src={card.image}
                    alt={card.name}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Name */}
              <p
                className="text-center text-[24px] font-semibold mt-3 leading-tight text-white"
                style={{ fontFamily: fd }}
              >
                {card.name}
              </p>

              {/* Role Pill */}
              <div className="flex justify-center mt-2">
                <span
                  className="flex items-center gap-1 text-[10px] font-medium px-3 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.2)", color: "white", fontFamily: fu }}
                >
                  <svg width="8" height="8" viewBox="0 0 10 10">
                    <path d="M5 0.5 L5.8 3.8 L9.5 5 L5.8 6.2 L5 9.5 L4.2 6.2 L0.5 5 L4.2 3.8 Z" fill="white" />
                  </svg>
                  {card.role}
                </span>
              </div>

              {/* Description */}
              <p
                className="text-center text-[11.5px] leading-[1.55] mx-5 mt-3"
                style={{ fontFamily: fu, color: "rgba(255,255,255,0.8)" }}
              >
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Pagination — pill-shaped dots */}
      <div className="flex items-center justify-center gap-1.5 mt-5 z-10">
        {cardsToRender.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex(i);
            }}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? 20 : 6,
              height: 6,
              background: i === activeIndex ? cardsToRender[activeIndex].grad[0] : "#CBD5E1",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AgentCardSlider;
