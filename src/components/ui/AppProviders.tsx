"use client";

import React from 'react';
import { WaitlistProvider } from '@/contexts/WaitlistContext';
import { WaitlistModal } from '@/components/ui/WaitlistModal';

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <WaitlistProvider>
    {children}
    <WaitlistModal />
  </WaitlistProvider>
);
