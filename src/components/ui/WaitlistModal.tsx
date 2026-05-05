"use client";

import React, { useEffect, useRef, useState } from 'react';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useWaitlist } from '@/contexts/WaitlistContext';

import { WaitlistForm } from './WaitlistForm';

export const WaitlistModal = () => {
  const { isOpen, closeModal } = useWaitlist();
  const overlayRef = useRef<HTMLDivElement>(null);

  /* Lock body scroll when open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* Close on ESC */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeModal]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Join the Waitlist"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) closeModal(); }}
    >
      <div className="absolute inset-0 bg-[#1C1C1E]/75 backdrop-blur-sm" />

      <div className="relative w-full max-w-md bg-[#FDFAF7] rounded-2xl shadow-2xl overflow-y-auto max-h-[calc(100vh-2rem)] animate-modal-in">
        <div className="bg-[#1C1C1E] px-7 pt-7 pb-6 relative">
          <button
            onClick={closeModal}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <span className="inline-block font-inter text-[0.625rem] font-bold tracking-[0.18em] uppercase text-[#FE6235] bg-[#FE6235]/10 px-2.5 py-1 rounded-full mb-3">
            Early Access
          </span>
          <h2 className="font-fraunces text-[1.625rem] font-semibold text-white leading-snug">
            Join the Waitlist
          </h2>
          <p className="font-inter text-sm text-[#A1A1AA] mt-1.5">
            Be among the first to experience Gruha.ai in Bengaluru.
          </p>
        </div>

        <div className="px-7 py-6">
          <WaitlistForm />
          <div className="flex justify-center mt-2">
            <button
              onClick={closeModal}
              className="font-inter text-sm font-semibold text-[#FE6235] hover:text-[#E05020] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .animate-modal-in { animation: modalIn 0.22s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>
    </div>
  );
};
