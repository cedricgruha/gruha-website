"use client";

import React, { useState, useRef, useEffect, type RefObject } from "react";
import JournalProfileV0 from "./tab-contents/JournalProfileV0";
import JournalJourneyV0 from "./tab-contents/JournalJourneyV0";
import JournalSearchV0 from "./tab-contents/JournalSearchV0";
import JournalProjectsV0 from "./tab-contents/JournalProjectsV0";
import JournalLearningsV0 from "./tab-contents/JournalLearningsV0";
import JournalStartHereV0 from "./tab-contents/JournalStartHereV0";
import imgHero from "@/imports/testy.jpg";
import ProgressBar from "@/components/ui/ProgressBar";

const fd = "'Newsreader', Georgia, serif";
const fu = "'Inter Tight', system-ui, sans-serif";

const getImgSrc = (img: any): string => {
  if (!img) return "";
  if (typeof img === "string") return img;
  if (typeof img === "object" && img.src) return img.src;
  return String(img);
};

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
      className="z-20 sticky top-0 w-screen relative left-0 right-1/2 -ml-[50vw] -mr-[50vw] bg-white border-b border-slate-200 shadow-xs"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <nav className="flex items-center justify-start gap-1 overflow-x-hidden overflow-y-hidden">
          {/* Brand Logo & Title (Reveals on the left when navbar sticks to the top) */}
          <div
            className="flex items-center gap-2.5 shrink-0 transition-all ease-out overflow-hidden"
            style={{
              maxWidth: showBrand ? 240 : 0,
              opacity: showBrand ? 1 : 0,
              marginRight: showBrand ? 20 : 0,
              transform: showBrand ? "translateX(0)" : "translateX(-12px)",
              transitionDuration: showBrand ? "500ms" : "600ms",
            }}
          >
            <img
              src={getImgSrc(heroImage || imgHero)}
              alt="Journal logo"
              className="w-10 h-10 rounded-lg object-cover flex-none border border-slate-100 shadow-xs"
            />
            <span
              className="text-[13px] font-semibold leading-[1.25] text-[#111821] flex-none max-w-[130px] truncate"
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
                className="relative shrink-0 px-4 py-6 transition-colors cursor-pointer"
              >
                <span
                  className="text-[13.5px] font-semibold tracking-tight"
                  style={{ fontFamily: fu, color: isActive ? "#111821" : "#8A94A1" }}
                >
                  {tab}
                </span>
                <span
                  className="absolute left-4 right-4 -bottom-px h-[2px] rounded-full transition-opacity"
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
}

export const JournalTabsSectionV0: React.FC<JournalTabsSectionV0Props> = ({
  tabsData = [],
  heroImgWrapRef,
  heroImage,
  title,
}) => {
  const [activeTab, setActiveTab] = useState("Profile");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const tabNavRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showNavBrand, setShowNavBrand] = useState(false);
  const isScrollingRef = useRef(false);

  // Map tabs array from JSON into a dictionary by tab id
  const tabsMap = (tabsData || []).reduce((acc: any, tab: any) => {
    acc[tab.id] = tab;
    return acc;
  }, {});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    tabs.forEach((tab) => {
      const el = sectionRefs.current[tab];
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
    const handleScroll = () => {
      // Reveal brand when user scrolls past 180px down the page
      setShowNavBrand(window.scrollY > 180);
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
      {/* Full Screenwidth Sticky TabNav Bar */}
      <TabNav
        active={activeTab}
        showBrand={showNavBrand}
        navRef={tabNavRef}
        onTabClick={handleTabClick}
        heroImage={heroImage}
        title={title}
      />

      {/* Content Sections */}
      <div ref={contentRef} id="journal-content" className="w-full min-w-0 pt-8 space-y-12">
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

        {/* Start Here Section */}
        <div
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
