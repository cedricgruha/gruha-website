"use client";

import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ---------------------------------------------------------------------------
 * JournalMapV0
 * ---------------------------------------------------------------------------
 * A real interactive Leaflet map that replaces the old Google-iframe + SVG
 * overlay. Because Leaflet renders markers/polygons against a true Web Mercator
 * base, everything stays glued to its coordinates at every zoom level (fixing
 * the old "selection drifts off when zooming" bug).
 *
 * Mirrors the legacy visuals: grayscale base map, coral/blue/green dot markers,
 * a name + projects-count pill, and offset-hexagon zone highlights drawn in
 * geo-space so the highlighting behaviour is identical to the old design.
 * No API key required (OpenStreetMap tiles).
 * ------------------------------------------------------------------------- */

export interface JournalArea {
  id: string;
  areaId: string;
  name?: string;
  title?: string;
  desc?: string;
  description?: string;
  /** Optional thumbnail shown inside the hover callout card. */
  imageSrc?: unknown;
  image?: unknown;
  latlong: { lat: number; lng: number };
  projectsCount?: number;
  projects?: number;
  visitsCount?: number;
  siteVisits?: number;
  dotColor?: string;
  isTopChoice?: boolean;
  /** Geodesic polygon vertices [lat, lng][] around the centroid (zone highlight). */
  polygonPoints?: Array<[number, number]>;
}

export interface JournalMapV0Props {
  areas: JournalArea[];
  selectedAreaId?: string | number | null;
  onSelect?: (areaId: string | number | null) => void;
  hoveredAreaId?: string | number | null;
  onHover?: (areaId: string | number | null) => void;
  /** Prefer a specific centre when nothing is selected (drives flyTo). */
  defaultCenter?: { lat: number; lng: number };
}

// Grayscale filter applied to the rendered tiles for the muted editorial look.
const tileCssFilter = "grayscale(80%) contrast(95%) brightness(105%)";

// Normalise a static import ({ src }) or a string URL into a usable src.
const toSrc = (img: unknown): string => {
  if (!img) return "";
  if (typeof img === "string") return img;
  if (typeof img === "object" && (img as { src?: string }).src) {
    return (img as { src: string }).src;
  }
  return "";
};

// Build a domIcon (HTML pill) so we control marker styling exactly like the old
// design and avoid Leaflet's broken default marker-image path under bundlers.
// Mirrors the legacy pill: dot (with pulse) + name + (projects) by default,
// collapsing to just the dot on hover/selection.
//
// IMPORTANT: Each area gets ONE stable L.divIcon object, cached by the area's
// static colour/name (NOT by its transient selected/hovered state). Returning the
// identical icon object every render means react-leaflet never calls
// marker.setIcon() for a marker when unrelated pins change, so the marker's DOM
// element persists and CSS transitions can actually animate the pill collapse,
// scale and glow. The selected/hovered look is applied by toggling extra classes
// on the persisted element (see StatefulMarker), never by swapping the icon
// markup — swapping would recreate the DOM and interrupt every transition.
const iconCache = new Map<string, L.DivIcon>();
const dotSize = 12;
// Left gutter of the dot inside the pill. Kept FIXED in every state so the dot
// never moves relative to the icon's left edge — no positional drift, no shake.
const gutterL = 10;
const pillH = 32; // matches the original "h-8" (8 * 4px) pill height
const labelPad = 8; // right padding so the rounded pill has breathing room
const anchorX = gutterL + dotSize / 2; // dot’s horizontal centre
const anchorY = pillH / 2; // vertical centre of the pill/dot

function buildIcon(
  dotColor: string,
  name: string,
  projectsCount: string
): L.DivIcon {
  // Always render the full pill + label exactly once per area. The dot keeps its
  // pulse class in every state; the active state simply pauses it via CSS.
  const html = `
    <div class="jmap-pin" style="--bordercolor:${dotColor};">
      <span class="jmap-pin__dot jmap-pin__dot--pulse" style="background:${dotColor}"></span>
      <span class="jmap-pin__label">
        <span class="jmap-pin__name">${name}</span>
        <span class="jmap-pin__count">(${projectsCount})</span>
      </span>
    </div>`;
  const key = `${dotColor}:${name}:${projectsCount}`;
  let icon = iconCache.get(key);
  if (!icon) {
    icon = L.divIcon({
      className: "jmap-icon-wrap",
      html,
      iconSize: undefined,
      iconAnchor: [anchorX, anchorY],
    });
    iconCache.set(key, icon);
  }
  return icon;
}

/**
 * Child that recentres + rezooms the map when the selection changes.
 *
 * We intentionally depend ONLY on the selected area's primitive lat/lng values
 * (not the `areas` array reference). `areas` is recreated on every parent render,
 * so depending on it would re-run this effect whenever ANY hover/zoom changes and
 * yank the map back onto the selected polygon even after the user has panned away
 * to another region. Primitives only change when the actual selection changes.
 */
function FlyController({
  selected,
  areas,
}: {
  selected?: string | number | null;
  areas: JournalArea[];
}) {
  const map = useMap();
  const target = areas.find((a) => a.areaId === selected);
  const lat = target?.latlong?.lat;
  const lng = target?.latlong?.lng;
  useEffect(() => {
    if (lat == null || lng == null) return;
    // Ease-in-out pan + zoom focusing on the chosen region (smooth, parity with
    // the old “fly to focused zone” feel rather than an abrupt jump).
    map.flyTo([lat, lng], 14, {
      duration: 0.9,
      easeLinearity: 0.25, // smooth ease-in-out curve instead of the default
    });
  }, [lat, lng, map]);
  return null;
}

/**
 * Renders one pin Marker + its floating callout card.
 *
 * The pin's visual state (idle / hovered / selected) is applied by toggling CSS
 * classes on the marker's PERSISTED DOM element instead of swapping the icon.
 * Because the icon object is stable (see buildIcon) react-leaflet never calls
 * marker.setIcon(), so the DOM element stays the same and CSS transitions play
 * the smooth pill collapse / scale / glow animations. If we baked the state into
 * the icon markup, setIcon would recreate the element and every transition would
 * jump instead of animating.
 */
function StatefulMarker({
  area,
  icon,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: {
  area: JournalArea;
  icon: L.DivIcon;
  isSelected: boolean;
  isHovered: boolean;
  onSelect?: (areaId: string | number | null) => void;
  onHover?: (areaId: string | number | null) => void;
}) {
  const areaId = area.areaId;
  const dotColor = area.dotColor || "#DD5128";
  const areaName = area.name || area.title || "";
  const projectsCount = area.projectsCount || area.projects || 0;
  const visitsCount = area.visitsCount || area.siteVisits || 0;
  const areaImage = toSrc(area.image ?? area.imageSrc);
  const markerRef = useRef<L.Marker>(null);

  // Keep the persisted pin element in sync with the selected/hovered state.
  // The classes live on the OUTER leaflet element (.jmap-icon-wrap) and drive
  // the pill's appearance via descendant selectors, so the same element animates.
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
        mouseout: () => onHover && onHover(null),
      }}
    >
      {/* Floating callout card — shows on hover OR on selection-from-sidebar.
          Parity with the old SVG overlay: the card appears whenever the
          polygon/pin is active, regardless of whether the mouse is over it.
          Driven by state (not Leaflet's hover-only tooltip). */}
      {(isSelected || isHovered) && (
        <Tooltip
          permanent
          direction="top"
          offset={[0, -6]}
          opacity={1}
          className="jmap-callout"
        >
          <div className="jmap-callout__card">
            <button
              type="button"
              className="jmap-callout__close"
              aria-label="Close location view"
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                if (onSelect) {
                  onSelect(null);
                  onHover && onHover(null);
                }
              }}
            >
              ✕
            </button>
            {areaImage ? (
              <div className="jmap-callout__img">
                <img src={areaImage} alt={areaName} />
              </div>
            ) : null}
            <p className="jmap-callout__name">{areaName}</p>
            {area.desc || area.description ? (
              <p className="jmap-callout__desc">{area.desc || area.description}</p>
            ) : null}
            <div className="jmap-callout__meta">
              <span>
                <span className="jmap-popup__dot" style={{ background: dotColor }} />
                {projectsCount} Projects
              </span>
              <span>•</span>
              <span>{visitsCount} Site visits</span>
            </div>
          </div>
        </Tooltip>
      )}
    </Marker>
  );
}

export const JournalMapV0: React.FC<JournalMapV0Props> = ({
  areas,
  selectedAreaId,
  onSelect,
  hoveredAreaId,
  onHover,
  defaultCenter,
}) => {
  const safe = areas && areas.length > 0 ? areas : [];
  const center: [number, number] = (() => {
    if (defaultCenter && typeof defaultCenter.lat === "number" && typeof defaultCenter.lng === "number") {
      return [defaultCenter.lat, defaultCenter.lng];
    }
    if (safe[0]?.latlong) {
      return [safe[0].latlong.lat, safe[0].latlong.lng];
    }
    return [12.9716, 77.5946];
  })();

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={false}
        className="jmap-container h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="jmap-tiles"
        />
        <FlyController selected={selectedAreaId} areas={safe} />

        {/* Zone highlight polygons (kept glued to real coords by Leaflet) */}
        {safe.map((area) => {
          const areaId = area.areaId;
          const isSelected = selectedAreaId === areaId;
          const isHovered = hoveredAreaId === areaId || isSelected;
          const strokeColor = area.dotColor || "#DD5128";
          const areaName = area.name || area.title || "";
          const projectsCount = area.projectsCount || area.projects || 0;
          const visitsCount = area.visitsCount || area.siteVisits || 0;
          if (!area.polygonPoints || area.polygonPoints.length < 3) return null;

          return (
            <Polygon
              key={`polygon-${areaId}`}
              positions={area.polygonPoints}
              pathOptions={{
                fillColor: strokeColor,
                fillOpacity: isSelected ? 0.45 : isHovered ? 0.35 : 0.18,
                color: isSelected ? "#DD5128" : strokeColor,
                weight: isSelected ? 4 : isHovered ? 3.5 : 2,
                dashArray: isSelected || isHovered ? undefined : "6 4",
                className: `jmap-poly ${isSelected || isHovered ? "jmap-poly--glow" : ""}`,
              }}
              eventHandlers={{
                click: () => {
                  if (onSelect) {
                    onSelect(isSelected ? null : areaId);
                  }
                },
                mouseover: () => onHover && onHover(areaId),
                mouseout: () => onHover && onHover(null),
              }}
            />
          );
        })}

        {safe.map((area) => {
          const isSelected = selectedAreaId === area.areaId;
          const isHovered = hoveredAreaId === area.areaId || isSelected;
          // One stable icon per area (independent of state) so the marker's DOM
          // persists and CSS transitions animate the collapse/scale/glow.
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

      <style jsx global>{`
        .jmap-container {
          background: #e5e3df;
          z-index: 0;
        }
        .jmap-tiles {
          filter: ${tileCssFilter};
        }
        .jmap-tiles img {
          filter: ${tileCssFilter};
        }
        .jmap-poly {
          cursor: pointer;
        }
        /* Soft pulsing glow around the active polygon (parity with the old
           highlighted-zone halo) — keyframed, not a static filter. */
        @keyframes jmapPolyGlow {
          0%,
          100% {
            filter: drop-shadow(0 0 4px rgba(221, 81, 40, 0.35));
          }
          50% {
            filter: drop-shadow(0 0 10px rgba(221, 81, 40, 0.6));
          }
        }
        .jmap-poly--glow {
          animation: jmapPolyGlow 2.2s ease-in-out infinite;
        }
        .jmap-icon-wrap {
          background: transparent;
          border: none;
        }
        .jmap-pin {
          display: flex;
          align-items: center;
          /* Left-align so the dot keeps a FIXED left gutter in every state and
             never drifts relative to the coordinate when the label collapses. */
          justify-content: flex-start;
          gap: 0;
          box-sizing: border-box;
          width: max-content;
          height: ${pillH}px;
          padding-left: ${gutterL}px;
          padding-right: ${labelPad}px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
          border: 1px solid rgb(226 232 240);
          cursor: pointer;
          white-space: nowrap;
          transform-origin: ${anchorX}px ${anchorY}px;
          transition: background-color 0.2s ease, border-color 0.2s ease,
            box-shadow 0.2s ease, color 0.2s ease, transform 0.18s ease;
          will-change: transform;
        }
        .jmap-pin:hover {
          transform: scale(1.05);
        }
        /* The active look is applied to the persisted marker element via the
           wrapper classes (see StatefulMarker), so the SAME element animates.
           Collapse the pill to just the dot, scale up from its anchor, and swap
           the background — all smooth because the element never gets recreated. */
        .jmap-icon-wrap--selected .jmap-pin,
        .jmap-icon-wrap--hover .jmap-pin {
          /* Collapse to the square dot (mirrors old w-8 h-8) */
          padding-right: 0;
          transform: scale(1.1);
        }
        .jmap-icon-wrap--selected .jmap-pin {
          background: #dd5128;
          border: 2px solid #fff;
          color: #fff;
          box-shadow: 0 6px 18px rgba(221, 81, 40, 0.45);
        }
        .jmap-icon-wrap--hover .jmap-pin {
          background: #111827;
          border: 2px solid var(--bordercolor, rgb(226 232 240));
          color: #fff;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.28);
        }
        /* White centre dot when active so it pops on the coral/navy pill. */
        .jmap-icon-wrap--selected .jmap-pin__dot,
        .jmap-icon-wrap--hover .jmap-pin__dot {
          background: #fff;
          margin-right: 0;
        }
        .jmap-pin__dot {
          width: ${dotSize}px;
          height: ${dotSize}px;
          border-radius: 9999px;
          flex: none;
          margin-right: 6px;
          transition: background-color 0.2s ease, margin-right 0.3s ease;
        }
        /* Restore the old animated (pulsing) centre dot */
        @keyframes jmapDotPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(20, 20, 20, 0.25);
          }
          70% {
            box-shadow: 0 0 0 5px rgba(20, 20, 20, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(20, 20, 20, 0);
          }
        }
        .jmap-pin__dot--pulse {
          animation: jmapDotPulse 1.6s ease-in-out infinite;
        }
        .jmap-icon-wrap--selected .jmap-pin__dot--pulse,
        .jmap-icon-wrap--hover .jmap-pin__dot--pulse {
          animation: none;
          box-shadow: none;
        }
        .jmap-pin__label {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          overflow: hidden;
          white-space: nowrap;
          font-size: 14px;
          font-weight: 600;
          color: inherit;
          font-family: 'Inter Tight', system-ui, sans-serif;
          /* Start fully expanded; active state retracts it to 0 via the wrapper
             classes, and because the element persists this transition plays. */
          max-width: 220px;
          opacity: 1;
          transition: max-width 0.3s ease, opacity 0.25s ease, padding 0.3s ease;
        }
        .jmap-icon-wrap--selected .jmap-pin__label,
        .jmap-icon-wrap--hover .jmap-pin__label {
          max-width: 0;
          opacity: 0;
          padding: 0;
        }
        .jmap-pin__name {
          font-weight: 600;
        }
        .jmap-pin__count {
          font-size: 14px;
          font-weight: 500;
          color: inherit;
          opacity: 0.8;
          font-family: 'Inter Tight', system-ui, sans-serif;
        }
        .jmap-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
        }
        .jmap-popup {
          font-family: 'Inter Tight', system-ui, sans-serif;
          min-width: 180px;
        }
        .jmap-popup__name {
          margin: 0 0 4px;
          font-size: 14px;
          font-weight: 700;
          color: #111821;
        }
        .jmap-popup__desc {
          margin: 0 0 6px;
          font-size: 12px;
          line-height: 1.4;
          color: #59636f;
        }
        .jmap-popup__meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          color: #64748b;
          border-top: 1px solid rgb(241 245 249);
          padding-top: 6px;
        }
        .jmap-popup__dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          margin-right: 4px;
        }
        /* Hover callout card (old floating callout equivalent) — scales up and
           fades in from its anchor (parity with the old card entrance). */
        @keyframes jmapFadeIn {
          from {
            opacity: 0;
            transform: translateY(4px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .jmap-callout {
          background: transparent;
          border: none;
          box-shadow: none;
        }
        .jmap-callout .leaflet-tooltip-content {
          width: 220px;
        }
        .jmap-callout .leaflet-tooltip-top:before {
          margin-left: -6px;
          border-top-color: #fff;
        }
        .jmap-callout .leaflet-tooltip-content-wrapper {
          border-radius: 12px;
          box-shadow: none;
          border: none;
          background: transparent;
          padding: 0;
        }
        .jmap-callout__card {
          position: relative;
          border-radius: 12px;
          background: #ffffff;
          padding: 12px;
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.22);
          border: 1px solid rgb(241 245 249);
          animation: jmapFadeIn 0.4s ease-out forwards;
        }
        .jmap-callout__close {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 10;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          background: rgba(15, 23, 42, 0.7);
          color: #fff;
          font-size: 12px;
          line-height: 1;
          cursor: pointer;
          border: none;
          transition: background-color 0.2s ease;
        }
        .jmap-callout__close:hover {
          background: rgba(15, 23, 42, 0.9);
        }
        .jmap-callout {
          font-family: 'Inter Tight', system-ui, sans-serif;
        }
        .jmap-callout__name {
          margin: 0 0 4px;
          font-size: 14px;
          font-weight: 700;
          color: #111821;
          padding-right: 20px; /* room for the ✕ close button */
        }
        .jmap-callout .jmap-callout__img {
          height: 75px; /* matches the old floating callout */
          margin: 0 0 8px;
        }
        .jmap-callout__img {
          width: 100%;
          height: 76px;
          border-radius: 8px;
          overflow: hidden;
          margin: 0 0 8px;
          background: #f1f5f9;
        }
        /* Soft zoom micro-interaction on the card thumbnail (old group-hover). */
        .jmap-callout__card:hover .jmap-callout__img img {
          transform: scale(1.05);
        }
        .jmap-callout__img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .jmap-callout__desc {
          margin: 0 0 6px;
          font-size: 13px;
          line-height: 1.45;
          color: #59636f;
        }
        .jmap-callout .jmap-callout__meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          color: #64748b;
          border-top: 1px solid rgb(241 245 249);
          padding-top: 6px;
        }
      `}</style>
    </div>
  );
};

export default JournalMapV0;
