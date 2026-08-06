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

/* ---------------------------------------------------------------------------
 * JournalMapV0
 * ---------------------------------------------------------------------------
 * A real interactive Leaflet map that replaces the old Google-iframe + SVG
 * overlay. Because Leaflet renders markers/polygons against a true Web Mercator
 * base, everything stays glued to its coordinates at every zoom level (fixing
 * the old "selection drifts off when zooming" bug).
 *
 * Mirrors the legacy visuals: grayscale base map, coral/blue/green dot markers,
 * a name + projects-count pill, and offset-hexagon zone highlights drawn as
 * fixed-pixel shapes (recomputed in Leaflet) so the highlighting behaviour is
 * identical to the old SVG design while staying glued to real coordinates.
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
// Lighter, cleaner monochrome (less contrast, brighter) to match the target design
// where the map reads as a soft grey backdrop behind the pins/polygons.
const tileCssFilter = "grayscale(100%) contrast(88%) brightness(114%)";

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
// Build a domIcon (HTML marker) so we control marker styling exactly like the
// target design and avoid Leaflet's broken default marker-image path under bundlers.
//
// Pin anatomy (3 states, all driven by CSS classes on the persisted element so
// transitions animate rather than jump):
//   - IDLE   : a small coral circular dot with the projects-count in white.
//   - HOVER  : the dot morphs into a rounded pill and a text label (area name)
//              expands outward from the dot. The dot/count never moves.
//   - SELECTED: the pin becomes a red teardrop (circular head + downward tail)
//              that points at the map coordinate, with the count still inside.
//   The callout card renders above the pin in the selected/hover states.
//
// IMPORTANT: Each area gets ONE stable L.divIcon object, cached by the area's
// static colour/count (NOT by its transient selected/hovered state). Returning the
// identical icon object every render means react-leaflet never calls
// marker.setIcon() for a marker when unrelated pins change, so the marker's DOM
// element persists and CSS transitions actually animate the collapse/expand,
// teardrop morph, scale and glow. The selected/hovered look is applied by toggling
// extra classes on the persisted element (see StatefulMarker), never by swapping
// the icon markup — swapping would recreate the DOM and interrupt every transition.
const iconCache = new Map<string, L.DivIcon>();

// Zero-size anchor: the map coordinate maps to the top-left of the (0x0) wrapper,
// and the pin self-centres via transform: translate(-50%, -50%) in CSS — exactly like
// the legacy -translate-x-1/2 -translate-y-1/2. This keeps the IDLE pill centred on
// the coordinate while the active states collapse into a centred dot (no drift).
const pinBase = 32; // diameter of the collapsed dot circle

function buildIcon(
  dotColor: string,
  name: string,
  projectsCount: string
): L.DivIcon {
  // Structure mirrors the legacy pill: a leading coloured dot (with a soft pulse)
  // followed by the name + (projects) label. Visual states are driven by CSS classes
  // on the persisted element, not by swapping the icon. The whole pill is centred on
  // the coordinate via translate(-50%,-50%) on .jmap-pin.
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
      // Zero-size so Leaflet puts the coordinate at the wrapper's origin; all
      // visual anchoring is done by translate(-50%,-50%) on .jmap-pin.
      iconSize: [0, 0] as L.PointExpression,
      iconAnchor: [0, 0] as L.PointExpression,
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
const FLY_DURATION_MS = 1400; // must stay in sync with the flyTo duration below

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
  const container = map.getContainer();

  useEffect(() => {
    if (lat == null || lng == null) return;

    // While the camera flies/pan across the map, the cursor passes over other pins
    // and polygons, firing their mouseover events mid-animation and flickering
    // unwanted popups on. Suppress pointer events on the whole map during the flight
    // and only re-enable them once the camera comes to rest (moveend). This kills
    // the "ghost hover" flicker and the mid-flight popup tearing.
    container.classList.add("jmap-flying");

    // Fly to the SAME zoom as the map's default (12), so selecting a corridor is a
    // pure PAN (no zoom animation). The fixed-pixel hexagons are latlng-anchored and
    // stay glued + constant-sized during a pan without any recompute, eliminating
    // both the mid-flight shape distortion and the continuous-recompute churn. The
    // pan also keeps surrounding neighbouring corridors in frame (context preserved).
    map.flyTo([lat, lng], 12, {
      duration: 1.4,
      easeLinearity: 0.18, // gentle ease-in-out arc
    });

    const handleMoveEnd = () => container.classList.remove("jmap-flying");
    const handleZoomEnd = () => container.classList.remove("jmap-flying");
    map.once("moveend", handleMoveEnd);
    map.once("zoomend", handleZoomEnd);
    // Safety net: if flyTo doesn't actually move (target already centred/zoomed) no
    // moveend/zoomend fires, so force re-enable pointer events after the flight.
    const fallback = window.setTimeout(
      () => container.classList.remove("jmap-flying"),
      FLY_DURATION_MS + 200
    );

    return () => {
      container.classList.remove("jmap-flying");
      window.clearTimeout(fallback);
      map.off("moveend", handleMoveEnd);
      map.off("zoomend", handleZoomEnd);
    };
  }, [lat, lng, map, container]);
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
  const areaName = area.name || area.title || "";
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
        mouseout: (e) => {
          if (!onHover) return;
          // Keep the callout alive while the cursor moves between the pin and our
          // floating card (both here in the map). If we cleared hover the instant the
          // pointer left the pill, the card would flicker open/closed as the cursor
          // travels from the pill up onto the card. Only clear when the pointer truly
          // leaves both regions (lands on the map / another element).
          const related = e.originalEvent?.relatedTarget as HTMLElement | null;
          if (related && related.closest && related.closest(".jmap-pin, .jmap-icon-wrap, .jmap-callout, .leaflet-tooltip")) {
            return;
          }
          onHover(null);
        },
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
            {(area.desc || area.description) ? (
              <p className="jmap-callout__desc">{area.desc || area.description}</p>
            ) : null}
          </div>
        </Tooltip>
      )}
    </Marker>
  );
}

/**
 * Zone highlight polygons rendered as FIXED-PIXEL hexagons, exactly like the old
 * Google-iframe SVG overlay (radius 54px on a 1000px viewBox).
 *
 * The legacy version projected each area's latlng into a fixed SVG canvas and drew
 * a constant-size hexagon AROUND that point in pixel space:
 *
 *   angles  = [0,60,120,180,240,300]
 *   offsets = [1.1, 0.85, 1.05, 0.9, 1.15, 0.95]
 *   px = cx + cos(rad) * 54 * offsets[(i + idx) % 6]
 *   py = cy + sin(rad) * 54 * offsets[(i + idx + 2) % 6]
 *
 * To keep that identical fixed 54px on-screen look now that the renderer is Leaflet,
 * we compute the hexagon vertices in SCREEN-pixel space around each area's real
 * coordinate (map.latLngToLayerPoint) and convert them back to latlng for a true
 * Leaflet <Polygon>. Because the hexagon derives from the area's own coordinate,
 * it stays glued to the pin at every zoom level (the bug fix), while its on-screen
 * size stays constant just like the old overlay. We only recompute on zoomend —
 * panning needs no recompute because each vertex is derived from the map transform
 * at the moment of render.
 */
const POLY_ANGLES = [0, 60, 120, 180, 240, 300];
const POLY_OFFSETS = [1.1, 0.85, 1.05, 0.9, 1.15, 0.95];
const POLY_R = 54; // same radius as the old SVG overlay

// keep the polygon layer's logic/computation intact but do
// NOT draw the zone polygons on the map at all — show only the map pins. Flip
// this back to true to re-enable the hexagon/polygon region highlights (the
// code below stays as-is for that).
const SHOW_POLYGONS = false;

function PixelPolygonLayer({
  areas,
  selectedAreaId,
  hoveredAreaId,
  onSelect,
  onHover,
}: {
  areas: JournalArea[];
  selectedAreaId?: string | number | null;
  hoveredAreaId?: string | number | null;
  onSelect?: (areaId: string | number | null) => void;
  onHover?: (areaId: string | number | null) => void;
}) {
  const map = useMap();
  const [zoomTick, setZoomTick] = useState(0);

  // Recompute the polygons only when the zoom SETTLES (zoomend). Selecting a
  // corridor flies to the SAME zoom as the map's default, so the flight is a pure
  // pan — during which a latlng-anchored, fixed-pixel hexagon stays glued and
  // constant-sized with NO recompute and NO churn. zoomend handles only the manual
  // zoom (+/-) case, once, instead of continuously redrawing every animation frame
  // (which caused the flickery `zoom`-event churn).
  useMapEvents({
    zoomend: () => setZoomTick((t) => t + 1),
  });

  // A selection / hover change makes the parent recreate the `areas` array with a
  // NEW reference every render, even though the coordinates and ids are unchanged.
  // Depending on that `areas` identity would force a pointless recompute HERE on
  // every card switch / hover — and because that recompute runs concurrently with
  // the flyTo pan (map.latLngToLayerPoint reads the momentary view transform), the
  // hexagon could be recomputed at a transient intermediate frame and look like it
  // "jumps" or morphs. So we depend on a STABLE signature of the geometry (area id +
  // coordinate) instead of the churning array reference.
  const coordKey = areas
    .map((a) => `${a.areaId}:${a.latlong?.lat}:${a.latlong?.lng}`)
    .join("|");

  // Recompute every area's fixed-pixel hexagon vertices ONLY when the zoom changes
  // (zoomend) — the 54px on-screen shape depends solely on zoom. At constant zoom a
  // pan doesn't change the computed geographic vertices (latLngToLayerPoint is
  // pan-invariant once converted back), so the polygon stays glued to its pin with
  // no recompute and no churn during the selection flight. The 54px radius at the
  // current zoom mirrors the old SVG overlay exactly.
  const polygonData = useMemo(() => {
    void zoomTick;
    return areas.map((area, idx) => {
      const centerPoint = map.latLngToLayerPoint(
        L.latLng(area.latlong.lat, area.latlong.lng)
      );
      const verts = POLY_ANGLES.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const px =
          centerPoint.x + Math.cos(rad) * POLY_R * POLY_OFFSETS[(i + idx) % POLY_OFFSETS.length];
        const py =
          centerPoint.y + Math.sin(rad) * POLY_R * POLY_OFFSETS[(i + idx + 2) % POLY_OFFSETS.length];
        const ll = map.layerPointToLatLng(L.point(px, py));
        return [ll.lat, ll.lng] as [number, number];
      });
      return { areaId: area.areaId, verts };
    });
  }, [coordKey, map, zoomTick]);

  return (
    <>
      {/* Polygons are hidden (not rendered) — pins only. See SHOW_POLYGONS above. */}
      {SHOW_POLYGONS &&
        polygonData.map(({ areaId, verts }) => {
        if (verts.length < 3) return null;
        const isSelected = selectedAreaId === areaId;
        const isHovered = hoveredAreaId === areaId || isSelected;
        const area = areas.find((a) => a.areaId === areaId);
        const strokeColor = area?.dotColor || "#DD5128";

        return (
          <Polygon
            key={`polygon-${areaId}`}
            positions={verts}
            pathOptions={{
              fillColor: strokeColor,
              fillOpacity: isSelected ? 0.45 : isHovered ? 0.35 : 0.18,
              color: isSelected ? "#DD5128" : strokeColor,
              weight: isSelected ? 4 : isHovered ? 3.5 : 2,
              dashArray: isSelected || isHovered ? undefined : "6 4",
              className: `jmap-poly ${isSelected ? "jmap-poly--ring" : isHovered ? "jmap-poly--hover" : ""}`,
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
    </>
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
        minZoom={11}
        scrollWheelZoom={false}
        attributionControl={false}
        className="jmap-container h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="jmap-tiles"
        />
        <FlyController selected={selectedAreaId} areas={safe} />

        {/* Zone highlight polygons — drawn directly from each area's hand-verified
            polygonPoints stored in the journal JSON (no runtime geocoding). Rendered
            beneath the pins so markers always sit on top. */}
        {safe.map((area) => {
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
                fillOpacity: isSelected ? 0.45 : isHovered ? 0.35 : 0.18,
                color: isSelected ? "#DD5128" : strokeColor,
                weight: isSelected ? 4 : isHovered ? 3.5 : 2,
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

        {/* Legacy fixed-pixel hexagon layer — kept for reference but hidden
            (SHOW_POLYGONS=false). */}
        <PixelPolygonLayer
          areas={safe}
          selectedAreaId={selectedAreaId}
          hoveredAreaId={hoveredAreaId}
          onSelect={onSelect}
          onHover={onHover}
        />

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
          background: #ecebea;
          z-index: 0;
        }
        /* While the camera is flying to a newly selected corridor, drop pointer
           events on the whole map so the mouse can't ghost-hover pins/polygons
           along the pan route and flicker unwanted callouts. Leaflet also disables
           its own targeting, but this hard-covers markers/polygons too. */
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
        /* Soft glow on hover (mirrors the legacy feGaussianBlur glow). */
        .jmap-poly--hover {
          filter: drop-shadow(0 0 5px rgba(221, 81, 40, 0.5));
        }
        /* Selected: a slightly stronger, gently pulsing glow around the zone. */
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
          /* Leaflet positions this wrapper at the coordinate. We force it to collapse
             to 0x0 (with !important so no inline width/height Leaflet may write, or a
             content-measured auto size, can change it), so the absolutely-positioned
             .jmap-pin's own top-left origin is exactly the map point and its
             translate(-50%,-50%) centres the whole pill on the coordinate. */
          position: relative;
          background: transparent;
          border: none;
          width: 0 !important;
          height: 0 !important;
          margin: 0;
          overflow: visible;
          /* Don't make this 0x0 box a hit target; events are captured by the pill
             (.jmap-pin, pointer-events:auto) and bubble up here to Leaflet's single
             mouse listener, so the WHOLE pill is one unified hover area. */
          pointer-events: none;
        }

        /* ---- Pin: white pill (idle) -> solid dark circle (hover) -> coral circle (selected) ----
           The whole pin is centred on the map coordinate with translate(-50%,-50%)
           (mirrors the legacy -translate-x-1/2 -translate-y-1/2). The idle pill is
           therefore centred on the point; active states collapse to a centred dot. */
        .jmap-pin {
          /* Pin its own centre to the map coordinate. The wrapper is forced to 0x0,
             so left/top 50% is still zero (the origin), and translate(-50%,-50%)
             shifts this pill so its geometric midpoint sits exactly on the point.
             This gives a balanced pill with the blue dot on the left and the text
             extending to the right, rather than hanging off the leading edge. */
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
          /* The whole pill is the single Leaflet hit area: hovering anywhere on the
             dot OR the label opens the callout card. Children have pointer-events:none
             (see below) so moving across the pill never fires a mouseout/mouseleave
             that would flicker the card open/closed. */
          pointer-events: auto;
          white-space: nowrap;
          transform: translate(-50%, -50%);
          transform-origin: center center;
          transition: width 0.3s ease, padding 0.3s ease, background-color 0.25s ease,
            border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
          will-change: transform;
        }
        /* Leading coloured dot, softly pulsing in every state (legacy animate-pulse).
           pointer-events:none so it is NOT a separate hover target — the pill.
           (.jmap-pin) is the single hit area and Leaflet sees one stable hover. */
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
        /* Label + (projects) — visible on the idle pill, hidden when active.
           pointer-events:none so it is NOT a separate hover target either. */
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

        /* HOVER: collapse to a solid dark circle centred on the coordinate, with
           the callout card anchored above it (no overlap). */
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

        /* SELECTED: solid coral circle with a white ring (legacy selected pin). */
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
        /* Callout card — scales+expands up from its anchor (target entrance). */
        @keyframes jmapFadeIn {
          from {
            opacity: 0;
            transform: translateY(6px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        /* The callout must stay perfectly centred on the pin. Leaflet centres a
           'top' tooltip by subtracting half its measured width (container.offsetWidth).
           If that width is measured as ~0 at mount (the card animates in via
           scale/opacity), subX collapses to 0 and the card's LEFT edge lands on the
           pin. Locking an exact width + zero padding on the tooltip container makes
           the measured width deterministic (260px => centred 130px either side) so
           the card is always centred on the map-pin point. Wide enough for the
           two-line description to wrap comfortably. */
        .jmap-callout {
          width: 260px;
          padding: 0;
          margin: 0;
          background: transparent;
          border: none;
          box-shadow: none;
        }
        .jmap-callout .leaflet-tooltip-content {
          width: 100%;
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
        .jmap-callout {
          font-family: 'Inter Tight', system-ui, sans-serif;
          /* Leaflet's own .leaflet-tooltip forces white-space:nowrap, which is why
             the description always rendered on ONE line regardless of width. Turning
             it off lets the text wrap so the -webkit-line-clamp:2 can show 2 lines. */
          white-space: normal;
          overflow-wrap: break-word;
        }
        .jmap-callout__name {
          margin: 0 0 4px;
          font-size: 16px;
          font-weight: 600;
          line-height: 1.25;
          color: #0f172a;
        }
        .jmap-callout .jmap-callout__img {
          height: 75px;
          margin: 0 0 10px;
          border-radius: 8px;
        }
        .jmap-callout__img {
          width: auto;
          height: 75px;
          border-radius: 8px;
          overflow: hidden;
          background: #f1f5f9;
        }
        /* Soft zoom micro-interaction on the card thumbnail. */
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
          margin: 0;
          font-size: 15px;
          line-height: 1.45;
          color: #64748b;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default JournalMapV0;
