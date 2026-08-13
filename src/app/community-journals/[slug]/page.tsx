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
 * Derived from the community-journals manifest paths, plus every journal JSON
 * file present in src/data/journals (so journals not yet listed in the manifest
 * are still statically generated and crawlable). This gives Next the full,
 * pre-computed list of slugs instead of leaving the route dynamic.
 */
export function generateStaticParams(): { slug: string }[] {
  const manifestSlugs = (journals as Array<{ path?: string }>)
    .map((j) => j?.path?.split("/").pop())
    .filter(Boolean) as string[];

  let fileSlugs: string[] = manifestSlugs;
  try {
    // Runs only at build time on the server; Node fs is never bundled client-side.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require("node:fs");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require("node:path");
    const dir = path.join(process.cwd(), "src/data/journals");
    fileSlugs = fs
      .readdirSync(dir)
      .filter((f: string) => f.endsWith(".json") && f !== "default.json")
      .map((f: string) => f.replace(/\.json$/, ""));
  } catch {
    // Fall back to the manifest list if the filesystem is unavailable.
    fileSlugs = manifestSlugs;
  }

  const unique = Array.from(new Set([...fileSlugs, ...manifestSlugs]));
  return unique.map((slug) => ({ slug }));
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
    imagePosition: (journalData.article as any)?.imagePosition || listing?.imagePosition,
  } as Record<string, any>;

  const title = article.title as string;
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
              description={description}
              readTime={article.readTime}
              updatedOn={article.updatedOn}
              learnings={article.learnings}
              heroImage={article.heroImage || article.image}
              imagePosition={article.imagePosition}
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
