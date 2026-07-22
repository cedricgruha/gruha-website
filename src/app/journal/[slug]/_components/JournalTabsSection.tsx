"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  CheckCircle2, ChevronRight, Compass, ShieldAlert, Sparkles, UserCheck, Briefcase, Coins, Heart, Hourglass,
  FileText, Search, Users, Calendar, IndianRupee, CalendarDays, BadgeCheck, CircleDollarSign, UserPlus,
  FileSearch, LayoutList, Clock3, Clock4, Banknote, Car, Frown, TrendingUp,
  Lightbulb, Feather, ArrowLeftRight, MessageSquare, CalendarPlus,
  LayoutGrid, FileCheck2, FileCheck, MapPin, Link2, Lock, GraduationCap, ShieldCheck, MoreHorizontal, Building2,
  HeartHandshake, BookOpen, Smile, Triangle, Zap, PiggyBank, Home
} from "lucide-react";
import * as Icons from "lucide-react";
import { JournalProfile, journalDefaultStatsIcons } from "./tab-contents/JournalProfile";
import { JournalJourney } from "./tab-contents/JournalJourney";
import { JournalSearch } from "./tab-contents/JournalSearch";
import { JournalProjects } from "./tab-contents/JournalProjects";
import { JournalLearnings } from "./tab-contents/JournalLearnings";
import { JournalStartHere } from "./tab-contents/JournalStartHere";
import journalData from "@/data/journal-data.json";

const getIcon = (name: string): React.ComponentType<any> => {
  return (Icons as any)[name] || Icons.HelpCircle;
};

// ---------------------------------------------------------------------------
// Tabs Configuration
// ---------------------------------------------------------------------------

type TabId = "profile" | "journey" | "search" | "projects" | "learnings" | "start-here";

interface TabItem {
  id: TabId;
  label: string;
  bgColorHex: string;       // Color when active
  inactiveBgHex: string;   // Color when inactive
  textColor: string;       // Text color class when active
  inactiveTextColor: string; // Text color class when inactive
  avatar?: string;
  badgeCount?: string;
}

export const JournalTabsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  const tabs: TabItem[] = [
    {
      id: "profile",
      label: "Profile",
      bgColorHex: "#FCEAE2",
      inactiveBgHex: "rgba(252, 234, 226, 0.45)",
      textColor: "text-[#111827] font-bold",
      inactiveTextColor: "text-gray-500 hover:text-gray-700",
    },
    {
      id: "journey",
      label: "Journey",
      bgColorHex: "#E2DFFD",
      inactiveBgHex: "rgba(226, 223, 253, 0.45)",
      textColor: "text-[#4A438A] font-semibold",
      inactiveTextColor: "text-gray-500 hover:text-gray-700",
      avatar: "/journals/avatar-riya.png",
    },
    {
      id: "search",
      label: "Search",
      bgColorHex: "#FCDFE3",
      inactiveBgHex: "rgba(252, 223, 227, 0.45)",
      textColor: "text-[#8A3243] font-semibold",
      inactiveTextColor: "text-gray-500 hover:text-gray-700",
      avatar: "/journals/avatar-riya.png",
    },
    {
      id: "projects",
      label: "Projects",
      bgColorHex: "#D0F6E3",
      inactiveBgHex: "rgba(208, 246, 227, 0.45)",
      textColor: "text-[#2B6A4F] font-semibold",
      inactiveTextColor: "text-gray-500 hover:text-gray-700",
      avatar: "/journals/avatar-riya.png",
      badgeCount: "10+",
    },
    {
      id: "learnings",
      label: "Learnings",
      bgColorHex: "#FEF1CD",
      inactiveBgHex: "rgba(254, 241, 205, 0.45)",
      textColor: "text-[#7A601A] font-semibold",
      inactiveTextColor: "text-gray-500 hover:text-gray-700",
      badgeCount: "10+",
    },
    {
      id: "start-here",
      label: "Start here",
      bgColorHex: "#D0EDFE",
      inactiveBgHex: "rgba(208, 237, 254, 0.45)",
      textColor: "text-[#1A5B7A] font-semibold",
      inactiveTextColor: "text-gray-500 hover:text-gray-700",
      avatar: "/journals/avatar-riya.png",
    },
  ];

  // ---------------------------------------------------------------------------
  // Tab Panel Renderers
  // ---------------------------------------------------------------------------

  const renderProfileContent = () => {
    const profileData = {
      ...journalData.profile,
      stats: journalData.profile.stats.map((item) => {
        const IconComponent = getIcon(item.icon);
        return {
          ...item,
          icon: <IconComponent className="h-5 w-5" strokeWidth={2} />,
        };
      }),
    };

    return <JournalProfile {...profileData} />;
  };

  const renderJourneyContent = () => {
    const journeyData = {
      ...journalData.journey,
      metrics: journalData.journey.metrics.map((item) => ({
        ...item,
        icon: getIcon(item.icon),
      })),
      roadmapNodes: journalData.journey.roadmapNodes.map((item) => ({
        ...item,
        icon: getIcon(item.icon),
      })),
      timelineSteps: journalData.journey.timelineSteps.map((item) => ({
        ...item,
        icon: getIcon(item.icon),
      })),
      moments: journalData.journey.moments.map((item) => ({
        ...item,
        desc: item.desc,
      })),
      realityChecks: journalData.journey.realityChecks.map((item) => ({
        ...item,
        icon: getIcon(item.icon),
      })),
    };

    return <JournalJourney {...journeyData} />;
  };

  const renderSearchContent = () => {
    const searchData = {
      ...journalData.search,
      metrics: journalData.search.metrics.map((item) => ({
        ...item,
        icon: getIcon(item.icon),
      })),
      filters: journalData.search.filters.map((item) => ({
        ...item,
        icon: getIcon(item.icon),
      })),
    };

    return <JournalSearch {...searchData} />;
  };

  const renderProjectsContent = () => {
    const projectsData = {
      ...journalData.projects,
      metrics: journalData.projects.metrics.map((item) => ({
        ...item,
        icon: getIcon(item.icon),
      })),
      priorities: journalData.projects.priorities.map((item) => ({
        ...item,
        icon: getIcon(item.icon),
      })),
      rejectedReasons: journalData.projects.rejectedReasons.map((item) => ({
        ...item,
        icon: getIcon(item.icon),
      })),
    };

    return <JournalProjects {...projectsData} />;
  };

  const renderLearningsContent = () => {
    const learningsData = {
      ...journalData.learnings,
      metrics: journalData.learnings.metrics.map((item) => ({
        ...item,
        icon: getIcon(item.icon),
      })),
      beforeItems: journalData.learnings.beforeItems.map((item) => ({
        ...item,
        icon: getIcon(item.icon),
      })),
      afterItems: journalData.learnings.afterItems.map((item) => ({
        ...item,
        icon: getIcon(item.icon),
      })),
      differentlyCards: journalData.learnings.differentlyCards.map((item) => ({
        ...item,
        icon: getIcon(item.icon),
      })),
    };

    return <JournalLearnings {...learningsData} />;
  };

  const renderStartHereContent = () => {
    const startHereData = {
      ...journalData.startHere,
      valueProps: journalData.startHere.valueProps.map((item) => ({
        ...item,
        icon: getIcon(item.icon),
      })),
    };

    return <JournalStartHere {...startHereData} />;
  };

  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = () => {
    if (isScrollingRef.current) return;

    const sectionIds: TabId[] = ["profile", "journey", "search", "projects", "learnings", "start-here"];
    const offset = 140; // sticky header detection threshold

    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const id = sectionIds[i];
      const el = document.getElementById(`section-${id}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= offset) {
          setActiveTab(id);
          break;
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial state setting
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleTabClick = (id: TabId) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      isScrollingRef.current = true;
      setActiveTab(id);

      const offset = 90; // sticky tabs header offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const offsetPosition = elementRect - bodyRect - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    }
  };

  return (
    <section
      className="relative w-full max-w-7xl mx-auto px-4 py-8 select-none"
      aria-label="Interactive folder sections"
    >
      {/* ── Folder Tabs Header (Sticky Container) ── */}
      <div className="sticky top-0 z-30 bg-[#FDFAF7] pt-4 pb-1 w-full">
        <div className="w-full max-w-full mx-auto relative flex items-end h-[76px] px-2 sm:px-4 overflow-hidden -mb-[1px] shrink-0">
          <nav className="flex items-end w-full">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className="relative flex-1 min-w-0 focus:outline-none transition-all duration-300 ease-out cursor-pointer"
                  style={{
                    height: isActive ? "71px" : "56px",
                    marginLeft: index === 0 ? "0px" : "-8px",
                    zIndex: isActive ? 30 : 20 - index,
                  }}
                >
                  {/* Top Badge Slot (Avatar & Tag Badge) */}
                  {!isActive && (tab.avatar || tab.badgeCount) && (
                    <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 z-40 flex items-center justify-center pointer-events-none transition-opacity duration-200">
                      {tab.avatar && (
                        <div className="relative w-[23.8px] h-[23.8px] rounded-full overflow-hidden border border-black/10 flex-shrink-0 bg-white">
                          <Image
                            src={tab.avatar}
                            alt={tab.label}
                            fill
                            sizes="24px"
                            className="object-cover object-[50%_15%] scale-[2.3] origin-top"
                          />
                        </div>
                      )}

                      {tab.badgeCount && (
                        <div
                          className={`flex items-center justify-center h-4 sm:h-5 bg-white rounded-full px-1.5 sm:px-2 text-[10px] sm:text-[11px] font-bold text-slate-800 shadow-xs border border-slate-100 ${tab.avatar ? "-ml-1.5" : ""
                            }`}
                        >
                          {tab.badgeCount}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SVG Folder Path Vector */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-300"
                      preserveAspectRatio="none"
                      viewBox="0 0 184 90"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M 0 90 V 52 C 0 44 4 40 10 40 H 12 C 18 40 22 36 22 28 V 12 C 22 4 28 0 36 0 H 158 C 166 0 170 6 171 14 C 172 22 174 28 178 33 C 180 36 184 40 184 48 V 90 Z"
                        fill={isActive ? tab.bgColorHex : tab.inactiveBgHex}
                      />
                    </svg>

                    {/* Tab Label */}
                    <span
                      className="relative z-20 font-inter text-[12px] sm:text-[14px] tracking-tight text-center truncate px-1 transition-all duration-300"
                      style={{
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? "#020617" : "#475569",
                        marginTop: isActive ? "-8px" : "10px",
                      }}
                    >
                      {tab.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── Folder Body (Free Scrollable Inline Content) ── */}
      <div className="w-full relative z-10 py-10 space-y-24 bg-white">
        <div id="section-profile" className="scroll-mt-28">
          {renderProfileContent()}
        </div>
        <div id="section-journey" className="scroll-mt-28 border-t border-slate-200/50 ">
          {renderJourneyContent()}
        </div>
        <div id="section-search" className="scroll-mt-28 border-t border-slate-200/50 ">
          {renderSearchContent()}
        </div>
        <div id="section-projects" className="scroll-mt-28 border-t border-slate-200/50 ">
          {renderProjectsContent()}
        </div>
        <div id="section-learnings" className="scroll-mt-28 border-t border-slate-200/50 ">
          {renderLearningsContent()}
        </div>
        <div id="section-start-here" className="scroll-mt-28 border-t border-slate-200/50 ">
          {renderStartHereContent()}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}} />
    </section>
  );
};
