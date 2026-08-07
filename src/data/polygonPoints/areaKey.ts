/**
 * Derive the canonical registry key for an `exploredAreas` entry from its
 * display `title` (or `name`), so nobody has to hand-write a key.
 *
 * The key is used by:
 *  - the client map  — `getPolygonPoints(areaKey(area))` looks up the boundary
 *  - the generator   — `generate-isochrone.mjs` uses the same slug to name the
 *    output TS file (`polygon<Key>.ts`) and register it in `index.ts`
 *
 * Because one slug implementation must be shared by the Node generator and the
 * browser client, this TS helper is the single source of truth. The `.mjs`
 * generator carries its own JS copy of `slugAreaTitle` (Node cannot import a
 * browser-bundled TS file) — keep the two in sync.
 *
 * Rule: strip only status-qualifier suffixes like "(Chosen)" / "(Flat)" /
 * "(Plot)" / "(Top Choice)"; spatial sub-area parts in parentheses (e.g.
 * "(Bellandur / Ecospace)") are kept so the key stays faithful to the title.
 * No `key`/`polygonKey` field exists — the key is always derived.
 */

/** Lowercase a raw title/name into a camelCase identifier. */
export function slugAreaTitle(raw?: string | null): string {
  if (!raw) return "";
  return raw
    .replace(/\((Chosen|Flat|Plot|Top Choice)\)/gi, "") // status qualifiers
    .replace(/[\(\)\,\/]/g, " ")                          // parens, slash -> space
    .replace(/[\u2013\u2014-]/g, " ")                       // en/em dash + hyphen -> space
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")                // split camelCase (TechVillage)
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w, i) =>
      i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()
    )
    .join("");
}

/** Resolve an exploredAreas entry to its canonical registry key (always derived). */
export function areaKey(area?: {
  title?: string;
  name?: string;
} | null): string {
  if (!area) return "";
  return slugAreaTitle(area.title || area.name);
}
