"use client";

import React, { useEffect, useId, useRef } from "react";
import { RotateCcw } from "lucide-react";
import { C, EASE } from "../tokens";
import { BriefGlyph, IsoBuilding, SignalDot, TechGrid, gsap, useSceneTimeline } from "../primitives";
import { StageCanvas, StageProps, ToolButton, Toolbar } from "../ui";

const NEEDS = ["Location", "Budget", "Configuration", "Lifestyle"];
const NEED_Y = [120, 180, 240, 300];
const ENGINE = { x: 340, y: 210 };

// Illustrative candidates — not real projects or scores.
const CANDS = [
  { id: "P1", x: 520, y: 150, w: 22, d: 22, h: 46, score: 61, pass: [1, 0, 1, 0] },
  { id: "P2", x: 624, y: 132, w: 20, d: 20, h: 62, score: 48, pass: [0, 1, 0, 0] },
  { id: "P3", x: 560, y: 262, w: 26, d: 22, h: 72, score: 92, pass: [1, 1, 1, 1] },
  { id: "P4", x: 664, y: 268, w: 22, d: 18, h: 46, score: 87, pass: [1, 1, 1, 0] },
  { id: "P5", x: 500, y: 372, w: 22, d: 22, h: 38, score: 55, pass: [0, 1, 0, 1] },
];
const STRONG = new Set(["P3", "P4"]);
const BEST = "P3";

export function RecommendStage({ reduced, onSequenceEnd, onInteract }: StageProps) {
  const scope = useRef<HTMLDivElement>(null);
  const clip = useId().replace(/:/g, "");

  const tl = useSceneTimeline(
    scope,
    (tl) => {
      tl.set(".kabir-photo", { opacity: 0, scale: 0.95, transformOrigin: "340px 58px" })
        // 1 — the Home Brief arrives from stage 01
        .fromTo(".brief-group", { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: EASE.out })
        // 2 — and decomposes into requirement nodes
        .fromTo(".split", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.6, stagger: 0.08, ease: EASE.inOut }, 0.7)
        .fromTo(".need", { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.45, stagger: 0.1, ease: EASE.out }, 1.0)
        // 3 — Kabir circular lines draw on
        .fromTo(".kabir-ring", { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 0.9, stagger: 0.12, ease: EASE.inOut }, 1.1)
        // Once the inner circular line completes, reveal Kabir's photo
        .fromTo(
          ".kabir-photo",
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.65, ease: "power2.out" },
          1.55,
        )
        .fromTo(".kabir-label", { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.5 }, 1.7)
        .fromTo(".engine-part", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.9, stagger: 0.12, ease: EASE.inOut }, 1.5)
        .fromTo(".engine-link", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.5 }, 2.0)
        // 4 — requirements flow into the engine
        .fromTo(".in-line", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.6, stagger: 0.08, ease: EASE.inOut }, 2.2)
        .addLabel("flow", 2.5);
      NEEDS.forEach((_, i) => {
        tl.set(`.in-dot-${i}`, { opacity: 1 }, `flow+=${i * 0.1}`)
          .fromTo(
            `.in-dot-${i}`,
            { motionPath: { path: `.in-line-${i}`, start: 0, end: 0 } },
            { motionPath: { path: `.in-line-${i}`, start: 0, end: 1 }, duration: 0.7, ease: EASE.inOut },
            `flow+=${i * 0.1}`,
          )
          .to(`.in-dot-${i}`, { opacity: 0, duration: 0.15 });
      });
      tl.fromTo(".engine-core", { scale: 1, transformOrigin: "50% 50%" }, { scale: 1.25, duration: 0.25, yoyo: true, repeat: 1, ease: "power1.inOut" }, "flow+=0.8")
        // 5 — the network fans out into architectural candidates
        .fromTo(".out-line", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.6, stagger: 0.08, ease: EASE.inOut }, "flow+=1.0")
        .fromTo(".cand .draw", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.8, stagger: 0.01, ease: EASE.draw }, "flow+=1.3")
        .fromTo(".cand .iso-fill", { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.08 }, "flow+=1.6")
        .fromTo(".cand-label", { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.08 }, "flow+=1.8")
        // 6 — evaluation matrix fills column by column
        .fromTo(".matrix-label", { opacity: 0 }, { opacity: 1, duration: 0.4 }, "flow+=1.6")
        .addLabel("eval", "flow+=2.1");
      CANDS.forEach((c, j) => {
        tl.fromTo(`.cell-${j}`, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.25, stagger: 0.05, ease: "back.out(2)" }, `eval+=${j * 0.18}`).fromTo(
          `.bar-${j}`,
          { attr: { width: 0 } },
          { attr: { width: (44 * c.score) / 100 }, duration: 0.5, ease: EASE.out },
          `eval+=${j * 0.18}`,
        );
      });
      tl.addLabel("decide", "eval+=1.3")
        // 7 — weak candidates step aside, strong ones light up
        .to(".weak", { opacity: 0.22, x: 8, duration: 0.6, ease: EASE.inOut }, "decide")
        .to(".weak-line", { opacity: 0.12, duration: 0.5 }, "decide")
        .to(".strong .draw", { stroke: C.blue, duration: 0.5 }, "decide+=0.2")
        .to(".strong-bar", { fill: C.blue, duration: 0.4 }, "decide+=0.2")
        .to(".strong-line", { stroke: C.blue, opacity: 1, duration: 0.4 }, "decide+=0.2")
        // 8 — one best match, and its signal toward stage 03
        .fromTo(".best-tag", { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.45, ease: EASE.out }, "decide+=0.6")
        .fromTo(".best-ring", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.6, ease: EASE.inOut }, "decide+=0.6")
        .addLabel("emit", "decide+=1.1")
        .fromTo(".emit-trail", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.9, ease: EASE.inOut }, "emit")
        .set(".emit-dot", { opacity: 1 }, "emit")
        .fromTo(
          ".emit-dot",
          { motionPath: { path: ".emit-trail", start: 0, end: 0 } },
          { motionPath: { path: ".emit-trail", start: 0, end: 1 }, duration: 0.9, ease: EASE.inOut },
          "emit",
        )
        .to(".emit-dot", { opacity: 0, duration: 0.2 });
    },
    { reduced, onComplete: onSequenceEnd },
  );

  // The outer engine ring turns slowly — the only ambient motion in the scene.
  useEffect(() => {
    if (reduced || !scope.current) return;
    const t = gsap.to(scope.current.querySelector(".engine-spin"), {
      rotation: 360,
      svgOrigin: `${ENGINE.x} ${ENGINE.y}`,
      duration: 24,
      repeat: -1,
      ease: "none",
    });
    return () => {
      t.kill();
    };
  }, [reduced]);

  const replay = () => {
    onInteract();
    tl.current?.restart();
  };

  return (
    <div ref={scope}>
      <StageCanvas label="Kabir breaks your Home Brief into location, budget, configuration and lifestyle needs, runs them through a matching engine, and highlights the projects that fit best.">
        <TechGrid w={720} h={440} />

        {/* Incoming Home Brief */}
        <g className="brief-group">
          <BriefGlyph x={50} y={186} />
          <text className="brief-label" x={72} y={256} textAnchor="middle" fontSize="9" fontWeight="600" letterSpacing="1.5" fill={C.inkSoft}>
            HOME BRIEF
          </text>
        </g>

        {/* Brief → requirement nodes */}
        <g fill="none" stroke={C.mint} strokeWidth="1">
          {NEED_Y.map((y, i) => (
            <path key={i} className="split" d={`M94 211 C107 211 107 ${y} 120 ${y}`} />
          ))}
        </g>
        {NEEDS.map((n, i) => (
          <g key={n} className="need">
            <rect x="120" y={NEED_Y[i] - 12} width="100" height="24" rx="12" fill={C.surface} stroke={C.hairline} />
            <circle cx="132" cy={NEED_Y[i]} r="3" fill={C.mint} />
            <text x="141" y={NEED_Y[i] + 4} fontSize="11" fill={C.ink}>
              {n}
            </text>
            <circle cx="220" cy={NEED_Y[i]} r="2.5" fill={C.surface} stroke={C.ink} />
          </g>
        ))}

        {/* Requirement → engine lines */}
        <g fill="none" stroke={C.ink} strokeWidth="0.9" opacity="0.55">
          {NEED_Y.map((y, i) => (
            <path key={i} className={`in-line in-line-${i}`} d={`M222 ${y} C255 ${y} 262 ${ENGINE.y + (y - ENGINE.y) * 0.3} 296 ${ENGINE.y + (y - ENGINE.y) * 0.3}`} />
          ))}
        </g>
        {NEEDS.map((_, i) => (
          <SignalDot key={i} className={`in-dot-${i}`} color={C.blue} r={2.5} />
        ))}

        {/* Kabir Circular Portrait */}
        <defs>
          <clipPath id={`kabir-${clip}`}>
            <circle cx="340" cy="58" r="40" />
          </clipPath>
        </defs>
        <circle cx="340" cy="58" r="40" fill={C.surface} />
        <g clipPath={`url(#kabir-${clip})`}>
          <image
            className="kabir-photo"
            href="/assets/team/kabir-avatar.jpg"
            x="308"
            y="17"
            width="104"
            height="104"
            preserveAspectRatio="xMidYMid slice"
            opacity="0"
          />
        </g>
        <g fill="none" strokeLinecap="round">
          <circle className="kabir-ring" cx="340" cy="58" r="40" stroke={C.hairline} strokeWidth="1" />
          <circle className="kabir-ring" cx="340" cy="58" r="46" stroke={C.blue} strokeWidth="1.1" strokeDasharray="2 5" />
        </g>
        <g className="kabir-label">
          <text x="394" y="54" fontSize="11" fontWeight="600" letterSpacing="2" fill={C.ink}>
            KABIR
          </text>
          <text x="394" y="70" fontSize="10.5" fill={C.inkSoft}>
            Matching engine
          </text>
        </g>
        <path className="engine-link" d={`M340 108 V${ENGINE.y - 66}`} stroke={C.blue} strokeDasharray="2 4" fill="none" />

        {/* Matching engine */}
        <g fill="none">
          <g className="engine-spin">
            <circle className="engine-part" cx={ENGINE.x} cy={ENGINE.y} r="64" stroke={C.hairline} strokeDasharray="1 5" strokeWidth="1.4" />
          </g>
          <path
            className="engine-part"
            d={hexPath(ENGINE.x, ENGINE.y, 44)}
            stroke={C.ink}
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path className="engine-part" d={hexPath(ENGINE.x, ENGINE.y, 32, true)} stroke={C.hairline} strokeWidth="1" strokeLinejoin="round" />
          <g className="engine-core">
            <circle className="engine-part" cx={ENGINE.x} cy={ENGINE.y} r="16" stroke={C.blue} strokeWidth="1.4" fill="#EAF4FE" />
            <circle cx={ENGINE.x} cy={ENGINE.y} r="3.5" fill={C.blue} />
          </g>
        </g>

        {/* Evaluation matrix */}
        <g className="matrix-label">
          {CANDS.map((c, j) => (
            <text key={c.id} x={318 + j * 16} y="304" textAnchor="middle" fontSize="8" fill={C.muted}>
              {c.id}
            </text>
          ))}
          {NEEDS.map((n, i) => (
            <g key={n}>
              <text x="304" y={324 + i * 20} textAnchor="end" fontSize="9.5" fill={C.inkSoft}>
                {n === "Configuration" ? "Config" : n} fit
              </text>
              {CANDS.map((_, j) => (
                <circle key={j} cx={318 + j * 16} cy={321 + i * 20} r="4" fill="none" stroke={C.grid} />
              ))}
            </g>
          ))}
        </g>
        {CANDS.map((c, j) => (
          <g key={c.id}>
            {NEEDS.map((_, i) => (
              <circle
                key={i}
                className={`cell-${j}`}
                cx={318 + j * 16}
                cy={321 + i * 20}
                r="4"
                fill={c.pass[i] ? (STRONG.has(c.id) ? C.blue : C.ink) : C.surface}
                stroke={c.pass[i] ? "none" : C.hairline}
                opacity={c.pass[i] ? (STRONG.has(c.id) ? 1 : 0.35) : 1}
              />
            ))}
          </g>
        ))}

        {/* Engine → candidates */}
        <g fill="none" stroke={C.ink} strokeWidth="0.9" opacity="0.5">
          {CANDS.map((c) => (
            <path
              key={c.id}
              className={`out-line ${STRONG.has(c.id) ? "strong-line" : "weak-line"}`}
              d={`M${ENGINE.x + 44} ${ENGINE.y} C${ENGINE.x + 90} ${ENGINE.y} ${c.x - 70} ${c.y - 10} ${c.x - 22} ${c.y - 10}`}
            />
          ))}
        </g>

        {/* Candidates */}
        {CANDS.map((c, j) => (
          <g key={c.id} className={`cand ${STRONG.has(c.id) ? "strong" : "weak"}`}>
            <IsoBuilding x={c.x} y={c.y} w={c.w} d={c.d} h={c.h} floors={Math.round(c.h / 10)} accent={STRONG.has(c.id) ? C.blue : undefined} />
            <g className="cand-label">
              <text x={c.x} y={c.y + 17} textAnchor="middle" fontSize="10" fill={C.ink}>
                <tspan fontWeight="600">{c.id}</tspan>
                <tspan fill={C.muted}> · {c.score}</tspan>
              </text>
              <rect x={c.x - 22} y={c.y + 23} width="44" height="3" rx="1.5" fill={C.grid} />
              <rect className={`bar-${j} ${STRONG.has(c.id) ? "strong-bar" : ""}`} x={c.x - 22} y={c.y + 23} width={(44 * c.score) / 100} height="3" rx="1.5" fill={C.ink} />
            </g>
          </g>
        ))}

        {/* Best match */}
        <ellipse className="best-ring" cx="560" cy="262" rx="44" ry="20" fill="none" stroke={C.blue} strokeWidth="1" strokeDasharray="3 3" />
        <g className="best-tag">
          <rect x="590" y="176" width="74" height="22" rx="11" fill={C.blue} />
          <text x="627" y="191" textAnchor="middle" fontSize="10" fontWeight="600" fill="#fff">
            Best fit · {CANDS.find((c) => c.id === BEST)?.score}
          </text>
        </g>

        <path className="emit-trail" d="M560 292 V404 Q560 414 570 414 H724" fill="none" stroke={C.blue} strokeWidth="1.2" />
        <SignalDot className="emit-dot" color={C.blue} />
      </StageCanvas>

      <Toolbar note="Illustrative candidates and fit scores">
        <ToolButton onClick={replay} aria-label="Replay stage two">
          <RotateCcw size={13} strokeWidth={2} />
          Replay
        </ToolButton>
      </Toolbar>
    </div>
  );
}

function hexPath(cx: number, cy: number, r: number, flat = false) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i + (flat ? 0 : Math.PI / 6);
    return `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  });
  return `M${pts.join(" L")} Z`;
}
