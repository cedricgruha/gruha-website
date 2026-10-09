// Design tokens for the "From conversation to keys" explainer.
// Colours are functional signals — each one belongs to a stage of the journey.

export const C = {
  bg: "#F7F6F2",
  surface: "#FFFFFF",
  surfaceAlt: "#F0EFE9",
  grid: "#E7E5DE",
  ink: "#17212B",
  inkSoft: "#5F6873",
  muted: "#858B91",
  hairline: "#D9D6CC",
  mint: "#27B78A",
  blue: "#3299F5",
  orange: "#F28B52",
  violet: "#8B73F5",
} as const;

export interface StageMeta {
  id: string;
  number: string;
  label: string;
  headline: string;
  copy: string;
  accent: string;
  agent: string;
}

export const STAGES: StageMeta[] = [
  {
    id: "understand",
    number: "01",
    label: "Understand",
    headline: "Start with a conversation.",
    copy: "Riya asks about the home, not about you: what you need, where, and what matters.",
    accent: C.mint,
    agent: "Riya · Home search agent",
  },
  {
    id: "recommend",
    number: "02",
    label: "Recommend",
    headline: "From needs to the right matches.",
    copy: "Kabir analyzes your requirements to discover the projects that fit.",
    accent: C.blue,
    agent: "Kabir · Projects curator",
  },
  {
    id: "explore",
    number: "03",
    label: "Explore & Refine",
    headline: "Explore until it feels right.",
    copy: "Floor plans, pricing, neighbourhoods. Compare them all on your terms, with no sales calls chasing you.",
    accent: C.orange,
    agent: "Riya + Kabir · Iterative",
  },
  {
    id: "connect",
    number: "04",
    label: "Connect",
    headline: "AI discovery. Human guidance.",
    copy: "When you're ready, and only then, bring in an expert who helps you move forward with confidence.",
    accent: C.violet,
    agent: "Human property advisor",
  },
];

// Shared easing vocabulary — restrained, no bounce.
export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  draw: "power1.inOut",
} as const;

// SVG canvas size every stage draws into.
export const VB = { w: 720, h: 440 } as const;
