"use client";

import React, { useRef, useState } from "react";
import { Mic, RotateCcw } from "lucide-react";
import { C, EASE } from "../tokens";
import { LockGlyph, RiyaPortrait, SignalDot, TechGrid, gsap, useSceneTimeline } from "../primitives";
import { StageCanvas, StageProps, ToolButton, Toolbar } from "../ui";

const PROMPT = "What does your ideal home look like?";
const ANSWERS = ["Bengaluru", "3 BHK", "₹1.5–2.5 Cr", "Good schools nearby"];
const BAR_COUNT = 30;
const BUBBLE = { x: 298, y0: 226, gap: 40, w: 144, h: 28 };
const SLOT = { x: 556, y0: 186, gap: 38 };

export function UnderstandStage({ reduced, onSequenceEnd, onInteract }: StageProps) {
  const scope = useRef<HTMLDivElement>(null);
  const [listening, setListening] = useState(false);

  const tl = useSceneTimeline(
    scope,
    (tl, q) => {
      const amp = { v: 0 };
      const bars = q(".bar") as SVGRectElement[];

      // Waveform: one ticker drives all bars from a single amplitude value,
      // so the timeline only has to choreograph `amp`.
      const tick = () => {
        const t = performance.now() / 1000;
        bars.forEach((b, i) => {
          const env = Math.sin((Math.PI * (i + 0.5)) / BAR_COUNT);
          const n = 0.55 + 0.45 * Math.sin(t * (5 + (i % 5)) + i * 1.7) * Math.sin(t * 2.3 + i);
          const h = 3 + amp.v * 40 * env * Math.abs(n);
          b.setAttribute("height", h.toFixed(2));
          b.setAttribute("y", (182 - h / 2).toFixed(2));
        });
      };
      if (!reduced) gsap.ticker.add(tick);

      const promptEl = q(".prompt-text")[0] as SVGTextElement;
      const typed = { n: 0 };

      tl.set(".resp", { opacity: 0 })
        // 1 — Riya draws herself on
        .fromTo(".riya .draw", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.5, stagger: 0.06, ease: EASE.draw })
        .fromTo(".ring", { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 1.2, stagger: 0.15, ease: EASE.inOut }, 0.4)
        .fromTo(".riya-label", { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.6, ease: EASE.out }, 1.2)
        .addLabel("listen", 1.5)
        // 2 — waveform wakes up
        .fromTo(".bars", { opacity: 0 }, { opacity: 1, duration: 0.3 }, "listen")
        .fromTo(amp, { v: 0 }, { v: 1, duration: 0.6, ease: "power2.out" }, "listen")
        .fromTo(".status-listen", { opacity: 0 }, { opacity: 1, duration: 0.3 }, "listen")
        .set(".status-ready", { opacity: 0 }, "listen")
        // 3 — Riya asks
        .fromTo(".prompt-box", { drawSVG: "0%", fillOpacity: 0 }, { drawSVG: "100%", fillOpacity: 1, duration: 0.6, ease: EASE.inOut }, "listen+=0.2")
        .fromTo(
          typed,
          { n: 0 },
          {
            n: PROMPT.length,
            duration: 1.1,
            ease: "none",
            onUpdate: () => {
              promptEl.textContent = PROMPT.slice(0, Math.round(typed.n));
            },
          },
          "listen+=0.5",
        )
        .addLabel("answers", "listen+=1.7");

      // 4 — answers arrive as chat bubbles, one by one
      ANSWERS.forEach((_, i) => {
        const dx = BUBBLE.x - SLOT.x;
        const dy = BUBBLE.y0 + i * BUBBLE.gap - (SLOT.y0 + i * SLOT.gap);
        tl.fromTo(
          `.resp-${i}`,
          { opacity: 0, x: dx, y: dy + 10 },
          { opacity: 1, x: dx, y: dy, duration: 0.45, ease: EASE.out },
          `answers+=${i * 0.32}`,
        );
      });

      tl.addLabel("brief", "answers+=1.6")
        // 5 — the Home Brief outline draws, answers become tokens and slot in
        .fromTo(".brief-outline", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1, ease: EASE.inOut }, "brief-=0.5")
        .fromTo(".brief-head", { opacity: 0 }, { opacity: 1, duration: 0.5 }, "brief")
        .fromTo(".slot", { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.08 }, "brief-=0.1")
        .to(".resp", { x: 0, y: 0, duration: 0.9, stagger: 0.14, ease: EASE.inOut }, "brief+=0.2")
        .to(".resp-box", { stroke: C.mint, fill: "#E8F7F1", duration: 0.5, stagger: 0.14 }, "brief+=0.5")
        .fromTo(".resp-dot", { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.35, stagger: 0.14, ease: "back.out(2)" }, "brief+=0.8")
        .to(amp, { v: 0.18, duration: 0.8, ease: "power2.inOut" }, "brief+=0.9")
        .to(".status-listen", { opacity: 0, duration: 0.25 }, "brief+=1.2")
        .fromTo(".status-ready", { opacity: 0 }, { opacity: 1, duration: 0.3 }, "brief+=1.4")
        .fromTo(".brief-check", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.5, ease: EASE.out }, "brief+=1.5")
        .fromTo(".brief-ready", { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.4 }, "brief+=1.6")
        // 6 — the brief emits a signal toward stage 02
        .addLabel("emit", "brief+=2")
        .fromTo(".emit-trail", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.9, ease: EASE.inOut }, "emit")
        .set(".emit-dot", { opacity: 1 }, "emit")
        .fromTo(
          ".emit-dot",
          { motionPath: { path: ".emit-trail", start: 0, end: 0 } },
          { motionPath: { path: ".emit-trail", start: 0, end: 1 }, duration: 0.9, ease: EASE.inOut },
          "emit",
        )
        .to(".emit-dot", { opacity: 0, duration: 0.2 })
        .call(() => setListening(false));

      return () => gsap.ticker.remove(tick);
    },
    { reduced, onComplete: onSequenceEnd },
  );

  const talk = () => {
    onInteract();
    setListening(true);
    tl.current?.seek("listen").play();
  };

  const replay = () => {
    onInteract();
    setListening(false);
    tl.current?.restart();
  };

  return (
    <div ref={scope}>
      <StageCanvas label="Riya asks what your ideal home looks like. Your answers — Bengaluru, 3 BHK, ₹1.5 to 2.5 crore, good schools nearby — become a structured Home Brief.">
        <TechGrid w={720} h={440} />

        {/* Riya */}
        <g fill="none" strokeLinecap="round">
          <circle className="ring" cx="160" cy="206" r="104" stroke={C.hairline} strokeWidth="1" />
          <circle className="ring" cx="160" cy="206" r="116" stroke={C.mint} strokeWidth="1.2" strokeDasharray="2 6" />
        </g>
        <g className="riya" transform="translate(68 112) scale(1.3)">
          <RiyaPortrait />
        </g>
        <g className="riya-label">
          <text x="160" y="354" textAnchor="middle" fontSize="11" fontWeight="600" letterSpacing="2" fill={C.ink}>
            RIYA
          </text>
          <text className="status-listen" x="160" y="372" textAnchor="middle" fontSize="11" fill={C.mint} opacity="0">
            ● Listening
          </text>
          <text className="status-ready" x="160" y="372" textAnchor="middle" fontSize="11" fill={C.inkSoft} opacity="0">
            Understood
          </text>
        </g>

        {/* Riya's question */}
        <g>
          <rect className="prompt-box" x="288" y="72" width="262" height="38" rx="19" fill={C.surface} stroke={C.ink} strokeWidth="1" />
          <circle cx="305" cy="91" r="3.5" fill={C.mint} />
          <text className="prompt-text" x="316" y="95" fontSize="12" fill={C.ink} fontWeight="500" />
        </g>

        {/* Waveform */}
        <g className="bars" opacity="0">
          {Array.from({ length: BAR_COUNT }, (_, i) => (
            <rect key={i} className="bar" x={300 + i * 6.4} y="180" width="2.6" height="4" rx="1.3" fill={C.mint} />
          ))}
        </g>

        {/* Home Brief */}
        <g fill="none" strokeLinejoin="round">
          <path className="brief-outline" d="M628 104 L708 160 V388 H548 V160 Z" stroke={C.ink} strokeWidth="1.2" fill={C.surface} />
          <path className="brief-outline" d="M572 160 H684" stroke={C.hairline} strokeWidth="1" />
        </g>
        <text className="brief-head" x="628" y="148" textAnchor="middle" fontSize="10" fontWeight="600" letterSpacing="1.8" fill={C.inkSoft}>
          HOME BRIEF
        </text>
        {ANSWERS.map((_, i) => (
          <rect
            key={i}
            className="slot"
            x={SLOT.x}
            y={SLOT.y0 + i * SLOT.gap}
            width={BUBBLE.w}
            height={BUBBLE.h}
            rx="14"
            fill="none"
            stroke={C.hairline}
            strokeDasharray="3 3"
          />
        ))}
        <path className="brief-check" d="M598 344 l5 5 l10 -11" fill="none" stroke={C.mint} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <text className="brief-ready" x="620" y="348" fontSize="11" fill={C.ink} fontWeight="500">
          Brief ready
        </text>
        <g className="brief-ready">
          <LockGlyph x={570} y={368} color={C.muted} />
          <text x="580" y="372" fontSize="9.5" fill={C.inkSoft}>
            No phone number needed
          </text>
        </g>

        {/* Answers → tokens (positioned at their slot, offset to the chat column) */}
        {ANSWERS.map((a, i) => (
          <g key={a} className={`resp resp-${i}`} opacity="0">
            <rect className="resp-box" x={SLOT.x} y={SLOT.y0 + i * SLOT.gap} width={BUBBLE.w} height={BUBBLE.h} rx="14" fill={C.surface} stroke="#D2CFC5" />
            <circle className="resp-dot" cx={SLOT.x + 13} cy={SLOT.y0 + i * SLOT.gap + 14} r="3" fill={C.mint} />
            <text x={SLOT.x + 23} y={SLOT.y0 + i * SLOT.gap + 18} fontSize="11.5" fill={C.ink}>
              {a}
            </text>
          </g>
        ))}

        {/* Signal toward stage 02 */}
        <path className="emit-trail" d="M628 388 V404 Q628 414 638 414 H724" fill="none" stroke={C.mint} strokeWidth="1.2" strokeDasharray="1 0" />
        <SignalDot className="emit-dot" color={C.mint} />
      </StageCanvas>

      <Toolbar note="Simulated conversation · no audio is recorded">
        <ToolButton onClick={talk} accent={C.mint} active={listening} aria-pressed={listening}>
          <Mic size={13} strokeWidth={2} />
          {listening ? "Listening…" : "Talk to Riya"}
        </ToolButton>
        <ToolButton onClick={replay} aria-label="Replay stage one">
          <RotateCcw size={13} strokeWidth={2} />
          Replay
        </ToolButton>
      </Toolbar>
    </div>
  );
}
