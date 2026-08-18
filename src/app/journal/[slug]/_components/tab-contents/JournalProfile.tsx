"use client";

import React from "react";
import Image from "next/image";
import { Briefcase, IndianRupee, Heart, TrendingUp, Hourglass, FileCheck } from "lucide-react";

export interface BuyerProfile {
    name: string;
    age: number;
    role: string;
    tags: string[];
    image: string;
}

export interface StatItem {
    icon: React.ReactNode;
    label: string;
    value: string;
    tag: string;
}

export interface PriorityItem {
    image: string;
    title: string;
    scoreLabel: string;
    scorePercentage: number;
    description: string;
}

export interface JournalProfileProps {
    aboutLabel?: string;
    title: string;
    description: string;
    buyers: BuyerProfile[];
    sharedVisionTitle?: string;
    sharedVisionDescription: string;
    sharedVisionImage: string;
    stats: StatItem[];
    prioritiesTitle?: string;
    priorities: PriorityItem[];
}

export const JournalProfile: React.FC<JournalProfileProps> = ({
    aboutLabel = "ABOUT",
    title,
    description,
    buyers,
    sharedVisionTitle = "Shared vision",
    sharedVisionDescription,
    sharedVisionImage,
    stats,
    prioritiesTitle = "Top priorities right now",
    priorities,
}) => {
    return (
        <section id="profile" className="w-full bg-white text-slate-900 p px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-8 sm:space-y-12">

                {/* Header */}
                <div className="text-center space-y-2">
                    <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase font-inter">{aboutLabel}</p>
                    <h2 className="text-3xl sm:text-4xl font-fraunces font-normal text-slate-900">{title}</h2>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-inter">
                        {description}
                    </p>
                </div>

                {/* Bio Cards + Shared Vision */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {buyers.map((buyer, idx) => (
                        <div key={idx} className="lg:col-span-4 flex flex-col justify-between rounded-[2rem] bg-white p-5 sm:p-6 border border-slate-100 shadow-xs">
                            <div>
                                {/* Portrait Image Box */}
                                <div className="relative aspect-[4/3.8] w-full rounded-[1.5rem] overflow-hidden bg-slate-100 mb-5">
                                    <Image
                                        src={buyer.image}
                                        alt={buyer.name}
                                        fill
                                        className="object-cover object-top"
                                        priority
                                    />
                                </div>

                                {/* Profile Details */}
                                <div className="text-center space-y-1">
                                    <h3 className="text-lg font-bold text-[#334155] font-inter">
                                        {buyer.name} ({buyer.age})
                                    </h3>
                                    <p className="text-xs font-semibold text-[#8B96A5] font-inter">
                                        {buyer.role}
                                    </p>
                                </div>
                            </div>

                            {/* Trait Badges */}
                            <div className="flex flex-wrap justify-center items-center gap-2 pt-4">
                                {buyer.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-[11px] font-semibold text-[#64748B] bg-[#F1F5F9] px-3 py-1.5 rounded-full tracking-wide font-inter"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Shared Vision Card */}
                    <div className="lg:col-span-4 flex flex-col justify-between rounded-[2rem] bg-white p-6 sm:p-7 border border-slate-100 shadow-xs overflow-hidden">
                        {/* Text Content */}
                        <div className="space-y-3">
                            <h3 className="text-base sm:text-lg font-bold text-[#475569] font-inter">
                                {sharedVisionTitle}
                            </h3>
                            <p className="text-xs sm:text-sm font-medium text-[#64748B] leading-relaxed font-inter">
                                {sharedVisionDescription}
                            </p>
                        </div>

                        {/* Illustration Wrapper - Sofa enlarged */}
                        <div className="relative mt-4 h-48 sm:h-56 lg:h-64 w-full flex items-end justify-center">
                            <div
                                className="relative w-full h-full"
                                style={{ clipPath: "inset(25% 0 0 0)" }} // Clips out top text cleanly
                            >
                                <Image
                                    src={sharedVisionImage}
                                    alt="Shared Vision Illustration"
                                    fill
                                    className="object-contain object-bottom scale-160 origin-bottom"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="w-full max-w-7xl mx-auto rounded-[1.5rem] bg-white border border-slate-100 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 divide-slate-100">
                        {stats.map((item, index) => (
                            <div
                                key={index}
                                className={`p-5 sm:p-6 flex items-start gap-4 ${index % 3 !== 0 ? "md:border-l md:border-slate-100" : ""
                                    } ${index >= 3 ? "border-t border-slate-100" : ""}`}
                            >
                                {/* Red/Coral Line Icon */}
                                <div className="pt-0.5 shrink-0 text-[#FF583A]">
                                    {item.icon}
                                </div>

                                {/* Text & Meta info */}
                                <div className="space-y-1">
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-inter">
                                        {item.label}
                                    </p>
                                    <p className="text-sm font-bold text-slate-800 leading-snug font-inter">
                                        {item.value}
                                    </p>
                                    <div className="pt-1">
                                        <span className="inline-block text-[11px] font-medium text-slate-500 bg-[#F1F5F9] px-3 py-1 rounded-full font-inter">
                                            {item.tag}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Priorities Section */}
                <div className="w-full rounded-xl border border-[#F1F5F9] bg-white p-5 sm:p-6 space-y-6">
                    {/* Header */}
                    <h3 className="text-base font-semibold text-[#475569] leading-[19px] flex items-center font-inter">
                        {prioritiesTitle}
                    </h3>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {priorities.map((priority, idx) => (
                            <div key={idx} className="flex flex-col gap-2 w-full">
                                {/* Image */}
                                <div className="relative aspect-[254/169.5] w-full overflow-hidden rounded-lg">
                                    <Image
                                        src={priority.image}
                                        alt={priority.title}
                                        fill
                                        className="object-cover mix-blend-darken"
                                    />
                                </div>

                                {/* Title */}
                                <div className="flex items-center py-1 min-h-[33px]">
                                    <p className="text-sm font-semibold text-[#1E293B] leading-tight font-inter">
                                        {priority.title}
                                    </p>
                                </div>

                                {/* Progress Bar & Rating */}
                                <div className="flex items-center gap-2 w-full py-1">
                                    <div className="relative flex-1 bg-[#E2E8F0] h-[4px] rounded-full overflow-hidden">
                                        <div className="bg-[#FF7E57] h-full" style={{ width: `${priority.scorePercentage}%` }} />
                                    </div>
                                    <span className="text-[10px] font-bold text-[#475569] leading-none whitespace-nowrap min-w-[36px] text-right font-inter">
                                        {priority.scoreLabel}
                                    </span>
                                </div>

                                {/* Description Box */}
                                <div className="bg-[#F8FAFC] p-2.5 rounded-[4px] w-full min-h-[52px] flex items-center">
                                    <p className="text-xs text-[#475569] leading-relaxed font-normal font-inter">
                                        {priority.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export const journalDefaultStatsIcons = {
    briefcase: <Briefcase className="h-5 w-5 stroke-[1.75]" />,
    rupee: <IndianRupee className="h-5 w-5 stroke-[1.75]" />,
    heart: <Heart className="h-5 w-5 stroke-[1.75]" />,
    trending: <TrendingUp className="h-5 w-5 stroke-[1.75]" />,
    hourglass: <Hourglass className="h-5 w-5 stroke-[1.75]" />,
    fileCheck: <FileCheck className="h-5 w-5 stroke-[1.75]" />,
};
