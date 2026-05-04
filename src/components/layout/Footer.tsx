"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useWaitlist } from '@/contexts/WaitlistContext';

export const Footer = () => {
  const { openModal } = useWaitlist();
  return (
    <footer className="bg-[#1C1C1E] pt-24 pb-10 text-white">
      <div className="container mx-auto px-6 md:px-12 max-w-[1400px]">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 pr-0 lg:pr-12">
            <Link href="/" className="inline-block mb-6">
              <div className="text-[2rem] font-inter font-bold tracking-tight">
                gruha<span className="text-gray-400 text-xl font-normal ml-[2px]">.ai</span>
              </div>
            </Link>
            <p className="text-[#A1A1AA] font-inter text-[0.9375rem] leading-[1.7] mb-10 max-w-[300px]">
              Lorem ipsum dolor sit amet consectetur urna congue.
            </p>
            <button onClick={openModal} className="bg-[#D2A574] hover:bg-[#B58D61] text-[#111] font-inter font-medium text-[0.9375rem] px-6 py-3.5 rounded-lg flex items-center gap-2 transition-all duration-300">
              Join Waitlist
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Contact & Email Column */}
          <div className="lg:col-span-3 flex flex-col gap-10">
            <div>
              <h4 className="text-[#888] text-xs font-bold tracking-[0.1em] uppercase mb-6">Contact</h4>
              <ul className="flex flex-col gap-3 text-[#E4E4E7] font-inter text-[0.9375rem]">
                <li>(888) 456 7890</li>
                <li>(888)1234-4567</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#888] text-xs font-bold tracking-[0.1em] uppercase mb-6">Email</h4>
              <Link href="mailto:info@example.com" className="text-[#E4E4E7] font-inter text-[0.9375rem] hover:text-white underline underline-offset-[5px] decoration-gray-500 hover:decoration-white transition-colors">
                info@example.com
              </Link>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2">
            <h4 className="text-[#888] text-xs font-bold tracking-[0.1em] uppercase mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-4 text-[#E4E4E7] font-inter text-[0.9375rem]">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About us</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/license" className="hover:text-white transition-colors">License</Link></li>
            </ul>
          </div>

          {/* Address & Social Column */}
          <div className="lg:col-span-3 flex flex-col gap-10">
            <div>
              <h4 className="text-[#888] text-xs font-bold tracking-[0.1em] uppercase mb-6">Address</h4>
              <p className="text-[#E4E4E7] font-inter text-[0.9375rem] leading-[1.7] max-w-[250px]">
                410 Sandtown,<br />
                California 94001, USA
              </p>
            </div>
            <div>
              <h4 className="text-[#888] text-xs font-bold tracking-[0.1em] uppercase mb-6">Social</h4>
              <div className="flex items-center gap-3">
                <Link href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:border-white transition-colors group">
                  <img src="/assets/socialmedia/Vector.svg" alt="Facebook" className="w-[14px] h-[14px] opacity-70 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:border-white transition-colors group">
                  <img src="/assets/socialmedia/Vector (1).svg" alt="X/Twitter" className="w-[14px] h-[14px] opacity-70 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:border-white transition-colors group">
                  <img src="/assets/socialmedia/logo-instagram 1.svg" alt="Instagram" className="w-[14px] h-[14px] opacity-70 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:border-white transition-colors group">
                  <img src="/assets/socialmedia/Vector (2).svg" alt="Pinterest" className="w-[14px] h-[14px] opacity-70 group-hover:opacity-100 transition-opacity" />
                </Link>
              </div>
            </div>
          </div>
          
        </div>

        {/* Bottom Border and Copyright */}
        <div className="border-t border-[#333] pt-8 flex justify-center items-center">
          <p className="text-[#A1A1AA] font-inter text-sm">
            &copy; 2026 Gruha.ai
          </p>
        </div>
        
      </div>
    </footer>
  );
};
