"use client";

import React, { useEffect, useRef } from "react";
import {
  trackExplainerAgentClick,
  trackExplainerChapterClick,
  trackExplainerPlayToggle,
  trackExplainerReplayClick,
} from "@/lib/analytics";

const ASSETS: Record<string, string> = {
  riya: "/assets/journey/riya.png",
  kabir: "/assets/journey/kabir.png",
  ananya: "/assets/journey/ananya.png",
  arjun: "/assets/journey/arjun.png",
  karan: "/assets/journey/karan.png",
  sharon: "/assets/journey/sharon.png",
  journal: "/assets/journey/journal.webp",
  "pramoda-overview": "/assets/journey/pramoda-overview.webp",
  "sattva-overview": "/assets/journey/sattva-overview.webp",
  "purva-overview": "/assets/journey/purva-overview.webp",
  "unit-review": "/assets/journey/unit-review.svg",
  "pramoda-boundary": "/assets/journey/pramoda-boundary.webp",
  "pramoda-commute": "/assets/journey/pramoda-commute.webp",
  "pramoda-amenities": "/assets/journey/pramoda-amenities.webp",
};

const DURATION = 58;

/* ---------- easing ---------- */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (x: number, a: number, b: number) => clamp((x - a) / (b - a));
const out3 = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
const outExpo = (v: number) => ((v = clamp(v)) >= 1 ? 1 : 1 - Math.pow(2, -10 * v));
const inOut = (v: number) => ((v = clamp(v)) < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
const outBack = (v: number, s = 1.25) => {
  v = clamp(v) - 1;
  return 1 + (s + 1) * v * v * v + s * v * v;
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ---------- content ---------- */
type Person = [string, string, string, number];
const people: Person[] = [
  ["riya", "Riya", "Your home guide", 0],
  ["kabir", "Kabir", "Project curator", 8],
  ["ananya", "Ananya", "Space specialist", 18],
  ["arjun", "Arjun", "Architecture specialist", 26],
  ["karan", "Karan", "Location specialist", 33],
  ["sharon", "Sharon", "Lifestyle specialist", 41],
];

const fmt: Record<string, (v: number) => string> = {
  n: (v: number) => Math.round(v).toLocaleString("en-IN"),
  pct: (v: number) => Math.round(v) + "%",
  sqft: (v: number) => Math.round(v).toLocaleString("en-IN") + " sq ft",
  min: (v: number) => Math.round(v) + " min",
  hm: (v: number) => {
    v = Math.round(v);
    return v < 60 ? v + " min" : Math.floor(v / 60) + " hr " + (v % 60) + " min";
  },
};

const R = {
  chip: [0.278, 0.435, 0.218, 0.122] as [number, number, number, number],
  stats: [0.05, 0.75, 0.83, 0.2] as [number, number, number, number],
  unit: [0.04, 0.5, 0.915, 0.405] as [number, number, number, number],
  unitBar: [0.047, 0.569, 0.9, 0.045] as [number, number, number, number],
  bChip: [0.203, 0.229, 0.07, 0.038] as [number, number, number, number],
  site: [0.325, 0.37, 0.265, 0.45] as [number, number, number, number],
  commute: [0.536, 0.512, 0.304, 0.265] as [number, number, number, number],
  evening: [0.549, 0.65, 0.142, 0.048] as [number, number, number, number],
  tab: [0.176, 0.478, 0.145, 0.052] as [number, number, number, number],
  amen: [0.049, 0.565, 0.823, 0.435] as [number, number, number, number],
};

const SITE =
  "447,315 496,284 567,310 668,342 718,362 708,379 632,367 579,371 576,452 683,469 653,510 597,575 450,449";

interface CardDef {
  aspect?: number;
  targets?: Record<string, [number, number, number, number]>;
  extra?: string;
  html?: string;
}

const CARDS: Record<string, CardDef> = {
  journal: {
    aspect: 1.5,
    targets: { chip: R.chip },
    extra:
      '<div class="ov journal-patch"><span>Your brief is <span data-pct>0</span>% complete</span></div><div class="ov journal-bar"><i></i></div>',
  },
  "sattva-overview": {},
  "purva-overview": {},
  "pramoda-overview": { targets: { stats: R.stats, hero: [0.02, 0.2, 0.5, 0.3] } },
  "unit-review": { targets: { bar: R.unitBar }, extra: '<div class="ov unit-fill"><i></i><b></b></div>' },
  "pramoda-boundary": {
    targets: { chip: R.bChip, site: R.site },
    extra: `<svg class="ov trace" viewBox="0 0 1265 712" preserveAspectRatio="none"><polygon class="area" points="${SITE}"/><path d="M${SITE.split(" ").join(" L")} Z" pathLength="1"/></svg>`,
  },
  "pramoda-commute": { targets: { evening: R.evening } },
  "pramoda-amenities": { targets: { tab: R.tab } },
  brief1: {
    html: `<div class="kicker">Built from your conversation</div><h3>Your home brief</h3><ul>
    <li><span class="ic">⌂</span>A 3 BHK in Bengaluru<span class="tick">✓</span></li>
    <li><span class="ic">◷</span>A manageable daily commute<span class="tick">✓</span></li>
    <li><span class="ic">♡</span>Space and amenities for your life<span class="tick">✓</span></li></ul>
    <div class="seal">Illustrative needs · No phone number needed</div>`,
  },
  brief2: {
    html: `<div class="kicker">Everything travels with you</div><h3>Your next conversation, ready.</h3><ul>
    <li><span class="ic">01</span>Your needs and priorities<span class="tick">✓</span></li>
    <li><span class="ic">02</span>Sumadhura Pramoda · explored<span class="tick">✓</span></li>
    <li><span class="ic">03</span>Space, commute and lifestyle questions<span class="tick">✓</span></li></ul>
    <button class="cta" data-t="cta" tabindex="-1">Connect with a human expert when you decide <span>→</span></button>
    <div class="fine">Illustrative handoff · No advisor is contacted</div>`,
  },
};

/* ---------- poses ---------- */
interface Pose {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  s: number;
  o: number;
  b: number;
}

const REST: Pose = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1, o: 1, b: 0 };
const P = (o: Partial<Pose>): Pose => Object.assign({}, REST, o);
const mix = (a: Pose, b: Pose, t: number): Pose => {
  const r: Partial<Pose> = {};
  for (const k in REST) {
    const key = k as keyof Pose;
    r[key] = lerp(a[key], b[key], t);
  }
  return r as Pose;
};
const enterSide = (age: number): Pose => {
  const e = outExpo(seg(age, 0, 1.15));
  const p = mix(P({ x: 0.5, z: -180, ry: -18, b: 5 }), REST, e);
  p.o = out3(seg(age, 0, 0.55));
  return p;
};
const exitSide = (p: Pose, age: number): Pose => {
  const e = inOut(seg(age, 0, 0.85));
  return mix(p, Object.assign({}, p, { x: p.x - 0.55, z: -260, ry: 16, s: p.s * 0.9, o: 0, b: 6 }), e);
};
const push = (
  pose: Pose,
  rect: [number, number, number, number],
  aspect: number,
  z: number,
  t: number,
  mobile: boolean
): Pose => {
  if (mobile) z = 1 + (z - 1) * 0.5;
  const k = 0.6 * t,
    s1 = pose.s * lerp(1, z, t),
    dx = rect[0] + rect[2] / 2 - 0.5,
    dy = (rect[1] + rect[3] / 2 - 0.5) / aspect;
  return Object.assign({}, pose, {
    s: s1,
    x: (pose.x + dx * pose.s) * (1 - k) - dx * s1,
    y: (pose.y + dy * pose.s) * (1 - k) - dy * s1,
  });
};

interface Spot {
  rect: [number, number, number, number];
  ring: number;
  dim: number;
  pop: number;
  sweep: number;
}
const spot = (rect: [number, number, number, number], on: number, extra: Partial<Spot> = {}): Spot =>
  Object.assign({ rect, ring: on, dim: 0.4 * on, pop: 1 - on, sweep: -1 }, extra);

interface CursorSeg {
  t0: number;
  t1: number;
  to: string;
  click?: number;
}
interface CursorDef {
  label: string;
  you?: boolean;
  from?: [number, number];
  segs: CursorSeg[];
  fade: number;
}

interface SceneState {
  cards: Record<string, Pose>;
  spots?: Record<string, Spot>;
  journalPct?: number;
  unitFill?: number;
  trace?: number;
  traceFill?: number;
  rows?: Record<string, number[]>;
  seal?: number;
  cta?: number;
  hover?: number;
}

interface Beat {
  start: number;
  end: number;
  who: number;
  chapter: number;
  screen: string;
  title: string;
  next: string;
  sw: number;
  context: string;
  take: string;
  source: string;
  facts?: { at: number; list: [number, string, string][] };
  cursor?: CursorDef;
  scene: (a: number, m: boolean) => SceneState;
}

const beats: Beat[] = [
  {
    start: 0,
    end: 8,
    who: 0,
    chapter: 0,
    screen: "01 / A conversation → a home brief",
    title: "First, tell me what matters.",
    next: "Your needs become our starting point.",
    sw: 4.8,
    context: "A conversation with Riya builds your home brief—before any project is opened.",
    take: "Start with your life. Then look for a home.",
    source: "Gruha.ai interface · Illustrative conversation",
    cursor: { label: "You", you: true, from: [0.97, 1.05], segs: [{ t0: 1.25, t1: 2.2, to: "journal.chip", click: 2.35 }], fade: 3.4 },
    scene(a, m) {
      const j = mix(P({ z: -260, y: 0.06, rx: 10, s: 0.78, o: 0 }), P(m ? { y: -0.02, s: 0.86 } : { x: -0.19, s: 0.78 }), outExpo(seg(a, 0, 1.4)));
      j.o = out3(seg(a, 0, 0.7));
      const bIn = outExpo(seg(a, 2.5, 3.9));
      const b = mix(P(m ? { y: 0.1, s: 0.86, o: 0 } : { x: 0.38, o: 0 }), P(m ? { y: 0.03, s: 0.86 } : { x: 0.25 }), bIn);
      b.o = out3(seg(a, 2.5, 3.2));
      const on = out3(seg(a, 2.35, 2.8)) * (1 - seg(a, 5.6, 6.3));
      const pct = [0, 33, 67, 100].reduce(
        (v, step, k) => (k ? v + (step - [0, 33, 67, 100][k - 1]) * inOut(seg(a, 2.7 + 0.8 * (k - 1), 3.2 + 0.8 * (k - 1))) : v),
        0
      );
      return {
        cards: { journal: j, brief1: b },
        spots: { journal: spot(R.chip, on, { dim: 0.3 * on, sweep: seg(a, 2.4, 3.2) }) },
        journalPct: pct,
        rows: { brief1: [3.2, 4, 4.8].map((t) => seg(a, t, t + 0.45)) },
        seal: seg(a, 5.2, 5.8),
      };
    },
  },
  {
    start: 8,
    end: 18,
    who: 1,
    chapter: 1,
    screen: "02 / From discovery → the actual project",
    title: "Let’s put real projects in front of you.",
    next: "Let’s look inside Sumadhura Pramoda.",
    sw: 3.4,
    context: "Kabir brings projects into view. Open one to understand what sits behind the render.",
    take: "A project is more than its cover image.",
    source: "Actual product views · Three example projects",
    facts: { at: 5.9, list: [[297, "n", "homes"], [82, "pct", "ground-level open space"]] },
    cursor: {
      label: "Kabir",
      segs: [
        { t0: 1.4, t1: 2.35, to: "pramoda-overview.hero", click: 2.65 },
        { t0: 4.7, t1: 5.5, to: "pramoda-overview.stats", click: 5.65 },
      ],
      fade: 6.6,
    },
    scene(a, m) {
      const fan = [
        P({ x: -0.34, y: -0.03, z: -90, ry: 16, rz: -1.5, s: 0.47 }),
        P({ x: 0.34, y: -0.03, z: -90, ry: -16, rz: 1.5, s: 0.47 }),
        P({ y: 0.05, z: 40, s: 0.52 }),
      ];
      const deal = fan.map((f, k) => {
        const e = outBack(seg(a, 0.15 * k, 0.15 * k + 1.05), 1.1);
        const p = mix(Object.assign({}, f, { y: f.y + 0.45, rx: -28, o: 0 }), f, e);
        p.o = out3(seg(a, 0.15 * k, 0.15 * k + 0.5));
        return p;
      });
      const hover = out3(seg(a, 2.0, 2.5)) * (1 - seg(a, 2.7, 2.9)),
        open = inOut(seg(a, 2.75, 4.35));
      let pr = Object.assign({}, deal[2]);
      pr.z += 50 * hover;
      pr.s += 0.025 * hover;
      pr = mix(pr, REST, open);
      const away = (k: number) =>
        mix(deal[k], Object.assign({}, deal[k], { x: k ? 1 : -1, z: -380, ry: k ? -34 : 34, o: 0, b: 4 }), inOut(seg(a, 2.8, 4.1)));
      const on = out3(seg(a, 5.65, 6.1));
      pr = push(pr, R.stats, 1265 / 712, 1.12, inOut(seg(a, 5.65, 7.8)), m);
      return {
        cards: { "sattva-overview": away(0), "purva-overview": away(1), "pramoda-overview": pr },
        spots: { "pramoda-overview": spot(R.stats, on, { sweep: seg(a, 5.7, 6.6) }) },
      };
    },
  },
  {
    start: 18,
    end: 26,
    who: 2,
    chapter: 2,
    screen: "03 / Sumadhura Pramoda · Units & floor plans",
    title: "How much space is actually inside?",
    next: "1,175 inside. 200 on the balcony.",
    sw: 4.4,
    context: "Ananya separates carpet from balcony area. This review example uses the revised 200 sq ft balcony.",
    take: "Separate indoor space from outdoor space.",
    source: "Illustrative review correction · Balcony revised to 200 sq ft",
    facts: { at: 3.7, list: [[1175, "sqft", "RERA carpet"], [200, "sqft", "balcony"]] },
    cursor: { label: "Ananya", segs: [{ t0: 1.2, t1: 2.15, to: "unit-review.bar", click: 2.3 }], fade: 3.4 },
    scene(a, m) {
      const on = out3(seg(a, 2.3, 2.75));
      return {
        cards: { "unit-review": push(enterSide(a), R.unit, 1265 / 712, 1.1, inOut(seg(a, 2.3, 4.6)), m) },
        spots: { "unit-review": spot(R.unit, on, { sweep: seg(a, 2.4, 3.3) }) },
        unitFill: outExpo(seg(a, 2.5, 4.1)),
      };
    },
  },
  {
    start: 26,
    end: 33,
    who: 3,
    chapter: 2,
    screen: "03 / Sumadhura Pramoda · Project & architecture",
    title: "Now, look beyond the tower.",
    next: "See where the project really sits.",
    sw: 3.8,
    context: "Arjun turns your attention to the site boundary and the streets and neighbours around it.",
    take: "Read the site, not just the building render.",
    source: "Actual product · Site boundary view",
    cursor: { label: "Arjun", segs: [{ t0: 1.1, t1: 1.95, to: "pramoda-boundary.chip", click: 2.1 }], fade: 3.1 },
    scene(a, m) {
      const on = out3(seg(a, 2.3, 2.8));
      return {
        cards: { "pramoda-boundary": push(enterSide(a), R.site, 1265 / 712, 1.26, inOut(seg(a, 2.3, 4.8)), m) },
        spots: { "pramoda-boundary": spot(R.site, on, { dim: 0.32 * on }) },
        trace: inOut(seg(a, 2.25, 3.9)),
        traceFill: seg(a, 3.6, 4.4),
      };
    },
  },
  {
    start: 33,
    end: 41,
    who: 4,
    chapter: 2,
    screen: "03 / Sumadhura Pramoda · Location & transit",
    title: "A map pin isn’t your commute.",
    next: "The same trip changes with the clock.",
    sw: 4.4,
    context: "Karan points to the time-of-day breakdown for the airport route. Compare peak and off-peak estimates.",
    take: "Judge the journey at the time you travel.",
    source: "Actual product · Airport route estimates shown in the capture",
    facts: { at: 3.1, list: [[57, "min", "off-peak shown"], [111, "hm", "evening peak shown"]] },
    cursor: { label: "Karan", segs: [{ t0: 1.2, t1: 2.15, to: "pramoda-commute.evening", click: 2.3 }], fade: 3.6 },
    scene(a, m) {
      const on = out3(seg(a, 2.3, 2.75));
      return {
        cards: { "pramoda-commute": push(enterSide(a), R.commute, 1265 / 712, 1.26, inOut(seg(a, 2.3, 4.7)), m) },
        spots: { "pramoda-commute": spot(R.commute, on, { sweep: seg(a, 2.4, 3.3) }) },
      };
    },
  },
  {
    start: 41,
    end: 49,
    who: 5,
    chapter: 2,
    screen: "03 / Sumadhura Pramoda · Lifestyle & amenities",
    title: "Which amenities fit your everyday?",
    next: "Look for what you’ll actually use.",
    sw: 4.4,
    context: "Sharon opens Sports & Fitness. Explore the listed pool, gym and sports facilities against your own routine.",
    take: "Turn an amenities list into personal priorities.",
    source: "Actual product · Listed facilities, not a completion claim",
    cursor: { label: "Sharon", segs: [{ t0: 1.2, t1: 2.1, to: "pramoda-amenities.tab", click: 2.25 }], fade: 3.2 },
    scene(a, m) {
      const on = out3(seg(a, 2.25, 2.6)),
        move = inOut(seg(a, 2.95, 3.8));
      const rect = R.tab.map((v, k) => lerp(v, R.amen[k], move)) as [number, number, number, number];
      return {
        cards: { "pramoda-amenities": push(enterSide(a), R.amen, 1265 / 712, 1.08, inOut(seg(a, 3, 5)), m) },
        spots: { "pramoda-amenities": spot(rect, on, { dim: 0.4 * on * move, sweep: seg(a, 3.6, 4.5) }) },
      };
    },
  },
  {
    start: 49,
    end: 58,
    who: 0,
    chapter: 3,
    screen: "04 / Your journey → a shared understanding",
    title: "Your questions travel with you.",
    next: "A human expert. Only when you choose.",
    sw: 5.2,
    context: "Your brief, project and open questions come together—so the next conversation starts with context.",
    take: "AI discovery. Human guidance. Your call.",
    source: "Illustrative handoff · No advisor is contacted",
    cursor: { label: "You", you: true, from: [0.97, 1.05], segs: [{ t0: 5.8, t1: 6.8, to: "brief2.cta" }], fade: 99 },
    scene(a, m) {
      const names = ["unit-review", "pramoda-boundary", "pramoda-commute", "pramoda-amenities"];
      const cx = m ? 0 : -0.31,
        grid = [
          [-0.16, -0.1],
          [0.16, -0.1],
          [-0.16, 0.1],
          [0.16, 0.1],
        ];
      const cards: Record<string, Pose> = {};
      const collapse = inOut(seg(a, 1.9, 3.0));
      names.forEach((n, k) => {
        const slot = P({ x: cx + grid[k][0] * (m ? 1.25 : 1), y: grid[k][1] * (m ? 1.1 : 1), s: m ? 0.36 : 0.29 });
        const stack = P({
          x: cx + (m ? -0.02 : 0) + k * 0.012,
          y: (m ? -0.02 : 0) + k * 0.012,
          z: k * 6 - 40,
          rz: [-7, -2.5, 2, 6][k],
          s: m ? 0.5 : 0.42,
        });
        const from = k === 3 ? beats[5].scene(8, m).cards["pramoda-amenities"] : P({ x: cx + grid[k][0] * 1.6, y: grid[k][1] * 2.4, z: -360, o: 0, b: 6 });
        const e = k === 3 ? inOut(seg(a, 0, 1.4)) : outExpo(seg(a, 0.1 + k * 0.12, 1.2 + k * 0.12));
        let p = mix(from, slot, e);
        if (k !== 3) p.o = out3(seg(a, 0.1 + k * 0.12, 0.6 + k * 0.12));
        p = mix(p, stack, collapse);
        if (m) p.o *= 1 - 0.45 * seg(a, 2.4, 3.2);
        cards[n] = p;
      });
      const cover = mix(P({ x: cx, y: 0.16, s: m ? 0.5 : 0.42, o: 0 }), P({ x: cx, s: m ? 0.5 : 0.42 }), outExpo(seg(a, 3.0, 4.1)));
      cover.o = out3(seg(a, 3.0, 3.22));
      if (m) cover.o *= 1 - 0.45 * seg(a, 2.4, 3.2);
      cards["pramoda-overview"] = cover;
      const bIn = outExpo(seg(a, 2.4, 3.5));
      const b = mix(P(m ? { y: 0.15, z: -60, s: 0.7, o: 0 } : { x: 0.55, ry: -16, z: -120, o: 0 }), P(m ? { y: 0.035, s: 0.76 } : { x: 0.27 }), bIn);
      b.o = out3(seg(a, 2.4, 2.9));
      cards.brief2 = b;
      return {
        cards,
        spots: { "pramoda-amenities": spot(R.amen, 1 - seg(a, 0, 0.5)) },
        unitFill: 1,
        trace: 1,
        traceFill: 1,
        rows: { brief2: [3.2, 3.8, 4.4].map((t) => seg(a, t, t + 0.45)) },
        cta: seg(a, 4.7, 5.3),
        hover: out3(seg(a, 6.6, 7.1)),
      };
    },
  },
];

function box(r: [number, number, number, number]) {
  return `left:${r[0] * 100}%;top:${r[1] * 100}%;width:${r[2] * 100}%;height:${r[3] * 100}%`;
}

export function GruhaExplainerSection() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const rootEl = root;

    const $ = (id: string) => rootEl.querySelector<HTMLElement>(`#${id}`)!;
    const theatre = $("theatre");
    const stage = $("stage");
    const rig = $("rig");
    const cursorEl = $("cursor");
    if (!theatre || !stage || !rig || !cursorEl) return;

    // Build Rig Cards
    rig.innerHTML = "";
    const cardEls: Record<string, HTMLElement> = {};
    for (const [name, c] of Object.entries(CARDS)) {
      const el = document.createElement("div");
      el.className = "card" + (c.html ? " brief" : "");
      el.style.transform = "translate3d(0px, 0px, 0px) scale(1)";
      if (c.html) {
        el.innerHTML = c.html;
      } else {
        el.innerHTML = `<img src="${ASSETS[name]}" alt="" draggable="false">${c.extra || ""}<div class="ov spot"></div>`;
        for (const [k, r] of Object.entries(c.targets || {})) {
          el.insertAdjacentHTML("beforeend", `<div class="ov" data-t="${k}" style="${box(r)}"></div>`);
        }
      }
      rig.appendChild(el);
      cardEls[name] = el;
    }

    const q = (name: string, sel: string) => cardEls[name]?.querySelector<HTMLElement>(sel);

    // Preload all assets
    Object.values(ASSETS).forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // State & Controls
    const reducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    let t = 0;
    let playing = false;
    let hasAutoplayed = false;
    let visible = false;
    let last = performance.now();
    let active = -1;
    let cw = 900;
    let mobile = false;
    let dirty = true;
    let rafId = 0;
    let phrase: string | null = null;

    const M = () => (reducedMQ.matches ? 0 : 1);

    function seek(n: number) {
      hasAutoplayed = true;
      t = clamp(n, 0, DURATION);
      dirty = true;
    }

    function sync() {
      const playBtn = $("play");
      if (playBtn) {
        playBtn.textContent = playing ? "Pause" : t >= DURATION ? "Replay tour" : "Play tour";
      }
    }

    function setPlaying(v: boolean) {
      if (v) hasAutoplayed = true;
      playing = v;
      if (v && t >= DURATION) t = 0;
      sync();
    }

    // Measure geometry
    const geo = { W: 0, H: 0, cy: 0, size: {} as Record<string, [number, number]> };
    function measure(W: number, H: number, cy: number) {
      Object.assign(geo, { W, H, cy });
      for (const [n, el] of Object.entries(cardEls)) {
        geo.size[n] = CARDS[n].html
          ? [el.offsetWidth, el.offsetHeight]
          : [cw, cw / (CARDS[n].aspect || 1265 / 712)];
      }
      dirty = true;
    }

    const timeButtons = root.querySelectorAll<HTMLButtonElement>("[data-time]");
    timeButtons.forEach((b) => {
      b.onclick = () => {
        const time = Number(b.dataset.time);
        // "01Understand" -> index "01", name "Understand"
        const index = b.querySelector("b")?.textContent?.trim() ?? "";
        const name = (b.textContent ?? "").replace(index, "").trim();
        trackExplainerChapterClick({ chapter_index: index, chapter_name: name, chapter_time: time });
        seek(time);
      };
    });

    const agentButtons = root.querySelectorAll<HTMLButtonElement>("[data-agent]");
    agentButtons.forEach((b) => {
      b.onclick = () => {
        const i = Number(b.dataset.agent);
        const person = people[i];
        trackExplainerAgentClick({ agent_name: person[1], agent_role: person[2], agent_index: i });
        seek(person[3]);
      };
    });

    const playBtn = $("play");
    if (playBtn)
      playBtn.onclick = () => {
        const next = !playing;
        trackExplainerPlayToggle({ action: next ? "play" : "pause" });
        setPlaying(next);
      };

    const replayBtn = $("replay");
    if (replayBtn) {
      replayBtn.onclick = () => {
        trackExplainerReplayClick();
        t = 0;
        setPlaying(true);
      };
    }

    const seekInput = $("seek") as HTMLInputElement | null;
    if (seekInput) {
      seekInput.oninput = (e) => seek(Number((e.target as HTMLInputElement).value));
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.matches?.("input,button")) return;
      if (e.code === "Space") {
        e.preventDefault();
        setPlaying(!playing);
      }
      if (e.code === "ArrowRight") seek(t + 5);
      if (e.code === "ArrowLeft") seek(t - 5);
    };
    document.addEventListener("keydown", onKeyDown);

    const io = new IntersectionObserver(
      ([en]) => {
        visible = en.isIntersecting;
        const triggerRatio = mobile ? 0.35 : 0.45;
        if (!hasAutoplayed && en.intersectionRatio >= triggerRatio && !reducedMQ.matches) {
          hasAutoplayed = true;
          t = 0;
          last = performance.now();
          setPlaying(true);
        }
      },
      { threshold: [0, 0.2, 0.35, 0.45, 0.5, 0.6] }
    );
    io.observe(theatre);

    const ro = new ResizeObserver(() => {
      const r = stage.getBoundingClientRect();
      mobile = theatre.clientWidth < 560;
      const top = mobile ? 0 : 34;
      const bottom = mobile ? 0 : 62;
      const availH = r.height - top - bottom;
      stage.style.setProperty("--cy", (top - bottom) / 2 + "px");
      cw = Math.round(Math.min(r.width * (mobile ? 0.94 : 0.9), availH * (mobile ? 0.98 : 1) * (1265 / 712)));
      stage.style.setProperty("--cw", cw + "px");
      stage.style.setProperty(
        "--bw",
        Math.round(mobile ? Math.min(r.width * 0.86, 330) : clamp(cw * 0.6, 320, 420)) + "px"
      );
      measure(r.width, r.height, (top - bottom) / 2);
    });
    ro.observe(theatre);

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => measure(geo.W, geo.H, geo.cy));
    }
    sync();

    // Per-beat chrome
    const agents = [$("agent-a"), $("agent-b")];
    let agentFlip = 0;

    function setPhrase(text: string) {
      if (phrase === text) return;
      phrase = text;
      const cap = $("caption");
      if (cap) {
        cap.innerHTML = text
          .split(" ")
          .map((w) => `<span class="w"><span>${w}</span></span>`)
          .join(" ");
      }
    }

    function setBeat(i: number) {
      const b = beats[i];
      const p = people[b.who];
      const prev = active >= 0 ? beats[active] : null;
      active = i;
      if (!prev || people[prev.who] !== p) {
        agentFlip ^= 1;
        const img = agents[agentFlip].querySelector("img");
        if (img) {
          img.src = ASSETS[p[0]];
          img.alt = p[1] + ", " + p[2];
        }
      }
      const agentTag = $("agent-tag");
      if (agentTag) agentTag.innerHTML = `<b>${p[1]}</b><span>${p[2]}</span>`;

      const speaker = $("speaker");
      if (speaker) speaker.textContent = p[1] + " · " + p[2];

      const ctx = $("context");
      if (ctx) ctx.textContent = b.context;

      const screenTitle = $("screen-title");
      if (screenTitle) screenTitle.textContent = b.screen;

      const takeaway = $("takeaway");
      if (takeaway) takeaway.textContent = b.take;

      const source = $("source");
      if (source) source.textContent = b.source;

      const live = $("live");
      if (live) live.textContent = `${p[1]}: ${b.title} ${b.next} ${b.context}`;

      const facts = $("facts");
      if (facts) {
        facts.innerHTML = (b.facts ? b.facts.list : [])
          .map((f) => `<div class="fact"><b></b><span>${f[2]}</span></div>`)
          .join("");
      }

      const cursorLabel = $("cursor-label");
      if (cursorLabel) {
        cursorLabel.textContent = b.cursor?.label || "";
        cursorLabel.classList.toggle("you", !!b.cursor?.you);
      }

      timeButtons.forEach((el, j) => {
        el.classList.toggle("active", j === b.chapter);
        el.setAttribute("aria-current", j === b.chapter ? "step" : "false");
      });

      agentButtons.forEach((el, j) => {
        el.classList.toggle("selected", j === b.who);
      });

      phrase = null;
    }

    // Cursor rendering
    const stagePt = (f: [number, number]) => ({
      x: f[0] * theatre.clientWidth,
      y: f[1] * theatre.clientHeight,
    });

    function targetPt(ref: string) {
      const [name, key] = ref.split(".");
      const el = cardEls[name]?.querySelector(`[data-t="${key}"]`);
      if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      const tr = theatre.getBoundingClientRect();
      return { x: r.left - tr.left + r.width * 0.5, y: r.top - tr.top + r.height * 0.5 };
    }

    function renderCursor(c: CursorDef, a: number) {
      const home = c.from ? stagePt(c.from) : mobile ? stagePt([0.8, 0.5]) : stagePt([0.24, 0.72]);
      let pos = home,
        click = -1,
        prevPt = home;
      for (const s of c.segs) {
        if (a < s.t0) break;
        const to = targetPt(s.to);
        const e = inOut(seg(a, s.t0, s.t1));
        const mx = (prevPt.x + to.x) / 2;
        const my = (prevPt.y + to.y) / 2 - Math.min(90, Math.hypot(to.x - prevPt.x, to.y - prevPt.y) * 0.22);
        pos = {
          x: (1 - e) * (1 - e) * prevPt.x + 2 * (1 - e) * e * mx + e * e * to.x,
          y: (1 - e) * (1 - e) * prevPt.y + 2 * (1 - e) * e * my + e * e * to.y,
        };
        if (s.click !== undefined && a >= s.click) click = a - s.click;
        prevPt = to;
      }
      const first = c.segs[0].t0;
      const o = seg(a, first - 0.35, first) * (1 - seg(a, c.fade, c.fade + 0.4));
      const dip = click >= 0 && click < 0.22 ? 1 - 0.14 * Math.sin((click / 0.22) * Math.PI) : 1;
      cursorEl.style.opacity = String(o);
      cursorEl.style.transform = `translate(${pos.x - 3}px,${pos.y - 3}px)`;
      const svg = cursorEl.querySelector("svg");
      if (svg) svg.style.transform = `scale(${dip})`;
      const rp = cursorEl.querySelector<HTMLElement>(".ripple");
      const rv = click >= 0 ? seg(click, 0, 0.6) : 0;
      if (rp) {
        rp.style.opacity = click >= 0 ? String((1 - rv) * 0.9) : "0";
        rp.style.transform = `scale(${0.3 + rv * 1.1})`;
      }
      return click;
    }

    const TRANS = 1.1;
    const lastPose: Record<string, string> = {};
    let moving = false;

    function poseCSS(n: string, p: Pose) {
      const [w, h] = geo.size[n] || [cw, cw];
      const tx = geo.W / 2 + p.x * cw - w / 2;
      const ty = geo.H / 2 + geo.cy + p.y * cw - h / 2;
      const flat = Math.abs(p.z) < 0.05 && Math.abs(p.rx) < 0.01 && Math.abs(p.ry) < 0.01 && Math.abs(p.rz) < 0.01;
      const key = tx.toFixed(2) + "," + ty.toFixed(2) + "," + p.s.toFixed(4);
      const settled = lastPose[n] === key;
      lastPose[n] = key;
      if (!settled) moving = true;
      if (flat) {
        const trans = settled ? `translate(${Math.round(tx)}px,${Math.round(ty)}px)` : `translate(${tx}px,${ty}px)`;
        return Math.abs(p.s - 1) > 0.0005 ? `${trans} scale(${p.s})` : trans;
      }
      return `translate3d(${tx}px,${ty}px,${p.z}px) rotateX(${p.rx}deg) rotateY(${p.ry}deg) rotateZ(${p.rz}deg) scale(${p.s})`;
    }

    function words(a: number, b: Beat) {
      const lastBeat = b === beats[beats.length - 1];
      const captionEl = $("caption");
      if (!captionEl) return;
      const ws = captionEl.querySelectorAll<HTMLElement>(".w>span");
      const inT = a < b.sw ? a : a - b.sw;
      const outAt = a < b.sw ? b.sw - 0.32 : lastBeat ? 1e9 : b.end - b.start - 0.32;
      ws.forEach((w, j) => {
        const vin = outExpo((inT - 0.05 - j * 0.05) / 0.7);
        const vout = inOut((a - outAt - j * 0.02) / 0.3);
        w.style.transform = `translateY(${(1 - vin) * 110 - vout * 110}%)`;
        w.style.opacity = String(vin * (1 - vout));
      });
    }

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (playing && visible && !document.hidden) {
        t = Math.min(DURATION, t + dt);
        dirty = true;
        if (t >= DURATION) {
          playing = false;
          sync();
        }
      }
      if (dirty) {
        dirty = false;
        moving = false;
        draw();
        if (moving) dirty = true;
      }
      rafId = requestAnimationFrame(frame);
    }

    function draw() {
      let i = beats.findIndex((b) => t < b.end);
      if (i < 0) i = beats.length - 1;
      if (i !== active) setBeat(i);
      const b = beats[i];
      const len = b.end - b.start;
      const a = t - b.start;
      const m = mobile;
      const mo = M();
      const st = b.scene(a, m);

      // Cards that exit side
      const poses: Record<string, Pose> = Object.assign({}, st.cards);
      if (i > 0 && a < TRANS) {
        const pb = beats[i - 1];
        const ps = pb.scene(pb.end - pb.start, m);
        for (const n in ps.cards) {
          if (!poses[n]) poses[n] = exitSide(ps.cards[n], a);
        }
      }

      for (const [n, el] of Object.entries(cardEls)) {
        let p = poses[n];
        if (!p || p.o <= 0.001) {
          el.style.visibility = "hidden";
          continue;
        }
        if (!mo) p = Object.assign({}, REST, { x: p.x, y: p.y, s: p.s, o: p.o });
        const flat = Math.abs(p.z) < 0.05 && Math.abs(p.rx) < 0.01 && Math.abs(p.ry) < 0.01 && Math.abs(p.rz) < 0.01;
        el.style.visibility = "visible";
        el.style.transformStyle = flat ? "flat" : "preserve-3d";
        el.style.transform = poseCSS(n, p);
        el.style.opacity = p.o >= 0.999 ? "" : String(p.o);
        el.style.filter = p.b > 0.15 ? `blur(${p.b.toFixed(2)}px)` : "none";
      }

      // Spotlights
      for (const [n, el] of Object.entries(cardEls)) {
        const sp = el.querySelector<HTMLElement>(".spot");
        if (!sp) continue;
        const s = st.spots && st.spots[n];
        if (!s || s.ring <= 0.001) {
          sp.style.opacity = "0";
          continue;
        }
        const g = 1 + 0.05 * s.pop * mo;
        sp.style.cssText =
          box(s.rect) +
          `;opacity:1;--ring:${s.ring};--dim:${s.dim};transform:scale(${g});--sweep:${
            s.sweep < 0 || s.sweep >= 1 ? "150%" : lerp(150, -50, s.sweep) + "%"
          }`;
      }

      // Product reacts
      const journalPctEl = q("journal", "[data-pct]");
      if (journalPctEl) journalPctEl.textContent = String(Math.round(st.journalPct || 0));
      const journalBarEl = q("journal", ".journal-bar i");
      if (journalBarEl) journalBarEl.style.width = (st.journalPct || 0) + "%";

      const uf = st.unitFill || 0;
      const unitFillI = q("unit-review", ".unit-fill i");
      if (unitFillI) unitFillI.style.transform = `scaleX(${uf * 0.855})`;
      const unitFillB = q("unit-review", ".unit-fill b");
      if (unitFillB) unitFillB.style.opacity = String(seg(uf, 0.85, 1));

      const tr = st.trace || 0;
      const tracePath = q("pramoda-boundary", ".trace path");
      if (tracePath) {
        tracePath.style.strokeDasharray = `${tr} 1`;
        tracePath.style.opacity = tr > 0 ? "1" : "0";
      }
      const traceArea = q("pramoda-boundary", ".trace .area");
      if (traceArea) traceArea.style.opacity = String((st.traceFill || 0) * 0.16);

      for (const n of ["brief1", "brief2"]) {
        const rows = (st.rows && st.rows[n]) || [0, 0, 0];
        cardEls[n]?.querySelectorAll<HTMLElement>("li").forEach((li, k) => {
          const v = out3(rows[k]);
          li.style.opacity = String(0.25 + 0.75 * v);
          li.style.transform = `translateX(${(1 - v) * 14 * mo}px)`;
          li.style.setProperty("--shine", lerp(-100, 100, rows[k]) + "%");
          const tk = li.querySelector<HTMLElement>(".tick");
          if (tk) tk.style.transform = `scale(${outBack(seg(rows[k], 0.5, 1), 2)})`;
        });
      }

      const seal = q("brief1", ".seal");
      if (seal) seal.style.opacity = String(st.seal || 0);

      const cta = q("brief2", ".cta");
      if (cta) {
        cta.style.opacity = String(st.cta || 0);
        cta.style.transform = `translateY(${(1 - out3(st.cta || 0)) * 10 * mo}px)`;
        cta.style.setProperty("--hover", String(st.hover || 0));
      }

      const fine = q("brief2", ".fine");
      if (fine) fine.style.opacity = String(st.cta || 0);

      // Cursor
      const click = b.cursor ? renderCursor(b.cursor, a) : -1;

      // Agent transition
      const enter = outBack(seg(a, 0.12, 0.95), 1.3);
      const leave = out3(seg(a, 0, 0.35));
      const gest = click >= 0 && click < 0.7 ? Math.sin((click / 0.7) * Math.PI) : 0;
      const cur = agents[agentFlip];
      const old = agents[agentFlip ^ 1];
      const samePerson = i > 0 && beats[i - 1].who === b.who;

      if (cur) {
        cur.style.opacity = samePerson ? "1" : String(clamp(seg(a, 0.12, 0.55)));
        cur.style.transform = `translateY(${(1 - enter) * 46 * mo}px) rotate(${(gest * 2.6 + (1 - enter) * -3) * mo}deg) scale(${0.94 + 0.06 * enter})`;
      }
      if (old) {
        old.style.opacity = i > 0 && !samePerson ? String(1 - leave) : "0";
        old.style.transform = `translateY(${leave * 24 * mo}px) scale(${1 - 0.03 * leave})`;
      }

      const tag = $("agent-tag");
      if (tag) {
        tag.style.opacity = String(seg(a, 0.5, 0.9));
        tag.style.transform = `translateY(${(1 - out3(seg(a, 0.5, 0.9))) * 8 * mo}px)`;
      }

      // Words
      setPhrase(a < b.sw ? b.title : b.next);
      words(a, b);

      const hold = i === beats.length - 1;
      const ctxVal = out3(seg(a, 0.35, 0.95)) * (hold ? 1 : 1 - seg(a, len - 0.3, len));
      const contextEl = $("context");
      if (contextEl) {
        contextEl.style.opacity = String(ctxVal);
        contextEl.style.transform = `translateY(${(1 - ctxVal) * 8 * mo}px)`;
      }

      const ttl = out3(seg(a, 0.2, 0.7));
      const screenTitleEl = $("screen-title");
      if (screenTitleEl) {
        screenTitleEl.style.opacity = String(ttl);
        screenTitleEl.style.transform = `translateX(${(1 - ttl) * -10 * mo}px)`;
      }

      const tk = out3(seg(a, 0.45, 1.05)) * (hold ? 1 : 1 - seg(a, len - 0.25, len));
      const takeawayParent = $("takeaway")?.parentNode as HTMLElement | null;
      if (takeawayParent) {
        takeawayParent.style.opacity = String(tk);
        takeawayParent.style.transform = `translateY(${(1 - tk) * 6 * mo}px)`;
      }

      const arrow = $("arrow");
      if (arrow) arrow.style.transform = `rotate(${(1 - out3(seg(a, 0.45, 1.2))) * -90 * mo}deg)`;

      // Facts
      if (b.facts) {
        const fa = b.facts.at;
        $("facts")
          ?.querySelectorAll<HTMLElement>(".fact")
          .forEach((el, k) => {
            const v = outBack(seg(a, fa + k * 0.15, fa + k * 0.15 + 0.7), 1.2);
            const n = outExpo(seg(a, fa + k * 0.15, fa + k * 0.15 + 1.3));
            const f = b.facts!.list[k];
            el.style.opacity = String(clamp(v));
            el.style.transform = `translateY(${(1 - v) * 18 * mo}px) scale(${0.92 + 0.08 * clamp(v)})`;
            if (el.firstChild) {
              el.firstChild.textContent = fmt[f[1]](f[0] * n);
            }
          });
      }

      const halo = $("halo");
      if (halo) {
        halo.style.opacity = String(0.55 + 0.45 * Math.max(...Object.values(st.spots || {}).map((s) => s.ring), 0));
      }

      // Chapters progress line
      const spans = [
        [0, 8],
        [8, 18],
        [18, 49],
        [49, 58],
      ];
      rootEl.querySelectorAll<HTMLElement>(".chapters i").forEach((el, k) => {
        el.style.transform = `scaleX(${seg(t, spans[k][0], spans[k][1])})`;
      });

      const sk = $("seek") as HTMLInputElement | null;
      if (sk) {
        sk.value = String(t);
        sk.style.setProperty("--p", (t / DURATION) * 100 + "%");
      }

      const timeEl = $("time");
      if (timeEl) {
        timeEl.textContent = `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")} / 0:58`;
      }
    }

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("keydown", onKeyDown);
      rig.innerHTML = "";
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="what-gruha-stands-for"
      aria-labelledby="gruha-explainer-title"
      className="gruha-journey relative w-full border-t border-[#deded5] bg-[#f8f7f3] pt-4 md:pt-6 pb-8 md:pb-12"
    >
      <div className="explainer">
        <span className="eyebrow">The Gruha way · An agent-led product tour</span>
        <h2 id="gruha-explainer-title" className="journey-title">
          From conversation to keys.
        </h2>
        <nav className="chapters" aria-label="Journey chapters">
          <button type="button" data-time="0" className="active" aria-current="step">
            <i />
            <b>01</b>Understand
          </button>
          <button type="button" data-time="8">
            <i />
            <b>02</b>Recommend
          </button>
          <button type="button" data-time="18">
            <i />
            <b>03</b>Explore &amp; refine
          </button>
          <button type="button" data-time="49">
            <i />
            <b>04</b>Connect
          </button>
        </nav>
        <div className="theatre" id="theatre" aria-label="Animated product demonstration">
          <div className="grain" />
          <div className="halo" id="halo" />
          <div className="speech">
            <div className="speaker" id="speaker" />
            <h2 id="caption" className="speech-caption" aria-hidden="true" />
            <p className="context" id="context" />
          </div>
          <p className="sr" id="live" aria-live="polite" />
          <div className="agent" id="agent-a">
            <img alt="" />
          </div>
          <div className="agent" id="agent-b">
            <img alt="" />
          </div>
          <div className="agent-tag" id="agent-tag" />
          <div className="screen-title" id="screen-title" />
          <div className="stage" id="stage" aria-hidden="true">
            <div className="rig" id="rig" />
          </div>
          <div className="facts" id="facts" />
          <div className="cursor" id="cursor">
            <span className="ripple" />
            <svg width="22" height="24" viewBox="0 0 22 24">
              <path
                d="M3 2.5v17.2l4.6-4.3 3 6.6 3.1-1.4-3-6.5 6.4-.3z"
                fill="#262b25"
                stroke="#fff"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            <span className="label" id="cursor-label" />
          </div>
          <div className="takeaway">
            <span className="arrow" id="arrow">
              ↗
            </span>
            <div className="txt">
              <strong id="takeaway" />
              <small id="source" />
            </div>
          </div>
        </div>
        <div className="team-rail" id="team">
          {people.map((p, i) => (
            <button
              key={p[0]}
              type="button"
              data-agent={i}
              aria-label={`Jump to ${p[1]}, ${p[2]}`}
              className={i === 0 ? "selected" : ""}
            >
              <span className="portrait">
                <img src={ASSETS[p[0]]} alt="" />
              </span>
              {p[1]}
            </button>
          ))}
        </div>
        <div className="controls">
          <button type="button" id="play">
            Play tour
          </button>
          <button type="button" id="replay" aria-label="Replay tour">
            ↺
          </button>
          <input id="seek" aria-label="Tour timeline" type="range" min="0" max="58" step="0.05" defaultValue="0" />
          <span id="time">0:00 / 0:58</span>
        </div>
        <p className="note">
          Illustrative needs and agent dialogue · Product captures: 12 Oct 2026 · Unit example revised for review ·
          Product figures are snapshots, not current availability · No contact submission.
        </p>
      </div>
    </section>
  );
}
