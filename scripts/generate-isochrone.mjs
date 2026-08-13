#!/usr/bin/env node
/**
 * generate-isochrone.mjs
 * -----------------------------------------------------------------------------
 * One tool for every drive-time "isochrone" polygon in the community journals.
 * An isochrone answers "how far can I drive on real roads from this pin in N
 * minutes?" and is the boundary drawn around each `exploredAreas` entry on the
 * Search map. It is a *different* data source from Nominatim admin boundaries:
 * the polygon is built AROUND the pin, so every journal pin is guaranteed to
 * lie inside its own region.
 *
 * Two commands, plus a check:
 *
 *   Single area   node scripts/generate-isochrone.mjs --name "Whitefield" \
 *                   --lat 12.97148 --lon 77.737086 --time 20 --denoise 0.1 \
 *                   --generalize 150 --out src/data/polygonPoints/polygonPointsWhitefield.ts \
 *                   --overwrite
 *   Regenerate all areas with the standard smoothing settings:
 *                   node scripts/generate-isochrone.mjs --batch
 *                     [--dry-run] [--time 25] [--generalize 200] [--denoise 0.2]
 *                     [--escalate | --no-escalate] [--max-time 90]
 *   Sanity-check every wired polygon (ring closed + pin inside + ≥3 points):
 *                   node scripts/generate-isochrone.mjs --verify
 *
 * Options (single-area mode)
 *   --name        Location name for file + export name (required).
 *   --lat  --lon  Drive origin coordinate (required).
 *   --time        Reachability in minutes, default 15 (Valhalla allows 5..120).
 *   --costing     "auto" (driving, default), "bus", "bicycle", "pedestrian",
 *                 "auto_shorter", "motorcycle".
 *   --precision   Decimal places to round lat/lng, default 6 (valhalla output is
 *                 dense; 6 keeps the file readable while staying accurate).
 *   --denoise     Simplifies tiny inlets/outliers, 0..1, default 0.3.
 *   --generalize  Smooths the contour outline by removing collinear/jagged
 *                 street-snapping vertices (meters). Optional; when 0/omitted,
 *                 no generalize is sent and the raw contour is kept. Larger
 *                 values = coarser, smoother shape. Tested at 150 on the demo
 *                 server: drops dense street-snap corners without shifting the
 *                 region's bounding box or excluding the origin pin.
 *   --out         Output path override.
 *   --overwrite   Allow overwriting an existing output file.
 *
 * Standard smoothing combo (used by --batch and the README)
 *   --time 20 --denoise 0.1 --generalize 150
 *
 * Auto-escalation
 *   By default the tool grows the reach time (5 -> 8 -> 10 -> 12 -> 15 -> 20 ->
 *   30 -> 40 -> 60 -> 90 min, capped by --max-time) until the origin pin falls
 *   INSIDE the isochrone, outputting the smallest qualifying reach and recording
 *   it in the file header. Starting low lets naturally small / adjacent
 *   micro-markets (e.g. South Bengaluru: JP Nagar / Jayanagar / Banashankari)
 *   land on a tight, non-overlapping shape. It also captures sparse-road pins
 *   that a single short run would miss (formerly a "known exception" for
 *   devanahalliPlottedArc). Because batch mode defaults to --time 20, batch runs
 *   still step up from 20.
 *     --escalate | --no-escalate   toggle auto-escalation (default ON)
 *     --max-time <N>               hard cap in minutes (default 90; 120 fails)
 *   With --no-escalate, a pin-outside run throws instead of writing a bad file.
 *
 * Data source
 *   The Valhalla routing engine's public demo server:
 *     https://valhalla1.openstreetmap.de
 *   It is free, requires no API key, and returns a GeoJSON Polygon whose
 *   coordinates are [longitude, latitude]. This script swaps them to [lat, lng]
 *   (the convention Leaflet's <Polygon positions> expects) and writes a closed
 *   ring, rounded to `--precision` decimal places.
 *
 * Notes
 *   - The public demo server is community-run and rate-limited — keep usage
 *     light and polite (a full --batch sweep is ~17 requests). For
 *     production/high-volume, run your own Valhalla/OSRM instance and swap
 *     VALHALLA_BASE below.
 *   - Points live in TS files only; journal JSONs reference them by a key derived
 *     from the area's `title` (see src/data/polygonPoints/areaKey.ts) and the
 *     Registry is rebuilt into polygonData.ts (auto-generated, one entry per
 *     journal) with a frozen index.ts re-export — adding a journal never requires
 *     hand-editing code.
 * -----------------------------------------------------------------------------
 */

import { writeFile, mkdir, access, readFile, readdir, rm } from "node:fs/promises";
import { dirname, resolve, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// Shared key derivation. The browser client resolves an area's boundary via the
// same rule (src/data/polygonPoints/areaKey.ts) — keep these two in sync.
// The key is always derived from the area's `title` (real map micro-markets
// carry a `title`); no `key`/`polygonKey` field exists in the JSON. Only
// status-qualifier suffixes like "(Chosen)"/"(Flat)"/"(Plot)"/"(Top Choice)"
// are stripped; spatial parenthetical parts e.g. "(Bellandur / Ecospace)" are
// kept so the key stays faithful to the title. Entries WITHOUT a `title` (some
// journals store non-map scenario cards under `name`) are skipped entirely.
// ---------------------------------------------------------------------------
function slugAreaTitle(raw) {
  if (!raw) return "";
  return raw
    .replace(/\((Chosen|Flat|Plot|Top Choice)\)/gi, "") // status qualifiers
    .replace(/[\(\)\,\/]/g, " ") // parens, slash -> space
    .replace(/[\u2013\u2014-]/g, " ") // en/em dash + hyphen -> space
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2") // split camelCase (TechVillage)
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w, i) =>
      i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()
    )
    .join("");
}

function areaKey(area) {
  if (!area) return "";
  return slugAreaTitle(area.title || area.name);
}

/** True for a genuine map micro-market: has a `title` AND a numeric latlong. */
function isMapArea(area) {
  return !!area && !!area.title && area.latlong &&
    typeof area.latlong.lat === "number" && typeof area.latlong.lng === "number";
}

// Public, keyless Valhalla demo. Swap for your own instance in production.
const VALHALLA_BASE = "https://valhalla1.openstreetmap.de";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const JOURNAL_ROOT = join(ROOT, "src/data/journals");
const POLY_ROOT = join(ROOT, "src/data/polygonPoints");

// ---------------------------------------------------------------------------
// Dynamic discovery (replaces the old hardcoded JOURNAL_FILES / POLY_FILES lists).
// Journals and output files are resolved from the filesystem at runtime so adding
// a new journal JSON just works — no hand-edited list here.
// ---------------------------------------------------------------------------

/** All journal slugs = every *.json in src/data/journals (minus default.json). */
async function listJournalSlugs() {
  const files = (await readdir(JOURNAL_ROOT)).filter((f) => f.endsWith(".json"));
  return files
    .map((f) => f.replace(/\.json$/, ""))
    .filter((s) => s !== "default")
    .sort();
}

/**
 * Resolve the polygon TS file for a key: reuse an existing file that already
 * exports `export const <key>IsochronePoints`, otherwise derive a stable new
 * filename from the key. Returns the absolute path.
 */
async function resolvePolyFile(key) {
  const files = (await readdir(POLY_ROOT))
    .filter((f) => f.endsWith(".ts") && f !== "index.ts" && f !== "areaKey.ts" && f !== "polygonData.ts")
    .sort();
  for (const f of files) {
    const src = await readFile(join(POLY_ROOT, f), "utf8");
    if (src.includes(`export const ${key}IsochronePoints`)) {
      return join(POLY_ROOT, f);
    }
  }
  // New area with no existing file: derive a deterministic filename.
  const base = "polygon" + key.charAt(0).toUpperCase() + key.slice(1);
  return join(POLY_ROOT, `${base}.ts`);
}

// ---------------------------------------------------------------------------
// Registry auto-sync.
// src/data/polygonPoints/index.ts is a FIXED entrypoint that re-exports from
// src/data/polygonPoints/polygonData.ts. The generator writes the polygon arrays
// INLINE into polygonData.ts (no per-area imports), so adding a new journal
// changes only that one data file — index.ts never grows and nothing is hand-edited.
// (Next.js has no Vite `import.meta.glob`; inlining the arrays into a single data
// module keeps an O(1) runtime lookup with zero per-journal imports.)
// -----------------------------------------------------------------------------
const INDEX_PATH = join(POLY_ROOT, "index.ts");
const DATA_PATH = join(POLY_ROOT, "polygonData.ts");

// Matches `export const <Key>IsochronePoints = [...]`
const EXPORT_RE = /export\s+const\s+([A-Za-z_$][\w$]*IsochronePoints)\s*[:=]/;

async function collectRegistryEntries() {
  const files = (await readdir(POLY_ROOT))
    .filter((f) => f.endsWith(".ts") && f !== "index.ts" && f !== "areaKey.ts" && f !== "polygonData.ts")
    .sort();

  const entries = [];
  for (const file of files) {
    const src = await readFile(join(POLY_ROOT, file), "utf8");
    const match = src.match(EXPORT_RE);
    if (!match) {
      console.warn(`  [registry-skip] ${file}: no \`export const <key>IsochronePoints\` found`);
      continue;
    }
    const exportName = match[1];
    entries.push({
      file,
      key: exportName.replace(/IsochronePoints$/, ""),
      exportName,
      points: parsePoints(src), // inline the actual vertices into polygonData.ts
    });
  }
  return entries;
}

/** Format a [lat, lng] vertex array as compact inline TS source. */
function formatPoints(points) {
  return points.map(([lat, lng]) => `  [${lat}, ${lng}],`).join("\n");
}

/** Build polygonData.ts — the single growing data file with arrays inline. */
function buildPolygonData(entries) {
  const header = `// AUTO-GENERATED by scripts/generate-isochrone.mjs — do not edit by hand.
// Regenerate with any generate-isochrone.mjs run (single or --batch) — this file
// grows one entry per journal area. The key is derived from each journal's
// exploredAreas \`title\` (see areaKey.ts). No imports live here, so new journals
// never touch index.ts.
`;
  const body = entries
    .map((e) => `export const ${e.exportName}: Array<[number, number]> = [\n${formatPoints(e.points)}\n];`)
    .join("\n\n");
  const mapEntries = entries.map((e) => `  ${e.key}: ${e.exportName},`).join("\n");
  return `${header}${body}\n\n/** Map of every derived area key to its boundary vertices. */\nexport const POLYGON_POINTS: Record<string, Array<[number, number]>> = {\n${mapEntries}\n};\n\n/** Resolve a journal's area key to its boundary vertices, or undefined. */\nexport function getPolygonPoints(\n  key?: string | null\n): Array<[number, number]> | undefined {\n  if (!key) return undefined;\n  return POLYGON_POINTS[key];\n}\n`;
}

/** Build index.ts — the FIXED thin re-export (never grows per journal). */
function buildIndex() {
  const header = `// AUTO-GENERATED by scripts/generate-isochrone.mjs — do not edit by hand.
// Fixed forwarder: the polygon data lives in polygonData.ts (auto-generated,
// one entry per journal). This file never gains new imports when journals are
// added — it simply re-exports the entire data module.
`;
  return `${header}
export { POLYGON_POINTS, getPolygonPoints } from \"./polygonData\";\n`;
}

/** Rebuild polygonData.ts + index.ts from the polygon files in POLY_ROOT. */
async function syncPolygonRegistry(log = true) {
  const entries = await collectRegistryEntries();
  if (entries.length === 0) {
    console.warn("[registry] No polygon files found — registry left unchanged.");
    return 0;
  }
  await writeFile(DATA_PATH, buildPolygonData(entries), "utf8");
  await writeFile(INDEX_PATH, buildIndex(), "utf8");
  if (log) {
    console.log(`\n[registry] Regenerated ${DATA_PATH} and ${INDEX_PATH}`);
    for (const e of entries) {
      console.log(`  key: ${e.key.padEnd(28)} <- ${e.file}`);
    }
    console.log(`[registry] ${entries.length} areas auto-registered.`);
  }
  return entries.length;
}
// arg parsing (no deps). Shared across single / batch / verify modes.
// Boolean flags (overwrite, batch, dry-run, verify) consume no value token, so
// they must NOT advance the index. Only value-taking flags skip the next token.
// Batch mode defaults to the standard smoothing combo (time 20, generalize 150,
// denoise 0.1); single-area mode keeps the raw defaults (time 15, generalize 0,
// denoise 0.3).
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const args = {
    time: 15,
    precision: 6,
    denoise: 0.3,
    generalize: 0,
    costing: "auto",
    batch: false,
    dryRun: false,
    verify: false,
    escalate: true,
    maxTime: DEFAULT_MAX_TIME,
    timeSet: false,
    generalizeSet: false,
    denoiseSet: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (!key.startsWith("--")) continue;
    const name = key.slice(2);
    const next = argv[i + 1];

    // Value-taking flags.
    if (name === "time") { args.time = Number.parseInt(next, 10); args.timeSet = true; i++; }
    else if (name === "precision") { args.precision = Number.parseInt(next, 10); i++; }
    else if (name === "denoise") { args.denoise = Number.parseFloat(next); args.denoiseSet = true; i++; }
    else if (name === "generalize") { args.generalize = Number.parseFloat(next); args.generalizeSet = true; i++; }
    else if (name === "lat") { args.lat = Number.parseFloat(next); i++; }
    else if (name === "lon") { args.lon = Number.parseFloat(next); i++; }
    else if (name === "name") { args.name = next; i++; }
    else if (name === "costing") { args.costing = next; i++; }
    else if (name === "out") { args.out = next; i++; }
    else if (name === "max-time") { args.maxTime = Number.parseInt(next, 10); i++; }

    // Boolean flags (no value consumed).
    else if (name === "overwrite") args.overwrite = true;
    else if (name === "batch") args.batch = true;
    else if (name === "dry-run") args.dryRun = true;
    else if (name === "verify") args.verify = true;
    else if (name === "escalate") args.escalate = true;
    else if (name === "no-escalate") args.escalate = false;
  }
  return args;
}

function fail(message) {
  console.error(`\n[generate-isochrone] ERROR: ${message}\n`);
  process.exit(1);
}

// camelCase a human location name -> export suffix. e.g. "Hebbal Airport Belt" -> "hebbalAirportBelt"
function camelize(name) {
  const words = (name || "")
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) fail(`Could not derive an export name from "${name}".`);
  const head = words[0].toLowerCase();
  const rest = words
    .slice(1)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
  return head + rest;
}

// ---------------------------------------------------------------------------
// Valhalla call
// ---------------------------------------------------------------------------
async function fetchIsochrone(lat, lon, time, costing, denoise, generalize) {
  const payload = {
    locations: [{ lat, lon }],
    costing,
    contours: [{ time }],
    polygons: true, // ring polygon, not a line
    denoise,
  };
  // Optional: smooth out jagged street-snapping vertices. Only sent when a
  // positive value is provided so existing (un-generalized) runs are unchanged.
  if (generalize && generalize > 0) payload.generalize = generalize;

  const url = `${VALHALLA_BASE}/isochrone`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Valhalla responded ${res.status} ${res.statusText}.`);
  }
  const data = await res.json();

  const feature = data.features?.[0];
  if (!feature || feature.geometry?.type !== "Polygon") {
    throw new Error(
      `No Polygon geometry returned from Valhalla. ` +
        `Check the coordinate is routable (${lat}, ${lon}) and try a larger --time.`
    );
  }
  return feature.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);
}

function roundPolygon(pts, precision) {
  if (precision == null || precision < 0) return pts;
  const p = 10 ** precision;
  return pts.map(([lat, lng]) => [
    Math.round(lat * p) / p,
    Math.round(lng * p) / p,
  ]);
}

function closeRing(pts) {
  const a = pts[0];
  const b = pts[pts.length - 1];
  if (a && b && (a[0] !== b[0] || a[1] !== b[1])) pts.push([a[0], a[1]]);
  return pts;
}

// Ray-casting point-in-polygon test for a [lat, lng] vertex array.
function pointInPolygon(lat, lng, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const yi = pts[i][0], xi = pts[i][1];
    const yj = pts[j][0], xj = pts[j][1];
    const intersect =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// Default escalation ladder when --escalate is on: grow the reach time until the
// origin pin falls inside the isochrone (some sparse-road pins only get captured
// at larger times), up to --max-time. Starts LOW so naturally small / adjacent
// micro-market zones (e.g. South Bengaluru: JP Nagar / Jayanagar / Banashankari)
// land on a tight, non-overlapping region instead of jumping straight to 20. 1 min
// is pointless fine-grain, so the floor is 5. Batch default --time 20 means the
// ladder still steps up from 20 for those runs via `t >= time`.
const DEFAULT_ESCALATION_LADDER = [5, 8, 10, 12, 15, 20, 30, 40, 60, 90];
const DEFAULT_MAX_TIME = 90;

// ---------------------------------------------------------------------------
// Escalation-aware fetch: returns { pts, time } for the smallest reach time whose
// isochrone contains the origin pin. With escalate off it fetches once at `time`
// and, if the pin is outside, throws (so a pin-outside polygon is never written).
// ---------------------------------------------------------------------------
async function fetchIsochroneAuto({ lat, lon, time, costing, denoise, generalize, escalate, maxTime }) {
  const ladder = escalate ? DEFAULT_ESCALATION_LADDER : null;
  // Candidate times to try, in ascending order, deduped by stepping the ladder
  // forward from `time` (ladder times < the start are skipped).
  const candidates = [];
  if (ladder) {
    for (const t of ladder) if (t >= time) candidates.push(t);
    if (candidates.length === 0) candidates.push(time);
  } else {
    candidates.push(time);
  }

  let lastPts = null;
  let lastTime = time;
  let lastError = null;
  for (const t of candidates) {
    if (maxTime > 0 && t > maxTime) break;
    let pts;
    try {
      pts = await fetchIsochrone(lat, lon, t, costing, denoise, generalize);
    } catch (e) {
      // A no-geometry / too-small response is recoverable during escalation:
      // treat it as "this reach is too tiny around this pin", climb to the next
      // rung, and only surface it if every rung up to the cap fails too.
      lastError = e;
      lastTime = t;
      continue;
    }
    lastPts = pts;
    lastTime = t;
    lastError = null;
    if (pointInPolygon(lat, lon, pts)) {
      return { pts, time: t };
    }
    if (!escalate) {
      throw new Error(
        `isochrone at ${t} min does not contain the pin (${lat}, ${lon}) — try a larger --time or --escalate`
      );
    }
  }
  // Reached the cap without a pin-inside result. If the last attempt threw (no
  // geometry), report that; otherwise it means no shape contained the pin.
  if (lastError) {
    throw new Error(
      `${lastError.message} Could not resolve (${lat}, ${lon}) up to ${Math.min(lastTime, maxTime > 0 ? maxTime : lastTime)} min.`
    );
  }
  if (lastPts) {
    throw new Error(
      `pin (${lat}, ${lon}) not inside any isochrone up to ${Math.min(lastTime, maxTime > 0 ? maxTime : lastTime)} min`
    );
  }
  throw new Error(`no isochrone returned for (${lat}, ${lon})`);
}

// ---------------------------------------------------------------------------
// file generation
// ---------------------------------------------------------------------------
function buildTs(points, exportName, locationName, options) {
  const suffix = "IsochronePoints";
  const lines = points.map(([lat, lng]) => `  [${lat}, ${lng}],`);
  const header = [
    `// ${locationName} Drive-Time Isochrone (untrimmed reachable zone)`,
  ];
  if (options?.batch) {
    header.push(
      `// Auto-generated by scripts/generate-isochrone.mjs from Valhalla routing`,
      `//   regenerated via --batch (time=${options.time}, generalize=${options.generalize}, denoise=${options.denoise})`
    );
  } else if (options?.time != null) {
    header.push(
      `// Auto-generated by scripts/generate-isochrone.mjs from Valhalla routing`,
      `//   single-area run (time=${options.time}, generalize=${options.generalize ?? "-"}, denoise=${options.denoise ?? "-"})`
    );
  } else {
    header.push(
      `// Auto-generated by scripts/generate-isochrone.mjs from Valhalla routing`
    );
  }
  header.push(`export const ${exportName}${suffix}: Array<[number, number]> = [`);
  return header.join("\n") + "\n" + [...lines, `];`, ``].join("\n");
}

// ---------------------------------------------------------------------------
// Single-area generation
// ---------------------------------------------------------------------------
async function runSingle(args) {
  if (!args.name) fail("--name <Location Name> is required.");
  if (typeof args.lat !== "number" || typeof args.lon !== "number") {
    fail("--lat <lat> and --lon <lon> are required.");
  }
  if (args.time < 5 || args.time > 120) {
    fail("--time must be between 5 and 120 minutes.");
  }

  const exportName = camelize(args.name);
  const fileNameBase = exportName.charAt(0).toUpperCase() + exportName.slice(1);
  const outPath = args.out
    ? resolve(args.out)
    : resolve(POLY_ROOT, `polygonPoints${fileNameBase}.ts`);

  if (!args.overwrite) {
    try {
      await access(outPath);
      fail(`${outPath} already exists. Re-run with --overwrite to replace it.`);
    } catch {
      /* not existing — ok */
    }
  }

  console.log(
    `Requesting ${args.time}-min ${args.costing} isochrone from (${args.lat}, ${args.lon}) ...` +
      (args.generalize > 0 ? ` (generalize=${args.generalize})` : "") +
      (args.escalate ? " (auto-escalate)" : "")
  );
  // Escalation-aware fetch: returns the smallest reach time whose isochrone
  // contains the pin. With escalation off (default ON), a pin-outside isochrone
  // throws instead of writing a bad file.
  const { pts, time: usedTime } = await fetchIsochroneAuto({
    lat: args.lat, lon: args.lon,
    time: args.time, costing: args.costing,
    denoise: args.denoise, generalize: args.generalize,
    escalate: args.escalate, maxTime: args.maxTime,
  });
  const closedPts = closeRing(roundPolygon(pts, args.precision));

  if (closedPts.length < 3) {
    fail(`Isochrone returned too few points (${closedPts.length}).`);
  }

  const content = buildTs(closedPts, exportName, args.name, {
    batch: false,
    time: usedTime,
    generalize: args.generalize,
    denoise: args.denoise,
  });

  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, content, "utf8");

  console.log(`\nWrote ${outPath}`);
  console.log(`  export const ${exportName}IsochronePoints (${closedPts.length} points @ ${usedTime} min)\n`);
}

// ---------------------------------------------------------------------------
// Batch regeneration (all areas, standard smoothing settings)
// ---------------------------------------------------------------------------
// KEY UNIQUENESS / COLLISION HANDLING
// -----------------------------------
// Several journals can describe the SAME geographic micro-market with slightly
// different display titles that happen to slug to one derived `areaKey` (see
// areaKey.ts). Each journal still carries its OWN pin. A single drive-time
// polygon is anchored on (and only guaranteed to contain) one pin, so it
// cannot faithfully cover every journal's pin when those pins genuinely diverge.
//
// Rather than hand-maintaining a skip-list (which rots and misses new cases),
// the batch generator TESTS honesty directly: it groups areas by key, generates
// the shared polygon once (anchored at the group's first pin), and only WRITES
// it if the polygon actually contains EVERY journal's pin in that group. If any
// pin falls outside, the key is SKIPPED — no shared polygon file is written —
// and every journal in that group falls back to its own pin-centered decorative
// hexagon (see JournalSearchV0.tsx), which is always inside its own pin.
//
//   - co-located keys (e.g. Cooke Town, 0 m apart) verify true  -> one shared
//     polygon, no duplicate fetches.
//   - colliding keys (e.g. Devanahalli airport corridor, ~4.6 km apart) verify
//     false -> auto-skip, same result as the old hardcoded SKIP_ISOCHRONE_KEYS
//     but discovered from geometry, so a future journal is handled with no code.
//   - the RUNTIME map (getPolygonPoints in polygonData.ts) needs no list: it
//     finds no entry for a skipped key and falls back to the hexagon.

async function collectAreas() {
  const areas = [];
  for (const jf of await listJournalSlugs()) {
    const json = JSON.parse(await readFile(join(JOURNAL_ROOT, `${jf}.json`), "utf8"));
    const search = json.tabs?.find((t) => t.id === "search");
    for (const a of search?.exploredAreas || []) {
      // Only genuine map micro-markets (carry a `title`) become isochrones.
      // Journals that hold non-map scenario cards under `name` are skipped.
      if (!isMapArea(a)) continue;
      areas.push({
        key: areaKey(a),
        title: a.title,
        lat: a.latlong.lat,
        lng: a.latlong.lng,
        journal: jf,
      });
    }
  }
  return areas;
}

// Group collected areas by `key`, preserving first-seen order.
function groupByKey(areas) {
  const order = [];
  const groups = new Map();
  for (const a of areas) {
    if (!groups.has(a.key)) {
      groups.set(a.key, []);
      order.push(a.key);
    }
    groups.get(a.key).push(a);
  }
  return { order, groups };
}

// A shared polygon for a key is only honest if it can contain every journal pin
// that maps to that key. `ring` is the closed polygon; returns false (-> skip)
// when any pin is outside it.
function polygonCoversAllPins(ring, areas) {
  return areas.every((a) => pointInPolygon(a.lat, a.lng, ring));
}

async function runBatch(args) {
  const areas = await collectAreas();
  const { order, groups } = groupByKey(areas);
  console.log(
    `Plan: ${areas.length} areas across ${order.length} keys; regenerating with --time ${args.time} --generalize ${args.generalize} --denoise ${args.denoise}` +
      (args.dryRun ? " (DRY RUN)" : "")
  );

  const results = [];
  for (const key of order) {
    const group = groups.get(key);
    const anchor = group[0];
    // Resolve the output path dynamically: reuse the existing file whose export
    // matches this key (if any), otherwise derive a fresh filename. No POLY_FILES.
    const outPath = await resolvePolyFile(key);
    const displayFile = basename(outPath);
    // buildTs() already appends the "IsochronePoints" suffix, so pass the bare key.
    const exportName = key;

    if (args.dryRun) {
      const dup = group.length > 1 ? ` x${group.length}` : "";
      console.log(`  [dry] ${key.padEnd(26)} ${anchor.title}${dup}  -> ${displayFile}  (${anchor.lat},${anchor.lng})`);
      results.push({ ...anchor, ok: true, dryRun: true, reason: "dry run" });
      continue;
    }

    try {
      // Escalation-aware fetch: returns the smallest reach time whose isochrone
      // contains the anchor pin. With escalation on (default) sparse-road pins like
      // devanahalliPlottedArc are captured at a larger time instead of being left
      // as a known exception. Never writes a pin-outside polygon.
      const { pts: raw, time: usedTime } = await fetchIsochroneAuto({
        lat: anchor.lat, lon: anchor.lng,
        time: args.time, costing: args.costing,
        denoise: args.denoise, generalize: args.generalize,
        escalate: args.escalate, maxTime: args.maxTime,
      });
      const pts = closeRing(roundPolygon(raw, args.precision));
      if (pts.length < 3) throw new Error(`only ${pts.length} points`);

      // KEY UNIQUENESS: a shared polygon is only honest if it contains every
      // journal pin that maps to this key. If any pin falls outside, skip the key
      // (no write) so each journal keeps its own pin-centered hexagon at runtime.
      if (!polygonCoversAllPins(pts, group)) {
        // Drop any STALE file that previously registered this key. Otherwise the
        // registry rebuild (syncPolygonRegistry -> collectRegistryEntries, which
        // scans on-disk files) would re-register a polygon that only honestly
        // covers one journal's pin. Removing it lets the runtime fall back to each
        // journal's own hexagon, exactly as a never-written key would.
        try {
          await rm(outPath, { force: true });
        } catch {}
        results.push({
          key, ok: false, reason: "SKIPPED shared polygon: pins too far apart for one isochrone",
          pts: 0, group: group.length,
        });
        console.warn(`  SKIP ${key.padEnd(24)} ${displayFile}  (${group.length} journals, pins not co-coverable)`);
        continue;
      }

      const opts = { batch: true, time: usedTime, generalize: args.generalize, denoise: args.denoise };
      const label = group.length > 1 ? `${anchor.title} +${group.length - 1}` : anchor.title;
      const content = buildTs(pts, exportName, label.replace(/ (Chosen)/, ""), opts);
      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, content, "utf8");
      results.push({ ...anchor, ok: true, pts: pts.length, time: usedTime, group: group.length });
      const dup = group.length > 1 ? ` x${group.length}` : "";
      console.log(`  OK ${key.padEnd(24)} ${displayFile}${dup}  (${pts.length} pts @ ${usedTime} min)`);
    } catch (e) {
      results.push({ ...anchor, ok: false, reason: e.message });
      console.error(`  FAIL ${key.padEnd(22)} ${e.message}`);
    }
  }

  console.log("\nSummary:");
  for (const r of results) {
    if (r.ok && r.dryRun) console.log(`  ...  ${r.key.padEnd(24)} planned`);
    else console.log(`  ${r.ok ? " SAVE" : "SKIP "} ${r.key.padEnd(24)} ${r.ok ? `${r.pts} pts @ ${r.time ?? "?"} min` : r.reason}`);
  }
}

// ---------------------------------------------------------------------------
// Verification (read-only sanity check of every wired polygon)
// ---------------------------------------------------------------------------
function parsePoints(src) {
  const matches = [...src.matchAll(/\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]/g)];
  return matches.map((m) => [parseFloat(m[1]), parseFloat(m[2])]);
}

async function runVerify() {
  const results = [];
  // Keys that appear in multiple journals may be legitimately SKIPPED (no shared
  // polygon) when their pins are too far apart for one isochrone — the runtime
  // then falls back to each journal's own hexagon. Track shared keys so a missing
  // file for them is reported as an expected skip, not a hard failure.
  const sharedKeyCount = new Map();
  for (const jf of await listJournalSlugs()) {
    const json = JSON.parse(await readFile(join(JOURNAL_ROOT, `${jf}.json`), "utf8"));
    const search = json.tabs?.find((t) => t.id === "search");
    for (const a of search?.exploredAreas || []) {
      if (!isMapArea(a)) continue;
      const key = areaKey(a);
      sharedKeyCount.set(key, (sharedKeyCount.get(key) || 0) + 1);
    }
  }

  for (const jf of await listJournalSlugs()) {
    const json = JSON.parse(await readFile(join(JOURNAL_ROOT, `${jf}.json`), "utf8"));
    const search = json.tabs?.find((t) => t.id === "search");
    for (const a of search?.exploredAreas || []) {
      if (!isMapArea(a)) continue;
      const key = areaKey(a);
      const outPath = await resolvePolyFile(key);
      if (!outPath) { results.push({ key, error: "no mapped file" }); continue; }
      let src;
      try {
        src = await readFile(outPath, "utf8");
      } catch {
        // No polygon file. This is expected (PASS) only for a genuinely-shared
        // key whose pins a single isochrone can't cover; otherwise it's a failure.
        const shared = (sharedKeyCount.get(key) || 0) > 1;
        results.push({
          key,
          expectedSkip: shared,
          error: shared
            ? `shared key (${sharedKeyCount.get(key)} journals) — no polygon (pin-centered hexagon fallback)`
            : `missing file ${basename(outPath)}`,
        });
        continue;
      }
      const pts = parsePoints(src);
      const ringClosed =
        pts.length > 1 &&
        Math.abs(pts[0][0] - pts[pts.length - 1][0]) < 1e-9 &&
        Math.abs(pts[0][1] - pts[pts.length - 1][1]) < 1e-9;
      const pin = pointInPolygon(a.latlong.lat, a.latlong.lng, pts);
      // Guard: the export must be exactly `export const <key>IsochronePoints:`.
      // (Keeps the file in sync with src/data/polygonPoints/index.ts and catches
      // any accidental double-suffix / renames from past generator bugs.)
      const exportOk = new RegExp(
        `export const ${key}IsochronePoints\\s*:`
      ).test(src);
      results.push({
        key,
        pts: pts.length,
        closed: ringClosed,
        pinInside: pin,
        exportOk,
        jf,
      });
    }
  }

  console.log(`\n${results.length} areas\n`);
  let allOk = true;
  for (const r of results) {
    if (r.error) {
      if (r.expectedSkip) console.log(`  OK(↑skip)  ${r.key.padEnd(16)} ${r.error}`);
      else { allOk = false; console.log(`  !!   ${r.key.padEnd(26)} ${r.error}`); }
      continue;
    }
    const ok = r.closed && r.pinInside && r.pts >= 3 && r.exportOk;
    if (!ok) allOk = false;
    console.log(
      `${ok ? "  PASS" : "  !!  "} ${r.key.padEnd(26)} pts=${String(r.pts).padStart(3)} closed=${r.closed} pinInside=${r.pinInside} export=${r.exportOk ? "ok" : "MISMATCH"}`
    );
  }
  console.log(allOk ? "\nAll polygons valid ✓" : "\nSome polygons FAILED ⚠");
  process.exit(allOk ? 0 : 1);
}

// ---------------------------------------------------------------------------
// entry point
// ---------------------------------------------------------------------------
async function main() {
  const args = parseArgs(process.argv.slice(2));
  // Batch mode uses the standard smoothing combo unless the user overrides it.
  if (args.batch) {
    if (!args.timeSet) args.time = 20;
    if (!args.generalizeSet) args.generalize = 150;
    if (!args.denoiseSet) args.denoise = 0.1;
  }
  if (args.verify) return runVerify();

  // Single or batch generation writes polygon files. After any write we
  // rebuild src/data/polygonPoints/index.ts automatically so the map sees the
  // new/updated area without anyone hand-editing the registry.
  if (args.batch) await runBatch(args);
  else await runSingle(args);

  await syncPolygonRegistry(true);
}

main().catch((err) => {
  console.error("\n[generate-isochrone] Unhandled error:\n", err);
  process.exit(1);
});
