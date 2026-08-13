import type { MetadataRoute } from "next";
import journals from "@/data/community-journals.json";

const BASE_URL = "https://gruha.ai";

/**
 * Derives the full list of journal slugs from both the manifest paths and every
 * JSON file present in src/data/journals (so journals not yet listed in the
 * manifest are still crawled). Runs only at build time on the server.
 */
function getJournalSlugs(): string[] {
  const manifestSlugs = (journals as Array<{ path?: string }>)
    .map((j) => j?.path?.split("/").pop())
    .filter(Boolean) as string[];

  let fileSlugs: string[] = manifestSlugs;
  try {
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
    fileSlugs = manifestSlugs;
  }

  return Array.from(new Set([...fileSlugs, ...manifestSlugs]));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/contact", "/community-journals"];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  const journalEntries: MetadataRoute.Sitemap = getJournalSlugs().map(
    (slug) => ({
      url: `${BASE_URL}/community-journals/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    })
  );

  return [...staticEntries, ...journalEntries];
}
