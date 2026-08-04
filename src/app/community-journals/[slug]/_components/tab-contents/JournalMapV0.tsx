"use client";

import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
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
// IMPORTANT: Icons are cached by their markup hash so that a marker keeps the
// *same L.divIcon object* unless its own state really changed. If we returned a
// brand-new object every render, react-leaflet would call `marker.setIcon()` for
// EVERY marker whenever ANY hover/selection changes — re-creating all of their
// DOM and making the whole map visibly “shake”. Caching avoids that entirely.
const iconCache = new Map<string, L.DivIcon>();
const dotSize = 12;
// Left gutter of the dot inside the pill. Keeping this FIXED in every state
// (selected / hovered / idle) means the dot never moves relative to the icon's
// left edge, so the anchored dot stays glued to the coordinate when the label
// collapses/expands — no positional drift, no shake.
const gutterL = 8;
const pillH = 22;
const anchorX = gutterL + dotSize / 2; // dot’s horizontal centre
const anchorY = pillH / 2; // vertical centre of the pill/dot

function buildIcon(
  dotColor: string,
  isSelected: boolean,
  isHovered: boolean,
  name: string,
  projectsCount: string
): L.DivIcon {
  const active = isSelected || isHovered;
  const html = `
    <div class="jmap-pin ${isSelected ? "jmap-pin--selected" : ""} ${
    isHovered && !isSelected ? "jmap-pin--hover" : ""
  }" style="${active ? `--bordercolor:${dotColor};` : ""}">
      <span class="jmap-pin__dot jmap-pin__dot--pulse" style="background:${active ? "#fff" : dotColor}"></span>
      ${active ? "" : `<span class="jmap-pin__label">${name}</span><span class="jmap-pin__count">(${projectsCount})</span>`}
    </div>`;
  const hash = html;
  let icon = iconCache.get(hash);
  if (!icon) {
    icon = L.divIcon({
      className: "jmap-icon-wrap",
      html,
      iconSize: undefined,
      iconAnchor: [anchorX, anchorY],
    });
    iconCache.set(hash, icon);
  }
  return icon;
}

/** Child that recentres + rezooms the map whenever the selection changes. */
function FlyController({
  selected,
  areas,
}: {
  selected?: string | number | null;
  areas: JournalArea[];
}) {
  const map = useMap();
  useEffect(() => {
    const target = areas.find((a) => a.areaId === selected);
    if (target) {
      map.flyTo([target.latlong.lat, target.latlong.lng], 14, { duration: 0.8 });
    }
  }, [selected, areas, map]);
  return null;
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
          const areaId = area.areaId;
          const isSelected = selectedAreaId === areaId;
          const isHovered = hoveredAreaId === areaId || isSelected;
          const dotColor = area.dotColor || "#DD5128";
          const areaName = area.name || area.title || "";
          const projectsCount = area.projectsCount || area.projects || 0;
          const visitsCount = area.visitsCount || area.siteVisits || 0;
          const areaImage = toSrc(area.image ?? area.imageSrc);

          const icon = buildIcon(dotColor, isSelected, isHovered, areaName, String(projectsCount));

          return (
            <Marker
              key={`marker-${areaId}`}
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
              {/* Hover card (replaces the old floating callout) — shows on hover */}
              <Tooltip direction="top" offset={[0, -6]} opacity={1} sticky={false} className="jmap-callout">
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
              </Tooltip>

              <Popup>
                <div className="jmap-popup">
                  {areaImage ? (
                    <div className="jmap-callout__img">
                      <img src={areaImage} alt={areaName} />
                    </div>
                  ) : null}
                  <p className="jmap-popup__name">{areaName}</p>
                  {area.desc || area.description ? (
                    <p className="jmap-popup__desc">{area.desc || area.description}</p>
                  ) : null}
                  <div className="jmap-popup__meta">
                    <span>
                      <span className="jmap-popup__dot" style={{ background: dotColor }} />
                      {projectsCount} Projects
                    </span>
                    <span>•</span>
                    <span>{visitsCount} Site visits</span>
                  </div>
                </div>
              </Popup>
            </Marker>
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
        .jmap-poly--glow {
          filter: drop-shadow(0 0 6px rgba(221, 81, 40, 0.45));
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
          gap: 6px;
          box-sizing: border-box;
          width: max-content;
          height: ${pillH}px;
          padding-left: ${gutterL}px;
          padding-right: 8px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.9);
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
          transform: scale(1.06);
        }
        .jmap-pin--selected {
          background: #dd5128;
          border: 2px solid #fff;
          color: #fff;
          transform: scale(1.14);
          box-shadow: 0 6px 18px rgba(221, 81, 40, 0.45);
        }
        .jmap-pin--hover {
          background: #111827;
          border: 2px solid var(--bordercolor, rgb(226 232 240));
          color: #fff;
          transform: scale(1.14);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.28);
        }
        .jmap-pin__dot {
          width: ${dotSize}px;
          height: ${dotSize}px;
          border-radius: 9999px;
          flex: none;
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
        .jmap-pin--selected .jmap-pin__dot--pulse,
        .jmap-pin--hover .jmap-pin__dot--pulse {
          animation: none;
          box-shadow: none;
        }
        .jmap-pin__label {
          font-size: 12px;
          font-weight: 600;
          color: inherit;
          font-family: 'Inter Tight', system-ui, sans-serif;
        }
        .jmap-pin__count {
          font-size: 12px;
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
        /* Hover callout card (old floating callout equivalent) */
        @keyframes jmapFadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .jmap-callout {
          background: transparent;
          border: none;
          box-shadow: none;
        }
        .jmap-callout .leaflet-tooltip-content {
          width: 200px;
        }
        .jmap-callout .leaflet-tooltip-top:before {
          margin-left: -6px;
        }
        .jmap-callout .leaflet-tooltip-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.22);
          border: 1px solid rgb(241 245 249);
          animation: jmapFadeIn 0.4s ease-out forwards;
        }
        .jmap-callout {
          font-family: 'Inter Tight', system-ui, sans-serif;
        }
        .jmap-callout__name {
          margin: 0 0 4px;
          font-size: 15px;
          font-weight: 700;
          color: #111821;
        }
        .jmap-callout__img {
          width: 100%;
          height: 76px;
          border-radius: 8px;
          overflow: hidden;
          margin: 0 0 8px;
          background: #f1f5f9;
        }
        .jmap-callout__img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .jmap-popup .jmap-callout__img {
          margin-bottom: 8px;
        }
        .jmap-callout__img {
          width: 100%;
          height: 76px;
          border-radius: 8px;
          overflow: hidden;
          margin: 0 0 8px;
          background: #f1f5f9;
        }
        .jmap-callout__img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .jmap-popup .jmap-callout__img {
          margin-bottom: 8px;
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
