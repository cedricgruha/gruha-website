"use client";

import React from 'react';
import { BaseStepSection } from '../ui/BaseStepSection';

const features = [
  {
    title: "Curated from 2,000+ projects",
    description: "Every project in bengaluru",
    icon: "/assets/02-projects/Vector.svg"
  },
  {
    title: "Trust, built in",
    description: "RERA verified. OC status. Builder track record.\nNo surprises later.",
    icon: "/assets/02-projects/Vector (1).svg"
  },
  {
    title: "Filtered by your Journal",
    description: "Kabir applies your dealbreakers, preferences\n& priorities.",
    icon: "/assets/02-projects/Vector (2).svg"
  }
];

const cards = [
  {
    id:"c-1",
    bg: "bg-[#F26A76]",
    title: "2,000+ projects. One screen. The whole city.",
    description: "Every active and upcoming project in Bengaluru, dropped on a real satellite map. Pan, zoom, and see what's actually being built around the localities you're shortlisting.",
    image: "/assets/blog/Rectangle%2034626212.png",
  },
  {
    id:"c-2",
    bg: "bg-[#E0C5A3]",
    title: "Your Journal becomes your filter — automatically.",
    description: "The requirements captured in your Home Search Journal apply to the map without you lifting a finger. Projects that fit light up; projects that don't fade out.",
    image: "/assets/blog/Rectangle%2034626212%20(1).png"
  },
  {
    id:"c-3",
    bg: "bg-[#F0A1C2]",
    title: "Make the Map Work Your Way",
    description: "Three control axes. Toggle map + panel or grid. Filter by stage, builder, RERA, possession, or availability—skip '2031' when you need December. Switch to satellite or 3D for context.",
    image: "/assets/blog/Rectangle%2034626212%20(2).png"
  },
  {
    id:"c-4",
    bg: "bg-[#b880c7]",
    title: "Side-by-Side Project Compare",
    description: "Four projects, one screen—no spreadsheets. Pin any four and compare price, sun, privacy, commute, vaastu, greenery, and RERA. Differences are instantly clear.",
    image: "/assets/blog/Rectangle%2034626212%20(3).png"
  },
  {
    id:"c-5",
    bg: "bg-[#9BA6BF]",
    title: "New launches in your area? You'll hear first.",
    description: "Save any map view as a watch. Get alerts for new listings, price drops, or when a flagged unit becomes available.",
    image: "/assets/blog/Rectangle%2034626212%20(4).png"
  }
];

export const ProjectsSection = () => {
  return (
    <BaseStepSection
      step={2}
      number="02"
      title="Projects"
      description={<>Bengaluru is building 2,000+.<br className="hidden md:block" /> Kabir shows you only yours.</>}
      sidebarImage="/assets/02-projects/character-men.png"
      cards={cards}
      features={features}
      spacing={32}
    />
  );
};
