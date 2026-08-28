"use client";

import React, { createContext, useContext, useState } from 'react';
import { trackCtaClick } from '@/lib/analytics';

type OpenModalArg = string | React.MouseEvent | undefined;

interface WaitlistContextType {
  isOpen: boolean;
  openModal: (source?: OpenModalArg) => void;
  closeModal: () => void;
}

const WaitlistContext = createContext<WaitlistContextType | null>(null);

export const WaitlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <WaitlistContext.Provider
      value={{
        isOpen,
        // Every CTA in the app flows through this single hook, so we track all
        // waitlist opens here in one place (no need to instrument each button).
        // Accepts an optional string source label ("header", "hero"…). Some call
        // sites pass a click event (onClick={openModal}) — that's ignored as a source.
        openModal: (source?: OpenModalArg) => {
          setIsOpen(true);
          if (typeof source === "string" && source) {
            trackCtaClick({ cta: "join_waitlist", source });
          } else {
            trackCtaClick();
          }
        },
        closeModal: () => setIsOpen(false),
      }}
    >
      {children}
    </WaitlistContext.Provider>
  );
};

export const useWaitlist = () => {
  const ctx = useContext(WaitlistContext);
  if (!ctx) throw new Error('useWaitlist must be used inside WaitlistProvider');
  return ctx;
};
