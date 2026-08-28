"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import * as Icons from "lucide-react";
import imgSearchMap from "@/imports/Container.png";
import { getPolygonPoints } from "@/data/polygonPoints";
import { areaKey } from "@/data/polygonPoints/areaKey";

// Dynamic import for Leaflet client-only map component
const JournalMapV1 = dynamic(() => import("./JournalMapV1"), { ssr: false });

const fd = "'Newsreader', Georgia, serif";
const fu = "'Inter Tight', system-ui, sans-serif";

const getImgSrc = (img: any): string => {
  if (!img) return "";
  if (typeof img === "string") return img;
  if (typeof img === "object" && img.src) return img.src;
  return String(img);
};

export const getIcon = (
  name?: string,
  defaultName = "MapPin",
  props: any = { className: "w-4 h-4", strokeWidth: 2 }
) => {
  if (!name) return null;
  const Icon = (Icons as any)[name] || (Icons as any)[defaultName] || Icons.HelpCircle;
  return <Icon {...props} />;
};

const defaultCostOfSearchStats = [
  { icon: "CalendarX", value: "11 months", label: "Total duration" },
  { icon: "LayoutGrid", value: "47 spreadsheets", label: "Tabs, models & comparisons" },
  { icon: "MapPin", value: "18 site visits", label: "Across 3 corridors" },
  { icon: "Sun", value: "5 Sundays", label: "Lost to research marathons" },
  { icon: "Car", value: "20 traffic hours", label: "Whitefield ↔ Sarjapur loops" },
  { icon: "TrendingUp", value: "₹35L appreciation", label: "Missed while deciding" },
];

const defaultExploredAreas = [
  {
    id: "hosa-road",
    name: "Hosa Road",
    desc: "Good connectivity & better value within reach",
    projectsCount: 3,
    visitsCount: 2,
    dotColor: "rgb(59, 130, 246)",
    image: imgSearchMap,
    latlong: { lat: 12.890365, lng: 77.673333 },
  },
  {
    id: "chandapura-attibele",
    name: "Chandapura-Attibele",
    desc: "Lower budget, but larger units",
    projectsCount: 3,
    visitsCount: 3,
    dotColor: "rgb(16, 185, 129)",
    image: imgSearchMap,
    latlong: { lat: 12.779163, lng: 77.768668 },
  },
  {
    id: "outer-sarjapur-road",
    name: "Outer Sarjapur Road",
    desc: "Strongest match on builder trust & school proximity",
    projectsCount: 5,
    visitsCount: 4,
    dotColor: "#DD5128",
    isTopChoice: true,
    image: imgSearchMap,
    latlong: { lat: 12.932896, lng: 77.688195 },
  },
];

export interface JournalSearchV1Props {
  eyebrow?: string;
  tagline?: string;
  title?: string;
  description?: string;
  metrics?: Array<{
    icon?: string | React.ReactNode;
    label: string;
    value: string;
  }>;
  exploredAreasTitle?: string;
  exploredAreas?: Array<any>;
  googleMapQuery?: string;
  searchMapImage?: any;
  costOfSearchTitle?: string;
  filtersTitle?: string;
  filters?: Array<any>;
  filtersFooterLabel?: string;
  costOfSearchStats?: Array<{
    icon?: string | React.ReactNode;
    value: string;
    label: string;
  }>;
  costOfSearchQuote?: string;
}

export const JournalSearchV1: React.FC<JournalSearchV1Props> = ({
  eyebrow = "The Search",
  tagline,
  title = "Where they looked and what they found.",
  description = "From defining non-negotiables to comparing communities and projects, every search brought them one step closer to understanding what truly mattered.",
  metrics = [
    { icon: "MapPin", label: "Location Preference", value: "Sarjapur" },
    { icon: "Home", label: "Home Configuration", value: "2.5 BHK" },
    { icon: "Sun", label: "Sundays Sacrificed", value: "5 Sundays" },
    { icon: "Car", label: "Lost to Traffic", value: "20+ Hours" },
  ],
  exploredAreasTitle = "Areas they explored",
  exploredAreas = defaultExploredAreas,
  googleMapQuery = "Sarjapur Road, Bengaluru",
  searchMapImage = imgSearchMap,
  costOfSearchTitle = "The Cost of Searching",
  filtersTitle,
  filters,
  filtersFooterLabel,
  costOfSearchStats = defaultCostOfSearchStats,
  costOfSearchQuote = "Not just time. It was the cost of waiting.",
}) => {
  const sectionTagline = tagline || eyebrow;

  const [selectedAreaId, setSelectedAreaId] = useState<string | number | null>(null);
  const [hoveredAreaId, setHoveredAreaId] = useState<string | number | null>(null);

  // Normalize explored areas list
  const exploredAreasList = useMemo(() => {
    return exploredAreas && exploredAreas.length > 0 ? exploredAreas : defaultExploredAreas;
  }, [exploredAreas]);

  // Resolve area polygon boundaries from area name & validate with latlong from JSON
  const { areasWithPoints, centerLat, centerLng } = useMemo(() => {
    if (exploredAreasList.length === 0) {
      return { areasWithPoints: [], centerLat: 12.9716, centerLng: 77.5946 };
    }

    // Default reference latlongs for standard area names if JSON only specifies area name without latlong
    const areaNameDefaults: Record<string, { lat: number; lng: number }> = {
      hosaRoad: { lat: 12.890365, lng: 77.673333 },
      chandapuraAttibele: { lat: 12.779163, lng: 77.768668 },
      outerSarjapurRoad: { lat: 12.932896, lng: 77.688195 },
      sarjapurRoad: { lat: 12.914094, lng: 77.68647 },
      whitefield: { lat: 12.973337, lng: 77.732228 },
      hebbalAirportBelt: { lat: 13.204324, lng: 77.743834 },
      hennurRoad: { lat: 13.032772, lng: 77.629932 },
    };

    const rLat = 0.011;
    const angles = [0, 60, 120, 180, 240, 300];
    const offsets = [1.1, 0.85, 1.05, 0.9, 1.15, 0.95];

    const processed = exploredAreasList.map((area, idx) => {
      const areaName = area.name || area.title || `Area ${idx + 1}`;
      const derivedKey = areaKey(area);

      // 1. Resolve registered polygon points from area name lookup
      const registered = getPolygonPoints(derivedKey);

      // 2. Resolve latlong coordinate (validate with JSON latlong, fallback to default dictionary or polygon centroid)
      let lat = area.latlong?.lat;
      let lng = area.latlong?.lng;

      if (typeof lat !== "number" || typeof lng !== "number") {
        const defaultCoord = areaNameDefaults[derivedKey];
        if (defaultCoord) {
          lat = defaultCoord.lat;
          lng = defaultCoord.lng;
        } else if (registered && registered.length > 0) {
          // Calculate centroid of registered points
          lat = registered.reduce((sum, p) => sum + p[0], 0) / registered.length;
          lng = registered.reduce((sum, p) => sum + p[1], 0) / registered.length;
        } else {
          // Default to central Bengaluru coordinates
          lat = 12.9716;
          lng = 77.5946;
        }
      }

      // 3. Resolve boundary polygon points (use registered points, or custom polygon, or dynamic latlong isochrone)
      const rLng = rLat / Math.max(0.2, Math.cos((lat * Math.PI) / 180));
      const polygonPoints: Array<[number, number]> =
        registered && registered.length >= 3
          ? registered
          : Array.isArray(area.polygonPoints) && area.polygonPoints.length >= 3
            ? area.polygonPoints
            : angles.map((deg, i) => {
                const rad = (deg * Math.PI) / 180;
                const offLat = offsets[(i + idx) % offsets.length];
                const offLng = offsets[(i + idx + 2) % offsets.length];
                return [
                  lat! + Math.cos(rad) * rLat * offLat,
                  lng! + Math.sin(rad) * rLng * offLng,
                ] as [number, number];
              });

      return {
        ...area,
        name: areaName,
        areaId: area.id || areaName || idx,
        latlong: { lat: lat!, lng: lng! },
        polygonPoints,
      };
    });

    const lats = processed.map((a) => a.latlong.lat);
    const lngs = processed.map((a) => a.latlong.lng);
    const avgLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const avgLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

    return {
      areasWithPoints: processed,
      centerLat: avgLat,
      centerLng: avgLng,
    };
  }, [exploredAreasList]);

  const sectionTitle = filtersTitle || costOfSearchTitle || "The Cost of Searching";
  const displayFilterStats =
    filters && filters.length > 0
      ? filters
      : costOfSearchStats && costOfSearchStats.length > 0
        ? costOfSearchStats
        : defaultCostOfSearchStats;

  const resolveLayoutColors = useMemo(
    () => (isMulti: boolean) =>
      areasWithPoints.map((area, idx) => ({
        ...area,
        dotColor:
          area.dotColor ||
          (isMulti
            ? idx === 0
              ? "#3B82F6"
              : idx === 1
                ? "#10B981"
                : "#DD5128"
            : "#DD5128"),
      })),
    [areasWithPoints]
  );

  const singleAreas = resolveLayoutColors(false);
  const multiAreas = resolveLayoutColors(true);

  return (
    <section id="section-search">
      <div className="text-left mb-7">
        <p className="text-md font-semibold tracking-[0.15em] uppercase" style={{ fontFamily: fu, color: "#DD5128" }}>
          {sectionTagline}
        </p>
        <h2 className="mt-2 text-[clamp(28px,3.6vw,40px)] font-semibold leading-[1.08] tracking-[-0.02em]" style={{ fontFamily: fd, color: "#111821" }}>
          {title}
        </h2>
        <p className="mt-3 text-base leading-[1.55]" style={{ fontFamily: fd, color: "#59636F" }}>
          {description}
        </p>
      </div>

      {/* Metrics Header Strip */}
      <div
        className="mb-5 bg-white border flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-100"
        style={{ borderRadius: 14, borderColor: "#E4E9EF", boxShadow: "0 1px 2px rgba(17,24,33,.04), 0 8px 24px rgba(17,24,33,.05)" }}
      >
        {metrics.map((cell: any) => {
          const iconElement =
            typeof cell.icon === "string"
              ? getIcon(cell.icon, "MapPin", { className: "w-4 h-4 text-[#DD5128]" })
              : cell.icon;

          return (
            <div key={cell.label} className="group flex items-start gap-3.5 px-5 sm:px-6 py-4.5 flex-1 min-w-0 transition-colors">
              <span className="flex-none mt-[22px]  text-[#DD5128]">{iconElement}</span>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold tracking-[0.10em] uppercase mb-1.5" style={{ fontFamily: fu, color: "#8A94A1" }}>
                  {cell.label}
                </p>
                <p className="text-sm sm:text-base font-[500] leading-tight" style={{ fontFamily: fd, color: "#111821" }}>
                  {cell.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Multi-Area Map View Container */}
      <div className="w-full mt-5">
        {areasWithPoints.length === 1 ? (
          /* SINGLE AREA LAYOUT */
          <div className="relative w-full rounded-[24px] border border-slate-200/90 overflow-hidden bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] h-[600px]">
            {(() => {
              const area = areasWithPoints[0];
              const areaId = area.areaId;
              const isSelected = selectedAreaId === areaId;
              const areaName = area.name || area.title || "";
              const areaDesc = area.desc || area.description || "";
              const projectsCount = area.projectsCount || area.projects || 0;
              const visitsCount = area.visitsCount || area.siteVisits || 0;
              const dotColor = area.dotColor || "#DD5128";
              const areaImage = getImgSrc(area.image || area.imageSrc || searchMapImage);

              return (
                <div
                  onClick={() => {
                    setSelectedAreaId(areaId);
                    setHoveredAreaId(areaId);
                  }}
                  onMouseEnter={() => setHoveredAreaId(areaId)}
                  onMouseLeave={() => setHoveredAreaId(null)}
                  className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 w-[calc(100%-2rem)] sm:w-[360px] bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-200/80 transition-all duration-200 hover:bg-white cursor-pointer group"
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#DD5128] animate-pulse" />
                      <span className="text-sm sm:text-base font-semibold text-slate-800 uppercase tracking-wider font-inter">
                        1 Corridor Explored
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {area.isTopChoice && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FE5B39]/10 text-[#DD5128] text-sm sm:text-base font-bold tracking-wider uppercase font-inter">
                          <Icons.Sparkles className="w-3 h-3" />
                          Top Choice
                        </span>
                      )}
                      {selectedAreaId !== null && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAreaId(null);
                            setHoveredAreaId(null);
                          }}
                          className="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
                          aria-label="Close location view"
                        >
                          <Icons.X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3
                      className="text-sm sm:text-base font-semibold leading-snug transition-colors group-hover:text-[#DD5128]"
                      style={{ fontFamily: fd, color: "#111821" }}
                    >
                      {areaName}
                    </h3>
                    <p
                      className="text-base leading-relaxed"
                      style={{ fontFamily: fu, color: "#59636F" }}
                    >
                      {areaDesc}
                    </p>
                  </div>



                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-sm sm:text-base font-medium font-inter text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full flex-none" style={{ backgroundColor: dotColor }} />
                      <span>{projectsCount} Projects</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Icons.Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>{visitsCount} Site visits</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="relative w-full h-full bg-[#E5E3DF] overflow-hidden">
              <JournalMapV1
                areas={singleAreas}
                selectedAreaId={selectedAreaId}
                onSelect={(id) => {
                  setSelectedAreaId(id);
                  setHoveredAreaId(id);
                }}
                hoveredAreaId={hoveredAreaId}
                onHover={setHoveredAreaId}
                defaultCenter={{ lat: centerLat, lng: centerLng }}
              />
            </div>
          </div>
        ) : (
          /* MULTIPLE AREAS LAYOUT: Left Cards Sidebar + Right Interactive Map */
          <div className="w-full rounded-[24px] border border-slate-200/90 overflow-hidden bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] grid grid-cols-1 lg:grid-cols-[360px_1fr] min-h-[600px]">

            {/* Left Sidebar */}
            <div className="border-r border-slate-200/80 bg-[#F8FAFC] flex flex-col h-full max-h-[600px]">
              <div className="p-4 border-b border-slate-200/80 bg-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#DD5128] animate-pulse" />
                  <span className="text-base font-semibold text-slate-800 uppercase tracking-wider font-inter">
                    {areasWithPoints.length} Corridors Explored
                  </span>
                </div>
                {selectedAreaId !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAreaId(null);
                      setHoveredAreaId(null);
                    }}
                    className="text-xs font-semibold text-[#DD5128] hover:underline cursor-pointer"
                  >
                    View All (Zoom Out)
                  </button>
                )}
              </div>

              {/* Sidebar Cards Scrollable Area */}
              <div className="p-3.5 grid grid-flow-col auto-cols-[68%] sm:auto-cols-[280px] md:block gap-3.5 md:gap-0 md:space-y-3.5 overflow-x-auto md:overflow-y-auto hide-scrollbar flex-1">
                {areasWithPoints.map((area: any, idx: number) => {
                  const areaId = area.areaId;
                  const isSelected = selectedAreaId === areaId;
                  const isHovered = hoveredAreaId === areaId || isSelected;
                  const areaName = area.name || area.title || "";
                  const areaDesc = area.desc || area.description || "";
                  const projectsCount = area.projectsCount || area.projects || 0;
                  const visitsCount = area.visitsCount || area.siteVisits || 0;
                  const dotColor = area.dotColor || (idx === 0 ? "#3B82F6" : idx === 1 ? "#10B981" : "#DD5128");

                  return (
                    <div
                      key={areaId}
                      onClick={() => {
                        if (selectedAreaId === areaId) {
                          setSelectedAreaId(null);
                          setHoveredAreaId(null);
                        } else {
                          setSelectedAreaId(areaId);
                          setHoveredAreaId(areaId);
                        }
                      }}
                      onMouseEnter={() => setHoveredAreaId(areaId)}
                      onMouseLeave={() => setHoveredAreaId(null)}
                      className={`w-full group relative rounded-xl p-3.5 transition-all duration-200 cursor-pointer border ${
                        isSelected
                          ? "bg-white border-[#DD5128] shadow-lg ring-2 ring-[#DD5128]/20 -translate-y-0.5"
                          : isHovered
                            ? "bg-white border-[#DD5128] shadow-md -translate-y-0.5"
                            : "bg-white/80 hover:bg-white border-slate-200/70 shadow-2xs"
                      }`}
                    >
                      <div className="pl-2">
                        {area.isTopChoice && (
                          <div className="inline-flex items-center gap-1 mb-2 px-2 py-0.5 rounded-md bg-[#FE5B39]/10 text-[#DD5128] text-sm sm:text-base font-bold tracking-wider uppercase font-inter">
                            <Icons.Sparkles className="w-3 h-3" />
                            Top Choice
                          </div>
                        )}

                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3
                              className="text-sm sm:text-base font-semibold leading-snug transition-colors group-hover:text-[#DD5128]"
                              style={{ fontFamily: fd, color: isSelected ? "#DD5128" : "#111821" }}
                            >
                              {areaName}
                            </h3>
                            <p
                              className="text-[15px] leading-relaxed mt-1 line-clamp-2"
                              style={{ fontFamily: fu, color: "#59636F" }}
                            >
                              {areaDesc}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-sm sm:text-base font-medium font-inter text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full flex-none"
                              style={{ backgroundColor: dotColor }}
                            />
                            <span className="text-xs sm:text-sm">{projectsCount} Projects</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Icons.Eye className="w-3 h-3 text-slate-400" />
                            <span className="text-xs sm:text-sm">{visitsCount} Site visits</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Interactive Map */}
            <div className="relative w-full h-[600px] bg-[#E5E3DF] overflow-hidden">
              <JournalMapV1
                areas={multiAreas}
                selectedAreaId={selectedAreaId}
                onSelect={(id) => {
                  setSelectedAreaId(id);
                  setHoveredAreaId(id);
                }}
                hoveredAreaId={hoveredAreaId}
                onHover={setHoveredAreaId}
                defaultCenter={{ lat: centerLat, lng: centerLng }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Filters & Search Criteria Grid */}
      <div className="mt-5">
        <div
          className="bg-white border p-6 sm:p-8"
          style={{ borderRadius: 14, borderColor: "#E4E9EF", boxShadow: "0 1px 2px rgba(17,24,33,.04), 0 8px 24px rgba(17,24,33,.05)" }}
        >
          <p className="text-sm sm:text-base font-semibold tracking-[0.14em] uppercase mb-6" style={{ fontFamily: fu, color: "#8A94A1" }}>
            {sectionTitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayFilterStats.map((item: any, idx: number) => {
              const iconElement =
                typeof item.icon === "string"
                  ? getIcon(item.icon, "MapPin", { className: "w-4 h-4 text-[#DD5128]" })
                  : item.icon;

              const itemTitle = item.title || item.label || `Filter #${idx + 1}`;
              const itemValue = item.value || "";
              const itemDesc = item.description || item.subtext || "";

              return (
                <div key={itemTitle + idx} className="rounded-xl border border-slate-100 p-5 flex flex-col bg-[#f8fafc] h-full">
                  <span className="text-[#DD5128] mb-2">{iconElement}</span>

                  <div className="flex items-start mb-1.5">
                    <p
                      className="text-sm font-medium tracking-[0.05em] uppercase text-[#8A94A1]"
                      style={{ fontFamily: fu }}
                    >
                      {itemTitle}
                    </p>
                  </div>

                  <p
                    className="text-base sm:text-lg font-semibold leading-snug text-[#111821] mb-2"
                    style={{ fontFamily: fd, color: "#111821" }}
                  >
                    {itemValue}
                  </p>

                  {itemDesc && (
                    <p
                      className="text-base leading-relaxed text-[#59636F]"
                      style={{ fontFamily: fu }}
                    >
                      {itemDesc}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {(filtersFooterLabel || costOfSearchQuote) && (
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-base italic font-medium" style={{ fontFamily: fd, color: "#4B5563" }}>
                "{filtersFooterLabel || costOfSearchQuote}"
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default JournalSearchV1;
