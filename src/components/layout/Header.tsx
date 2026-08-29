"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useWaitlist } from '@/contexts/WaitlistContext';

interface HeaderProps {
  forceSolid?: boolean;
  sticky?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ forceSolid = false, sticky = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const { openModal } = useWaitlist();
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`${sticky && scrolled ? 'fixed' : 'absolute'} top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-12 ${scrolled || forceSolid ? 'bg-[#111821] shadow-md py-4 border-b border-white/10' : 'bg-transparent py-6'
        }`}
    >
      <div className="max-w-[1400px] mx-auto px-0 sm:px-8 flex items-center justify-between">
        <Link href="/" className="relative z-10 flex items-center gap-2">
          <div className="relative h-8 w-32 md:h-10 md:w-40">

            {/* Mobile logo — always the standard logo (sm:hidden) */}
            <Image
              src="/assets/logo.png"
              alt="Gruha.ai Logo"
              fill
              className="object-contain object-left sm:hidden"
              priority
            />
            {/* Desktop logo — dark on home, standard elsewhere (hidden sm:block) */}
            <Image
              src={isHome ? "/assets/dark-logo.png" : "/assets/logo.png"}
              alt="Gruha.ai Logo"
              fill
              className="object-contain object-left hidden sm:block"
              priority
            />
          </div>
        </Link>


        <div className="flex items-center gap-3">
          {/* Mobile CTA - small, always visible */}
          <Button onClick={() => openModal("header_mobile")} variant="primary" size="sm" className="md:hidden bg-[#fc7c54] text-black hover:bg-[#fc7c54]/90 rounded-lg border-none shadow-none text-xs px-4 py-2">
            Join Waitlist
          </Button>
          <Button onClick={() => openModal("header_desktop")} variant="primary" size="sm" className="hidden md:inline-flex bg-[#fc7c54] text-white hover:bg-[#fc7c54]/90 rounded-lg border-none shadow-none text-sm px-6">
            Join Waitlist
          </Button>
        </div>
      </div>
    </header>
  );
};
