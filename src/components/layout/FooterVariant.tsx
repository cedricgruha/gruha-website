"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const FooterVariant = () => {
  return (
    <footer className="bg-white pt-16 pb-12 text-black overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Logo Column */}
          <div className="flex flex-col items-start justify-start">
            <Link href="/" className="inline-block">
              <Image src="/assets/dark-logo.png" alt="Gruha.ai Logo" width={160} height={40} className="w-40 h-auto" />
            </Link>
          </div>

          {/* Email Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[#888] text-[0.7rem] font-bold tracking-[0.15em] uppercase">Email</h4>
            <Link href="mailto:hello@gruha.ai" className="text-black font-inter font-semibold text-sm hover:opacity-70 transition-opacity">
              hello@gruha.ai
            </Link>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[#888] text-[0.7rem] font-bold tracking-[0.15em] uppercase">Quick Links</h4>
            <ul className="flex flex-col gap-3 text-black font-inter font-semibold text-sm">
              <li><Link href="/" className="hover:opacity-70 transition-opacity">Home</Link></li>
              <li><Link href="/about" className="hover:opacity-70 transition-opacity">About us</Link></li>
              <li><Link href="/contact" className="hover:opacity-70 transition-opacity">Contact us</Link></li>
            </ul>
          </div>

          {/* Social Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[#888] text-[0.7rem] font-bold tracking-[0.15em] uppercase">Social</h4>
            <div className="flex items-center gap-3">
              <Link href="#" className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition-colors group">
                <Image src="/assets/socialmedia/Vector.svg" alt="Facebook" width={12} height={12} className="opacity-50 group-hover:opacity-100 transition-opacity invert" />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition-colors group">
                <Image src="/assets/socialmedia/vector-1.svg" alt="X/Twitter" width={12} height={12} className="opacity-50 group-hover:opacity-100 transition-opacity invert" />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition-colors group">
                <Image src="/assets/socialmedia/logo-instagram-1.svg" alt="Instagram" width={12} height={12} className="opacity-50 group-hover:opacity-100 transition-opacity invert" />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition-colors group">
                <Image src="/assets/socialmedia/vector-2.svg" alt="Pinterest" width={12} height={12} className="opacity-50 group-hover:opacity-100 transition-opacity invert" />
              </Link>
            </div>
          </div>
        </div>

        {/* Illustration Section */}
        <div className="relative w-full flex flex-col items-center">
          <div className="w-full max-w-6xl relative aspect-[16/9] md:aspect-[21/9]">
            <Image 
              src="/assets/footer-group.png" 
              alt="Gruha Specialists Team" 
              fill
              priority
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 1400px"
            />
          </div>
          
          <div className="text-center -mt-6 md:-mt-12 relative z-10">
            <h3 className="font-inter text-lg md:text-xl lg:text-2xl leading-[1.1] tracking-[-0.03em] text-[#1A1A1A] font-bold max-w-sm">
              Together, we make <br className="md:hidden" /> your perfect home happen
            </h3>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 flex justify-center">
          <p className="text-gray-400 text-xs font-inter tracking-wide">
            &copy; 2026 Gruha.ai
          </p>
        </div>
      </div>
    </footer>
  );
};
