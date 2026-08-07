export interface JournalArticle {
  tags: string[];
  title: string;
  description: string;
  quote: string;
  readTime: string;
  updatedOn: string;
  learnings: {
    icon: string;
    text: string;
  }[];
}

export interface JournalTab {
  id: string;
  name: string;
  label: string;
  bgColorHex: string;
  inactiveBgHex: string;
  textColor: string;
  inactiveTextColor: string;
  avatar?: string;
  badgeCount?: string;
  [key: string]: any;
}

export interface JournalData {
  article: JournalArticle;
  tabs: JournalTab[];
}

/**
 * Fetches journal data based on the provided slug.
 * Loads the JSON file matching the slug (e.g. `@/data/journals/${slug}.json`).
 * Returns null if no JSON file exists for the slug, allowing 404 / Not Found handling.
 * 
 * @param slug - The journal slug identifier (e.g., 'outer-sarjapur-road')
 */
export async function getJournalBySlug(slug: string): Promise<JournalData | null> {
  if (!slug) return null;

  // Optional: API endpoint fetching template for future backend integration
  // if (process.env.NEXT_PUBLIC_API_URL) {
  //   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/journals/${slug}`, {
  //     next: { revalidate: 3600 }
  //   });
  //   if (res.ok) return res.json();
  //   return null;
  // }

  try {
    // 1. Try loading dedicated JSON file from @/data/journals/${slug}.json
    const journalModule = await import(`@/data/journals/${slug}.json`);
    return journalModule.default as JournalData;
  } catch {
    try {
      // 2. Try loading from @/data/${slug}.json
      const journalModule = await import(`@/data/${slug}.json`);
      return journalModule.default as JournalData;
    } catch {
      // No JSON file found for this slug -> return null so 404 / Not Found is triggered
      return null;
    }
  }
}
