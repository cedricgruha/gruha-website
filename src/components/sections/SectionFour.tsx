"use client";

import React from 'react';
import { BaseStepSection } from '../ui/BaseStepSection';

const features = [
  {
    title: "Master Plan",
    description: "Understand the entire layout at a glance.",
    icon: "/assets/04-project-tower/Vector.svg"
  },
  {
    title: "Amenities",
    description: "See everything you'll love, inside & out.",
    icon: "/assets/04-project-tower/vector-2.svg"
  },
  {
    title: "Construction updates",
    description: "See everything you'll love, inside & out.",
    icon: "/assets/04-project-tower/vector-3.svg"
  }
];

const cards = [
  {
    title: "How efficiently is space used?",
    description: "A breakdown of usable vs wasted space across towers, corridors, amenities, and common areas. Not all square footage works equally — some projects look large on paper but lose space to poor layouts and circulation.",
    image: "/assets/list-after-project/list-1.png",
    id:"pj-1",
    bg:"bg-[#B349A6]",
    textColor: "text-white"
  },
  {
    title: "Construction Progress",
    description: "Track real construction progress across towers, floors, and key infrastructure — not just overall percentages. See what’s structurally complete, what’s still under development, and whether timelines align with reality.",
    image: "/assets/list-after-project/list-3.png",
    id:"pj-2",
    bg:"bg-[#9BEBDF]",
  },
  {
    title: "Movement & Access",
    description: "Understand real walking paths, entry/exit points, lift access, and internal road layouts — mapped to daily routines. The distance from gate to tower, tower to amenities, parking to home — all visualised. What feels convenient on a plan can become friction when you live it. ",
    image: "/assets/list-after-project/list-4.png",
    id:"pj-3",
    bg:"bg-[#EA726D]",
    textColor: "text-white"
  },
  {
    title: "Sun & Shadow Simulation",
    description: "A dynamic simulation of how sunlight and shadows shift across the day and through the year — at both project and unit level. See which homes get natural light, which stay shaded, and how surrounding towers impact exposure. ",
    image: "/assets/list-after-project/list-2.png",
    id:"pj-4",
    bg:"bg-[#d2ea6d]",
  }
];

export const SectionFour = () => {
  return (
    <BaseStepSection
      step={4}
      number="04"
      title={<>Project & Tower <br/>Intelligence</>}
      description="Big decisions need the full picture."
      sidebarImage="/assets/drone.png"
      cards={cards}
      features={features}
       spacing={32}
    />
  );
};
