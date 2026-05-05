"use client";

import React from 'react';
import { Coffee, ShoppingBag, Trees } from 'lucide-react';
import { BaseStepSection } from '../ui/BaseStepSection';

const features = [
  {
    title: "Cafés & Dining",
    description: "Great places to eat, relax & socialise.",
    icon: <Coffee className="w-6 h-6 text-[#FE6235]" />
  },
  {
    title: "Shopping & Essentials",
    description: "Daily needs and retail options nearby.",
    icon: <ShoppingBag className="w-6 h-6 text-[#4A90E2]" />
  },
  {
    title: "Parks & Outdoors",
    description: "Green spaces and open-air activities.",
    icon: <Trees className="w-6 h-6 text-[#3BAE8B]" />
  }
];

const cards = [
  {
    id: "01",
    title: "Your 5-minute walk zone has 8/100 green cover. Now you know.",
    description: "We map satellite vegetation to your actual walking zone, not just the project area. See the real tree cover on the streets you'll walk every evening.",
    image: "/assets/generated/noise_proximity_score.png",
    bg: "bg-[#EBB3F2]"
  },
  {
    id: "02",
    title: "What's around for the way you actually live.",
    description: "Cafés, gyms, and parks mapped by proximity and variety. Know the neighborhood's pulse at night before you commit. Tell the lively areas from the dead.",
    image: "/assets/generated/walk_zone_vegetation.png",
    bg: "bg-[#6650F2]",
    textColor: "text-white"
  },
  {
    id: "03",
    title: "How quiet is the neighbourhood at 6am, really?",
    description: "A 0–100 score based on proximity to major roads and hubs. Know if you can sleep and work without the city leaking in. Quiet on paper vs. quiet at dawn.",
    image: "/assets/generated/community_profile.png",
    bg: "bg-[#FF9F00]",
    textColor: "text-white"
  },
  {
    id: "04",
    title: "Who else lives here? A clear-eyed view, not a brochure cliché.",
    description: "Resident mix—family stage, profession, and owner ratio—drawn from local data. Decide between a young-professional hub or a settled-family enclave.",
    image: "/assets/generated/maintenance_quality.png",
    bg: "bg-[#79D9AC]"
  },
  {
    id: "05",
    title: "Will you feel like you belong here?",
    description: "We estimate the resident mix using unit types, rental patterns, and nearby employment hubs. See if you truly belong in the community.",
    image: "/assets/generated/lifestyle_amenities.png",
    bg: "bg-[#F27052]",
    textColor: "text-white"
  }
];

export const SectionSix = () => {
  return (
    <BaseStepSection
      step={6}
      number="06"
      title={<>Lifestyle Insights</>}
      description={<>Explore how a project fits into <br/>the life you want to live.</>}
      sidebarImage="/assets/section6.png"
      cards={cards}
      features={features}
      spacing={32}
    />
  );
};
