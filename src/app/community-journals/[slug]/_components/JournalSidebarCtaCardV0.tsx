"use client";

import React from "react";
import Image from "next/image";
import imgRiya from "@/imports/signal-2026-07-23-17-18-39-504.jpg";

const fd = "'Newsreader', Georgia, serif";
const fu = "'Inter Tight', system-ui, sans-serif";

const getImgSrc = (img: any): string => {
  if (!img) return "";
  if (typeof img === "string") return img;
  if (typeof img === "object" && img.src) return img.src;
  return String(img);
};

export interface JournalSidebarCtaCardV0Props {
  title?: string;
  description?: string;
  startJournalText?: string;
  adaptJournalText?: string;
  characterImage?: any;
  onStartJournal?: () => void;
  onAdaptJournal?: () => void;
}

export const JournalSidebarCtaCardV0: React.FC<JournalSidebarCtaCardV0Props> = ({
  title = "Ready to write your story?",
  description = "Let Riya build a personalised journal that guides you toward the right home.",
  startJournalText = "Start your journal",
  adaptJournalText = "Adapt this journal",
  characterImage = imgRiya,
  onStartJournal,
  onAdaptJournal,
}) => {
  return (
    <>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div
        className="relative overflow-hidden z-100"
        style={{
          borderRadius: 14,
          background: "rgba(17, 24, 39, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
        }}
      >
        {/* Background glow blobs */}
        <div
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full"
          style={{ background: "rgba(242, 90, 43, 0.15)", filter: "blur(80px)" }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full"
          style={{ background: "rgba(59, 130, 246, 0.08)", filter: "blur(80px)" }}
        />

        <div className="relative z-10 p-8 text-center">
          {/* AI Aura & Avatar */}
          <div className="relative inline-block mb-5">
            {/* Animated gradient aura */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "linear-gradient(to top right, #f25a2b, #7C3AED, #3B82F6)",
                filter: "blur(10px)",
                opacity: 0.35,
                animation: "pulse-glow 3s ease-in-out infinite",
              }}
            />
            {/* Rotating border ring */}
            <div
              className="absolute -inset-1.5 rounded-full"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                animation: "rotate-slow 12s linear infinite",
              }}
            />
            {/* Avatar */}
            <div
              className="relative w-16 h-16 rounded-full overflow-hidden"
              style={{ border: "2px solid rgba(255,255,255,0.2)", padding: 2, background: "#111827" }}
            >
              <Image
                src={characterImage || imgRiya}
                alt="Riya"
                width={64}
                height={64}
                className="w-full h-full object-cover object-top rounded-full"
              />
            </div>
            {/* Green active indicator — on the border */}
            <div
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full"
              style={{ background: "#4ADE80", border: "2.5px solid #111827" }}
            />
          </div>

          {/* Content */}
          <p
            className="text-gray-400 text-[13px] leading-relaxed mb-8 px-2"
            style={{ fontFamily: fu }}
          >
            {description}
          </p>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={onStartJournal}
              className="group relative w-full flex items-center justify-center gap-2 py-3.5 px-4 text-[14px] font-bold rounded-2xl text-white overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{
                background: "#f25a2b",
                fontFamily: fu,
                boxShadow: "0 0 0 rgba(242,90,43,0)",
                transition: "box-shadow 0.3s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 20px rgba(242,90,43,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0 rgba(242,90,43,0)";
              }}
            >
              <span className="relative z-10">{startJournalText}</span>
              <svg className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              {/* Shine sweep */}
              <div
                className="absolute inset-0 w-full h-full -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out"
                style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)" }}
              />
            </button>

            <button
              type="button"
              onClick={onAdaptJournal}
              className="w-full py-3.5 px-4 text-[14px] font-semibold rounded-2xl transition-colors hover:bg-white/5 active:scale-[0.98] cursor-pointer"
              style={{
                fontFamily: fu,
                color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {adaptJournalText}
            </button>
          </div>

          {/* Decorative waveform bars */}
          <div className="mt-8 flex justify-center gap-1 opacity-20">
            <div className="w-1 h-4 bg-white rounded-full" />
            <div className="w-1 h-6 bg-white rounded-full" />
            <div className="w-1 h-3 bg-white rounded-full" />
            <div className="w-1 h-5 bg-white rounded-full" />
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </div>
      </div>
    </>
  );
};

export default JournalSidebarCtaCardV0;
