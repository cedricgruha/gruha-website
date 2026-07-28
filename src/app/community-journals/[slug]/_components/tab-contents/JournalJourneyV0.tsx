"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";
import * as Icons from "lucide-react";
import imgMoment1 from "@/imports/1.png";
import imgMoment2 from "@/imports/2.png";
import imgMoment3 from "@/imports/3.png";
import AgentCardSlider, { AgentCardItem } from "./JournalAgentCardStack";

const fd = "'Newsreader', Georgia, serif";
const fu = "'Inter Tight', system-ui, sans-serif";

const getImgSrc = (img: any): string => {
  if (!img) return "";
  if (typeof img === "string") return img;
  if (typeof img === "object" && img.src) return img.src;
  return String(img);
};

export const getIcon = (
  name?: string,
  defaultName = "Briefcase",
  props: any = { className: "w-4 h-4", strokeWidth: 2 }
) => {
  if (!name) return null;
  const Icon = (Icons as any)[name] || (Icons as any)[defaultName] || Icons.HelpCircle;
  return <Icon {...props} />;
};

/* -- Type Definitions ------------------------------------------------------ */

export interface MomentItem {
  id?: string;
  title: string;
  desc?: string;
  description?: string;
  imageSrc?: any;
}

export interface RoadmapNode {
  id: string;
  title: string;
  desc: string;
  icon: any;
  x: number; // Viewbox X (0 to 1000)
  y: number; // Viewbox Y (0 to 800)
  width: number;
}

export interface MetricItem {
  icon?: any;
  label: string;
  value: string;
}

export interface QuoteItem {
  text: string;
  author?: string;
  speaker?: string;
}

export interface ChatMessage {
  sender: string;
  avatar: string;
  text: string;
  isRiya?: boolean;
}

export interface RealityCheckItem {
  icon?: any;
  title: string;
  description: string;
}

export interface TimelineStep {
  id: string;
  label: string;
  icon: any;
  active?: boolean;
  tag?: string;
}

export interface JournalJourneyV0Props {
  eyebrow?: string;
  tagline?: string;
  title?: string;
  description?: string;
  metrics?: MetricItem[];
  journeyFrameTitle?: string;
  journeyFrameSubtitle?: string;
  journeyFrameImage?: any;
  roadmapTitle?: string;
  roadmapNodes?: RoadmapNode[];
  timelineTitle?: string;
  timelineSteps?: TimelineStep[];
  momentsTitle?: string;
  moments?: MomentItem[];
  agents?: any[];
  agentCards?: AgentCardItem[];
  agentCardsTitle?: string;
  voicesTitle?: string;
  quotes?: QuoteItem[];
  riyaConclusionTitle?: string;
  riyaConclusionImage?: string;
  chatMessages?: ChatMessage[];
  audioLabel?: string;
  audioDurationLabel?: string;
  audioSrc?: string;
  waveformBars?: { height: number; opacity: number }[];
  realityChecksTitle?: string;
  realityChecks?: RealityCheckItem[];
}

/* -- Interactive Audio Player Sub-Component ------------------------------- */

export interface AudioPlayerProps {
  audioLabel?: string;
  audioSrc?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioLabel = "HEAR ENTIRE CONVERSATION",
  audioSrc = "https://samplelib.com/mp3/sample-3s.mp3",
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(92);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn("Audio playback notice:", err);
            setIsPlaying(true);
          });
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && !isNaN(audioRef.current.currentTime)) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
      setDuration(Math.round(audioRef.current.duration));
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        if (audioRef.current && !audioRef.current.paused && !isNaN(audioRef.current.currentTime)) {
          setCurrentTime(audioRef.current.currentTime);
          if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
            setDuration(Math.round(audioRef.current.duration));
          }
        } else if (isPlaying) {
          setCurrentTime((prev) => {
            const next = prev + 0.25;
            const maxDur = duration > 0 ? duration : 92;
            if (next >= maxDur) {
              setIsPlaying(false);
              return 0;
            }
            return next;
          });
        }
      }, 250);
    }
    return () => clearInterval(timer);
  }, [isPlaying, duration]);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progressRatio = duration > 0 ? currentTime / duration : 0;

  const baseWaveform = [
    12, 14, 18, 22, 26, 22, 28, 24, 20, 16, 24, 28, 22, 18, 14, 12, 16, 20, 24, 18, 14, 10, 14, 18, 22
  ];
  const totalBars = baseWaveform.length;
  const activeBarIndex = Math.floor(progressRatio * totalBars);

  const handleBarClick = (index: number) => {
    const maxDur = duration > 0 ? duration : 92;
    const targetTime = (index / totalBars) * maxDur;
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = targetTime;
      } catch (e) {
        // Fallback
      }
    }
    setCurrentTime(targetTime);
  };

  return (
    <div className="pt-4 border-t border-slate-100/80 space-y-3">
      <audio
        ref={audioRef}
        src={audioSrc}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="auto"
      />

      <p
        className="text-[9.5px] font-semibold tracking-[0.14em] uppercase"
        style={{ fontFamily: fu, color: "rgb(138, 148, 161)" }}
      >
        {audioLabel} {duration > 0 ? `(${Math.round(duration)} SEC)` : "(92 SEC)"}
      </p>

      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors flex items-center justify-center shrink-0 border-none cursor-pointer shadow-md text-white"
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-white text-white" />
          ) : (
            <Play className="w-4 h-4 fill-white text-white translate-x-[1px]" />
          )}
        </button>

        {/* Dynamic Waveform Visualizer */}
        <div className="flex items-center gap-[3px] flex-1 max-w-[280px] h-8 cursor-pointer select-none">
          {baseWaveform.map((height, idx) => {
            const isActive = idx <= activeBarIndex;
            const barHeight = isPlaying && isActive
              ? Math.min(28, Math.max(8, height + Math.sin(currentTime * 8 + idx) * 5))
              : height;

            return (
              <div
                key={idx}
                onClick={() => handleBarClick(idx)}
                className={`flex-1 rounded-full transition-all duration-150 hover:opacity-80 ${isActive ? "bg-[#8B5CF6]" : "bg-[#EBE9FE]"}`}
                style={{ height: `${barHeight}px` }}
              />
            );
          })}
        </div>

        <span className="text-[12px] font-medium text-slate-400 shrink-0 font-inter min-w-[70px] text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

const defaultRoadmapNodes: RoadmapNode[] = [
  { id: "spreadsheet-loop", title: "The 47-Tab Spreadsheet", desc: "Eleven months of analysis loop; ₹35L cost of analysis added as its own column.", icon: "FileSpreadsheet", x: 130, y: 110, width: 190 },
  { id: "raintree-benchmark", title: "Raintree Boulevard Benchmark", desc: "Calibrating delivered Hebbal premium (₹17.5K–20.4K/sqft) to establish exit ceiling.", icon: "TrendingUp", x: 340, y: 160, width: 190 },
  { id: "land-syndicate-detour", title: "Land Syndicate Detour", desc: "22% IRR pitch deck with no RERA or title packet; killed by one lawyer call.", icon: "AlertTriangle", x: 560, y: 150, width: 190 },
  { id: "kitchen-mandate", title: "Kitchen Mandate Formed", desc: "Thesis narrows to launch window; 4 written conditions framed in kitchen.", icon: "FileText", x: 740, y: 130, width: 190 },
  { id: "eoi-bounce", title: "Road-Facing EOI Bounce", desc: "Allotment day offered low road-facing floors; exercised refundable EOI clause.", icon: "RotateCcw", x: 880, y: 290, width: 180 },
  { id: "nikoo-unit-secured", title: "East Mid-Floor Secured", desc: "Secured ideal east-facing mid-floor in Nikoo's new phase (possession 2029).", icon: "CheckCircle2", x: 620, y: 400, width: 190 },
  { id: "rera-progress-ritual", title: "RERA Progress Ritual", desc: "Quarterly RERA progress tracking ritual established; Deepa's rule audited.", icon: "CalendarCheck", x: 340, y: 410, width: 190 },
];

/* -- Main Dynamic JournalJourneyV0 Component ----------------------------- */

export const JournalJourneyV0: React.FC<JournalJourneyV0Props> = ({
  eyebrow = "The journey so far",
  tagline,
  title = "How their journey actually unfolded.",
  description = "Months of conversations, weekend visits, changing budgets and countless trade-offs brought them to where they are today.",
  metrics = [
    { icon: "Briefcase", label: "Journey stage", value: "Actively exploring" },
    { icon: "TrendingUp", label: "Site visits", value: "11 Projects" },
    { icon: "Hourglass", label: "Timeline", value: "≤ 8 Months" },
    { icon: "IndianRupee", label: "Budget stretch", value: "₹1 Cr → ₹1.5 Cr" },
  ],
  journeyFrameTitle = "How their journey unfolded",
  journeyFrameSubtitle = "Every stage, mapped.",
  roadmapTitle = "How their journey unfolded",
  roadmapNodes = defaultRoadmapNodes,
  timelineTitle = "Where they stand today",
  timelineSteps,
  momentsTitle = "Moments that changed everything",
  moments = [
    { title: "The budget shift", desc: "Their ₹1 Cr dream became a ₹1.5 Cr reality as prices rose faster than their savings.", imageSrc: imgMoment1 },
    { title: "The baby deadline", desc: "With their first child arriving next year, delaying the decision was no longer an option.", imageSrc: imgMoment2 },
    { title: "The Sunday Ritual", desc: "Every Sunday meant one site visit, one Excel update, one argument and one make-up dosa.", imageSrc: imgMoment3 },
  ],
  agentCards,
  voicesTitle = "Voices around them",
  quotes = [
    { text: "Buy a site. Land never loses value.", speaker: "Dad" },
    { text: "Find a home close to a temple and good schools.", speaker: "Mom" },
    { text: "Don't rush. Wait for ready-to-move projects.", speaker: "Friend" },
    { text: "Prices are increasing every quarter.", speaker: "Builder" },
  ],
  riyaConclusionTitle = "Riya's take on the Journey",
  chatMessages,
  audioLabel = "HEAR ENTIRE CONVERSATION",
  audioSrc,
  realityChecksTitle = "Reality checks along the way",
  realityChecks,
}) => {
  const displayEyebrow = tagline || eyebrow;

  // Extract Riya quote from chatMessages if provided
  const riyaChatMessage = chatMessages?.find((m) => m.isRiya || m.sender === "Riya")?.text;
  const displayRiyaQuote = riyaChatMessage || "Every time I suggested a lower-priced option, both of you kept returning to communities with trusted builders, better schools and realistic possession timelines. That's when I realized you weren't searching for the cheapest home. You were searching for peace of mind.";

  return (
    <section id="section-journey" className="pt-10  w-full text-slate-900">
      <div className="w-full space-y-10">

        {/* -- Header ---------------------------------------------------- */}
        <div className="text-left mb-7">
          <p
            className="text-[11px] font-semibold tracking-[0.15em] uppercase"
            style={{ fontFamily: fu, color: "rgb(221, 81, 40)" }}
          >
            {displayEyebrow}
          </p>
          <h2
            className="mt-2 text-[clamp(28px,3.6vw,40px)] font-semibold leading-[1.08] tracking-[-0.02em]"
            style={{ fontFamily: fd, color: "rgb(17, 24, 33)" }}
          >
            {title}
          </h2>
          <p
            className="mt-3 text-[17px] leading-[1.55]"
            style={{ fontFamily: fd, color: "rgb(89, 99, 111)" }}
          >
            {description}
          </p>
        </div>

        {/* -- Metrics Strip ---------------------------------------------- */}
        {metrics && metrics.length > 0 && (
          <div
            className="w-full bg-white border border-slate-100 flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-100 overflow-hidden"
            style={{ borderRadius: 14, boxShadow: "rgba(17, 24, 33, 0.04) 0px 1px 2px, rgba(17, 24, 33, 0.06) 0px 8px 24px" }}
          >
            {metrics.map((cell: any, idx: number) => {
              const iconElement =
                typeof cell.icon === "string"
                  ? getIcon(cell.icon, "Briefcase", { className: "w-4 h-4 text-[#DD5128]" })
                  : cell.icon ? <cell.icon className="w-4 h-4 text-[#DD5128]" /> : getIcon("Briefcase", "Briefcase", { className: "w-4 h-4 text-[#DD5128]" });

              return (
                <div key={cell.label || idx} className="flex items-center gap-4 px-6 sm:px-8 py-5 flex-1">
                  <span className="flex-none text-[#DD5128]">{iconElement}</span>
                  <div>
                    <p
                      className="text-[9.5px] font-semibold tracking-[0.13em] uppercase mb-1"
                      style={{ fontFamily: fu, color: "rgb(138, 148, 161)" }}
                    >
                      {cell.label}
                    </p>
                    <p
                      className="text-[17px] font-[500] leading-tight"
                      style={{ fontFamily: fd, color: "rgb(17, 24, 33)" }}
                    >
                      {cell.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* -- Dynamic Roadmap SVG ---------------------------------------- */}
        <div className="w-full border border-[#F1F5F9] rounded-[24px] bg-white overflow-hidden pb-6 shadow-[0_1px_2px_rgba(17,24,33,.04),0_8px_24px_rgba(17,24,33,.05)]">
          <div className="px-8 pt-7 pb-2">
            <p
              className="text-[9.5px] font-semibold tracking-[0.14em] uppercase"
              style={{ fontFamily: fu, color: "rgb(138, 148, 161)" }}
            >
              {journeyFrameTitle}
            </p>
            <h3
              className="mt-1 text-[20px] font-semibold leading-tight"
              style={{ fontFamily: fd, color: "rgb(17, 24, 33)" }}
            >
              {roadmapTitle}
            </h3>
          </div>

          {/* Mobile Vertical Nodes */}
          <div className="flex flex-col gap-6 p-6 pb-10 md:hidden">
            {roadmapNodes.map((stage, idx) => {
              const Icon = typeof stage.icon === "string" ? (props: any) => getIcon(stage.icon, "HelpCircle", props) : stage.icon;
              const isLast = idx === roadmapNodes.length - 1;

              return (
                <div key={stage.id} className="relative flex items-start gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="flex items-center justify-center w-[52px] h-[52px] bg-[#F1F5F9] rounded-[18px] z-10">
                      {Icon ? <Icon className="w-[24px] h-[24px] text-[#475569]" strokeWidth={1.8} /> : getIcon("HelpCircle", "HelpCircle", { className: "w-6 h-6 text-[#475569]" })}
                    </div>
                    {!isLast && <div className="w-[2px] bg-slate-200 flex-1 my-2 min-h-[36px]" />}
                  </div>
                  <div className="flex flex-col gap-1 pt-1">
                    <h4 className="font-semibold text-[15px] leading-[20px] text-[#334155] font-inter">
                      {stage.title}
                    </h4>
                    <p className="font-medium text-[13px] leading-[18px] text-[#64748B] font-inter">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop SVG Snaking Path & Loop/Bounce Overlays */}
          {(() => {
            const maxY = Math.max(...roadmapNodes.map((n) => n.y), 300);
            // Generous bottom margin space (240px offset) ensuring no node card text, badge, or bounce arc gets clipped
            const viewBoxHeight = Math.max(520, maxY + 240);

            // 1. Main sequential connecting path
            const mainPathD = roadmapNodes.reduce((acc, curr, idx) => {
              if (idx === 0) return `M ${curr.x} ${curr.y}`;
              const prev = roadmapNodes[idx - 1];
              const dx = curr.x - prev.x;
              const dy = curr.y - prev.y;

              if (Math.abs(dx) > Math.abs(dy)) {
                const cx1 = prev.x + dx * 0.5;
                const cy1 = prev.y;
                const cx2 = prev.x + dx * 0.5;
                const cy2 = curr.y;
                return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
              } else {
                const cx1 = prev.x;
                const cy1 = prev.y + dy * 0.5;
                const cx2 = curr.x;
                const cy2 = prev.y + dy * 0.5;
                return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
              }
            }, "");

            // 2. Identify loop & bounce/regression overlay arcs
            const overlayArcs: Array<{
              id: string;
              type: string;
              pathD: string;
              label?: string;
              labelPos: { x: number; y: number };
            }> = [];

            roadmapNodes.forEach((node) => {
              const nodeType = (node as any).type;
              const targetId = (node as any).targetNodeId;
              const loopText = (node as any).loopText;

              // Self-looping node (e.g. S1 11-month spreadsheet loop, S2 video protocol loop)
              if (nodeType === "loop") {
                const loopD = `M ${node.x - 15} ${node.y - 30} C ${node.x - 60} ${node.y - 110}, ${node.x + 60} ${node.y - 110}, ${node.x + 15} ${node.y - 30}`;
                overlayArcs.push({
                  id: `loop-${node.id}`,
                  type: "loop",
                  pathD: loopD,
                  label: loopText || "Stage Loop",
                  labelPos: { x: node.x, y: node.y - 100 },
                });
              }

              // Backward bounce or regression connecting back to targetNodeId
              if ((nodeType === "bounce" || nodeType === "regression") && targetId) {
                const targetNode = roadmapNodes.find((n) => n.id === targetId);
                if (targetNode) {
                  // Arch curve high above or below
                  const isTopArc = node.y > 300 && targetNode.y > 300;
                  const archY = isTopArc ? Math.min(node.y, targetNode.y) - 130 : Math.max(node.y, targetNode.y) + 120;
                  const midX = (node.x + targetNode.x) / 2;
                  const bounceD = `M ${node.x} ${node.y - 25} C ${node.x} ${archY}, ${targetNode.x} ${archY}, ${targetNode.x} ${targetNode.y - 25}`;
                  overlayArcs.push({
                    id: `bounce-${node.id}`,
                    type: nodeType,
                    pathD: bounceD,
                    label: loopText || (nodeType === "bounce" ? "Bounce" : "Regression"),
                    labelPos: { x: midX, y: archY + (isTopArc ? -12 : 16) },
                  });
                }
              }
            });

            return (
              <div
                className="hidden md:block relative w-full pb-12 mb-4"
                style={{ aspectRatio: `1000 / ${viewBoxHeight}` }}
              >
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-0"
                  viewBox={`0 0 1000 ${viewBoxHeight}`}
                  preserveAspectRatio="xMidYMid meet"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <marker
                      id="arrowhead-v0"
                      markerWidth="7"
                      markerHeight="7"
                      refX="5"
                      refY="3.5"
                      orient="auto"
                    >
                      <path
                        d="M 1 1 L 6 3.5 L 1 6"
                        fill="none"
                        stroke="#94A3B8"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </marker>
                    <marker
                      id="arrowhead-coral"
                      markerWidth="7"
                      markerHeight="7"
                      refX="5"
                      refY="3.5"
                      orient="auto"
                    >
                      <path
                        d="M 1 1 L 6 3.5 L 1 6"
                        fill="none"
                        stroke="#DD5128"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </marker>
                  </defs>

                  {/* Base Connecting Path */}
                  <path
                    d={mainPathD}
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="2.2"
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                  />

                  {/* Loop & Bounce Overlay Arcs */}
                  {overlayArcs.map((arc) => {
                    const strokeColor = arc.type === "bounce" ? "#DD5128" : arc.type === "regression" ? "#8B5CF6" : "#3B82F6";
                    return (
                      <g key={arc.id}>
                        <path
                          d={arc.pathD}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth="2.4"
                          strokeDasharray={arc.type === "loop" ? "4 4" : "6 4"}
                          markerEnd={arc.type === "bounce" ? "url(#arrowhead-coral)" : "url(#arrowhead-v0)"}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* SVG Text & Overlay Badges */}
                {overlayArcs.map((arc) => (
                  <div
                    key={`badge-${arc.id}`}
                    className="absolute z-20 pointer-events-auto transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${(arc.labelPos.x / 1000) * 100}%`,
                      top: `${(arc.labelPos.y / viewBoxHeight) * 100}%`,
                    }}
                  >
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide border shadow-xs whitespace-nowrap ${
                        arc.type === "bounce"
                          ? "bg-[#FEF0EC] text-[#DD5128] border-[#FDBA74]"
                          : arc.type === "regression"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                      style={{ fontFamily: fu }}
                    >
                      {arc.label}
                    </span>
                  </div>
                ))}

                {roadmapNodes.map((stage) => {
                  const nodeType = (stage as any).type;
                  const Icon =
                    typeof stage.icon === "string"
                      ? (props: any) => getIcon(stage.icon, "HelpCircle", props)
                      : stage.icon;

                  const badgeBg =
                    nodeType === "bounce"
                      ? "bg-rose-500 text-white"
                      : nodeType === "regression"
                      ? "bg-purple-600 text-white"
                      : nodeType === "detour"
                      ? "bg-amber-500 text-white"
                      : nodeType === "loop"
                      ? "bg-blue-600 text-white"
                      : null;

                  return (
                    <div
                      key={stage.id}
                      className="absolute z-10 flex flex-col items-center pointer-events-auto"
                      style={{
                        left: `${(stage.x / 1000) * 100}%`,
                        top: `${(stage.y / viewBoxHeight) * 100}%`,
                        width: `${stage.width}px`,
                        transform: "translate(-50%, -27px)",
                      }}
                    >
                      <div
                        className="relative flex items-center justify-center w-[54px] h-[54px] bg-[#F1F5F9] rounded-[18px] mb-2 shrink-0 transition-transform duration-200 hover:scale-105"
                        style={{ boxShadow: "0 0 0 8px #ffffff" }}
                      >
                        {badgeBg && (
                          <span className={`absolute -top-2.5 px-1.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider ${badgeBg}`}>
                            {nodeType}
                          </span>
                        )}
                        {Icon ? (
                          <Icon className="w-[26px] h-[26px] text-[#475569]" strokeWidth={1.75} />
                        ) : (
                          getIcon("HelpCircle", "HelpCircle", { className: "w-6 h-6 text-[#475569]" })
                        )}
                      </div>
                      <div className="flex flex-col items-center text-center gap-0.5 w-full">
                        <h4 className="font-semibold text-[14px] leading-[18px] text-[#334155] font-inter">
                          {stage.title}
                        </h4>
                        <p className="font-medium text-[13px] leading-[17px] text-[#64748B] font-inter">
                          {stage.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* -- Moments Cards Grid ----------------------------------------- */}
        {moments && moments.length > 0 && (
          <div className="w-full">
            <p
              className="text-[9.5px] font-semibold tracking-[0.14em] uppercase mb-4"
              style={{ fontFamily: fu, color: "rgb(138, 148, 161)" }}
            >
              {momentsTitle}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {moments.slice(0, 3).map((m: any, idx: number) => {
                const imgSrc = getImgSrc(m.imageSrc || (idx === 0 ? imgMoment1 : idx === 1 ? imgMoment2 : imgMoment3));
                const bodyText = m.desc || m.description || "";

                return (
                  <div
                    key={m.id || m.title || idx}
                    className="bg-white border overflow-hidden flex flex-col"
                    style={{ borderRadius: 14, borderColor: "#E4E9EF", boxShadow: "0 1px 2px rgba(17,24,33,.04), 0 8px 24px rgba(17,24,33,.05)" }}
                  >
                    <div className="flex-1 flex items-center justify-center pt-5 px-5 bg-slate-50/60">
                      <img src={imgSrc} alt={m.title} className="w-full h-auto object-contain rounded-lg" />
                    </div>
                    <div className="px-6 py-5">
                      <p className="text-[11px] font-semibold mb-1" style={{ fontFamily: fu, color: "#DD5128" }}>
                        {String(idx + 1).padStart(2, "0")}
                      </p>
                      <h4 className="text-[16px] mb-1.5" style={{ fontFamily: fd, color: "#111821", fontWeight: 500 }}>
                        {m.title}
                      </h4>
                      <p className="text-[13px] leading-[1.55]" style={{ fontFamily: fu, color: "#59636F" }}>
                        {bodyText}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* -- AI Agents & Audio Player Section ------------------------------ */}
        <div className="w-full">
          <div
            className="bg-white rounded-2xl border border-slate-100 grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] divide-y lg:divide-y-0 lg:divide-x divide-slate-100 overflow-hidden"
            style={{ borderRadius: 14, borderColor: "#E4E9EF", boxShadow: "0 1px 2px rgba(17,24,33,.04), 0 8px 24px rgba(17,24,33,.05)" }}
          >
            {/* Left Column: Take on Journey & Audio Player */}
            <div className="p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p
                  className="text-[9.5px] font-semibold tracking-[0.14em] uppercase"
                  style={{ fontFamily: fu, color: "rgb(138, 148, 161)" }}
                >
                  AI AGENTS ON THIS JOURNEY
                </p>

                <div className="flex items-start gap-0 flex-col">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="mb-3"><path d="M14 2 L15.5 11.5 L25 14 L15.5 16.5 L14 26 L12.5 16.5 L3 14 L12.5 11.5 Z" stroke="#7C3AED" strokeWidth="1.5" strokeLinejoin="round"></path><path d="M22 4 L22.7 7.3 L26 8 L22.7 8.7 L22 12 L21.3 8.7 L18 8 L21.3 7.3 Z" stroke="#7C3AED" strokeWidth="1.2" strokeLinejoin="round"></path></svg>
                  <span className="text-[14px] font-semibold text-[#8B5CF6] font-inter">
                    {riyaConclusionTitle}
                  </span>
                </div>

                <p
                  className="text-[18px] sm:text-[19px] leading-[1.65] text-slate-800"
                  style={{ fontFamily: fd }}
                >
                  "{displayRiyaQuote}"
                </p>
              </div>

              {/* Interactive Audio Player Controls */}
              <AudioPlayer audioLabel={audioLabel} audioSrc={audioSrc} />
            </div>

            {/* Right Column: Card Slider */}
            <div className="flex items-center justify-center bg-[#FAFAFD] lg:bg-white p-4">
              <AgentCardSlider cards={agentCards} />
            </div>
          </div>
        </div>

        {/* -- Voices Around Them Grid ------------------------------------ */}
        {quotes && quotes.length > 0 && (
          <div className="w-full">
            <div
              className="bg-white border p-8"
              style={{
                borderRadius: 14,
                borderColor: "#E4E9EF",
                // boxShadow: "0 1px 2px rgba(17,24,33,.04), 0 8px 24px rgba(17,24,33,.05)",
                // borderradius: "14px", 
                boxShadow: "rgba(17, 24, 33, 0.04) 0px 1px 2px, rgba(17, 24, 33, 0.05) 0px 8px 24px"
              }}
            >
              <p
                className="text-[9.5px] font-semibold tracking-[0.14em] uppercase mb-6"
                style={{ fontFamily: fu, color: "#8A94A1" }}
              >
                {voicesTitle}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quotes.map((q: any, idx: number) => {
                  const quoteText = typeof q === "string" ? q : (q.text || "");
                  const quoteAuthor = typeof q === "string" ? "" : (q.author || q.speaker || "");

                  return (
                    <div
                      key={quoteAuthor || idx}
                      className="rounded-xl border border-slate-100 p-7 flex flex-col justify-between gap-6"
                      style={{ background: "#f8fafc" }}
                    >
                      <p
                        className="text-[20px] leading-[1.5] italic"
                        style={{ fontFamily: fd, color: "#2D3748" }}
                      >
                        "{quoteText}"
                      </p>
                      {quoteAuthor && (
                        <p
                          className="text-[14px] font-semibold"
                          style={{ fontFamily: fu, color: "#DD5128" }}
                        >
                          {quoteAuthor}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default JournalJourneyV0;
