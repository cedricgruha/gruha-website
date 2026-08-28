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

export default async function CommunityJournalsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }> | { filter?: string };
}) {
  const params = await searchParams;
  const filter =
    typeof params === "object" && params !== null
      ? (params.filter as string | undefined)
      : undefined;
  return <CommunityJournalsClient journals={journals} initialFilter={filter} />;
}
