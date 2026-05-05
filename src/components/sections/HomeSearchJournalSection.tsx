"use client";

import React from 'react';
import { BaseStepSection } from '../ui/BaseStepSection';

const cards = [
  {
    id: "1",
    title: "Pick the prompt that sounds like you.",
    description: "Working couple with a toddler? NRI investor? First-time buyer? Pre-built starting points fill in 80% of the obvious. You spend your time on the 20% that makes you you.",
    bg: "bg-[#EBB3F2]",
    image: "/assets/home-search-journal/home-search-journal-card-image (2).png"
  },
  {
    id: "2",
    title: "Goes deeper than BHK.",
    description: "Study, pooja, servant quarter, WFH corner, second balcony for laundry — the rooms you actually need. Capture them once and only the units that have them surface.",
    bg: "bg-[#6650F2]",
    image: "/assets/home-search-journal/home-search-journal-card-image (3).png",
    textColor: "text-white"
  },
  {
    id: "3",
    title: "The dealbreakers brochures skip",
    description: "Pets, Vaastu, vegetarian-only block, aging parents on the ground floor — the constraints that never make a listing. Tell Riya once, and every project we surface has already passed them.",
    bg: "bg-[#79D9AC]",
    image: "/assets/home-search-journal/home-search-journal-card-image (4).png"
  },
  {
    id: "4",
    title: "Sticker price isn't your budget",
    description: "Registration, GST, parking, club fees, BWSSB, BESCOM, fit-out — another 18-22% on top of the headline price. Tell us what you can actually spend; we work back to what you can actually buy.",
    bg: "bg-[#F27052]",
    textColor: "text-white",
    image: "/assets/home-search-journal/home-search-journal-card-image (1).png"
  }
];

export const HomeSearchJournalSection = () => {
  return (
    <BaseStepSection
      step={1}
      number="01"
      title={<>Home Search<br/>Journal</>}
      description={<>Tell Riya who you are.<br className="hidden md:block"/>She finds the home that fits.</>}
      sidebarImage="/assets/home-search-journal/left-side-main-character.png"
      cards={cards}
      bgClass="bg-[#f8f7f3]"
      badgeMarginTop="" // This section has different margin top for badge
      spacing={32}
    />
  );
};
