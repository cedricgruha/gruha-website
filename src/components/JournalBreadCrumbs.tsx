'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Copy } from 'lucide-react';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export interface JournalBreadCrumbsProps {
    items?: BreadcrumbItem[];
    currentTitle?: string;
    onAdaptJournal?: () => void;
    adaptButtonText?: string;
}

const JournalBreadCrumbs: React.FC<JournalBreadCrumbsProps> = ({
    items,
    currentTitle,
    onAdaptJournal,
    adaptButtonText = 'Adapt this Journal',
}) => {
    // Default breadcrumb hierarchy if custom items are not provided
    const defaultItems: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Community Journals', href: '/' },
    ];

    const breadcrumbs = items || defaultItems;
    const activeLabel = currentTitle || 'Journal';

    return (
        <div className="top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
            <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-8">

                {/* Left Section: Logo & Dynamic Breadcrumbs */}
                <div className="flex items-center space-x-6 sm:space-x-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center shrink-0">
                        <Image
                            src="/journals/Logo.png"
                            alt="Logo"
                            width={36}
                            height={36}
                            className="h-9 w-auto object-contain"
                            priority
                        />
                    </Link>

                    {/* Dynamic Breadcrumbs */}
                    <nav aria-label="Breadcrumb" className="hidden sm:flex items-center space-x-2.5 text-sm font-medium text-slate-500">
                        {breadcrumbs.map((item, idx) => (
                            <React.Fragment key={idx}>
                                {item.href ? (
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
                                    >
                                        {idx === 0 && <Home className="h-4 w-4 text-slate-400" />}
                                        <span>{item.label}</span>
                                    </Link>
                                ) : (
                                    <span>{item.label}</span>
                                )}
                                <span className="text-slate-300 font-normal">/</span>
                            </React.Fragment>
                        ))}

                        {/* Active Breadcrumb Title */}
                        <span className="font-semibold text-slate-900 truncate max-w-[280px] md:max-w-[420px]">
                            {activeLabel}
                        </span>
                    </nav>
                </div>


            </div>
        </div>
    );
};

export default JournalBreadCrumbs;