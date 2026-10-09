"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, RotateCcw, X } from "lucide-react";
import { useWaitlist } from "@/contexts/WaitlistContext";
import { C, EASE } from "../tokens";
import { AdvisorPortrait, BriefGlyph, IsoBuilding, LockGlyph, SignalDot, TechGrid, gsap, useSceneTimeline } from "../primitives";
import { StageCanvas, StageProps, ToolButton, Toolbar } from "../ui";

const INPUTS = [
  { y: 80, title: "Home Brief", sub: "3 BHK · ₹1.5–2.5 Cr", color: C.mint, kind: "brief" as const },
  { y: 194, title: "Aster Residences", sub: "Shortlisted", color: C.orange, kind: "building" as const },
  { y: 308, title: "Banyan Heights", sub: "Top match · 91", color: C.orange, kind: "building" as const },
];
const CARD_H = 52;
const MERGE = { x: 238, y: 220 };
const SUMMARY = { x: 266, y: 104, w: 184, h: 236 };
const ADVISOR = { x: 612, y: 196, r: 78 };
// The consent gate sits between the summary and the advisor: nothing crosses
// it until the buyer chooses to connect.
const GATE = { x: 480, r: 11 };
const LINK_START = SUMMARY.x + SUMMARY.w;
const LINK_END = ADVISOR.x - ADVISOR.r - 8;

const ROWS = [
  ["BRIEF", "3 BHK · Bengaluru"],
  ["BUDGET", "₹1.5–2.5 Cr"],
  ["SHORTLIST", "Aster, Banyan"],
  ["PRIORITIES", "Schools · Commute"],
  ["CONTACT", "Only when you choose"],
];

const NEXT_STEPS = ["You choose what to share, and when", "Discuss your shortlisted projects", "Plan site visits that fit your week", "Get help with negotiations"];

export function ConnectStage({ reduced, onSequenceEnd, onInteract }: StageProps) {
  const scope = useRef<HTMLDivElement>(null);
  const clip = useId().replace(/:/g, "");
  const [panelOpen, setPanelOpen] = useState(false);
  const { openModal } = useWaitlist();
  const panelRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  const tl = useSceneTimeline(
    scope,
    (tl, q) => {
      // Past the gate stays empty until the buyer chooses to connect.
      tl.set(".link-b", { drawSVG: "0%" }, 0)
        .set(".link-end", { scale: 0, transformOrigin: "50% 50%" }, 0);
      tl.fromTo(".in-card", { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.16, ease: EASE.out })
        .fromTo(".conv", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.8, stagger: 0.1, ease: EASE.inOut }, 0.7)
        .addLabel("flow", 1.1);
      INPUTS.forEach((_, i) => {
        const path = q(`.conv-${i}`)[0] as SVGPathElement;
        tl.set(`.conv-dot-${i}`, { opacity: 1 }, `flow+=${i * 0.12}`)
          .fromTo(
            `.conv-dot-${i}`,
            { motionPath: { path, start: 0, end: 0 } },
            { motionPath: { path, start: 0, end: 1 }, duration: 0.9, ease: EASE.inOut },
            `flow+=${i * 0.12}`,
          )
          .to(`.conv-dot-${i}`, { opacity: 0, duration: 0.15 });
      });
      tl.fromTo(".merge", { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.35, ease: "back.out(2)" }, "flow+=1.05")
        .fromTo(".merge-out", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.3 }, "flow+=1.2")
        // The brief resolves into a compact handoff summary
        .fromTo(".summary-frame", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.8, ease: EASE.inOut }, "flow+=1.3")
        .fromTo(".summary-row", { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.12, ease: EASE.out }, "flow+=1.6")
        // A human advisor is revealed
        .fromTo(".adv-ring", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1, stagger: 0.15, ease: EASE.inOut }, "flow+=2.1")
        .fromTo(".advisor .draw", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.3, stagger: 0.05, ease: EASE.draw }, "flow+=2.3")
        .fromTo(".adv-label", { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5 }, "flow+=3.1")
        // The summary travels up to the consent gate, and waits there
        .addLabel("connect", "flow+=3.4")
        .fromTo(".link-a", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.5, ease: EASE.inOut }, "connect")
        .fromTo(".link-start", { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.3 }, "connect")
        .fromTo(".gate", { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.35, ease: "back.out(2)" }, "connect+=0.3")
        .set(".link-dot", { opacity: 1 }, "connect+=0.5")
        .fromTo(
          ".link-dot",
          { motionPath: { path: ".link-a", start: 0, end: 0 } },
          { motionPath: { path: ".link-a", start: 0, end: 1 }, duration: 0.6, ease: EASE.inOut },
          "connect+=0.5",
        )
        .to(".link-dot", { opacity: 0, duration: 0.2 })
        .fromTo(".gate-ring", { scale: 1, opacity: 0.6, transformOrigin: "50% 50%" }, { scale: 1.8, opacity: 0, duration: 0.7, ease: "power2.out" }, "connect+=1.05")
        .fromTo(".tag-wait", { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.4 }, "connect+=1.1")
        // The closing line
        .fromTo(".closing", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.8, ease: EASE.out }, "connect+=1.5");
    },
    { reduced, onComplete: onSequenceEnd },
  );

  useEffect(() => {
    if (panelOpen) panelRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, [panelOpen]);

  const consentTl = useRef<gsap.core.Timeline | null>(null);

  // The buyer's click is what opens the gate and completes the connection.
  const connect = (onDone: () => void) => {
    const root = scope.current;
    if (!root || consentTl.current) return onDone();
    const q = gsap.utils.selector(root);
    const path = q(".link-b")[0] as unknown as SVGPathElement;
    const t = gsap.timeline({ onComplete: onDone });
    t.to(q(".gate .shackle"), { y: -2.5, duration: 0.25, ease: EASE.out })
      .to(q(".gate-lock"), { stroke: C.violet, duration: 0.25 }, 0)
      .to(q(".gate-bg"), { stroke: C.violet, fill: "#F1EEFE", duration: 0.25 }, 0)
      .fromTo(q(".link-b"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.45, ease: EASE.inOut }, 0.2)
      .set(q(".link-dot"), { opacity: 1 }, 0.2)
      .fromTo(q(".link-dot"), { motionPath: { path, start: 0, end: 0 } }, { motionPath: { path, start: 0, end: 1 }, duration: 0.45, ease: EASE.inOut }, 0.2)
      .to(q(".link-dot"), { opacity: 0, duration: 0.15 })
      .fromTo(q(".link-end"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.25 }, 0.6)
      .to(q(".tag-wait"), { opacity: 0, duration: 0.2 }, 0.5)
      .fromTo(q(".tag-done"), { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.3 }, 0.65)
      .fromTo(q(".adv-glow"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.6);
    consentTl.current = t;
    if (reduced) t.progress(1);
  };

  const openPanel = () => {
    onInteract();
    tl.current?.progress(1);
    connect(showPanel);
  };

  const showPanel = () => {
    setPanelOpen(true);
    if (!reduced && scope.current) {
      requestAnimationFrame(() => {
        const el = panelRef.current;
        if (!el) return;
        gsap.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, ease: EASE.out });
        gsap.fromTo(el.querySelectorAll(".step"), { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.35, stagger: 0.08, delay: 0.15 });
      });
    }
  };

  const closePanel = () => {
    setPanelOpen(false);
    ctaRef.current?.focus();
  };

  const replay = () => {
    onInteract();
    setPanelOpen(false);
    consentTl.current?.progress(0).kill();
    consentTl.current = null;
    tl.current?.restart();
  };

  return (
    <div ref={scope} className="relative">
      <StageCanvas label="Your Home Brief and shortlisted projects converge into a handoff summary. It reaches a human property advisor only when you choose to connect.">
        <TechGrid w={720} h={440} />

        {/* Inputs from the AI stages */}
        {INPUTS.map((it, i) => (
          <g key={it.title} className="in-card">
            <rect x="22" y={it.y} width="150" height={CARD_H} rx="12" fill={C.surface} stroke={C.hairline} />
            {it.kind === "brief" ? (
              <BriefGlyph x={34} y={it.y + 13} s={0.52} stroke={it.color} />
            ) : (
              <IsoBuilding x={46} y={it.y + 40} w={12} d={12} h={20} floors={3} stroke={it.color} accent={it.color} drawClass="" />
            )}
            <text x="70" y={it.y + 23} fontSize="11" fontWeight="600" fill={C.ink}>
              {it.title}
            </text>
            <text x="70" y={it.y + 38} fontSize="9.5" fill={C.inkSoft}>
              {it.sub}
            </text>
            <circle cx="172" cy={it.y + CARD_H / 2} r="2.5" fill={C.surface} stroke={it.color} strokeWidth="1.2" />
            <path
              className={`conv conv-${i}`}
              d={`M175 ${it.y + CARD_H / 2} C205 ${it.y + CARD_H / 2} 210 ${MERGE.y} ${MERGE.x - 6} ${MERGE.y}`}
              fill="none"
              stroke={it.color}
              strokeWidth="1.1"
            />
          </g>
        ))}
        {INPUTS.map((it, i) => (
          <SignalDot key={i} className={`conv-dot-${i}`} color={it.color} r={3} />
        ))}

        {/* Convergence */}
        <g className="merge">
          <circle cx={MERGE.x} cy={MERGE.y} r="10" fill={C.surface} stroke={C.hairline} />
          <circle cx={MERGE.x} cy={MERGE.y} r="4" fill={C.ink} />
        </g>
        <path className="merge-out" d={`M${MERGE.x + 10} ${MERGE.y} H${SUMMARY.x}`} stroke={C.ink} strokeWidth="1.1" />

        {/* Handoff summary */}
        <rect className="summary-frame" x={SUMMARY.x} y={SUMMARY.y} width={SUMMARY.w} height={SUMMARY.h} rx="14" fill={C.surface} stroke={C.ink} strokeWidth="1.1" />
        <g className="summary-row">
          <text x={SUMMARY.x + 16} y={SUMMARY.y + 26} fontSize="9" fontWeight="600" letterSpacing="1.6" fill={C.violet}>
            HANDOFF SUMMARY
          </text>
          <path d={`M${SUMMARY.x + 16} ${SUMMARY.y + 38} H${SUMMARY.x + SUMMARY.w - 16}`} stroke={C.grid} />
        </g>
        {ROWS.map(([k, v], i) => (
          <g key={k} className="summary-row">
            <text x={SUMMARY.x + 16} y={SUMMARY.y + 60 + i * 36} fontSize="8" letterSpacing="1.2" fill={C.muted}>
              {k}
            </text>
            <text x={SUMMARY.x + 16} y={SUMMARY.y + 75 + i * 36} fontSize="11.5" fontWeight="500" fill={k === "CONTACT" ? C.violet : C.ink}>
              {v}
            </text>
          </g>
        ))}

        {/* Connection, gated by the buyer's consent */}
        <path className="link-a" d={`M${LINK_START} ${MERGE.y} H${GATE.x - GATE.r}`} stroke={C.violet} strokeWidth="1.4" fill="none" />
        <path className="link-b" d={`M${GATE.x + GATE.r} ${MERGE.y} H${LINK_END}`} stroke={C.violet} strokeWidth="1.4" fill="none" />
        <circle className="link-start" cx={LINK_START} cy={MERGE.y} r="3.5" fill={C.violet} />
        <circle className="link-end" cx={LINK_END} cy={MERGE.y} r="3.5" fill={C.violet} />
        <circle className="gate-ring" cx={GATE.x} cy={MERGE.y} r={GATE.r} fill="none" stroke={C.violet} opacity="0" />
        <g className="gate">
          <circle className="gate-bg" cx={GATE.x} cy={MERGE.y} r={GATE.r} fill={C.surface} stroke={C.hairline} />
          <LockGlyph x={GATE.x} y={MERGE.y - 1} color={C.inkSoft} className="gate-lock" />
        </g>
        <SignalDot className="link-dot" color={C.violet} r={3.5} />
        <g className="tag-wait" opacity="0">
          <rect x={GATE.x - 30} y="240" width="60" height="20" rx="10" fill={C.surface} stroke={C.hairline} />
          <text x={GATE.x} y="253.5" textAnchor="middle" fontSize="9.5" fontWeight="600" fill={C.inkSoft}>
            Your call
          </text>
        </g>
        <g className="tag-done" opacity="0">
          <rect x={GATE.x - 38} y="240" width="76" height="20" rx="10" fill="#F1EEFE" stroke={C.violet} strokeOpacity="0.5" />
          <text x={GATE.x} y="253.5" textAnchor="middle" fontSize="9.5" fontWeight="600" fill={C.violet}>
            Shared by you
          </text>
        </g>

        {/* Advisor */}
        <circle className="adv-glow" cx={ADVISOR.x} cy={ADVISOR.y} r={ADVISOR.r} fill={C.violet} fillOpacity="0.06" opacity="0" />
        <circle className="adv-ring" cx={ADVISOR.x} cy={ADVISOR.y} r={ADVISOR.r} fill="none" stroke={C.hairline} />
        <circle className="adv-ring" cx={ADVISOR.x} cy={ADVISOR.y} r={ADVISOR.r + 10} fill="none" stroke={C.violet} strokeDasharray="2 6" strokeWidth="1.2" />
        <defs>
          <clipPath id={`adv-${clip}`}>
            <circle cx={ADVISOR.x} cy={ADVISOR.y} r={ADVISOR.r} />
          </clipPath>
        </defs>
        <g clipPath={`url(#adv-${clip})`}>
          <g className="advisor" transform={`translate(${ADVISOR.x - 66} ${ADVISOR.y - 68}) scale(0.9)`}>
            <AdvisorPortrait />
          </g>
        </g>
        <g className="adv-label">
          <text x={ADVISOR.x} y={ADVISOR.y + ADVISOR.r + 36} textAnchor="middle" fontSize="11" fontWeight="600" letterSpacing="2" fill={C.ink}>
            YOUR ADVISOR
          </text>
          <text x={ADVISOR.x} y={ADVISOR.y + ADVISOR.r + 52} textAnchor="middle" fontSize="10.5" fill={C.inkSoft}>
            A human expert, by your side
          </text>
        </g>

        <text className="closing" x="360" y="410" textAnchor="middle" fontSize="17" fill={C.ink} style={{ fontFamily: "var(--font-fraunces), serif" }}>
          Your journey, understood. <tspan fill={C.violet}>Your next step, guided.</tspan>
        </text>
      </StageCanvas>

      {panelOpen && (
        <div className="absolute inset-0 bottom-[49px] z-10 flex items-center justify-center bg-[#F7F6F2]/70 p-4 backdrop-blur-[2px]">
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="false"
            aria-labelledby="explainer-next-title"
            className="relative w-full max-w-sm rounded-2xl border border-[#E1DED5] bg-white p-5 shadow-[0_12px_40px_-16px_rgba(23,33,43,0.25)] sm:p-6"
          >
            <button
              type="button"
              onClick={closePanel}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-full p-1.5 text-[#5F6873] hover:bg-[#F7F6F2] focus-visible:outline-2 focus-visible:outline-[#8B73F5]"
            >
              <X size={16} />
            </button>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8B73F5]">What happens next</p>
            <h4 id="explainer-next-title" className="mt-1.5 text-lg font-semibold tracking-tight text-[#17212B]">
              An expert picks up where the AI leaves off.
            </h4>
            <ol className="mt-4 space-y-2.5">
              {NEXT_STEPS.map((s, i) => (
                <li key={s} className="step flex items-center gap-3 text-sm text-[#17212B]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#8B73F5]/40 text-[11px] font-semibold text-[#8B73F5]">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
            <p className="mt-4 text-[11px] leading-relaxed text-[#858B91]">
              Nothing has been shared with anyone. You decide when the conversation starts. This demo contacts no one.
            </p>
            <button
              type="button"
              onClick={() => openModal("explainer_connect")}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B73F5] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#7A61EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B73F5]"
            >
              Join the waitlist
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      <Toolbar note="Preview · no advisor is contacted from this demo">
        <ToolButton ref={ctaRef} onClick={openPanel} primary accent={C.violet}>
          Connect with an Expert
          <ArrowRight size={13} strokeWidth={2} />
        </ToolButton>
        <ToolButton onClick={replay} aria-label="Replay stage four">
          <RotateCcw size={13} strokeWidth={2} />
          Replay
        </ToolButton>
      </Toolbar>
    </div>
  );
}
