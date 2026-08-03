"use client";

import React, { useState, useRef, useEffect, type RefObject } from "react";
import Image from "next/image";
import JournalProfileV0 from "./tab-contents/JournalProfileV0";
import JournalJourneyV0 from "./tab-contents/JournalJourneyV0";
import JournalSearchV0 from "./tab-contents/JournalSearchV0";
import JournalProjectsV0 from "./tab-contents/JournalProjectsV0";
import JournalLearningsV0 from "./tab-contents/JournalLearningsV0";
import JournalStartHereV0 from "./tab-contents/JournalStartHereV0";
import imgHero from "@/imports/testy.jpg";
import ProgressBar from "@/components/ui/ProgressBar";

const fu = "'Inter Tight', system-ui, sans-serif";

const tabs = ["Profile", "Journey", "Search", "Projects", "Learnings", "Start here"];

function TabNav({
  active,
  showBrand,
  navRef,
  onTabClick,
  heroImage,
  title,
}: {
  active: string;
  showBrand: boolean;
  navRef: RefObject<HTMLDivElement | null>;
  onTabClick: (tab: string) => void;
  heroImage?: any;
  title?: string;
}) {
  return (
    <div
      ref={navRef}
      className="z-30 sticky top-0 w-screen relative left-0 right-1/2 -ml-[50vw] -mr-[50vw] bg-white border-b border-slate-200 shadow-xs mb-8"
    >
      <div className="max-w-[1400px] mx-auto px-3 sm:px-8">
        <nav
          className="flex items-center justify-start gap-0.5 sm:gap-1 overflow-x-auto overflow-y-hidden scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Brand Logo & Title (Reveals when sticky) */}
          <div
            className="hidden sm:flex items-center gap-2.5 shrink-0 transition-all ease-out overflow-hidden"
            style={{
              maxWidth: showBrand ? 240 : 0,
              opacity: showBrand ? 1 : 0,
              marginRight: showBrand ? 20 : 0,
              transform: showBrand ? "translateX(0)" : "translateX(-12px)",
              transitionDuration: showBrand ? "500ms" : "600ms",
            }}
          >
            <Image
              src={heroImage || imgHero}
              alt="Journal logo"
              width={40}
              height={40}
              className="w-10 h-10 rounded-lg object-cover flex-none border border-slate-100 shadow-xs"
            />
            <span
              className="text-[16px] font-semibold leading-[1.25] text-[#111821] flex-none max-w-[165px]"
              style={{ fontFamily: fu }}
            >
              {title ? title.split(":")[0] : "Homebuyer's Journal"}
            </span>
          </div>

          {tabs.map((tab) => {
            const isActive = active.toLowerCase() === tab.toLowerCase();
            return (
              <button
                type="button"
                key={tab}
                onClick={() => onTabClick(tab)}
                className="relative shrink-0 px-2.5 sm:px-4 py-4 sm:py-6 transition-colors cursor-pointer"
              >
                <span
                  className="text-sm sm:text-base font-medium tracking-tight whitespace-nowrap"
                  style={{ fontFamily: fu, color: isActive ? "#111821" : "#8A94A1" }}
                >
                  {tab}
                </span>
                <span
                  className="absolute left-2.5 right-2.5 sm:left-4 sm:right-4 -bottom-px h-[2px] rounded-full transition-opacity"
                  style={{ background: "#DD5128", opacity: isActive ? 1 : 0 }}
                />
              </button>
            );
          })}
        </nav>
      </div>
      <ProgressBar />
    </div>
  );
}

export interface JournalTabsSectionV0Props {
  tabsData?: any[];
  heroImgWrapRef?: RefObject<HTMLDivElement | null>;
  heroImage?: any;
  title?: string;
  heroContent?: React.ReactNode;
  sidebar?: React.ReactNode;
}

export const JournalTabsSectionV0: React.FC<JournalTabsSectionV0Props> = ({
  tabsData = [],
  heroImage,
  title,
  heroContent,
  sidebar,
}) => {
  const [activeTab, setActiveTab] = useState("Profile");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const tabNavRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showNavBrand, setShowNavBrand] = useState(false);
  const isScrollingRef = useRef(false);
  const tabNavTopRef = useRef(0);

  const tabsMap = (tabsData || []).reduce((acc: any, tab: any) => {
    acc[tab.id] = tab;
    return acc;
  }, {});

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    tabs.forEach((tab) => {
      const targetId = `section-${tab.toLowerCase().replace(/\s+/g, "-")}`;
      const el = sectionRefs.current[tab] || document.getElementById(targetId);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isScrollingRef.current) {
            setActiveTab(tab);
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    if (tabNavRef.current) {
      tabNavTopRef.current = tabNavRef.current.getBoundingClientRect().top + window.scrollY;
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowNavBrand(window.scrollY > 180);
      if (tabNavRef.current) {
        tabNavRef.current.style.zIndex = window.scrollY >= tabNavTopRef.current ? "50" : "30";
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    const targetId = `section-${tabName.toLowerCase().replace(/\s+/g, "-")}`;
    const el = document.getElementById(targetId);
    if (el) {
      isScrollingRef.current = true;
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    }
  };

  return (
    <>
      <div ref={contentRef} id="journal-content" className="w-full min-w-0">

        {/* 1. Full Width Hero Section (Above Grid & Above Tabs) */}
        <div className="w-full min-w-0">
          {heroContent}
        </div>

        {/* 2. Full Screenwidth Sticky Navigation Bar */}
        <TabNav
          active={activeTab}
          showBrand={showNavBrand}
          navRef={tabNavRef}
          onTabClick={handleTabClick}
          heroImage={heroImage}
          title={title}
        />

        {/* 3. 2-Column Grid: Tabs Content on Left, Sticky Sidebar on Right */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-10">

          {/* Left Column: 5 Main Content Tabs */}
          <div className="min-w-0 space-y-12">
            {/* Profile Section */}
            <div
              ref={(el) => {
                sectionRefs.current["Profile"] = el;
              }}
            >
              <JournalProfileV0 {...tabsMap["profile"]} />
            </div>

            {/* Journey Section */}
            <div
              ref={(el) => {
                sectionRefs.current["Journey"] = el;
              }}
            >
              <JournalJourneyV0 {...tabsMap["journey"]} />
            </div>

            {/* Search Section */}
            <div
              ref={(el) => {
                sectionRefs.current["Search"] = el;
              }}
            >
              <JournalSearchV0 {...tabsMap["search"]} />
            </div>

            {/* Projects Section */}
            <div
              ref={(el) => {
                sectionRefs.current["Projects"] = el;
              }}
            >
              <JournalProjectsV0 {...tabsMap["projects"]} />
            </div>

            {/* Learnings Section */}
            <div
              ref={(el) => {
                sectionRefs.current["Learnings"] = el;
              }}
            >
              <JournalLearningsV0 {...tabsMap["learnings"]} />
            </div>
          </div>

          {/* Right Column: Sticky Sidebar — Starts below TabNav, sticks through Learnings */}
          {sidebar && (
            <div className="hidden lg:block h-full">
              <div className="sticky top-24 z-40">
                {sidebar}
              </div>
            </div>
          )}
        </div>

        {/* 4. Final Section ("Start Here") — Rendered Full Width Outside Grid */}
        <div
          className="mt-16"
          ref={(el) => {
            sectionRefs.current["Start here"] = el;
          }}
        >
          <JournalStartHereV0 {...tabsMap["start-here"] || tabsMap["startHere"]} />
        </div>

      </div>
    </>
  );
};

export default JournalTabsSectionV0;