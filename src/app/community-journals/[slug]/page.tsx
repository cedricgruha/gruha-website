import type { Metadata } from "next";
import Script from "next/script";
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

const SITE_URL = "https://gruha.ai";

/**
 * Map a community-journals manifest entry to a short category badge label,
 * mirroring the logic used by the journal-listing cards so the hero badge on
 * the detail page stays consistent with what the user saw on the grid.
 */
function getCategoryBadge(listing: any): string {
  const segment = (listing?.segment || "").toLowerCase();
  const tagsStr = (listing?.tags || []).join(" ").toLowerCase();
  const id = listing?.id;

  if (segment.includes("nri") || tagsStr.includes("nri") || id === 3 || id === 18) {
    return "Premium";
  }
  if (segment.includes("investor") || tagsStr.includes("investor") || id === 1 || id === 2 || id === 5 || id === 7) {
    return "Investment";
  }
  if (
    segment.includes("young") ||
    segment.includes("first") ||
    tagsStr.includes("first-timer") ||
    id === 14 ||
    id === 15
  ) {
    return "First Home";
  }
  if (
    segment.includes("family") ||
    segment.includes("families") ||
    tagsStr.includes("multigenerational") ||
    id === 22 ||
    id === 24
  ) {
    return "Family Living";
  }
  if (segment.includes("plot") || tagsStr.includes("plot") || id === 4 || id === 9 || id === 12) {
    return "Villas";
  }
  if (
    segment.includes("primary") ||
    tagsStr.includes("under construction") ||
    id === 38 ||
    id === 39
  ) {
    return "Under Construction";
  }
  if (segment.includes("senior") || tagsStr.includes("downsizing") || id === 29 || id === 30) {
    return "Renovation";
  }

  return "Community";
}

/**
 * Derived from the community-journals manifest paths, plus any journal JSON
 * file present in src/data/journals that isn't already covered by a manifest
 * entry (so journals not yet listed in the manifest are still statically
 * generated and crawlable). This gives Next the full, pre-computed list of
 * slugs instead of leaving the route dynamic.
 *
 * The union is deduplicated on a normalized key, so a stray or half-finished
 * journal file that uses a variant of a published slug (e.g. a redundant
 * "-journal" suffix on a file whose manifest slug omits it) collapses to its
 * single published route instead of being prerendered as a second, conflicting
 * page. That keeps one malformed file in the folder from taking down the whole
 * static export inside the SSR render.
 */
export function generateStaticParams(): { slug: string }[] {
  // Normalize so "the-mud-sun-and-slab-journal" and "the-mud-sun-and-slab" are
  // recognised as the same journal, regardless of which source spelled it.
  const normalize = (s: string) => s.replace(/-journal$/, "");

  const manifestSlugs = (journals as Array<{ path?: string }>)
    .map((j) => j?.path?.split("/").pop())
    .filter(Boolean) as string[];

  let fileSlugs: string[] = [];
  try {
    // Runs only at build time on the server; Node fs is never bundled client-side.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("node:fs");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("node:path");
    const dir = path.join(process.cwd(), "src/data/journals");
    fileSlugs = fs
      .readdirSync(dir)
      .filter((f: string) => f.endsWith(".json") && f !== "default.json")
      .map((f: string) => f.replace(/\.json$/, ""));
  } catch {
    // File system unavailable: fall back to a pure manifest-driven list.
    fileSlugs = [];
  }

  // Manifest slugs always win (they are the canonical published route). File
  // slugs are only kept when no manifest slug normalises to the same journal.
  const canonical = new Map<string, string>();
  for (const slug of manifestSlugs) canonical.set(normalize(slug), slug);
  for (const slug of fileSlugs) {
    const key = normalize(slug);
    if (!canonical.has(key)) canonical.set(key, slug);
  }

  return Array.from(canonical.values()).map((slug) => ({ slug }));
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

  const article = journalData.article as any;
  const title =
    article?.title ||
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  const description =
    article?.description ||
    "A real home-buying journey on Gruha.ai — budgets, fears, and futures built together.";
  const canonical = `/community-journals/${slug}`;
  const imageUrl =
    article?.heroImage || (article as any)?.image || "/assets/og-image.jpg";

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Gruha.ai",
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_IN",
      publishedTime: article?.datePublished,
      modifiedTime: article?.dateModified,
      authors: article?.author?.name
        ? [article.author.name]
        : ["Gruha.ai Team"],
      tags: Array.isArray(article?.tags) ? article.tags : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@gruha_ai",
    },
    robots: {
      index: true,
      follow: true,
    },
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
  } as Record<string, any>;

  const title = article.title as string;
  const category = getCategoryBadge(listing);
  const description = (article.description as string) || "";
  const canonical = `${SITE_URL}/community-journals/${slug}`;
  const image =
    article.heroImage || article.image || "/assets/og-image.jpg";
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: image,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      "@type": "Person",
      name: article.author?.name || "Riya",
      url: `${SITE_URL}/community-journals`,
    },
    publisher: {
      "@type": "Organization",
      name: "Gruha.ai",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon-96x96.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    keywords: Array.isArray(article.tags) ? article.tags.join(", ") : undefined,
    inLanguage: "en-IN",
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

      {/* Structured data for the journal */}
      <Script
        id="journal-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <Header forceSolid />

      {/* Main wrapper on light grey background */}
      <main className="min-h-screen bg-[#F3F6F9] text-[#111821] antialiased pt-16 pb-8 lg:pb-8">

        {/* Full-width white hero container */}
        <div className="w-full bg-white border-b border-slate-200">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
            <JournalHeroV0
              title={title}
              journalTitle={listing?.title}
              category={category}
              description={description}
              quoteText={article.quote}
              readTime={article.readTime}
              updatedOn={article.updatedOn}
              learnings={article.learnings}
              heroImage={article.heroImage || article.image}
            />
          </div>
        </div>

        {/* Page Container for Sticky TabNav & Tabs Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8">
          <JournalTabsSectionV0
            tabsData={journalData.tabs}
            heroImage={article.heroImage}
            title={title}
            sidebar={<JournalSidebarCtaCardV0 />}
          />
        </div>
      </main>

      <MobileBottomCtaBar />
      <FooterVariant />
    </>
  );
}
