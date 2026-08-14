"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface JournalAreaV1 {
  id?: string;
  areaId: string | number;
  name?: string;
  title?: string;
  desc?: string;
  description?: string;
  imageSrc?: unknown;
  image?: unknown;
  latlong: { lat: number; lng: number };
  projectsCount?: number;
  projects?: number;
  visitsCount?: number;
  siteVisits?: number;
  dotColor?: string;
  isTopChoice?: boolean;
  polygonPoints?: Array<[number, number]>;
}

export interface JournalMapV1Props {
  areas: JournalAreaV1[];
  selectedAreaId?: string | number | null;
  onSelect?: (areaId: string | number | null) => void;
  hoveredAreaId?: string | number | null;
  onHover?: (areaId: string | number | null) => void;
  defaultCenter?: { lat: number; lng: number };
}

const tileCssFilter = "grayscale(100%) contrast(88%) brightness(114%)";

const toSrc = (img: unknown): string => {
  if (!img) return "";
  if (typeof img === "string") return img;
  if (typeof img === "object" && (img as { src?: string }).src) {
    return (img as { src: string }).src;
  }
  return "";
};

const iconCache = new Map<string, L.DivIcon>();
const pinBase = 32;

function buildIcon(
  dotColor: string,
  name: string,
  projectsCount: string
): L.DivIcon {
  const html = `
    <div class="jmap-pin" style="--c:${dotColor};" aria-hidden="true">
      <span class="jmap-pin__dot"></span>
      <span class="jmap-pin__name">${name}<span class="jmap-pin__caps"> (${projectsCount})</span></span>
    </div>`;
  const key = `${dotColor}:${name}:${projectsCount}`;
  let icon = iconCache.get(key);
  if (!icon) {
    icon = L.divIcon({
      className: "jmap-icon-wrap",
      html,
      iconSize: [0, 0] as L.PointExpression,
      iconAnchor: [0, 0] as L.PointExpression,
    });
    iconCache.set(key, icon);
  }
  return icon;
}

/**
 * Controller component that handles single-viewpoint fitting for ALL areas at the start,
 * zooms into a specific area polygon on selection, and zooms back out to show all areas on close.
 */
function FitBoundsController({
  selected,
  areas,
}: {
  selected?: string | number | null;
  areas: JournalAreaV1[];
}) {
  const map = useMap();
  const container = map.getContainer();
  const hasInitializedRef = useRef(false);

  // Compute all lat/lng points across all areas to construct full viewport bounds
  const allPoints = useMemo(() => {
    const points: Array<[number, number]> = [];
    areas.forEach((area) => {
      if (area.polygonPoints && area.polygonPoints.length > 0) {
        area.polygonPoints.forEach((pt) => points.push(pt));
      } else if (area.latlong) {
        points.push([area.latlong.lat, area.latlong.lng]);
      }
    });
    return points;
  }, [areas]);

  // Compute bounds for a single area
  const selectedAreaPoints = useMemo(() => {
    if (!selected) return null;
    const target = areas.find((a) => a.areaId === selected);
    if (!target) return null;
    if (target.polygonPoints && target.polygonPoints.length > 0) {
      return target.polygonPoints;
    }
    if (target.latlong) {
      return [[target.latlong.lat, target.latlong.lng]] as Array<[number, number]>;
    }
    return null;
  }, [selected, areas]);

  // Fit view to ALL areas at startup or when deselected/closed
  useEffect(() => {
    if (allPoints.length === 0) return;

    if (!selected) {
      const bounds = L.latLngBounds(allPoints.map((pt) => L.latLng(pt[0], pt[1])));
      if (bounds.isValid()) {
        const isFirstLoad = !hasInitializedRef.current;
        hasInitializedRef.current = true;

        if (isFirstLoad) {
          map.fitBounds(bounds, { padding: [50, 50], animate: false });
        } else {
          container.classList.add("jmap-flying");
          map.fitBounds(bounds, {
            padding: [50, 50],
            animate: true,
            duration: 1.2,
          });
          const cleanup = setTimeout(() => container.classList.remove("jmap-flying"), 1300);
          return () => clearTimeout(cleanup);
        }
      }
    }
  }, [selected, allPoints, map, container]);

  // Fit view (zoom in) to the SELECTED area
  useEffect(() => {
    if (!selected || !selectedAreaPoints || selectedAreaPoints.length === 0) return;

    const bounds = L.latLngBounds(selectedAreaPoints.map((pt) => L.latLng(pt[0], pt[1])));
    if (bounds.isValid()) {
      container.classList.add("jmap-flying");

      // If single point (no polygon), zoom into latlong with fixed zoom level
      if (selectedAreaPoints.length === 1) {
        map.flyTo(bounds.getCenter(), 14, { duration: 1.2 });
      } else {
        map.fitBounds(bounds, {
          padding: [70, 70],
          maxZoom: 15,
          animate: true,
          duration: 1.2,
        });
      }

      const cleanup = setTimeout(() => container.classList.remove("jmap-flying"), 1300);
      return () => clearTimeout(cleanup);
    }
  }, [selected, selectedAreaPoints, map, container]);

  return null;
}

function StatefulMarker({
  area,
  icon,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: {
  area: JournalAreaV1;
  icon: L.DivIcon;
  isSelected: boolean;
  isHovered: boolean;
  onSelect?: (areaId: string | number | null) => void;
  onHover?: (areaId: string | number | null) => void;
}) {
  const areaId = area.areaId;
  const areaName = area.name || area.title || "";
  const areaImage = toSrc(area.image ?? area.imageSrc);
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    const el = markerRef.current?.getElement?.() as HTMLElement | null;
    if (!el) return;
    el.classList.toggle("jmap-icon-wrap--selected", !!isSelected);
    el.classList.toggle("jmap-icon-wrap--hover", !!isHovered && !isSelected);
  }, [isSelected, isHovered]);

  return (
    <Marker
      ref={markerRef}
      position={[area.latlong.lat, area.latlong.lng]}
      icon={icon}
      eventHandlers={{
        click: () => {
          if (onSelect) {
            onSelect(isSelected ? null : areaId);
          }
        },
        mouseover: () => onHover && onHover(areaId),
        mouseout: (e) => {
          if (!onHover) return;
          const related = e.originalEvent?.relatedTarget as HTMLElement | null;
          if (
            related &&
            related.closest &&
            related.closest(".jmap-pin, .jmap-icon-wrap, .jmap-callout, .leaflet-tooltip")
          ) {
            return;
          }
          onHover(null);
        },
      }}
    >
      {(isSelected || isHovered) && (
        <Tooltip
          permanent
          direction="top"
          offset={[0, -22]}
          opacity={1}
          className="jmap-callout"
        >
          <div className="jmap-callout__card">
            {areaImage ? (
              <div className="jmap-callout__img">
                <img src={areaImage} alt={areaName} />
              </div>
            ) : null}
            <p className="jmap-callout__name">{areaName}</p>
            {area.desc || area.description ? (
              <p className="jmap-callout__desc">{area.desc || area.description}</p>
            ) : null}
          </div>
        </Tooltip>
      )}
    </Marker>
  );
}

export const JournalMapV1: React.FC<JournalMapV1Props> = ({
  areas,
  selectedAreaId,
  onSelect,
  hoveredAreaId,
  onHover,
  defaultCenter,
}) => {
  const safeAreas = areas && areas.length > 0 ? areas : [];
  const initialCenter: [number, number] = (() => {
    if (defaultCenter && typeof defaultCenter.lat === "number" && typeof defaultCenter.lng === "number") {
      return [defaultCenter.lat, defaultCenter.lng];
    }
    if (safeAreas[0]?.latlong) {
      return [safeAreas[0].latlong.lat, safeAreas[0].latlong.lng];
    }
    return [12.9716, 77.5946];
  })();

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={initialCenter}
        zoom={12}
        minZoom={10}
        maxZoom={18}
        scrollWheelZoom={false}
        attributionControl={false}
        className="jmap-container h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="jmap-tiles"
        />

        {/* Viewport controller handles fitting all 3 areas at startup, zooming in on select, and zooming out on close */}
        <FitBoundsController selected={selectedAreaId} areas={safeAreas} />

        {/* Render all area boundary polygons simultaneously */}
        {safeAreas.map((area) => {
          const verts = area.polygonPoints;
          if (!verts || verts.length < 3) return null;
          const isSelected = selectedAreaId === area.areaId;
          const isHovered = hoveredAreaId === area.areaId || isSelected;
          const strokeColor = area.dotColor || "#DD5128";

          return (
            <Polygon
              key={`polygon-${area.areaId}`}
              positions={verts}
              pathOptions={{
                fillColor: strokeColor,
                fillOpacity: isSelected ? 0.5 : isHovered ? 0.38 : 0.22,
                color: isSelected ? "#DD5128" : strokeColor,
                weight: isSelected ? 4 : isHovered ? 3.5 : 2.5,
                dashArray: isSelected || isHovered ? undefined : "6 4",
                className: `jmap-poly ${isSelected ? "jmap-poly--ring" : isHovered ? "jmap-poly--hover" : ""}`,
              }}
              eventHandlers={{
                click: () => {
                  if (onSelect) onSelect(isSelected ? null : area.areaId);
                },
                mouseover: () => onHover && onHover(area.areaId),
                mouseout: () => onHover && onHover(null),
              }}
            />
          );
        })}

        {/* Render area pin markers */}
        {safeAreas.map((area) => {
          const isSelected = selectedAreaId === area.areaId;
          const isHovered = hoveredAreaId === area.areaId || isSelected;
          const icon = buildIcon(
            area.dotColor || "#DD5128",
            area.name || area.title || "",
            String(area.projectsCount || area.projects || 0)
          );

          return (
            <StatefulMarker
              key={`marker-${area.areaId}`}
              area={area}
              icon={icon}
              isSelected={isSelected}
              isHovered={isHovered}
              onSelect={onSelect}
              onHover={onHover}
            />
          );
        })}
      </MapContainer>

      {/* Reset view overlay button when zoomed into a specific area */}
      {selectedAreaId !== null && selectedAreaId !== undefined && (
        <button
          type="button"
          onClick={() => onSelect && onSelect(null)}
          className="absolute bottom-4 right-4 z-[400] bg-white/95 backdrop-blur-sm text-slate-800 text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl shadow-lg border border-slate-200 hover:bg-white hover:text-[#DD5128] transition-all flex items-center gap-2 group cursor-pointer"
        >
          <svg className="w-4 h-4 text-slate-500 group-hover:text-[#DD5128] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          <span>Show All Areas (Zoom Out)</span>
        </button>
      )}

      <style jsx global>{`
        .jmap-container {
          background: #ecebea;
          z-index: 0;
        }
        .jmap-container.jmap-flying,
        .jmap-flying {
          pointer-events: none !important;
        }
        .jmap-flying * {
          pointer-events: none !important;
        }
        .jmap-tiles {
          filter: ${tileCssFilter};
        }
        .jmap-tiles img {
          filter: ${tileCssFilter};
        }
        .jmap-poly {
          cursor: pointer;
          transition: fill-opacity 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease,
            filter 0.3s ease;
        }
        .jmap-poly--hover {
          filter: drop-shadow(0 0 6px rgba(221, 81, 40, 0.5));
        }
        @keyframes jmapPolyRing {
          0%,
          100% {
            filter: drop-shadow(0 0 4px rgba(221, 81, 40, 0.55)) drop-shadow(0 0 12px rgba(221, 81, 40, 0.25));
          }
          50% {
            filter: drop-shadow(0 0 7px rgba(221, 81, 40, 0.7)) drop-shadow(0 0 20px rgba(221, 81, 40, 0.4));
          }
        }
        .jmap-poly--ring {
          animation: jmapPolyRing 2s ease-in-out infinite;
        }
        .jmap-icon-wrap {
          position: relative;
          background: transparent;
          border: none;
          width: 0 !important;
          height: 0 !important;
          margin: 0;
          overflow: visible;
          pointer-events: none;
        }
        .jmap-pin {
          position: absolute;
          left: 0;
          top: 0;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: ${pinBase}px;
          padding-left: 12px;
          padding-right: 12px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.95);
          color: #334155;
          border: 2px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
          cursor: pointer;
          pointer-events: auto;
          white-space: nowrap;
          transform: translate(-50%, -50%);
          transform-origin: center center;
          transition: width 0.3s ease, padding 0.3s ease, background-color 0.25s ease,
            border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
          will-change: transform;
        }
        .jmap-pin__dot {
          flex: none;
          width: 12px;
          height: 12px;
          border-radius: 9999px;
          background: var(--c, #dd5128);
          margin-right: 6px;
          animation: jmapDotPulse 2.2s ease-in-out infinite;
          pointer-events: none;
        }
        .jmap-pin__name {
          flex: none;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          white-space: nowrap;
          font-family: 'Inter Tight', system-ui, sans-serif;
          transition: max-width 0.3s ease, opacity 0.2s ease, overflow 0.3s ease;
          max-width: 240px;
          overflow: hidden;
          pointer-events: none;
        }
        .jmap-pin__caps {
          font-weight: 500;
          opacity: 0.8;
          pointer-events: none;
        }
        @keyframes jmapDotPulse {
          0% {
            box-shadow: 0 0 0 0 color-mix(in srgb, var(--c, #dd5128) 40%, transparent);
          }
          70% {
            box-shadow: 0 0 0 8px transparent;
          }
          100% {
            box-shadow: 0 0 0 0 transparent;
          }
        }
        .jmap-icon-wrap--hover .jmap-pin {
          width: ${pinBase}px;
          height: ${pinBase}px;
          padding: 0;
          justify-content: center;
          background: #111827;
          border-color: var(--c, #dd5128);
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.3);
          transform: translate(-50%, -50%) scale(1.1);
        }
        .jmap-icon-wrap--hover .jmap-pin__dot {
          background: var(--c, #dd5128);
          animation: none;
          margin-right: 0;
        }
        .jmap-icon-wrap--hover .jmap-pin__name {
          max-width: 0;
          opacity: 0;
          overflow: hidden;
        }
        .jmap-icon-wrap--selected .jmap-pin {
          width: ${pinBase}px;
          height: ${pinBase}px;
          padding: 0;
          justify-content: center;
          background: #dd5128;
          border: 2px solid #fff;
          box-shadow: 0 8px 22px rgba(221, 81, 40, 0.55);
          transform: translate(-50%, -50%) scale(1.15);
        }
        .jmap-icon-wrap--selected .jmap-pin__dot {
          background: #fff;
          animation: none;
          margin-right: 0;
        }
        .jmap-icon-wrap--selected .jmap-pin__name {
          max-width: 0;
          opacity: 0;
          overflow: hidden;
        }
        .jmap-icon-wrap--selected .jmap-pin,
        .jmap-icon-wrap--hover .jmap-pin {
          z-index: 300;
        }
        .jmap-callout {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .jmap-callout::before {
          display: none !important;
        }
        .jmap-callout__card {
          background: #ffffff;
          border-radius: 12px;
          padding: 10px 14px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(226, 232, 240, 0.8);
          min-width: 160px;
          max-width: 240px;
          font-family: 'Inter Tight', system-ui, sans-serif;
        }
        .jmap-callout__img {
          width: 100%;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .jmap-callout__img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .jmap-callout__name {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          line-height: 1.3;
          white-space: normal;
          overflow-wrap: break-word;
        }
        .jmap-callout__desc {
          font-size: 11px;
          color: #64748b;
          margin: 2px 0 0 0;
          line-height: 1.3;
          white-space: normal;
          overflow-wrap: break-word;
        }
      `}</style>
    </div>
  );
};

export default JournalMapV1;
