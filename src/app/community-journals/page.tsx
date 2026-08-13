import type { Metadata } from "next";
import { CommunityJournalsClient } from "./CommunityJournalsClient";
import journals from "@/data/community-journals.json";

export const metadata: Metadata = {
  title: "Community Journals",
  description: "Explore real home-buying journeys from the Gruha.ai community in Bengaluru.",
  alternates: {
    canonical: "/community-journals",
  },
};

export default function CommunityJournalsPage() {
  return <CommunityJournalsClient journals={journals} />;
}
