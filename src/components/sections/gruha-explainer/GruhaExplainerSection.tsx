"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { C, EASE, STAGES } from "./tokens";
import { TechGrid, gsap, usePrefersReducedMotion } from "./primitives";
import { StageProps } from "./ui";
import { UnderstandStage } from "./stages/UnderstandStage";
import { RecommendStage } from "./stages/RecommendStage";
import { ExploreStage } from "./stages/ExploreStage";
import { ConnectStage } from "./stages/ConnectStage";

const STAGE_COMPONENTS: React.ComponentType<StageProps>[] = [UnderstandStage, RecommendStage, ExploreStage, ConnectStage];

// How long a finished stage rests before guided mode moves on.
const HOLD_MS = 2200;
const nodePct = (i: number) => (i / (STAGES.length - 1)) * 100;

export function GruhaExplainerSection() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const railDotRef = useRef<HTMLSpanElement>(null);
  const railFillRef = useRef<HTMLSpanElement>(null);
  const navRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [stage, setStage] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [finished, setFinished] = useState(false);
  const [seqDone, setSeqDone] = useState(false);
  const [inView, setInView] = useState(false);
  const [started, setStarted] = useState(false);
  const transitioning = useRef(false);
  const [busy, setBusy] = useState(false);

  // Start the film when the section is actually on screen; guided mode only
  // advances while it stays visible.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Stage change: the scene hands off, the rail carries a signal to the next
     node, then the next scene builds itself. */
  const goTo = useCallback(
    (next: number) => {
      if (transitioning.current) return;
      if (next === stage) {
        setSeqDone(false);
        setRunKey((k) => k + 1);
        return;
      }
      const finish = () => {
        transitioning.current = false;
        setBusy(false);
        setSeqDone(false);
        setStage(next);
        setRunKey((k) => k + 1);
      };
      if (reduced) return finish();
      transitioning.current = true;
      setBusy(true);
      const tl = gsap.timeline({ onComplete: finish });
      tl.to(canvasRef.current, { opacity: 0, x: next > stage ? -18 : 18, duration: 0.4, ease: EASE.inOut })
        .to(textRef.current?.querySelectorAll(".reveal") ?? [], { yPercent: -110, duration: 0.35, stagger: 0.04, ease: "power2.in" }, 0)
        .fromTo(railDotRef.current, { left: `${nodePct(stage)}%`, opacity: 1 }, { left: `${nodePct(next)}%`, duration: 0.85, ease: EASE.inOut }, 0)
        .to(railFillRef.current, { width: `${nodePct(next)}%`, duration: 0.85, ease: EASE.inOut }, 0)
        .to(railDotRef.current, { opacity: 0, duration: 0.2 });
    },
    [reduced, stage],
  );

  // Bring the new scene and its copy in.
  useLayoutEffect(() => {
    if (railFillRef.current) gsap.set(railFillRef.current, { width: `${nodePct(stage)}%` });
    if (reduced) {
      gsap.set(canvasRef.current, { opacity: 1, x: 0 });
      gsap.set(textRef.current?.querySelectorAll(".reveal") ?? [], { yPercent: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(canvasRef.current, { opacity: 0, x: 18 }, { opacity: 1, x: 0, duration: 0.55, ease: EASE.out });
      gsap.fromTo(textRef.current?.querySelectorAll(".reveal") ?? [], { yPercent: 110 }, { yPercent: 0, duration: 0.7, stagger: 0.07, ease: EASE.out });
    });
    return () => ctx.revert();
  }, [stage, reduced]);

  // Guided mode: advance once a stage has finished and rested.
  useEffect(() => {
    if (!playing || !inView || !seqDone || busy) return;
    const t = window.setTimeout(() => {
      if (stage < STAGES.length - 1) goTo(stage + 1);
      else {
        setPlaying(false);
        setFinished(true);
      }
    }, HOLD_MS);
    return () => window.clearTimeout(t);
  }, [playing, inView, seqDone, busy, stage, goTo]);

  const onSequenceEnd = useCallback(() => setSeqDone(true), []);
  const onInteract = useCallback(() => setPlaying(false), []);

  const togglePlay = () => {
    if (finished || (!playing && stage === STAGES.length - 1 && seqDone)) {
      setFinished(false);
      setPlaying(true);
      goTo(0);
      return;
    }
    setPlaying((p) => !p);
  };

  const replayJourney = () => {
    setFinished(false);
    setPlaying(true);
    goTo(0);
  };

  const selectStage = (i: number) => {
    setPlaying(false);
    setFinished(false);
    goTo(i);
  };

  const onRailKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = Math.min(STAGES.length - 1, Math.max(0, stage + (e.key === "ArrowRight" ? 1 : -1)));
    selectStage(next);
    navRefs.current[next]?.focus();
  };

  const meta = STAGES[stage];
  const Stage = STAGE_COMPONENTS[stage];

  return (
    <section
      ref={sectionRef}
      aria-labelledby="gruha-explainer-title"
      className="relative overflow-hidden border-t border-[#E7E5DE] py-16 sm:py-20 md:py-24"
      style={{ backgroundColor: C.bg }}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#858B91] font-inter">
              <span className="h-px w-6 bg-[#858B91]" />
              What Gruha stands for
            </span>
            <h2 id="gruha-explainer-title" className="font-fraunces text-3xl font-normal leading-[1.15] tracking-tight text-[#17212B] sm:text-4xl md:text-5xl">
              From conversation to keys.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#5F6873] font-inter font-normal sm:text-base">
              AI that understands you and finds what fits, without chasing you for a phone number. A human expert joins only when you
              decide.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-[#17212B] font-inter">
              <span className="h-1.5 w-1.5 rounded-full bg-[#17212B]" />
              Information first. Identity when you choose.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause guided tour" : finished ? "Replay guided tour" : "Play guided tour"}
              className="inline-flex items-center gap-2 rounded-full border border-[#E1DED5] bg-white px-4 py-2 text-xs font-medium font-inter text-[#17212B] transition-colors hover:bg-[#F0EFE9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17212B]"
            >
              {playing ? <Pause size={13} /> : finished ? <RotateCcw size={13} /> : <Play size={13} />}
              {playing ? "Pause tour" : finished ? "Replay tour" : "Play tour"}
            </button>
            {!finished && (
              <button
                type="button"
                onClick={replayJourney}
                aria-label="Restart from step one"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E1DED5] bg-white text-[#5F6873] transition-colors hover:bg-[#F0EFE9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17212B]"
              >
                <RotateCcw size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Journey rail */}
        <nav aria-label="Journey steps" className="relative mt-10 md:mt-12" onKeyDown={onRailKey}>
          <div className="relative mx-[12.5%]">
            <span className="absolute left-0 right-0 top-[15px] h-px bg-[#D9D6CC]" aria-hidden="true" />
            <span
              ref={railFillRef}
              className="absolute left-0 top-[15px] h-px"
              style={{ width: `${nodePct(stage)}%`, background: `linear-gradient(90deg, ${C.mint}, ${C.blue}, ${C.orange}, ${C.violet})` }}
              aria-hidden="true"
            />
            <span
              ref={railDotRef}
              className="absolute top-[15px] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
              style={{ background: meta.accent, boxShadow: `0 0 0 5px ${meta.accent}22` }}
              aria-hidden="true"
            />
          </div>
          <ol className="relative grid grid-cols-4">
            {STAGES.map((s, i) => {
              const active = i === stage;
              const done = i < stage;
              return (
                <li key={s.id} className="flex justify-center">
                  <button
                    ref={(el) => {
                      navRefs.current[i] = el;
                    }}
                    type="button"
                    onClick={() => selectStage(i)}
                    aria-current={active ? "step" : undefined}
                    tabIndex={active ? 0 : -1}
                    className="group flex flex-col items-center gap-2 rounded-lg px-1 pb-1 focus-visible:outline-2 focus-visible:outline-offset-4"
                    style={{ outlineColor: s.accent }}
                  >
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full border bg-white text-xs font-semibold tabular-nums font-inter transition-all duration-300"
                      style={{
                        borderColor: active || done ? s.accent : "#D9D6CC",
                        color: active ? "#fff" : done ? s.accent : C.muted,
                        backgroundColor: active ? s.accent : "#fff",
                        boxShadow: active ? `0 0 0 5px ${s.accent}1F` : undefined,
                      }}
                    >
                      {s.number}
                    </span>
                    <span
                      className="hidden text-xs font-semibold uppercase tracking-wider font-inter transition-colors sm:block"
                      style={{ color: active ? C.ink : C.muted }}
                    >
                      {s.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Stage */}
        <div className="mt-8 grid grid-cols-1 gap-8 md:mt-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,9fr)] lg:gap-12">
          <div ref={textRef} className="flex flex-col justify-center lg:py-6" aria-live="polite">
            <div className="overflow-hidden">
              <div className="reveal flex items-baseline gap-3">
                <span className="font-fraunces text-6xl font-light leading-none tabular-nums tracking-tight md:text-7xl lg:text-8xl" style={{ color: meta.accent }}>
                  {meta.number}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#858B91] font-inter">{meta.label}</span>
              </div>
            </div>
            <div className="mt-5 overflow-hidden pb-1">
              <h3 className="reveal font-fraunces text-2xl font-normal leading-tight tracking-tight text-[#17212B] sm:text-3xl md:text-3xl">{meta.headline}</h3>
            </div>
            <div className="mt-3 overflow-hidden">
              <p className="reveal max-w-sm text-sm leading-relaxed text-[#5F6873] font-inter md:text-base">{meta.copy}</p>
            </div>
            <div className="mt-6 overflow-hidden">
              <p className="reveal inline-flex items-center gap-2 text-xs font-medium text-[#5F6873] font-inter">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.accent }} />
                {meta.agent}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#E1DED5] bg-white shadow-[0_1px_0_rgba(23,33,43,0.03),0_24px_48px_-32px_rgba(23,33,43,0.18)]">
            <div className="flex items-center justify-between border-b border-[#E7E5DE] px-4 py-2.5">
              <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#5F6873] font-inter">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.accent }} />
                {meta.number} / {meta.label}
              </span>
              <span className="hidden text-xs uppercase tracking-wider text-[#858B91] sm:inline font-inter">Interactive · Illustrative</span>
            </div>
            <div ref={canvasRef}>
              {started ? (
                <Stage key={`${stage}-${runKey}`} reduced={reduced} onSequenceEnd={onSequenceEnd} onInteract={onInteract} />
              ) : (
                <div aria-hidden="true">
                  <svg viewBox="0 0 720 440" className="block h-auto w-full">
                    <TechGrid w={720} h={440} />
                  </svg>
                  <div className="h-[49px] border-t border-[#E7E5DE]" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
