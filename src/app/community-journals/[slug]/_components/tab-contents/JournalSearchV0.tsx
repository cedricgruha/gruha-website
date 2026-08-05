"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import * as Icons from "lucide-react";
import imgSearchMap from "@/imports/Container.png";

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

export interface JournalSearchV0Props {
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

export const JournalSearchV0: React.FC<JournalSearchV0Props> = ({
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

  // Filter exploredAreas to ONLY items that contain latlong key
  const exploredAreasList = useMemo(() => {
    const rawList = exploredAreas && exploredAreas.length > 0 ? exploredAreas : defaultExploredAreas;
    const filtered = rawList.filter(
      (area) =>
        area &&
        area.latlong &&
        typeof area.latlong.lat === "number" &&
        typeof area.latlong.lng === "number"
    );
    return filtered.length > 0 ? filtered : defaultExploredAreas;
  }, [exploredAreas]);

  // Compute SVG canvas projected points, centroids, and bounding box center
  const { areasWithPoints, centerLat, centerLng } = useMemo(() => {
    if (exploredAreasList.length === 0) {
      return { areasWithPoints: [], centerLat: 12.9716, centerLng: 77.5946 };
    }

    const lats = exploredAreasList.map((a) => a.latlong.lat);
    const lngs = exploredAreasList.map((a) => a.latlong.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latSpan = maxLat - minLat || 0.04;
    const lngSpan = maxLng - minLng || 0.04;

    const paddedMinLat = minLat - latSpan * 0.3;
    const paddedMaxLat = maxLat + latSpan * 0.3;
    const paddedMinLng = minLng - lngSpan * 0.3;
    const paddedMaxLng = maxLng + lngSpan * 0.3;

    const avgLat = (minLat + maxLat) / 2;
    const avgLng = (minLng + maxLng) / 2;

    const angles = [0, 60, 120, 180, 240, 300];
    const offsets = [1.1, 0.85, 1.05, 0.9, 1.15, 0.95];

    const processed = exploredAreasList.map((area, idx) => {
      const lat = area.latlong.lat;
      const lng = area.latlong.lng;

      // Project longitude to X (120 to 880 inside 1000 viewBox)
      const cx = Math.round(
        ((lng - paddedMinLng) / (paddedMaxLng - paddedMinLng)) * 740 + 130
      );
      // Project latitude to Y (500 to 120, inverted for SVG coordinate space)
      const cy = Math.round(
        500 - ((lat - paddedMinLat) / (paddedMaxLat - paddedMinLat)) * 380
      );

      const r = 54;
      const polygonPoints = angles
        .map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const px = Math.round(cx + Math.cos(rad) * r * offsets[(i + idx) % offsets.length]);
          const py = Math.round(cy + Math.sin(rad) * r * offsets[(i + idx + 2) % offsets.length]);
          return `${px},${py}`;
        })
        .join(" ");

      return {
        ...area,
        areaId: area.id || area.name || area.title || idx,
        computedCentroid: { x: cx, y: cy },
        computedPolygonPoints: polygonPoints,
      };
    });

    return {
      areasWithPoints: processed,
      centerLat: avgLat,
      centerLng: avgLng,
    };
  }, [exploredAreasList]);

  // Determine current map view center based on selected area or default bounding center
  const selectedArea = areasWithPoints.find((a) => a.areaId === selectedAreaId);
  const mapQuery = selectedArea
    ? `${selectedArea.latlong.lat},${selectedArea.latlong.lng}`
    : googleMapQuery || `${centerLat},${centerLng}`;
  const mapZoom = selectedArea ? 14 : 12;

  const sectionTitle = filtersTitle || costOfSearchTitle || "The Cost of Searching";
  const displayFilterStats = (filters && filters.length > 0)
    ? filters
    : ((costOfSearchStats && costOfSearchStats.length > 0) ? costOfSearchStats : defaultCostOfSearchStats);

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
            <div key={cell.label} className="flex items-center gap-4 px-6 sm:px-8 py-5 flex-1 min-w-0">
              <span className="flex-none text-[#DD5128]">{iconElement}</span>

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

      {/* Interactive Map illustration container */}
      <div className="w-full mt-5">
        {areasWithPoints.length === 1 ? (
          /* ── SINGLE CARD LAYOUT: Full Width Map + Floating Card Overlay ── */
          <div className="relative w-full rounded-[24px] border border-slate-200/90 overflow-hidden bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] h-[600px]">
            {/* Floating Card Overlay */}
            {(() => {
              const area = areasWithPoints[0];
              const areaId = area.areaId;
              const isSelected = selectedAreaId === areaId;
              const isHovered = hoveredAreaId === areaId || isSelected;
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
                  {/* Top Header Row */}
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

                  {areaImage && (
                    <div className="mt-3.5 h-[110px] rounded-xl overflow-hidden border border-slate-100 shadow-2xs relative">
                      <Image src={area.image || area.imageSrc || searchMapImage} alt={areaName} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}

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

            {/* Full Width Google Map Canvas with Polygonal Overlay */}
            <div className="relative w-full h-full bg-[#E5E3DF] overflow-hidden">
              <iframe
                key={mapQuery}
                title="Explored Areas Polygonal Google Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=m&z=${mapZoom}&output=embed&iwloc=near`}
                className="absolute inset-0 w-full h-full border-none pointer-events-none transition-opacity duration-300"
                style={{ filter: "grayscale(80%) contrast(95%) brightness(105%)", opacity: 0.9 }}
                loading="lazy"
              />

              <div className="absolute inset-0 bg-white/10 pointer-events-none z-1" />

              <svg
                className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                viewBox="0 0 1000 600"
                preserveAspectRatio="none"
              >
                <defs>
                  <filter id="poly-glow-single" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {areasWithPoints.filter((area: any) => !selectedAreaId || area.areaId === selectedAreaId).map((area: any, idx: number) => {
                  const areaId = area.areaId;
                  const isSelected = selectedAreaId === areaId;
                  const isHovered = hoveredAreaId === areaId || isSelected;
                  const points = area.computedPolygonPoints;
                  const strokeColor = area.dotColor || "#DD5128";

                  return (
                    <polygon
                      key={`polygon-${areaId}`}
                      points={points}
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
                      className="pointer-events-auto transition-all duration-300 cursor-pointer"
                      style={{
                        fill: strokeColor,
                        fillOpacity: isSelected ? 0.45 : isHovered ? 0.35 : 0.18,
                        stroke: isSelected ? "#DD5128" : strokeColor,
                        strokeWidth: isSelected ? 4 : isHovered ? 3.5 : 2,
                        strokeDasharray: isSelected || isHovered ? "none" : "6 4",
                        filter: isSelected || isHovered ? "url(#poly-glow-single)" : "none",
                      }}
                    />
                  );
                })}
              </svg>

              <div className="absolute inset-0 z-20 pointer-events-none">
                {areasWithPoints.filter((area: any) => !selectedAreaId || area.areaId === selectedAreaId).map((area: any, idx: number) => {
                  const areaId = area.areaId;
                  const isSelected = selectedAreaId === areaId;
                  const isHovered = hoveredAreaId === areaId || isSelected;
                  const centroid = area.computedCentroid;
                  const areaName = area.name || area.title || "";
                  const projectsCount = area.projectsCount || area.projects || 0;
                  const dotColor = area.dotColor || "#DD5128";
                  const areaImage = getImgSrc(area.image || area.imageSrc || searchMapImage);

                  const leftPercent = `${(centroid.x / 1000) * 100}%`;
                  const topPercent = `${(centroid.y / 600) * 100}%`;

                  return (
                    <div
                      key={`pin-${areaId}`}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-all duration-300"
                      style={{ left: leftPercent, top: topPercent }}
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
                    >
                      {/* Polygon Centroid Pin Pill */}
                      <div
                        className={`flex items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-300 ease-in-out cursor-pointer border overflow-hidden ${isSelected
                          ? "bg-[#DD5128] text-white scale-110 shadow-2xl border-2 border-white w-8 h-8 p-0 aspect-square"
                          : isHovered
                            ? "bg-[#111827] text-white scale-110 shadow-xl border-2 w-8 h-8 p-0 aspect-square"
                            : "bg-white/95 text-slate-800 hover:scale-105 border-slate-200 w-auto h-8 px-3 py-1.5 gap-2"
                          }`}
                        style={{ borderColor: !isSelected && isHovered ? dotColor : undefined }}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-none animate-pulse"
                          style={{ backgroundColor: isSelected ? "#FFFFFF" : dotColor }}
                        />

                        <div
                          className={`flex items-center gap-1 transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${isHovered || isSelected
                            ? "max-w-0 opacity-0 pointer-events-none"
                            : "max-w-[220px] opacity-100"
                            }`}
                        >
                          <span className="text-sm sm:text-base font-semibold font-inter">
                            {areaName}
                          </span>
                          <span className="text-sm sm:text-base font-medium opacity-80 font-inter">
                            ({projectsCount})
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ── MULTIPLE CARDS LAYOUT: Left Sidebar + Right Map ── */
          <div className="w-full rounded-[24px] border border-slate-200/90 overflow-hidden bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] grid grid-cols-1 lg:grid-cols-[360px_1fr] min-h-[600px]">

            {/* Left Column: Google Map Search Cards Sidebar */}
            <div className="border-r border-slate-200/80 bg-[#F8FAFC] flex flex-col h-full max-h-[600px]">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-slate-200/80 bg-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#DD5128] animate-pulse" />
                  <span className="text-base font-semibold text-slate-800 uppercase tracking-wider font-inter">
                    {areasWithPoints.length} Corridors Explored
                  </span>
                </div>

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
                      className={`w-full group relative rounded-xl p-3.5 transition-all duration-200 cursor-pointer border ${isSelected
                        ? "bg-white-100 border-[#DD5128] shadow-lg ring-2 ring-[#DD5128]/20 -translate-y-0.5"
                        : isHovered
                          ? "bg-white border-[#DD5128] shadow-md -translate-y-0.5"
                          : "bg-white/80 hover:bg-white border-slate-200/70 shadow-2xs"
                        }`}
                    >
                      {/* Left color bar indicator */}
                      {/* <div
                        className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full transition-all"
                        style={{ backgroundColor: isSelected || isHovered ? "#DD5128" : dotColor }}
                      /> */}

                      <div className="pl-2">
                        {/* Top badge if present */}
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

                        {/* Footer Stats Row */}
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

            {/* Right Column: Google Map Canvas with Polygonal Overlay */}
            <div className="relative w-full h-[600px] bg-[#E5E3DF] overflow-hidden">
              {/* Google Map iframe background focusing on selected area or center */}
              <iframe
                key={mapQuery}
                title="Explored Areas Polygonal Google Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=m&z=${mapZoom}&output=embed&iwloc=near`}
                className="absolute inset-0 w-full h-full border-none pointer-events-none transition-opacity duration-300"
                style={{ filter: "grayscale(80%) contrast(95%) brightness(105%)", opacity: 0.9 }}
                loading="lazy"
              />

              {/* Light Map Overlay */}
              <div className="absolute inset-0 bg-white/10 pointer-events-none z-1" />

              {/* Interactive SVG Layer for Polygonal Plots around latlong */}
              <svg
                className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                viewBox="0 0 1000 600"
                preserveAspectRatio="none"
              >
                <defs>
                  <filter id="poly-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {areasWithPoints.filter((area: any) => !selectedAreaId || area.areaId === selectedAreaId).map((area: any, idx: number) => {
                  const areaId = area.areaId;
                  const isSelected = selectedAreaId === areaId;
                  const isHovered = hoveredAreaId === areaId || isSelected;
                  const points = area.computedPolygonPoints;
                  const strokeColor = area.dotColor || (idx === 0 ? "#3B82F6" : idx === 1 ? "#10B981" : "#DD5128");

                  return (
                    <polygon
                      key={`polygon-${areaId}`}
                      points={points}
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
                      className="pointer-events-auto transition-all duration-300 cursor-pointer"
                      style={{
                        fill: strokeColor,
                        fillOpacity: isSelected ? 0.45 : isHovered ? 0.35 : 0.18,
                        stroke: isSelected ? "#DD5128" : strokeColor,
                        strokeWidth: isSelected ? 4 : isHovered ? 3.5 : 2,
                        strokeDasharray: isSelected || isHovered ? "none" : "6 4",
                        filter: isSelected || isHovered ? "url(#poly-glow)" : "none",
                      }}
                    />
                  );
                })}
              </svg>

              {/* Area Pin Badges & Floating Hover Callouts on Map */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                {areasWithPoints.filter((area: any) => !selectedAreaId || area.areaId === selectedAreaId).map((area: any, idx: number) => {
                  const areaId = area.areaId;
                  const isSelected = selectedAreaId === areaId;
                  const isHovered = hoveredAreaId === areaId || isSelected;
                  const centroid = area.computedCentroid;
                  const areaName = area.name || area.title || "";
                  const projectsCount = area.projectsCount || area.projects || 0;
                  const dotColor = area.dotColor || (idx === 0 ? "#3B82F6" : idx === 1 ? "#10B981" : "#DD5128");
                  const areaImage = getImgSrc(area.image || area.imageSrc || searchMapImage);

                  const leftPercent = `${(centroid.x / 1000) * 100}%`;
                  const topPercent = `${(centroid.y / 600) * 100}%`;

                  return (
                    <div
                      key={`pin-${areaId}`}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-all duration-300"
                      style={{ left: leftPercent, top: topPercent }}
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
                    >
                      {/* Polygon Centroid Pin Pill */}
                      <div
                        className={`flex items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-300 ease-in-out cursor-pointer border overflow-hidden ${isSelected
                          ? "bg-[#DD5128] text-white scale-110 shadow-2xl border-2 border-white w-8 h-8 p-0 aspect-square"
                          : isHovered
                            ? "bg-[#111827] text-white scale-110 shadow-xl border-2 w-8 h-8 p-0 aspect-square"
                            : "bg-white/95 text-slate-800 hover:scale-105 border-slate-200 w-auto h-8 px-3 py-1.5 gap-2"
                          }`}
                        style={{ borderColor: !isSelected && isHovered ? dotColor : undefined }}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-none animate-pulse"
                          style={{ backgroundColor: isSelected ? "#FFFFFF" : dotColor }}
                        />

                        <div
                          className={`flex items-center gap-1 transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${isHovered || isSelected
                            ? "max-w-0 opacity-0 pointer-events-none"
                            : "max-w-[220px] opacity-100"
                            }`}
                        >
                          <span className="text-sm sm:text-base font-semibold font-inter">
                            {areaName}
                          </span>
                          <span className="text-sm sm:text-base font-medium opacity-80 font-inter">
                            ({projectsCount})
                          </span>
                        </div>
                      </div>

                      {/* Floating Callout Card on Hover/Selection */}
                      {isHovered && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[220px] rounded-xl bg-white p-3 shadow-2xl border border-slate-100 z-40 animate-fadeIn pointer-events-auto">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAreaId(null);
                              setHoveredAreaId(null);
                            }}
                            className="absolute top-2 right-2 w-5.5 h-5.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center cursor-pointer transition-colors z-50 shadow-xs"
                            aria-label="Close location view"
                          >
                            <Icons.X className="w-3 h-3" />
                          </button>
                          {areaImage && (
                            <div className="h-[75px] rounded-lg overflow-hidden mb-2 relative">
                              <Image src={area.image || area.imageSrc || searchMapImage} alt={areaName} fill className="object-cover" />
                            </div>
                          )}
                          <p className="text-base font-semibold text-slate-900 leading-tight font-inter pr-5">
                            {areaName}
                          </p>
                          <p className="text-[15px] text-slate-500 mt-0.5 line-clamp-2 font-inter">
                            {area.desc || area.description}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
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

                  <div className="flex items-start mb-1">
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

                  {/* Description */}
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

export default JournalSearchV0;
