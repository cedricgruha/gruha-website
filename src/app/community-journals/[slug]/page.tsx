import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { JournalHeroV0 } from "./_components/JournalHeroV0";
import { JournalTabsSectionV0 } from "./_components/JournalTabsSectionV0";
import { JournalSidebarCtaCardV0 } from "./_components/JournalSidebarCtaCardV0";
import { getJournalBySlug } from "@/lib/journal";
import { FooterVariant } from "@/components/layout/FooterVariant";

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

    const article = {
        ...journalData.article,
        learnings: (journalData.article?.learnings || []).map((item: any) => ({
            icon: item.icon,
            text: typeof item === "string" ? item : item.text,
        })),
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
            <main className="min-h-screen bg-[#F3F6F9] text-[#111821] antialiased relative pt-16">
                {/* -- 1. Full Screenwidth White Background Layer for Hero ------- */}
                <div className="absolute top-0 left-0 right-0 h-[560px] bg-white border-b border-slate-200 pointer-events-none z-0" />

                {/* -- 2. Page-Level 2-Column Grid (Spans Hero + Tabs) ---------- */}
                <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-10">
                    {/* Left Column: Hero Content + Tabs Sections */}
                    <div className="min-w-0">
                        <JournalHeroV0
                            title={article.title}
                            description={article.description}
                            learnings={article.learnings}
                            heroImage={(article as any)?.heroImage || (article as any)?.image}
                        />
                        <JournalTabsSectionV0
                            tabsData={journalData.tabs}
                            heroImage={(article as any)?.heroImage}
                            title={article?.title}
                        />
                    </div>

                    {/* Right Column: THE ONLY STICKY CTA CARD ON THE ENTIRE PAGE */}
                    <div className="hidden lg:block h-full pt-10">
                        <div className="sticky top-20 z-40">
                            <JournalSidebarCtaCardV0 />
                        </div>
                    </div>
                </div>
            </main>

            <FooterVariant />
        </>
    );
}
