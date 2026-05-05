"use client";

import React from 'react';
import { BaseStepSection } from '../ui/BaseStepSection';

const features = [
  {
    title: "25+",
    description: "Data Layers",
    icon: "/assets/05-location-inteligence/stacks_24dp_E3E3E3_FILL0_wght400_GRAD0_OPSZ24 1.svg"
  },
  {
    title: "Live",
    description: "Environment",
    icon: "/assets/05-location-inteligence/Vector.svg"
  },
  {
    title: "AI-Powered",
    description: "Insights",
    icon: "/assets/05-location-inteligence/Vector (1).svg"
  }
];

const cards = [
  {
    id: "01",
    title: "Real reach - not radius",
    description: "Walk and drive zones that follow actual roads, not perfect circles. Dead ends, one-ways, and missing links included - so you see what's truly reachable in 5, 10, or 15 minutes.",
    image: "/assets/05-location-inteligence/cards/Road-Following Walk & Drive Zones 1 (1).png",
    bg:"bg-[#67C7AD]"
  },
  {
    id: "02",
    title: "Green cover, verified from space",
    description: "A satellite-based vegetation map that reveals actual tree cover - not brochure promises. See where greenery truly exists, and where it doesn't.",
    image: "/assets/05-location-inteligence/cards/Road-Following Walk & Drive Zones 1 (2).png",
    bg:"bg-[#FFE6AB]",
    
  },
  {
    id: "03",
    title: "Flood risk - before it finds you",
    description: "Elevation and water-index data combined into a clear flood risk map. Identify low-lying zones and historically waterlogged areas before you commit.",
    image: "/assets/05-location-inteligence/cards/Road-Following Walk & Drive Zones 1 (3).png",
    bg:"bg-[#FF867D]"
  },
  {
    id: "04",
    title: "Experience your commute — before you live it",
    description: "Preview your actual daily route through real street-level views - traffic, signals, and all. No stitched maps, just what your mornings will look like.",
    image: "/assets/05-location-inteligence/cards/Road-Following Walk & Drive Zones 1.png",
    bg:"bg-[#E84A5F]",
    textColor: "text-white"
  },
  {
    id: "05",
    title: "Real commute times that actually hold up",
    description: "Peak-hour travel times to the places that matter - airport, work hubs, stations - based on live traffic, not optimistic estimates.",
    image: "/assets/05-location-inteligence/cards/Road-Following Walk & Drive Zones 1 (4).png",
    bg:"bg-[#FC6D95]",
   
  }
];

export const SectionFive = () => {
  return (
    <BaseStepSection
      step={5}
      number="05"
      title={<>Project & Tower <br/>Intelligence</>}
      description="Big decisions need the full picture."
      sidebarImage="/assets/05-location-inteligence/right-image.png"
      cards={cards}
      features={features}
      spacing={32}
    />
  );
};
