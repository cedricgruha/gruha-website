"use client";

import React, { createContext, useContext, useState } from 'react';

interface WaitlistContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const WaitlistContext = createContext<WaitlistContextType | null>(null);

export const WaitlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <WaitlistContext.Provider value={{ isOpen, openModal: () => setIsOpen(true), closeModal: () => setIsOpen(false) }}>
      {children}
    </WaitlistContext.Provider>
  );
};

export const useWaitlist = () => {
  const ctx = useContext(WaitlistContext);
  if (!ctx) throw new Error('useWaitlist must be used inside WaitlistProvider');
  return ctx;
};
