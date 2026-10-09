"use client";

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { C } from "./tokens";

gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin);

export { gsap };

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ─────────────────────────────────────────────────────────────────────────────
   Hooks
   ───────────────────────────────────────────────────────────────────────────── */

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

type Q = (selector: string) => Element[];

/**
 * Builds a scene timeline scoped to `scope`. With reduced motion the timeline
 * jumps straight to its end state, so the narrative is preserved without movement.
 * The builder may return a cleanup function for tickers/loops it starts.
 */
export function useSceneTimeline(
  scope: React.RefObject<Element | null>,
  build: (tl: gsap.core.Timeline, q: Q) => void | (() => void),
  opts: { reduced: boolean; onComplete?: () => void },
) {
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const onCompleteRef = useRef(opts.onComplete);
  useEffect(() => {
    onCompleteRef.current = opts.onComplete;
  });

  useIsoLayoutEffect(() => {
    if (!scope.current) return;
    let cleanup: void | (() => void);
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(scope.current) as Q;
      const tl = gsap.timeline({ onComplete: () => onCompleteRef.current?.() });
      tlRef.current = tl;
      cleanup = build(tl, q);
      if (opts.reduced) {
        tl.progress(1);
        onCompleteRef.current?.();
      }
    }, scope);
    return () => {
      cleanup?.();
      ctx.revert();
    };
  }, [opts.reduced]);

  return tlRef;
}

/** Animates a number displayed in an SVG <text>/<tspan> whenever `value` changes. */
export function CountUp({ value, reduced, suffix = "" }: { value: number; reduced: boolean; suffix?: string }) {
  const ref = useRef<SVGTSpanElement>(null);
  const shown = useRef(value);
  // Rendered once; afterwards the tween owns the text node.
  const [initial] = useState(value);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      shown.current = value;
      el.textContent = `${value}${suffix}`;
      return;
    }
    const obj = { v: shown.current };
    const tween = gsap.to(obj, {
      v: value,
      duration: 0.9,
      ease: "power2.out",
      onUpdate: () => {
        shown.current = Math.round(obj.v);
        el.textContent = `${shown.current}${suffix}`;
      },
    });
    return () => {
      tween.kill();
    };
  }, [value, reduced, suffix]);
  return <tspan ref={ref}>{`${initial}${suffix}`}</tspan>;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Canvas chrome
   ───────────────────────────────────────────────────────────────────────────── */

export function TechGrid({ w, h }: { w: number; h: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <g aria-hidden="true">
      <defs>
        <pattern id={`minor-${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke={C.grid} strokeWidth="0.5" />
        </pattern>
        <pattern id={`major-${id}`} width="120" height="120" patternUnits="userSpaceOnUse">
          <rect width="120" height="120" fill={`url(#minor-${id})`} />
          <path d="M120 0H0V120" fill="none" stroke={C.grid} strokeWidth="1" />
          <path d="M-3 0H3M0 -3V3" stroke={C.hairline} strokeWidth="1" />
        </pattern>
        <radialGradient id={`fade-${id}`} cx="50%" cy="50%" r="70%">
          <stop offset="55%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`mask-${id}`}>
          <rect width={w} height={h} fill={`url(#fade-${id})`} />
        </mask>
      </defs>
      <rect width={w} height={h} fill={`url(#major-${id})`} mask={`url(#mask-${id})`} />
    </g>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Isometric wireframe building — the architectural motif used across stages.
   (x, y) is the front-bottom corner; w runs to the right, d to the left.
   ───────────────────────────────────────────────────────────────────────────── */

const COS = 0.866;

export function isoPoints(x: number, y: number, w: number, d: number, h: number) {
  const F = [x, y];
  const R = [x + w * COS, y - w * 0.5];
  const L = [x - d * COS, y - d * 0.5];
  const B = [x + w * COS - d * COS, y - w * 0.5 - d * 0.5];
  const up = (p: number[], k = h) => [p[0], p[1] - k];
  return { F, R, L, B, up };
}

const pt = (p: number[]) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;

export function IsoBuilding({
  x,
  y,
  w,
  d,
  h,
  floors = 0,
  stroke = C.ink,
  accent,
  strokeWidth = 1,
  className = "",
  drawClass = "draw",
  fillOpacity = 1,
}: {
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  floors?: number;
  stroke?: string;
  accent?: string;
  strokeWidth?: number;
  className?: string;
  drawClass?: string;
  fillOpacity?: number;
}) {
  const { F, R, L, B, up } = isoPoints(x, y, w, d, h);
  const right = `M${pt(F)} L${pt(R)} L${pt(up(R))} L${pt(up(F))} Z`;
  const left = `M${pt(F)} L${pt(L)} L${pt(up(L))} L${pt(up(F))} Z`;
  const top = `M${pt(up(F))} L${pt(up(R))} L${pt(up(B))} L${pt(up(L))} Z`;
  const floorLines: string[] = [];
  for (let i = 1; i < floors; i++) {
    const k = (h * i) / floors;
    floorLines.push(`M${pt(up(L, k))} L${pt(up(F, k))} L${pt(up(R, k))}`);
  }
  // Two vertical mullions on the right face give the façade rhythm.
  const mull = [1 / 3, 2 / 3].map((t) => {
    const p = [F[0] + (R[0] - F[0]) * t, F[1] + (R[1] - F[1]) * t];
    return `M${pt(p)} L${pt(up(p))}`;
  });
  return (
    <g className={className}>
      <path className="iso-fill" d={left} fill={C.surface} fillOpacity={fillOpacity} stroke="none" />
      <path className="iso-fill" d={right} fill={accent ?? C.surfaceAlt} fillOpacity={accent ? 0.14 * fillOpacity : fillOpacity} stroke="none" />
      <path className="iso-fill" d={top} fill={C.surface} fillOpacity={fillOpacity} stroke="none" />
      <g fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round">
        <path className={drawClass} d={left} />
        <path className={drawClass} d={right} />
        <path className={drawClass} d={top} />
        {floorLines.map((dd, i) => (
          <path key={i} className={drawClass} d={dd} strokeWidth={strokeWidth * 0.5} opacity={0.7} />
        ))}
        {floors > 3 && mull.map((dd, i) => <path key={`m${i}`} className={drawClass} d={dd} strokeWidth={strokeWidth * 0.5} opacity={0.6} />)}
      </g>
    </g>
  );
}

/** The geometric "Home Brief" glyph: a house outline that holds requirements. */
export function BriefGlyph({ x, y, s = 1, stroke = C.mint, className = "" }: { x: number; y: number; s?: number; stroke?: string; className?: string }) {
  return (
    <g className={className} transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 18 L22 0 L44 18 V50 H0 Z" fill={C.surface} stroke={stroke} strokeWidth={1.4 / s} strokeLinejoin="round" />
      {[26, 33, 40].map((yy, i) => (
        <path key={i} d={`M9 ${yy} H${i === 2 ? 26 : 35}`} stroke={stroke} strokeWidth={1.2 / s} strokeLinecap="round" />
      ))}
    </g>
  );
}

/** Padlock glyph centred on (x, y). The shackle carries `.shackle` so it can be lifted open. */
export function LockGlyph({ x, y, color = C.inkSoft, s = 1, className = "" }: { x: number; y: number; color?: string; s?: number; className?: string }) {
  return (
    <g className={className} transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={color} strokeWidth={1.2 / s} strokeLinecap="round" strokeLinejoin="round">
      <path className="shackle" d="M-2.6 -0.5 V-3 A2.6 2.6 0 0 1 2.6 -3 V-0.5" />
      <rect x="-4" y="-0.5" width="8" height="6" rx="1.4" fill={C.surface} />
    </g>
  );
}

/** A small glowing signal dot used to carry information along paths. */
export function SignalDot({ color, className, r = 4 }: { color: string; className: string; r?: number }) {
  return (
    <g className={className} opacity={0}>
      <circle r={r * 3} fill={color} opacity={0.12} />
      <circle r={r * 1.8} fill={color} opacity={0.18} />
      <circle r={r} fill={color} />
    </g>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Line-art portraits. Drawn in a 140×150 local box; all strokes carry `.draw`
   so a scene can draw them on.
   ───────────────────────────────────────────────────────────────────────────── */

const portraitStroke = {
  fill: "none",
  stroke: C.ink,
  strokeWidth: 1.3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function RiyaPortrait({ accent = C.mint }: { accent?: string }) {
  return (
    <g {...portraitStroke}>
      {/* hair */}
      <path className="draw" d="M47 70 C42 42 56 22 74 22 C93 22 104 40 99 66 C97 82 101 96 110 106" />
      <path className="draw" d="M49 60 C45 80 44 96 34 108" />
      <path className="draw" d="M55 46 C66 42 80 34 95 48" />
      {/* face */}
      <path className="draw" d="M54 60 C54 44 63 36 73 36 C85 36 92 46 92 60 C92 77 84 90 73 90 C62 90 54 77 54 60 Z" fill={C.surface} />
      <path className="draw" d="M63 61 q3 -2.4 6 0 M77 61 q3 -2.4 6 0" />
      <path className="draw" d="M71 66 l-1.5 6 h3" strokeWidth="1" />
      <path className="draw" d="M67 78 q6 4.5 12 0" />
      {/* neck + shoulders */}
      <path className="draw" d="M66 89 L65 101 M80 89 L81 101" />
      <path className="draw" d="M26 140 C30 116 48 104 65 101 C70 108 76 108 81 101 C98 104 114 116 118 140" />
      {/* headset — Riya is a voice agent */}
      <path className="draw" d="M53 56 C50 70 52 82 64 84" stroke={accent} strokeWidth="1.5" />
      <circle className="draw" cx="66" cy="84" r="2.6" stroke={accent} fill={accent} />
    </g>
  );
}

export function KabirPortrait({ accent = C.blue }: { accent?: string }) {
  return (
    <g {...portraitStroke}>
      <path className="draw" d="M52 60 C50 36 62 26 74 26 C88 26 98 36 95 60" />
      <path className="draw" d="M53 46 C62 36 84 34 95 48" />
      <path className="draw" d="M54 60 C54 44 63 38 73 38 C85 38 93 46 93 60 C93 78 85 91 73 91 C62 91 54 78 54 60 Z" fill={C.surface} />
      {/* glasses — the analyst */}
      <circle className="draw" cx="64" cy="61" r="6.5" stroke={accent} strokeWidth="1.4" />
      <circle className="draw" cx="83" cy="61" r="6.5" stroke={accent} strokeWidth="1.4" />
      <path className="draw" d="M70.5 61 H76.5" stroke={accent} strokeWidth="1.4" />
      <path className="draw" d="M68 79 H79" />
      <path className="draw" d="M66 90 L65 101 M81 90 L82 101" />
      <path className="draw" d="M26 140 C30 116 48 104 65 101 L73 112 L82 101 C99 104 114 116 118 140" />
      <path className="draw" d="M73 112 V140" strokeWidth="0.8" opacity="0.6" />
    </g>
  );
}

export function AdvisorPortrait({ accent = C.violet }: { accent?: string }) {
  return (
    <g {...portraitStroke}>
      <path className="draw" d="M50 62 C46 38 60 24 75 24 C90 24 101 36 98 58" />
      <path className="draw" d="M52 50 C60 34 80 30 98 52" />
      <circle className="draw" cx="74" cy="20" r="7" />
      <path className="draw" d="M54 60 C54 44 63 37 73 37 C85 37 93 46 93 60 C93 77 85 90 73 90 C62 90 54 77 54 60 Z" fill={C.surface} />
      <path className="draw" d="M63 60 q3 -2.4 6 0 M78 60 q3 -2.4 6 0" />
      <path className="draw" d="M66 76 q7 6 14 0" />
      <path className="draw" d="M66 89 L65 101 M81 89 L82 101" />
      <path className="draw" d="M26 140 C30 116 48 104 65 101 C70 107 77 107 82 101 C99 104 114 116 118 140" />
      {/* blazer lapels */}
      <path className="draw" d="M62 102 L70 128 M85 102 L77 128" />
      <circle className="draw" cx="92" cy="122" r="3" stroke={accent} fill={accent} />
    </g>
  );
}
