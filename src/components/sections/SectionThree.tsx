"use client";


import { BaseStepSection } from '../ui/BaseStepSection';

const features = [
  {
    icon: "/assets/home-units/icon-2.svg",
    title: "Well ventilated",
    description: "Rooms with natural light"
  },
  {
    icon: "/assets/home-units/icon-3.svg",
    title: "Efficient layouts",
    description: "No wastage of space"
  },
  {
    icon: "/assets/home-units/icon-1.svg",
    title: "Private spaces",
    description: "Balcony, utility & more"
  }
];

const cards = [
  {
    title: "Not all 1900 Sq ft flats are created equal.",
    description: "Your floor plan colour-coded into usable space, circulation, and dead space — with an efficiency score. See exactly what you're paying for, and what's eating into your carpet area.",
    image: "/assets/features/chatgpt-image-may-2,-2026,-09_44_47-am-1-1.png",
    bg:"bg-[#FB2162]",
    textColor: "text-white",
    id:"st1"
  },
  {
    title: "Vaastu-aligned? We check every room — not just the main door.",
    description: "Every unit evaluated against classical Vaastu principles — main door, kitchen, master bedroom, pooja room, toilets, and the Brahmasthan. You get a compliance score with specific passes and deviations.",
    image: "/assets/features/chatgpt-image-may-2,-2026,-09_44_47-am-1-3.png",
    bg:"bg-[#FB6660]",
    textColor: "text-white",
    id:"st5"
  },
  {
    title: "Pick your appliances. We'll show you the kitchens that actually fit them.",
    description: "Tell Gruha what goes in your kitchen — OTG, built-in oven, dishwasher, tall fridge, coffee machine, chimney size — and every unit's kitchen is scored for counter space, ventilation, plug points, and storage.",
    image: "/assets/features/chatgpt-image-may-2,-2026,-09_44_47-am-1-4.png",
    bg:"bg-[#EFD477]",
    id:"st2"
  },
  {
    title: "Overlook & Privacy Check",
    description: "Every nearby building — PGs, residential towers, offices, schools — measured against your unit's window lines. See which of your windows are overlooked, from what angle, and by what kind of building, before you commit to a flat where the curtains never come off.",
    image: "/assets/features/chatgpt-image-may-2,-2026,-09_44_47-am-1-2.png",
    bg:"bg-[#20BDA1]",
    id:"st3"
  },
  {
    title: "The NE flat and the SW flat are not the same. Nowyou'll see why.",
    description: "Direct sunlight calculated on your specific window facings, per season. Two units in the same tower can get very different sun — this is the number that tells you which is which.",
    image: "/assets/features/chatgpt-image-may-2,-2026,-09_44_47-am-1-5.png",
    bg:"bg-[#1650cb]",
    textColor: "text-white",
    id:"st4"
  }
];

export const SectionThree = () => {
  return (
    <BaseStepSection
      step={3}
      number="03"
      title={<>Home & Units</>}
      description={<>Every space tells a story. <br/>Find yours.</>}
      sidebarImage="/assets/section3.png"
      cards={cards}
      features={features}
      spacing={32}
    />
  );
};
