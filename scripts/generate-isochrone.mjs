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
 *   - Points live in TS files only; journal JSONs reference them by polygonKey
 *     via src/data/polygonPoints/index.ts.
 * -----------------------------------------------------------------------------
 */

import { writeFile, mkdir, access, readFile } from "node:fs/promises";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

// Public, keyless Valhalla demo. Swap for your own instance in production.
const VALHALLA_BASE = "https://valhalla1.openstreetmap.de";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const JOURNAL_ROOT = join(ROOT, "src/data/journals");
const POLY_ROOT = join(ROOT, "src/data/polygonPoints");

// ---------------------------------------------------------------------------
// Polygon registry wiring (polygonKey -> wired TS file). Must stay in sync with
// src/data/polygonPoints/index.ts imports.
// ---------------------------------------------------------------------------
const POLY_FILES = {
  // the-3000-miles-home-journal
  whitefield: "polygonPointsWhitefield",
  hennurRoad: "polygonPointsHennurRoad",
  hebbalAirportBelt: "polygonPointsHebbalAirportBelt",
  // the-quiet-crorepatis
  jpNagar7thPhase: "polygonQuietCrorepatisJPNagar",
  jayanagar4thBlock: "polygonQuietCrorepatisJayanagar",
  banashankari3rdStage: "polygonQuietCrorepatisBanashankari",
  // the-spreadsheet-deployer
  thanisandraMainRd: "polygonSpreadsheetThanisandra",
  hebbalCorridor: "polygonSpreadsheetHebbal",
  devanahalliPlottedArc: "polygonSpreadsheetDevanahalli", // excluded below
  // the-bhoomi-to-bengaluru-journal
  bellandurPanathur: "polygonBhoomiBellandur",
  devanahalliAirportCorridor: "polygonBhoomiDevanahalli",
  sarjapurRoad: "polygonBhoomiSarjapur",
  // the-twelve-keys-journal
  outerRingRoadBellandur: "polygonTwelveKeysOrr",
  embassyTechvillagePanathur: "polygonTwelveKeysPanathur",
  manyataTechParkCorridor: "polygonTwelveKeysManyata",
  // the-first-emi-family
  outerSarjapurRoad: "polygonEmiSarjapur",
  hosaRoad: "polygonEmiHosa",
  chandapuraAttibeleFringe: "polygonEmiChandapura",
};

// Journals that use the V0 Search tab map and carry `exploredAreas`.
const JOURNAL_FILES = [
  "the-3000-miles-home-journal",
  "the-quiet-crorepatis",
  "the-spreadsheet-deployer",
  "the-bhoomi-to-bengaluru-journal",
  "the-twelve-keys-journal",
  "the-first-emi-family",
];

// ---------------------------------------------------------------------------
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
  console.log(
    `Next: register it in src/data/polygonPoints/index.ts and point an area's ` +
      `polygonKey at the camelized export name.\n`
  );
}

// ---------------------------------------------------------------------------
// Batch regeneration (all areas, standard smoothing settings)
// ---------------------------------------------------------------------------
async function collectAreas() {
  const areas = [];
  for (const jf of JOURNAL_FILES) {
    const json = JSON.parse(await readFile(join(JOURNAL_ROOT, `${jf}.json`), "utf8"));
    const search = json.tabs?.find((t) => t.id === "search");
    for (const a of search?.exploredAreas || []) {
      if (a.polygonKey && a.latlong) {
        areas.push({ key: a.polygonKey, title: a.title, lat: a.latlong.lat, lng: a.latlong.lng, journal: jf });
      }
    }
  }
  return areas;
}

async function runBatch(args) {
  const areas = await collectAreas();
  console.log(
    `Plan: ${areas.length} areas found; regenerating with --time ${args.time} --generalize ${args.generalize} --denoise ${args.denoise}` +
      (args.dryRun ? " (DRY RUN)" : "")
  );

  const results = [];
  for (const area of areas) {
    const file = POLY_FILES[area.key];

    if (!file) {
      results.push({ ...area, ok: false, reason: "no mapped file" });
      continue;
    }

    const outPath = join(POLY_ROOT, `${file}.ts`);
    // buildTs() already appends the "IsochronePoints" suffix, so pass the bare key.
    const exportName = area.key;

    if (args.dryRun) {
      console.log(`  [dry] ${area.key.padEnd(26)} ${area.title}  -> ${file}.ts  (${area.lat},${area.lng})`);
      results.push({ ...area, ok: true, dryRun: true, reason: "dry run" });
      continue;
    }

    try {
      // Escalation-aware fetch: returns the smallest reach time whose isochrone
      // contains the pin. With escalation on (default) sparse-road pins like
      // devanahalliPlottedArc are captured at a larger time instead of being left
      // as a known exception. Never writes a pin-outside polygon.
      const { pts: raw, time: usedTime } = await fetchIsochroneAuto({
        lat: area.lat, lon: area.lng,
        time: args.time, costing: args.costing,
        denoise: args.denoise, generalize: args.generalize,
        escalate: args.escalate, maxTime: args.maxTime,
      });
      const pts = closeRing(roundPolygon(raw, args.precision));
      if (pts.length < 3) throw new Error(`only ${pts.length} points`);
      const opts = { batch: true, time: usedTime, generalize: args.generalize, denoise: args.denoise };
      const content = buildTs(pts, exportName, area.title.replace(/ \u0028Chosen\u0029/, ""), opts);
      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, content, "utf8");
      results.push({ ...area, ok: true, pts: pts.length, time: usedTime });
      console.log(`  OK ${area.key.padEnd(24)} ${file}.ts  (${pts.length} pts @ ${usedTime} min)`);
    } catch (e) {
      results.push({ ...area, ok: false, reason: e.message });
      console.error(`  FAIL ${area.key.padEnd(22)} ${e.message}`);
    }
  }

  console.log("\nSummary:");
  for (const r of results) {
    if (r.ok && r.dryRun) console.log(`  ...  ${r.key.padEnd(24)} planned`);
    else console.log(`  ${r.ok ? " SAVE" : "FAIL "} ${r.key.padEnd(24)} ${r.ok ? `${r.pts} pts @ ${r.time ?? "?"} min` : r.reason}`);
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
  for (const jf of JOURNAL_FILES) {
    const json = JSON.parse(await readFile(join(JOURNAL_ROOT, `${jf}.json`), "utf8"));
    const search = json.tabs?.find((t) => t.id === "search");
    for (const a of search?.exploredAreas || []) {
      if (!a.polygonKey || !a.latlong) continue;
      const file = POLY_FILES[a.polygonKey];
      if (!file) { results.push({ key: a.polygonKey, error: "no mapped file" }); continue; }
      const src = await readFile(join(POLY_ROOT, `${file}.ts`), "utf8");
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
        `export const ${a.polygonKey}IsochronePoints\\s*:`
      ).test(src);
      results.push({
        key: a.polygonKey,
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
    if (r.error) { allOk = false; console.log(`  !!   ${r.key.padEnd(26)} ${r.error}`); continue; }
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
  if (args.batch) return runBatch(args);
  return runSingle(args);
}

main().catch((err) => {
  console.error("\n[generate-isochrone] Unhandled error:\n", err);
  process.exit(1);
});
