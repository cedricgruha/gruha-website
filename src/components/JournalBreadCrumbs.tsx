'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Copy } from 'lucide-react';
import ProgressBar from './ui/ProgressBar';

const JournalBreadCrumbs: React.FC = () => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                const currentProgress = (window.scrollY / totalHeight) * 100;
                setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <><div className=" top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Left Section: Logo & Breadcrumbs */}
                <div className="flex items-center space-x-6 sm:space-x-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center shrink-0">
                        <Image
                            src="/journals/Logo.png"
                            alt="Logo"
                            width={36}
                            height={36}
                            className="h-9 w-auto object-contain"
                            priority />
                    </Link>

                    {/* Breadcrumbs */}
                    <nav aria-label="Breadcrumb" className="hidden sm:flex items-center space-x-2.5 text-sm font-medium text-slate-500">
                        <Link
                            href="/"
                            className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
                        >
                            <Home className="h-4 w-4 text-slate-400" />
                            <span>Home</span>
                        </Link>

                        <span className="text-slate-300 font-normal">/</span>

                        <Link
                            href="/"
                            className="hover:text-slate-900 transition-colors"
                        >
                            Community Journals
                        </Link>

                        <span className="text-slate-300 font-normal">/</span>

                        <span className="font-semibold text-slate-900">
                            The First-EMI Family
                        </span>
                    </nav>
                </div>

                {/* Right Section: Action Button */}
                <div className="flex items-center">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#FF583A] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#e0482b] active:scale-[0.98] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF583A]"
                    >
                        <Copy className="h-4 w-4 stroke-[2.25]" />
                        <span>Adapt this Journal</span>
                    </button>
                </div>
                <ProgressBar />
            </div>


        </div></>
    );
};

export default JournalBreadCrumbs;