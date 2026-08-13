import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { JournalHeroSection } from "./_components/JournalHero";
import { JournalTabsSection } from "./_components/JournalTabsSection";
import JournalBreadCrumbs from "@/components/JournalBreadCrumbs";
import * as Icons from "lucide-react";
import journalData from "@/data/journal-data.json";
import { FooterVariant } from "@/components/layout/FooterVariant";

interface JournalSlugPageProps {
    params: Promise<{ slug: string }>;
}

// Legacy / deprecated route. It renders a single hardcoded sample (journal-data.json)
// rather than per-slug content, and is no longer linked from anywhere.
// It is intentionally excluded from indexing so Google never records it as
// duplicate/hardcoded content in place of the real /community-journals/[slug] pages.
export function generateStaticParams(): { slug: string }[] {
    return [{ slug: "sample" }];
}

export async function generateMetadata({
    params,
}: JournalSlugPageProps): Promise<Metadata> {
    const { slug } = await params;

    return {
        title: slug
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" "),
        description:
            "A real home-buying journey on Gruha.ai — budgets, fears, and futures built together.",
        alternates: {
            canonical: `/journal/${slug}`,
        },
        robots: {
            index: false,
            follow: true,
        },
    };
}

const getIcon = (name: string, props = { className: "h-5 w-5", strokeWidth: 2 }) => {
    const Icon = (Icons as any)[name] || Icons.HelpCircle;
    return <Icon {...props} />;
};

export default async function JournalSlugPage({
    params,
}: JournalSlugPageProps) {
    const { slug } = await params;

    const article = {
        ...journalData.article,
        learnings: journalData.article.learnings.map((item) => ({
            icon: getIcon(item.icon),
            text: item.text,
        })),
    };

    void slug;
    return (
        <>
            {/* <Header forceSolid /> */}
            <main className="min-h-screen bg-[#FDFAF7] pb-24">
                <JournalBreadCrumbs />
                {/* ── Section 1 — Hero ───────────────────────────────────────── */}
                <JournalHeroSection
                    tags={article.tags}
                    title={article.title}
                    description={article.description}
                    quote={article.quote}
                    readTime={article.readTime}
                    updatedOn={article.updatedOn}
                    learnings={article.learnings}
                />

                {/* ── Section 2 — Folder Tabs (Profile, Journey, Search, Projects, Learnings, Start here) ── */}
                <JournalTabsSection />
            </main>
            <FooterVariant />
        </>
    );
}
