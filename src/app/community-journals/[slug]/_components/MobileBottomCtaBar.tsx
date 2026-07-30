"use client";

import React from "react";

const fu = "'Inter Tight', system-ui, sans-serif";

export interface MobileBottomCtaBarProps {
  startJournalText?: string;
  adaptJournalText?: string;
  onStartJournal?: () => void;
  onAdaptJournal?: () => void;
}

export const MobileBottomCtaBar: React.FC<MobileBottomCtaBarProps> = ({
  startJournalText = "Start your journal",
  adaptJournalText = "Adapt this journal",
  onStartJournal,
  onAdaptJournal,
}) => {
  return (
    <div
      className="block md:hidden fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 transition-transform duration-300"
      style={{
        background: "rgba(17, 24, 39, 0.96)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 -10px 30px rgba(0,0,0,0.35)",
      }}
    >
      <div className="max-w-md mx-auto flex items-center gap-2.5">
        <button
          type="button"
          onClick={onStartJournal}
          className="group relative flex-1 flex items-center justify-center gap-1.5 py-3 px-3.5 text-[13px] font-bold rounded-xl text-white overflow-hidden transition-all active:scale-[0.98] cursor-pointer"
          style={{
            background: "#f25a2b",
            fontFamily: fu,
            boxShadow: "0 4px 14px rgba(242,90,43,0.35)",
          }}
        >
          <span className="truncate">{startJournalText}</span>
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>

        <button
          type="button"
          onClick={onAdaptJournal}
          className="flex-1 py-3 px-3 text-[13px] font-semibold rounded-xl transition-colors hover:bg-white/5 active:scale-[0.98] cursor-pointer truncate text-center"
          style={{
            fontFamily: fu,
            color: "rgba(255,255,255,0.75)",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.05)",
          }}
        >
          {adaptJournalText}
        </button>
      </div>
    </div>
  );
};

export default MobileBottomCtaBar;
