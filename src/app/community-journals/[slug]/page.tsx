import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { JournalHeroV0 } from "./_components/JournalHeroV0";
import { JournalTabsSectionV0 } from "./_components/JournalTabsSectionV0";
import { JournalSidebarCtaCardV0 } from "./_components/JournalSidebarCtaCardV0";
import { getJournalBySlug } from "@/lib/journal";
import { FooterVariant } from "@/components/layout/FooterVariant";
import journals from "@/data/community-journals.json";

import { MobileBottomCtaBar } from "./_components/MobileBottomCtaBar";

interface JournalSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: JournalSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const journalData = await getJournalBySlug(slug);

  if (!journalData) {
    return {
      title: "Journal Not Found",
    };
  }

  return {
    title:
      journalData.article?.title ||
      slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
    description:
      journalData.article?.description ||
      "A real home-buying journey on Gruha.ai — budgets, fears, and futures built together.",
  };
}

export default async function JournalSlugPageV0({
  params,
}: JournalSlugPageProps) {
  const { slug } = await params;
  const journalData = await getJournalBySlug(slug);

  if (!journalData) {
    notFound();
  }

  const listing = (journals as any[]).find(
    (j) => j?.path?.endsWith(slug) || j?.id?.toString() === slug
  );

  const article = {
    ...journalData.article,
    learnings: (journalData.article?.learnings || []).map((item: any) => ({
      icon: item.icon,
      text: typeof item === "string" ? item : item.text,
    })),
    imagePosition: (journalData.article as any)?.imagePosition || listing?.imagePosition,
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=Inter+Tight:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <Header forceSolid />

      {/* Main wrapper on light grey background */}
      <main className="min-h-screen bg-[#F3F6F9] text-[#111821] antialiased pt-16 pb-8 lg:pb-8">

        {/* Full-width white hero container */}
        <div className="w-full bg-white border-b border-slate-200">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
            <JournalHeroV0
              title={article.title}
              description={article.description}
              readTime={article.readTime}
              updatedOn={article.updatedOn}
              learnings={article.learnings}
              heroImage={(article as any)?.heroImage || (article as any)?.image}
              imagePosition={(article as any)?.imagePosition}
            />
          </div>
        </div>

        {/* Page Container for Sticky TabNav & Tabs Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8">
          <JournalTabsSectionV0
            tabsData={journalData.tabs}
            heroImage={(article as any)?.heroImage}
            title={article?.title}
            sidebar={<JournalSidebarCtaCardV0 />}
          />
        </div>
      </main>

      <MobileBottomCtaBar />
      <FooterVariant />
    </>
  );
}