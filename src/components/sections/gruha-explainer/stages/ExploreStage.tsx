"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Bookmark, GitCompareArrows, RotateCcw, Sparkles } from "lucide-react";
import { C, EASE } from "../tokens";
import { BriefGlyph, CountUp, LockGlyph, IsoBuilding, SignalDot, TechGrid, gsap, useSceneTimeline } from "../primitives";
import { StageCanvas, StageProps, ToolButton, Toolbar } from "../ui";

/* Illustrative, fictitious projects — every figure here is example data. */
type Metric = "Budget" | "Schools" | "Commute" | "Amenities";
const METRICS: Metric[] = ["Budget", "Schools", "Commute", "Amenities"];

interface Project {
  id: string;
  letter: string;
  name: string;
  x: number;
  y: number;
  price: string;
  config: string;
  amenity: string;
  nearby: string;
  metrics: Record<Metric, number>;
  score: { base: number; refined: number };
}

const PROJECTS: Project[] = [
  {
    id: "aster",
    letter: "A",
    name: "Aster Residences",
    x: 120,
    y: 214,
    price: "₹1.9 Cr",
    config: "3 BHK · 1,640 sq ft",
    amenity: "Clubhouse · Pool",
    nearby: "School 1.2 km",
    metrics: { Budget: 82, Schools: 92, Commute: 54, Amenities: 76 },
    score: { base: 88, refined: 79 },
  },
  {
    id: "banyan",
    letter: "B",
    name: "Banyan Heights",
    x: 318,
    y: 176,
    price: "₹2.3 Cr",
    config: "3 BHK · 1,820 sq ft",
    amenity: "Co-working · Gym",
    nearby: "Metro 600 m",
    metrics: { Budget: 64, Schools: 78, Commute: 94, Amenities: 84 },
    score: { base: 81, refined: 91 },
  },
  {
    id: "cedar",
    letter: "C",
    name: "Cedar Park",
    x: 232,
    y: 344,
    price: "₹1.6 Cr",
    config: "3 BHK · 1,510 sq ft",
    amenity: "Park-facing",
    nearby: "School 2.4 km",
    metrics: { Budget: 95, Schools: 60, Commute: 70, Amenities: 55 },
    score: { base: 64, refined: 72 },
  },
];
const pinHeight = (p: Project) => (p.id === "banyan" ? 40 : 30);
const byId = (id: string | null) => PROJECTS.find((p) => p.id === id) ?? null;

const PANEL = { x: 462, y: 22, w: 240, h: 396 };

export function ExploreStage({ reduced, onSequenceEnd, onInteract }: StageProps) {
  const scope = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [compareId, setCompareId] = useState<string | null>(null);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [refined, setRefined] = useState(false);
  const [refining, setRefining] = useState(false);
  const demo = useRef<gsap.core.Timeline | null>(null);
  const refineTl = useRef<gsap.core.Timeline | null>(null);

  const scoreOf = (p: Project) => (refined ? p.score.refined : p.score.base);
  const best = PROJECTS.reduce((a, b) => (scoreOf(b) > scoreOf(a) ? b : a));

  /* Intro: the neighbourhood draws itself, then projects rise. */
  const intro = useSceneTimeline(
    scope,
    (tl) => {
      tl.fromTo(".road", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.4, stagger: 0.08, ease: EASE.draw })
        .fromTo(".metro", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.2, ease: EASE.inOut }, 0.4)
        .fromTo(".area", { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.1 }, 0.6)
        .fromTo(".poi", { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, 0.9)
        .fromTo(".brief-row", { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.5 }, 0.3)
        .fromTo(".pin-building", { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.6, stagger: 0.14, ease: EASE.out }, 1.2)
        .fromTo(".pin-tag", { opacity: 0, x: -4 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.14 }, 1.5)
        .fromTo(".panel-frame", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1, ease: EASE.inOut }, 0.6);
    },
    { reduced },
  );

  /* Refine with Riya: a signal travels back to the Home Brief, preferences
     update, the matching network re-runs, and the new matches flow forward. */
  const runRefine = useCallback(
    (onDone?: () => void) => {
      const root = scope.current;
      if (!root || refining) return;
      if (reduced) {
        setRefined(true);
        onDone?.();
        return;
      }
      setRefining(true);
      const q = gsap.utils.selector(root);
      refineTl.current?.kill();
      const tl = gsap.timeline({
        onComplete: () => {
          setRefining(false);
          onDone?.();
        },
      });
      refineTl.current = tl;
      tl.set([...q(".back-dot"), ...q(".back-trail")], { opacity: 1 })
        .fromTo(q(".back-trail"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.9, ease: EASE.inOut })
        .fromTo(
          q(".back-dot"),
          { motionPath: { path: q(".back-trail")[0] as unknown as SVGPathElement, start: 0, end: 0 } },
          { motionPath: { path: q(".back-trail")[0] as unknown as SVGPathElement, start: 0, end: 1 }, duration: 0.9, ease: EASE.inOut },
          0,
        )
        .to(q(".back-dot"), { opacity: 0, duration: 0.15 })
        .to(q(".back-trail"), { opacity: 0, duration: 0.4 }, "+=0.1")
        .fromTo(q(".brief-glyph"), { scale: 1, svgOrigin: "40 37" }, { scale: 1.15, duration: 0.2, yoyo: true, repeat: 1 }, 0.85)
        .call(() => setRefined(true), [], 1.0)
        .fromTo(q(".rematch"), { drawSVG: "0%", opacity: 1 }, { drawSVG: "100%", duration: 0.7, stagger: 0.1, ease: EASE.inOut }, 1.2)
        .to(q(".rematch"), { opacity: 0, duration: 0.5 }, 2.2)
        // The forward path depends on the re-ranked best match, so it is read
        // only once the new scores have rendered.
        .call(
          () => {
            gsap
              .timeline()
              .fromTo(q(".fwd-trail"), { drawSVG: "0%", opacity: 1 }, { drawSVG: "100%", duration: 0.9, ease: EASE.inOut })
              .set(q(".fwd-dot"), { opacity: 1 }, 0)
              .fromTo(
                q(".fwd-dot"),
                { motionPath: { path: q(".fwd-trail")[0] as unknown as SVGPathElement, start: 0, end: 0 } },
                { motionPath: { path: q(".fwd-trail")[0] as unknown as SVGPathElement, start: 0, end: 1 }, duration: 0.9, ease: EASE.inOut },
                0,
              )
              .to(q(".fwd-dot"), { opacity: 0, duration: 0.15 })
              .to(q(".fwd-trail"), { opacity: 0, duration: 0.6 }, "+=0.3");
          },
          [],
          2.4,
        )
        .to({}, { duration: 1.3 });
    },
    [reduced, refining],
  );

  /* Guided demo: select → compare → shortlist → refine. Cancelled on interaction. */
  useEffect(() => {
    const tl = gsap.timeline({ delay: reduced ? 0.4 : 2.3 });
    tl.call(() => setSelected("aster"))
      .call(() => setCompareId("banyan"), [], reduced ? 1.2 : 2.4)
      .call(() => setCompareId(null), [], reduced ? 2.4 : 4.6)
      .call(() => setShortlist(["aster"]), [], reduced ? 2.6 : 5.0)
      .call(() => runRefine(onSequenceEnd), [], reduced ? 3.4 : 6.0);
    demo.current = tl;
    return () => {
      tl.kill();
    };
    // Runs once per mount (a stage replay remounts this component).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const takeOver = () => {
    if (demo.current) {
      demo.current.kill();
      demo.current = null;
      intro.current?.progress(1);
    }
    onInteract();
  };

  const select = (id: string) => {
    takeOver();
    if (compareId) {
      if (id !== selected) setCompareId(id);
      return;
    }
    setSelected(id);
  };

  const toggleCompare = () => {
    takeOver();
    if (compareId) return setCompareId(null);
    const base = selected ?? best.id;
    if (!selected) setSelected(base);
    const other = PROJECTS.filter((p) => p.id !== base).reduce((a, b) => (scoreOf(b) > scoreOf(a) ? b : a));
    setCompareId(other.id);
  };

  const toggleShortlist = () => {
    takeOver();
    if (!selected) return;
    setShortlist((s) => (s.includes(selected) ? s.filter((x) => x !== selected) : [...s, selected]));
  };

  const refine = () => {
    takeOver();
    runRefine();
  };

  const reset = () => {
    takeOver();
    refineTl.current?.kill();
    setRefining(false);
    setSelected(null);
    setCompareId(null);
    setShortlist([]);
    setRefined(false);
  };

  const sel = byId(selected);
  const cmp = byId(compareId);

  return (
    <div ref={scope}>
      <StageCanvas label="A neighbourhood map with three illustrative projects. Select a project to see its details, compare two side by side, shortlist, and refine your preferences with Riya.">
        <TechGrid w={720} h={440} />

        {/* ── Neighbourhood map ─────────────────────────────────────────── */}
        <g aria-hidden="true">
          <path className="area" d="M352 300 C382 286 426 296 432 326 C438 356 404 376 372 372 C342 368 326 342 334 322 C338 312 344 304 352 300 Z" fill={C.blue} fillOpacity="0.07" stroke={C.blue} strokeOpacity="0.4" strokeWidth="0.8" />
          <rect className="area" x="40" y="292" width="88" height="56" rx="10" fill={C.mint} fillOpacity="0.09" stroke={C.mint} strokeOpacity="0.45" strokeWidth="0.8" />
          <g fill="none" stroke={C.ink} strokeLinecap="round">
            <path className="road" d="M16 262 C110 240 200 276 300 232 S410 160 446 148" strokeWidth="2" opacity="0.75" />
            <path className="road" d="M86 70 C102 150 150 222 170 300 S188 392 196 426" strokeWidth="0.8" opacity="0.5" />
            <path className="road" d="M16 120 C140 128 270 104 446 86" strokeWidth="0.8" opacity="0.5" />
            <path className="road" d="M248 70 C258 160 330 272 418 426" strokeWidth="0.8" opacity="0.5" />
            <path className="road" d="M16 396 C130 372 250 396 330 380" strokeWidth="0.8" opacity="0.5" />
            <path className="road" d="M330 380 C360 400 410 400 446 392" strokeWidth="0.8" opacity="0.35" strokeDasharray="2 3" />
          </g>
          <path className="metro" d="M24 330 L150 268 L344 156 L446 108" fill="none" stroke={C.violet} strokeWidth="1.2" strokeDasharray="5 3" opacity="0.7" />
          <g className="poi">
            <circle cx="344" cy="156" r="4" fill={C.surface} stroke={C.violet} strokeWidth="1.4" />
            <text x="352" y="150" fontSize="9" fill={C.inkSoft}>Metro</text>
          </g>
          <g className="poi">
            <circle cx="150" cy="268" r="4" fill={C.surface} stroke={C.violet} strokeWidth="1.4" />
          </g>
          <g className="poi">
            <rect x="72" y="156" width="8" height="8" fill={C.surface} stroke={C.ink} />
            <text x="58" y="152" fontSize="9" fill={C.inkSoft}>School</text>
          </g>
          <g className="poi">
            <rect x="396" y="214" width="8" height="8" fill={C.surface} stroke={C.ink} />
            <text x="372" y="236" fontSize="9" fill={C.inkSoft}>Tech park</text>
          </g>
          <g className="poi">
            <text x="84" y="324" textAnchor="middle" fontSize="9" fill={C.mint}>Park</text>
          </g>
          <g className="poi">
            <text x="384" y="338" textAnchor="middle" fontSize="9" fill={C.blue}>Lake</text>
          </g>
          <text className="poi" x="22" y="280" fontSize="8" letterSpacing="1" fill={C.muted}>
            OUTER RING RD
          </text>
        </g>

        {/* ── Home Brief + preferences (refined by Riya) ─────────────────── */}
        <g className="brief-row">
          <g className="brief-glyph">
            <BriefGlyph x={26} y={22} s={0.62} />
          </g>
          {["3 BHK", "₹1.5–2.5 Cr", "Schools ≤ 2 km"].map((t, i) => (
            <Chip key={t} x={[64, 120, 206][i]} y={26} text={t} />
          ))}
          {refined && <Chip x={64} y={52} text="Commute ≤ 30 min" accent={C.mint} reduced={reduced} fresh />}
        </g>

        {/* Re-match network (animated on refine) */}
        <g fill="none" stroke={C.mint} strokeWidth="1" strokeDasharray="3 3">
          {PROJECTS.map((p) => (
            <path key={p.id} className="rematch" opacity="0" d={`M44 58 C${p.x / 2} 70 ${p.x - 40} ${p.y - 60} ${p.x} ${p.y - 40}`} />
          ))}
        </g>

        {/* Comparison line */}
        {sel && cmp && <CompareArc key={`${sel.id}-${cmp.id}`} a={sel} b={cmp} reduced={reduced} />}

        {/* ── Project pins ──────────────────────────────────────────────── */}
        {PROJECTS.map((p) => {
          const active = p.id === selected || p.id === compareId;
          const listed = shortlist.includes(p.id);
          const isBest = p.id === best.id;
          const top = p.y - 16 - pinHeight(p);
          return (
            <g
              key={p.id}
              role="button"
              tabIndex={0}
              aria-pressed={active}
              aria-label={`${p.name}, illustrative fit ${scoreOf(p)}${listed ? ", shortlisted" : ""}`}
              className="group/pin cursor-pointer outline-none"
              onClick={() => select(p.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  select(p.id);
                }
              }}
            >
              <ellipse cx={p.x} cy={p.y + 2} rx="34" ry="16" fill="transparent" />
              <ellipse
                cx={p.x}
                cy={p.y + 2}
                rx="30"
                ry="14"
                fill={active ? C.orange : "none"}
                fillOpacity={0.1}
                stroke={active ? C.orange : C.hairline}
                strokeDasharray={active ? undefined : "2 3"}
                className="transition-all duration-300"
              />
              <ellipse cx={p.x} cy={p.y + 2} rx="36" ry="18" fill="none" stroke={C.orange} strokeWidth="1.5" className="opacity-0 group-focus-visible/pin:opacity-100" />
              <g className="pin-building">
                <IsoBuilding
                  x={p.x}
                  y={p.y}
                  w={16}
                  d={16}
                  h={pinHeight(p)}
                  floors={4}
                  stroke={active ? C.orange : C.ink}
                  accent={active ? C.orange : undefined}
                  drawClass="pin-line"
                />
              </g>
              {listed && (
                <g className="pointer-events-none">
                  <path d={`M${p.x - 5} ${top - 20} h10 v12 l-5 -3.5 l-5 3.5 Z`} fill={C.orange} />
                </g>
              )}
              <g className="pin-tag">
                <rect x={p.x + 18} y={p.y - 44} width="54" height="20" rx="10" fill={C.surface} stroke={isBest ? C.orange : C.hairline} className="transition-colors duration-300" />
                <text x={p.x + 30} y={p.y - 30.5} fontSize="10" fontWeight="700" fill={C.ink}>
                  {p.letter}
                </text>
                <text x={p.x + 44} y={p.y - 30.5} fontSize="10" fill={isBest ? C.orange : C.inkSoft} fontWeight={isBest ? 600 : 400}>
                  <CountUp value={scoreOf(p)} reduced={reduced} />
                </text>
              </g>
            </g>
          );
        })}

        {/* Privacy marker */}
        <g className="poi">
          <rect x="328" y="50" width="112" height="18" rx="9" fill={C.surface} stroke={C.hairline} />
          <LockGlyph x={341} y={58} color={C.inkSoft} s={0.85} />
          <text x="350" y="62.5" fontSize="9.5" fill={C.inkSoft}>
            Private by default
          </text>
        </g>

        {/* Shortlist counter */}
        <g aria-hidden="true">
          <text x="440" y="40" textAnchor="end" fontSize="9" letterSpacing="1.4" fill={shortlist.length ? C.orange : C.muted} fontWeight="600">
            SHORTLIST · {shortlist.length}
          </text>
        </g>

        {/* ── Detail panel ──────────────────────────────────────────────── */}
        <rect className="panel-frame" x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx="14" fill={C.surface} stroke={C.hairline} />
        {sel && cmp ? (
          <ComparePanel key={`c-${sel.id}-${cmp.id}-${refined}`} a={sel} b={cmp} reduced={reduced} score={scoreOf} />
        ) : sel ? (
          <DetailPanel key={`d-${sel.id}`} p={sel} reduced={reduced} score={scoreOf(sel)} listed={shortlist.includes(sel.id)} />
        ) : (
          <g>
            <rect x={PANEL.x + 20} y={PANEL.y + 20} width={PANEL.w - 40} height={PANEL.h - 40} rx="10" fill="none" stroke={C.grid} strokeDasharray="4 4" />
            <text x={PANEL.x + PANEL.w / 2} y={PANEL.y + PANEL.h / 2 - 4} textAnchor="middle" fontSize="12" fill={C.inkSoft}>
              Select a project
            </text>
            <text x={PANEL.x + PANEL.w / 2} y={PANEL.y + PANEL.h / 2 + 14} textAnchor="middle" fontSize="10" fill={C.muted}>
              on the map to explore it
            </text>
          </g>
        )}

        {/* Signal back to the brief, and updated matches forward to stage 04 */}
        <path className="back-trail" d={`M${PANEL.x + 30} ${PANEL.y} C 400 4 120 4 46 22`} fill="none" stroke={C.mint} strokeWidth="1" strokeDasharray="3 3" opacity="0" />
        <SignalDot className="back-dot" color={C.mint} r={3} />
        <path className="fwd-trail" d={`M${best.x} ${best.y + 16} V430 H724`} fill="none" stroke={C.orange} strokeWidth="1.2" opacity="0" />
        <SignalDot className="fwd-dot" color={C.orange} r={3.5} />
      </StageCanvas>

      <Toolbar note="Illustrative projects and figures">
        <ToolButton onClick={toggleCompare} active={!!compareId} accent={C.orange} aria-pressed={!!compareId}>
          <GitCompareArrows size={13} strokeWidth={2} />
          Compare
        </ToolButton>
        <ToolButton onClick={toggleShortlist} disabled={!selected} active={!!selected && shortlist.includes(selected)} accent={C.orange} aria-pressed={!!selected && shortlist.includes(selected)}>
          <Bookmark size={13} strokeWidth={2} />
          {selected && shortlist.includes(selected) ? "Shortlisted" : "Shortlist"}
        </ToolButton>
        <ToolButton onClick={refine} disabled={refined || refining} accent={C.mint} active={refined}>
          <Sparkles size={13} strokeWidth={2} />
          {refined ? "Refined with Riya" : "Refine with Riya"}
        </ToolButton>
        <ToolButton onClick={reset} aria-label="Reset the exploration">
          <RotateCcw size={13} strokeWidth={2} />
          Reset
        </ToolButton>
      </Toolbar>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */

function Chip({ x, y, text, accent, fresh, reduced }: { x: number; y: number; text: string; accent?: string; fresh?: boolean; reduced?: boolean }) {
  const ref = useRef<SVGGElement>(null);
  const w = text.length * 5.7 + 18;
  useLayoutEffect(() => {
    if (!fresh || reduced || !ref.current) return;
    const t = gsap.fromTo(ref.current, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.5, ease: EASE.out });
    return () => {
      t.kill();
    };
  }, [fresh, reduced]);
  return (
    <g ref={ref}>
      <rect x={x} y={y} width={w} height="18" rx="9" fill={accent ? "#E8F7F1" : C.surface} stroke={accent ?? C.hairline} />
      <text x={x + 9} y={y + 12.5} fontSize="9.5" fill={C.ink}>
        {text}
      </text>
    </g>
  );
}

function useMountTimeline(reduced: boolean, build: (tl: gsap.core.Timeline) => void) {
  const ref = useRef<SVGGElement>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      build(tl);
      if (reduced) tl.progress(1);
    }, ref);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}

function CompareArc({ a, b, reduced }: { a: Project; b: Project; reduced: boolean }) {
  const ref = useMountTimeline(reduced, (tl) => {
    tl.fromTo(".arc", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.8, ease: EASE.inOut }).fromTo(".arc-end", { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.3 }, 0.6);
  });
  const ay = a.y - 20 - pinHeight(a);
  const by = b.y - 20 - pinHeight(b);
  const mx = (a.x + b.x) / 2;
  const my = Math.min(ay, by) - 50;
  return (
    <g ref={ref} aria-hidden="true">
      <path className="arc" d={`M${a.x} ${ay} Q${mx} ${my} ${b.x} ${by}`} fill="none" stroke={C.orange} strokeWidth="1.2" strokeDasharray="4 3" />
      <circle className="arc-end" cx={a.x} cy={ay} r="3" fill={C.orange} />
      <circle className="arc-end" cx={b.x} cy={by} r="3" fill={C.orange} />
    </g>
  );
}

function DetailPanel({ p, reduced, score, listed }: { p: Project; reduced: boolean; score: number; listed: boolean }) {
  const bx = PANEL.x + 112;
  const by = 262;
  const ref = useMountTimeline(reduced, (tl) => {
    tl.fromTo(".hd", { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: EASE.out })
      .fromTo(".big .draw", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.1, stagger: 0.02, ease: EASE.draw }, 0.1)
      .fromTo(".big .iso-fill", { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.5)
      .fromTo(".callout", { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.35, stagger: 0.1, ease: "back.out(2)" }, 0.9)
      .fromTo(".info", { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.1 }, 1.1);
  });
  // Numbered callouts on the façade, keyed to the spec grid below it.
  const info = [
    { k: "PRICE", v: p.price, at: [bx + 6, by - 166] },
    { k: "CONFIGURATION", v: p.config, at: [bx + 28, by - 84] },
    { k: "AMENITIES", v: p.amenity, at: [bx - 20, by - 96] },
    { k: "NEARBY", v: p.nearby, at: [bx, by + 14] },
  ];
  const cells = [
    [PANEL.x + 18, 314],
    [PANEL.x + 128, 314],
    [PANEL.x + 18, 362],
    [PANEL.x + 128, 362],
  ];
  return (
    <g ref={ref}>
      <text className="hd" x={PANEL.x + 18} y={PANEL.y + 30} fontSize="13" fontWeight="600" fill={C.ink}>
        {p.name}
      </text>
      <text className="hd" x={PANEL.x + 18} y={PANEL.y + 46} fontSize="9.5" fill={C.muted}>
        Illustrative project{listed ? " · Shortlisted" : ""}
      </text>
      <g className="hd">
        <text x={PANEL.x + PANEL.w - 18} y={PANEL.y + 34} textAnchor="end" fontSize="22" fontWeight="300" fill={C.orange}>
          <CountUp value={score} reduced={reduced} />
        </text>
        <text x={PANEL.x + PANEL.w - 18} y={PANEL.y + 48} textAnchor="end" fontSize="8.5" letterSpacing="1" fill={C.muted}>
          FIT
        </text>
      </g>
      <g className="big">
        <IsoBuilding x={bx} y={by} w={58} d={44} h={140} floors={12} stroke={C.ink} accent={C.orange} strokeWidth={1.1} />
      </g>
      {info.map((it, i) => (
        <g key={it.k}>
          <g className="callout">
            <circle cx={it.at[0]} cy={it.at[1]} r="11" fill={C.orange} fillOpacity="0.15" />
            <circle cx={it.at[0]} cy={it.at[1]} r="7" fill={C.orange} />
            <text x={it.at[0]} y={it.at[1] + 3} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#fff">
              {i + 1}
            </text>
          </g>
          <g className="info">
            <text x={cells[i][0]} y={cells[i][1]} fontSize="8" letterSpacing="1" fill={C.muted}>
              <tspan fill={C.orange} fontWeight="700">{i + 1}</tspan>
              {"  "}
              {it.k}
              {it.k === "PRICE" ? "*" : ""}
            </text>
            <text x={cells[i][0]} y={cells[i][1] + 16} fontSize="11.5" fill={C.ink} fontWeight="500">
              {it.v}
            </text>
          </g>
        </g>
      ))}
      <text className="info" x={PANEL.x + 18} y={PANEL.y + PANEL.h - 12} fontSize="8.5" fill={C.muted}>
        *Example figures for illustration only
      </text>
    </g>
  );
}

function ComparePanel({ a, b, reduced, score }: { a: Project; b: Project; reduced: boolean; score: (p: Project) => number }) {
  const ref = useMountTimeline(reduced, (tl) => {
    tl.fromTo(".hd", { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 })
      .fromTo(".twin .draw", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.9, stagger: 0.01, ease: EASE.draw }, 0.1)
      .fromTo(".twin .iso-fill", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.4)
      .fromTo(".bar", { attr: { width: 0 } }, { attr: { width: (_: number, el: Element) => Number(el.getAttribute("data-w")) }, duration: 0.7, stagger: 0.05, ease: EASE.out }, 0.7)
      .fromTo(".row-label", { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.06 }, 0.6);
  });
  const col = [PANEL.x + 72, PANEL.x + 172];
  const barX = PANEL.x + 84;
  const barW = 136;
  return (
    <g ref={ref}>
      <text className="hd" x={PANEL.x + 18} y={PANEL.y + 30} fontSize="9" letterSpacing="1.6" fontWeight="600" fill={C.muted}>
        COMPARE
      </text>
      {[a, b].map((p, i) => (
        <g key={p.id}>
          <g className="twin">
            <IsoBuilding x={col[i]} y={180} w={30} d={24} h={p.id === "banyan" ? 86 : 72} floors={8} stroke={i === 0 ? C.orange : C.ink} accent={i === 0 ? C.orange : undefined} />
          </g>
          <text className="hd" x={col[i]} y={202} textAnchor="middle" fontSize="10.5" fontWeight="600" fill={C.ink}>
            {p.name.split(" ")[0]}
          </text>
          <text className="hd" x={col[i]} y={218} textAnchor="middle" fontSize="10" fill={i === 0 ? C.orange : C.inkSoft}>
            {p.price} · fit {score(p)}
          </text>
        </g>
      ))}
      <path className="hd" d={`M${PANEL.x + 18} 236 H${PANEL.x + PANEL.w - 18}`} stroke={C.grid} />
      {METRICS.map((m, r) => {
        const y = 262 + r * 36;
        return (
          <g key={m}>
            <text className="row-label" x={PANEL.x + 18} y={y + 6} fontSize="10" fill={C.inkSoft}>
              {m}
            </text>
            <rect x={barX} y={y - 4} width={barW} height="4" rx="2" fill={C.surfaceAlt} />
            <rect className="bar" data-w={(barW * a.metrics[m]) / 100} x={barX} y={y - 4} width={(barW * a.metrics[m]) / 100} height="4" rx="2" fill={C.orange} />
            <rect x={barX} y={y + 5} width={barW} height="4" rx="2" fill={C.surfaceAlt} />
            <rect className="bar" data-w={(barW * b.metrics[m]) / 100} x={barX} y={y + 5} width={(barW * b.metrics[m]) / 100} height="4" rx="2" fill={C.ink} opacity="0.75" />
          </g>
        );
      })}
      <text className="row-label" x={PANEL.x + 18} y={PANEL.y + PANEL.h - 12} fontSize="8.5" fill={C.muted}>
        Example figures for illustration only
      </text>
    </g>
  );
}
