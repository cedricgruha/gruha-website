# Gruha.ai Journal JSON Generation Skill

This specification document guides AI models (ChatGPT, Claude, Gemini, Nano Banana, etc.) in parsing raw narrative home-buying content and converting it into the exact multi-tab **Gruha.ai Journal JSON format**.

---

## 🎯 Skill Purpose

Transform raw home-buying persona stories, financial metrics, trade-offs, and journey steps into a structured, validated JSON file ready to be rendered by the Gruha.ai web platform.

---

## 👤 Persona Parsing & Person Image Prompt Rule (CRITICAL)

Raw journal narratives start with a persona block header:
```text
01 MEET THE PERSONA
YOUNG PROFESSIONALS & FIRST-TIMERS
The First-EMI Family
Pavan & Shruti Kulal
```

### Extraction Protocol for `profile.buyers` Array:
1. **Identify Persons**: Read the names listed under the title (e.g., `Pavan & Shruti Kulal`). Create a buyer entry in `profile.buyers` for **EACH** person involved in the persona.
2. **Extract Attributes**: Parse `name`, `age`, `role` (profession), narrative `description` (e.g., `"A steady, practical planner who does the math twice before deciding. Stays calm under pressure and leans on logic over impulse."`), and 3 representative personality `tags` for each person.
3. **Generate Person Image & Prompt**:
   - Set `"image"` to a relative path placeholder under the journal slug folder (e.g. `"/journals/the-quiet-crorepatis/suresh.png"`).
   - Add a mandatory `"imagegenerationprompt"` key **DIRECTLY BELOW** the `"image"` key containing a detailed visual prompt for generating that specific person's portrait using AI image generators (Nano Banana, ChatGPT, DALL-E 3, Midjourney).
4. **Layout Rule for 1 Persona vs 2 Personas**:
   - If there is only **1 buyer persona**, the UI automatically renders the 1st persona card and brings the `Shared Vision` card into the 2nd slot of the top 2-column grid.
   - If there are **2 buyer personas**, both personas fill the top 2-column grid and `Shared Vision` renders full-width below.

### 📊 Profile Stats Strip Standard (STRICT 4 COLUMNS):
The `stats` array in `tabs[0]` (Profile) MUST contain **EXACTLY 4 items** with short 1-2 word values that fit cleanly on a single line:
1. `BUYER PROFILE` (icon: `"Briefcase"`, e.g. `"First-timers"`, `"Fintech Exec"`, `"Dubai Expat"`, `"Agri Business"`)
2. `LIFE STAGE` (icon: `"Heart"`, e.g. `"Newly married"`, `"Mid-career"`, `"NRI Investor"`, `"Reinvestment"`)
3. `SEARCH STAGE` (icon: `"TrendingUp"`, e.g. `"Active explorer"`, `"Shortlisting"`, `"Negotiating & Closing"`, `"Post-Booking / EOI Secured"`, `"Stuck & Deciding"`)

**`SEARCH STAGE` MUST MATCH the journal's actual ending.** Read the last `roadmapNodes` / `timelineSteps` and set the value to the buyer's *current* standing, never a stale mid-search phase. If the roadmap ends on a secured unit, capital deployed, or a post-booking ritual (e.g. `S5/S6` nodes like "Unit Secured" → "RERA Progress Ritual"), then a search-y label like `"Re-evaluating"` or `"Shortlisting"` is a contradiction — use a commitment-stage label instead (e.g. `"Post-Booking / EOI Secured"`, `"PositBooking — Slab 14/22"`, `"Possession & Moving In"`). Only use genuinely open-ended labels (`"Re-evaluating"`, `"Stuck & Deciding"`) when the journey genuinely ends unresolved. Cross-check against the `journey` tab's `JOURNEY STAGE` metric and the `timelineSteps` entry flagged `active: true` — all `Where they stand now` signals must agree.
4. `TIMELINE` (icon: `"Hourglass"`, e.g. `"Before baby"`, `"This quarter"`, `"Grade 6"`, `"8 Months"`)

```json
"stats": [
  { "icon": "Briefcase", "label": "BUYER PROFILE", "value": "First-timers" },
  { "icon": "Heart", "label": "LIFE STAGE", "value": "Newly married" },
  { "icon": "TrendingUp", "label": "SEARCH STAGE", "value": "Active explorer" },
  { "icon": "Hourglass", "label": "TIMELINE", "value": "Before baby" }
]
```

---

## 🎨 Image Generation Design & Color Theme Guideline (STRICT & MANDATORY)

All `imagegenerationprompt` fields MUST strictly adhere to the following visual aesthetic & color palette rule and **MUST BE PLACED DIRECTLY BELOW THE IMAGE URL KEY**:

### 1. Avatar & Profile Picture Style (STYLIZED VECTOR ART, NOT PHOTOREALISTIC):
- **Stylized Vector Graphic Portrait**: All persona avatars and profile pictures MUST be rendered as stylized digital vector portrait illustrations (NOT photorealistic photography or 3D plastic renders).
- **Visual Features**: Fine dark inked outlines around facial features and collar, smooth posterized cel-shading gradients, warm natural Indian skin tones, friendly open smiling expression, chest-up frontal headshot portrait.
- **Background**: Solid clean warm beige / off-white studio background (`#F4EBE1` / `#EBE3D7`).

### 2. Color Palette System for Scenes & Documents:
- **80% Greyscale Monochrome Base for Technical Diagrams/Documents**: Soft white (`#FFFFFF`), light grey (`#E6E6E6`), silver (`#C9C9C9`), charcoal (`#3A3A3A`), and matte black (`#1E1E1E`). All architecture, landscaping, background objects, furniture, shadows, and supporting elements in scene illustrations MUST be rendered in refined greyscale monochrome.
- **20% Focal Accent Color (Warm Coral `#DD5128` / `#FF8A65`)**: Reserve the **Warm Coral `#DD5128`** accent ONLY for high-value focal elements (e.g. key icons, chart trend lines, coin symbols, verified checkmarks, key UI highlights, or workflow indicators).

### 3. Required Prompt Construction Formula:

#### A. Persona Profile Picture Formula:
> **`[Subject Description]` + `[digital vector graphic portrait illustration with fine dark outlines and posterized cel-shading]` + `[warm natural skin tones, friendly smiling expression]` + `[clean solid warm beige background (#F4EBE1), high quality character art]`**

- **Example (Male Persona Avatar)**:
  `"A stylized vector graphic portrait illustration of a 41-year-old South Indian male tech executive named Nikhil with short curly black hair and a neat trim beard, wearing a dark navy button-down shirt, digital vector art style with fine dark outlines, posterized cel-shading, warm natural skin tones, friendly smiling expression, clean solid warm beige background (#F4EBE1), high quality character art."`
- **Example (Female Persona Avatar)**:
  `"A stylized vector graphic portrait illustration of a 50-year-old South Indian woman named Suma with long dark wavy hair, wearing a clean ribbed off-white sweater, digital vector art style with fine dark outlines, posterized cel-shading, warm natural skin tones, friendly smiling expression, clean solid warm beige background (#F4EBE1), high quality character art."`

#### B. Scene / Document / Architectural Diagram Formula:
> **`[Subject & Action]` + `[detailed vector graphic illustration]` + `[80% greyscale monochrome palette (#1E1E1E to #FFFFFF) with 20% Warm Coral (#DD5128) accent on focal elements]` + `[Scandinavian minimalism, Apple-inspired product aesthetics, clean white background, editorial quality]`**

### 4. Folder Path Convention:
All image relative paths in the JSON MUST be organized under the specific journal folder:
- **Folder Path**: `/journals/<journal-slug>/`
- **Person Avatars**: `/journals/<journal-slug>/<person-name>.png` (e.g. `/journals/the-quiet-crorepatis/suresh.png`)
- **Priorities**: `/journals/<journal-slug>/priority-1.png`
- **Moments**: `/journals/<journal-slug>/moment-1.png`
- **Lessons**: `/journals/<journal-slug>/lesson-1.png`
- **Projects & Locations**: `/journals/<journal-slug>/<project-slug>.png`

---

## 📸 Image Handling & Prompt Rule (GENERAL)

Whenever ANY visual asset key exists in the schema (`image`, `imageSrc`, `sharedVisionImage`, `insightImage`, `mapImageSrc`, `adviceStoryboardImage`, `blankImageSrc`, `ctaCharacterImage`, `riyaConclusionImage`):

1. **Path Assignment**: Set the image path key to a standard relative placeholder path under `/journals/<journal-slug>/` (e.g. `"/journals/the-quiet-crorepatis/priority-1.png"`).
2. **AI Image Generation Prompt Key Location**: Add an accompanying `"imagegenerationprompt"` field **DIRECTLY BELOW THE IMAGE URL KEY** in the JSON object, holding the visual prompt guidelines for AI image generators.

---

## 🗺️ EXPLORED AREAS IMAGE PROMPT RULE (CRITICAL & STRICT)

The `exploredAreas[].imagegenerationprompt` fields represent the residential character of the geographical areas explored during the home-buying journey.

These images MUST feel like a consistent visual series. They should communicate the **character of the neighborhood/residential corridor**, not a specific property listing, map, advertisement, landmark, or UI graphic.

**SCOPE OVERRIDE:** For `exploredAreas` images, this specialized photorealistic neighborhood style **OVERRIDES** the generic vector / 80%-greyscale / 3D-illustration formula defined elsewhere in the “Image Generation Design & Color Theme Guideline” section. The restricted palette rules below (Warm Coral accents, restrained tones) still apply, but the rendered look must be photorealistic editorial, not a vector/3D illustration.

### 1. Visual Style — STRICT

All `exploredAreas[].imagegenerationprompt`<span> values MUST use the same visual direction:

- Photorealistic architectural/editorial neighborhood scene.
- Natural Indian residential environment.
- Contemporary but believable Indian homes, apartments, streets, landscaping, and neighborhood context.
- Soft natural daylight with realistic shadows.
- Premium editorial real-estate photography aesthetic.
- Slightly cinematic but grounded and believable.
- Clean, calm, aspirational composition.
- No fantasy architecture.
- No exaggerated luxury.
- No futuristic buildings.
- No cartoon/vector/3D-render appearance.
- No plastic CGI appearance.
- No drone/map infographic appearance.

### 2. Color Treatment

Use a restrained, natural palette:

- Warm neutral architectural tones.
- Soft whites, concrete greys, muted greens, natural wood and stone.
- Realistic Indian daylight and vegetation.
- Avoid oversaturated colors.
- Avoid strong color grading.

Warm Coral `#DD5128` may ONLY appear as a very subtle visual accent if naturally appropriate, such as:
- a small architectural detail,
- muted garden element,
- understated door detail,
- tiny visual focal point.

DO NOT artificially add coral-colored signs, metro stations, map pins, icons, arrows, UI elements, logos, text, banners, or storefront branding.

### 3. Geographic Language (CRITICAL)

The base prompt may contain geographic terms such as `corridor`, `arc`, `belt`, `territory`, `area`, `core`, `fringe`, `ring`, or `base camp`. These describe a **geographical location / district**, and must NEVER be interpreted as an indoor hallway, passage, corridor, or interior.

For example, `Hebbal residential corridor` must visually mean “Hebbal residential district / neighborhood / township area” — NOT an interior building corridor. Always read the location name as an outdoor residential district.

### 4. Subject Selection

The prompt MUST describe the actual character of the explored area using the source narrative.

Extract visual cues from the area's:

- residential character
- housing typology
- age of buildings
- greenery
- street character
- density
- connectivity/context
- established vs emerging character
- premium vs practical character
- apartment vs independent-home mix
- relevant neighborhood atmosphere

Do NOT invent famous landmarks unless the source explicitly mentions them. Do NOT create a recognizable landmark merely because the neighborhood is known for one.

### 5. Composition

Every explored-area image should follow a consistent composition.

Because these images are rendered inside journal cards (square thumbnails on the `journal` page, and cropped wide banners on the community-journals page), the composition MUST be **square 1:1** and intentionally framed so the main subject survives cropping. Use:

- Square 1:1 editorial composition (NOT wide-only — the subject must sit comfortably in a centered square crop).
- Residential street or apartment-community perspective.
- Main architectural subject positioned around the center/right-middle of the frame.
- Clear foreground, middle ground, and background.
- Some natural landscaping in the foreground.
- Enough negative space around the architecture.
- Human presence may be included only when useful for scale, but people should remain secondary.
- No close-up portrait.
- No aerial map view.
- No text-heavy storefronts.
- No prominent vehicle branding.

The scene should look like a photograph taken while exploring the neighborhood during a property search.

### 6. Required Prompt Construction Formula

Every `exploredAreas[].imagegenerationprompt` MUST follow this structure:

> `[AREA NAME / RESIDENTIAL CHARACTER]` + `[specific housing and street characteristics derived from source]` + `[natural Indian neighborhood context]` + `[square editorial photography composition]` + `[soft natural daylight and realistic shadows]` + `[restrained warm-neutral color palette]` + `[premium but believable real-estate editorial photography]` + `[no text, logos, signs, maps or UI]`

### 7. Area-Specificity Rule

Each prompt MUST contain at least **3 visual characteristics that distinguish the area** from the other explored areas.

Do NOT simply replace the location name while keeping the rest of the prompt identical.

For example:

BAD:
`"Photorealistic residential neighborhood in JP Nagar with modern homes and greenery..."`
`"Photorealistic residential neighborhood in Jayanagar with modern homes and greenery..."`

These produce interchangeable images.

Instead:

- **JP Nagar**: established residential corridor, leafy streets, contemporary apartment communities, practical family-oriented housing, mature landscaping.
- **Jayanagar**: older established neighborhood, mature tree canopy, quieter residential streets, traditional homes mixed with apartments, more premium/heritage character.
- **Banashankari / Konanakunte**: broader suburban residential roads, newer apartment developments, mix of independent homes and larger communities, more open greenery, developing residential character.

The visual characteristics MUST come from the source narrative whenever possible.

### 8. No Text / No Graphic Elements

Every explored-area prompt MUST explicitly end with:

`"no visible text, no readable signage, no logos, no advertisements, no map graphics, no UI elements, no watermarks."`

This is mandatory because these images are used inside journal cards and should remain visually clean.

### 9. Consistency Suffix

Every explored-area prompt MUST end with the same visual consistency suffix:

`"Square editorial real-estate photograph, photorealistic architectural photography, natural Indian daylight, realistic materials and vegetation, restrained warm-neutral palette, subtle cinematic depth, premium but believable residential atmosphere, clean composition, no visible text, no readable signage, no logos, no advertisements, no map graphics, no UI elements, no watermarks."`

### 10. Examples

#### JP Nagar

`"An established leafy residential corridor in JP Nagar 7th Phase, Bengaluru, showing well-maintained contemporary apartment communities alongside mature trees, landscaped entrances, quiet paved internal streets and practical family-oriented housing, viewed from a pedestrian-height street perspective with architecture as the main subject, square editorial composition, soft morning daylight, realistic Indian vegetation and materials, calm premium residential atmosphere, subtle natural shadows, photorealistic architectural/editorial photography, restrained warm-neutral palette. Square editorial real-estate photograph, photorealistic architectural photography, natural Indian daylight, realistic materials and vegetation, restrained warm-neutral palette, subtle cinematic depth, premium but believable residential atmosphere, clean composition, no visible text, no readable signage, no logos, no advertisements, no map graphics, no UI elements, no watermarks."`

#### Jayanagar

`"An established residential street in Jayanagar 4th Block, Bengaluru, with mature tree canopy, older well-kept independent homes mixed with low-rise apartment buildings, shaded sidewalks, established gardens and a quiet premium neighborhood character, viewed from a pedestrian-height street perspective, square editorial composition with layered greenery and architecture, soft afternoon daylight, realistic Indian materials and vegetation, subtle shadows, photorealistic architectural/editorial photography, restrained warm-neutral palette. Square editorial real-estate photograph, photorealistic architectural photography, natural Indian daylight, realistic materials and vegetation, restrained warm-neutral palette, subtle cinematic depth, premium but believable residential atmosphere, clean composition, no visible text, no readable signage, no logos, no advertisements, no map graphics, no UI elements, no watermarks."`

#### Banashankari & Konanakunte

`"A residential corridor around Banashankari and Konanakunte, Bengaluru, showing a mix of newer apartment communities and independent family homes, broader paved residential roads, landscaped compounds, open pockets of greenery and a slightly more spacious suburban character, viewed from street level with the housing environment extending naturally into the background, square editorial composition, bright soft daylight, realistic Indian architecture and vegetation, calm practical residential atmosphere, photorealistic architectural/editorial photography, restrained warm-neutral palette. Square editorial real-estate photograph, photorealistic architectural photography, natural Indian daylight, realistic materials and vegetation, restrained warm-neutral palette, subtle cinematic depth, premium but believable residential atmosphere, clean composition, no visible text, no readable signage, no logos, no advertisements, no map graphics, no UI elements, no watermarks."`

---

## 🎨 Lucide Icons Rule
All `"icon"` fields MUST use valid, PascalCase [Lucide React Icon names](https://lucide.dev/icons/).
Commonly used icons in Gruha.ai journals:
`"Briefcase"`, `"TrendingUp"`, `"Heart"`, `"Sparkles"`, `"Hourglass"`, `"CheckCircle2"`, `"Search"`, `"Calendar"`, `"IndianRupee"`, `"CalendarDays"`, `"BadgeCheck"`, `"CircleDollarSign"`, `"Compass"`, `"UserPlus"`, `"FileSearch"`, `"LayoutList"`, `"Clock3"`, `"Clock4"`, `"Banknote"`, `"Car"`, `"Frown"`, `"Lightbulb"`, `"Feather"`, `"ArrowLeftRight"`, `"MessageSquare"`, `"CalendarPlus"`, `"LayoutGrid"`, `"FileCheck2"`, `"MapPin"`, `"Link2"`, `"Lock"`, `"GraduationCap"`, `"ShieldCheck"`, `"Building2"`, `"HeartHandshake"`, `"BookOpen"`, `"Smile"`, `"Triangle"`, `"Zap"`, `"PiggyBank"`, `"Home"`.

---

## 📑 Required Tab Structure & Color Styling

The JSON structure contains two top-level keys: `"article"` and `"tabs"`.
The `"tabs"` array MUST contain exactly 6 tab items with these IDs and default color styles:

1. **`id: "profile"`**
   - `bgColorHex`: `"#FCEAE2"`
   - `inactiveBgHex`: `"rgba(252, 234, 226, 0.45)"`
   - `textColor`: `"text-[#111827] font-bold"`
   - `inactiveTextColor`: `"text-gray-500 hover:text-gray-700"`
2. **`id: "journey"`**
   - `bgColorHex`: `"#E2DFFD"`
   - `inactiveBgHex`: `"rgba(226, 223, 253, 0.45)"`
   - `textColor`: `"text-[#4A438A] font-semibold"`
   - `inactiveTextColor`: `"text-gray-500 hover:text-gray-700"`
3. **`id: "search"`**
   - `bgColorHex`: `"#FCDFE3"`
   - `inactiveBgHex`: `"rgba(252, 223, 227, 0.45)"`
   - `textColor`: `"text-[#8A3243] font-semibold"`
   - `inactiveTextColor`: `"text-gray-500 hover:text-gray-700"`
4. **`id: "projects"`**
   - `bgColorHex`: `"#D0F6E3"`
   - `inactiveBgHex`: `"rgba(208, 246, 227, 0.45)"`
   - `textColor`: `"text-[#2B6A4F] font-semibold"`
   - `inactiveTextColor`: `"text-gray-500 hover:text-gray-700"`
5. **`id: "learnings"`**
   - `bgColorHex`: `"#FEF1CD"`
   - `inactiveBgHex`: `"rgba(254, 241, 205, 0.45)"`
   - `textColor`: `"text-[#7A601A] font-semibold"`
   - `inactiveTextColor`: `"text-gray-500 hover:text-gray-700"`
6. **`id: "start-here"`**
   - `bgColorHex`: `"#D0EDFE"`
   - `inactiveBgHex`: `"rgba(208, 237, 254, 0.45)"`
   - `textColor`: `"text-[#1A5B7A] font-semibold"`
   - `inactiveTextColor`: `"text-gray-500 hover:text-gray-700"`

---

## 🛠️ Step-by-Step Content Extraction Guide

When given raw narrative text:

1. **Extract Article Overview**:
   - Create 2-3 relevant tags (e.g. `["JOURNAL", "BENGALURU"]`).
   - Draft a punchy title and 1-2 sentence description.
   - Select a standout emotional quote from the narrative.
   - Summarize 3 core takeaways into `article.learnings`.

2. **Build Profile Tab (`profile`)**:
   - Parse persona headers (e.g. `YOUNG PROFESSIONALS & FIRST-TIMERS`, `Pavan & Shruti Kulal`).
   - Extract every person into `buyers` array with `name`, `age`, `role`, `tags`, `image`, and `imagegenerationprompt`.
   - Summarize shared family vision into `sharedVisionDescription` with image prompt.
   - Populate `stats` (Buyer Profile, Reality, Life Stage, Search Stage, Timeline, Focus).
   - Extract 4 main priorities into `priorities` with score labels and image prompts.

3. **Build Journey Tab (`journey`)**:
   - Populate key metrics (Journey Stage, Site Visits, Timeline, Budget Stretch).
   - Map timeline legs into `roadmapNodes` (x/y positions spread horizontally across steps).
   - Extract key pivotal moments into `moments` with image generation prompts.
   - Include quotes in `quotes` and Riya AI advisor dialogue in `chatMessages` (see the **RIYA QUOTE RULE** below).
   - Extract 5 reality check cards into `realityChecks`.

#### 🗣️ RIYA QUOTE RULE (STRICT — do not invent Riya's words)

The Journey tab renders Riya's closing takeaway (`displayRiyaQuote`) and the Riya bubble(s) in `chatMessages` from this data. Riya's dialogue in the JSON **MUST faithfully condense the actual `07 RIYA IN CONVERSATION — A VOICE SNIPPET`** block of the source document — the ``RIYA:`` speaker lines — NOT be invented, paraphrased broadly, or copied verbatim from the component's hardcoded fallback string.

Rules:
- Use the source document's real ``RIYA:`` lines as the seed. Condense them into 1–2 short Riya messages that reuse the source's distinctive wording (rules, numbers, catchphrases, e.g. Suresh's ``Rule #42``/``Strict is how you sleep, sir``, Pavan & Shruti's ``Dreams — Parked``).
- Pair each Riya message with a matching buyer/speaker message that also comes from the source snippet (Suresh/Pavan/Veena/etc.), so the exchange reads as a real back-and-forth.
- Do NOT set a `riyaConclusionTitle` in the journey tab unless the source explicitly gives the conclusion a named title — otherwise omit it and let the UI fall back to the shared default `"Riya's take on the Journey"`. (Compare: `chatMessages` may exist in every tab, but the journey-tab ``riyaConclusionTitle`` is intentionally left unset across journals for consistency.)
- Never output the component's default fallback text ("Every time I suggested a lower-priced option … searching for peace of mind") as a real Riya message — that string is only a UI fallback, not journal content.

**Anti-example (invented):** `"You weren't searching for the cheapest home or the prettiest one…"` — composed prose not present in the source snippet. **Correct example (condensed from source):** `"Sir, shall we make it a rule then? Not 'is it ready' — but 'what is the OC number, and where is my photocopy.'"`

4. **Build Search Tab (`search`)**:
   - List explored areas with project counts, site visits, and images/prompts.
   - Populate search filters (Budget, Location, Home Configuration, Builder Preference).
   - Capture advisor insight in `insightDescription`.

5. **Build Projects Tab (`projects`)**:
   - List top priorities in project evaluation.
   - Map explored projects into `projects` array.
   - Categorize reasons for rejected projects into `rejectedReasons`.
   - Summarize final recommendations in `suggestionDescription`.

6. **Build Learnings Tab (`learnings`)**:
   - Extract 4 core lessons learned into `lessons` with image prompts.
   - Create before/after mindset comparisons (`beforeItems` vs `afterItems`).
   - Extract actionable advice into `differentlyCards`.

7. **Build Start Here Tab (`start-here`)**:
   - Set a DYNAMIC, persona-specific `title` that addresses the reader through the journal's primary buyer(s) by name, in the JOURNAL'S own voice — do NOT reuse a single template. The header should feel hand-written to this persona, not cookie-cutter. Vary the pattern naturally; plausible forms include:
     - Direct question to the reader: `"Are you like Shobha?"`, `"Do you think like Anirudh?"`
     - Persona-as-mirror statement: `"This could be your second front door, too"`, `"Maybe you're a Suresh & Veena"`
     - Invitation framed by their situation: `"Trading three floors for one lighter one?"`, `"Hunting your third launch-window edge?"`
     - Second-person echo of the search: `"Your name on the deed?"`, `"One more room could change everything"`
   - **KEEP THE TITLE SHORT — medium length at most.** Aim for roughly 6–10 words or one punchy clause. Do NOT write a full sentence that restates the whole journey (e.g. `"Buying from Dubai, trusting your brother and a video call?"` is too long). Lead with the single strongest hook — the persona, the situation, or the one detail that defines them — and let everything else live in `description`. Prefer sharp fragments like `"A video call and a brother's gut"`, `"Three floors, one lighter house"`, or `"Buying from Dubai?"`. If it needs an en-dash pairing, keep both sides short. The title works best at a glance.
   - Base the PERSONA on the first buyer(s) in `profile.buyers` (first names / relationship), and let the segment, money picture, and the buyer's own words drive the phrasing. The key rule: the header must sound specific to THIS journal and read at a glance — never a generic `"What if this journal was about you?"`, and never a long sentence.
   - **Make `description` a persona-first subheadline.** The title is the short hook; the description is where you name the reader and the situation in full. Write it as ONE sentence that (a) names or echoes the primary buyer(s) by first name, (b) states their defining situation in their own voice, and (c) hands off to Riya with a concrete action. Vary the pattern; plausible forms include:
     - Direct & conversational: `"If you are like Arjun — buying from abroad and relying on family video calls — let Riya build your remote verification protocol."`
     - Story-driven: `"Follow Arjun's journey buying from abroad on family video calls, and let Riya build your remote verification protocol."`
     - Persona-focused: `"Are you like Arjun? If you're managing a Bengaluru home purchase from overseas, let Riya guide your remote verification process."`
     - Situation-first echo: `"If your search is ruled by a school bell at 8:10, let Riya build your school-radius roadmap."` (name optional when the situation is the identity)
   - The description should always end on Riya and a concrete deliverable (protocol / roadmap / system / audit), and should read differently per journal — never the same template with the project name swapped in. Ground the wording in the `profile.buyers` name(s) and their specific dilemma.
   - Provide 4 step-by-step onboarding guide items.
   - List 5 value propositions (`valueProps`).
   - Provide call-to-action details (`ctaTitle`, `ctaDescription`, `ctaButtonText`).

---

## 📋 Complete Annotated JSON Output Schema

```json
{
  "article": {
    "tags": ["INVESTORS", "BENGALURU"],
    "title": "The Quiet Crorepatis: The Safe Harbour Journal",
    "description": "The story of Suresh & Veena Kulkarni's capital-protection search in South Bengaluru — deploying ₹1.69 Cr of their ₹2.7 Cr life savings with zero loan and maximum peace of mind.",
    "quote": "\"We didn't save for thirty years to gamble now.\"",
    "readTime": "14 min read",
    "updatedOn": "Updated on July 2026",
    "learnings": [
      {
        "icon": "ShieldCheck",
        "text": "Prioritize capital safety & OC in hand over high uncertain yields"
      },
      {
        "icon": "FileCheck2",
        "text": "Verify 30-year clean title chain & RWA sinking fund health"
      },
      {
        "icon": "Smile",
        "text": "Price the sleep — buy ready assets within visible geography"
      }
    ]
  },
  "tabs": [
    {
      "id": "profile",
      "name": "Profile",
      "label": "Profile",
      "bgColorHex": "#FCEAE2",
      "inactiveBgHex": "rgba(252, 234, 226, 0.45)",
      "textColor": "text-[#111827] font-bold",
      "inactiveTextColor": "text-gray-500 hover:text-gray-700",
      "aboutLabel": "ABOUT",
      "title": "Who they are",
      "description": "Getting to know Suresh & Veena Kulkarni -- their values, their retirement corpus, and what matters most.",
      "buyers": [
        {
          "name": "Suresh",
          "age": 58,
          "role": "Retired DGM (Canara Bank)",
          "tags": ["Risk-averse", "Methodical", "Document-obsessed"],
          "image": "/journals/the-quiet-crorepatis/suresh.png",
          "imagegenerationprompt": "A studio portrait photo of a 58-year-old South Indian retired bank manager named Suresh wearing a dark charcoal shirt and spectacles in an 80% greyscale monochrome aesthetic with a subtle Warm Coral #FF8A65 lapel pin accent, Scandinavian minimalism, soft studio rim lighting, clean pearl white background."
        },
        {
          "name": "Veena",
          "age": 54,
          "role": "Former Tailoring Unit Owner",
          "tags": ["Practical", "Community-rooted", "Intuitive"],
          "image": "/journals/the-quiet-crorepatis/veena.png",
          "imagegenerationprompt": "A studio portrait photo of a 54-year-old South Indian woman named Veena wearing an elegant charcoal saree with a subtle Warm Coral #FF8A65 border accent, 80% greyscale monochrome aesthetic, Scandinavian minimalism, soft studio rim lighting, clean pearl white background."
        }
      ],
      "sharedVisionTitle": "Shared vision",
      "sharedVisionDescription": "Convert paper savings into a tangible, high-quality ready home in South Bengaluru without taking any loan, leaving ₹1 Cr untouched as an emergency cushion and ensuring complete peace of mind.",
      "sharedVisionImage": "/journals/the-quiet-crorepatis/safe-harbour-sketch.png",
      "imagegenerationprompt": "An architectural render illustration of an elegant residential apartment building in an 80% greyscale monochrome palette (#1E1E1E to #FFFFFF) with a striking Warm Coral #FF8A65 main entrance door accent, Scandinavian minimalism, soft ambient lighting, clean white background.",
      "stats": [
        {
          "icon": "Briefcase",
          "label": "BUYER PROFILE",
          "value": "Retired Professionals & Investors",
          "tag": "Age 58 & 54"
        },
        {
          "icon": "TrendingUp",
          "label": "THEIR REALITY",
          "value": "FD 6.4% → ₹1.69 Cr Brick Asset",
          "tag": "Capital Protection"
        },
        {
          "icon": "Heart",
          "label": "LIFE STAGE",
          "value": "Retirement Planning",
          "tag": "Loan-free preference"
        },
        {
          "icon": "Sparkles",
          "label": "SEARCH STAGE",
          "value": "Shortlisting Ready Stock",
          "tag": "Proof over promises"
        },
        {
          "icon": "Hourglass",
          "label": "TIMELINE",
          "value": "6–9 Months",
          "tag": "Patience is a feature"
        },
        {
          "icon": "CheckCircle2",
          "label": "TRANSACTION FOCUS",
          "value": "Ready Stock (OC Issued)",
          "tag": "Primary purchase"
        }
      ],
      "prioritiesTitle": "Top priorities right now",
      "priorities": [
        {
          "image": "/journals/the-quiet-crorepatis/priority-1.png",
          "imagegenerationprompt": "A 3D render of an occupancy certificate document in an 80% greyscale monochrome palette with a single vibrant Warm Coral #FF8A65 wax seal stamp accent, Scandinavian minimalism, Apple-inspired product aesthetics, matte finishes, soft ambient lighting, clean white background.",
          "title": "OC in hand & clean title chain",
          "scorePercentage": 100,
          "scoreLabel": "10/10",
          "description": "Photocopied OC and 30-year clean title chain before signing any paper."
        },
        {
          "image": "/journals/the-quiet-crorepatis/priority-2.png",
          "imagegenerationprompt": "A 3D render of a financial ledger notebook in an 80% greyscale monochrome palette with a Warm Coral #FF8A65 emergency fund key accent, Scandinavian minimalism, Apple-inspired product aesthetics, soft ambient lighting, clean white background.",
          "title": "Zero loan & reserve preservation",
          "scorePercentage": 95,
          "scoreLabel": "9.5/10",
          "description": "Deploying max ₹1.9 Cr, leaving ₹1 Cr untouchable emergency reserve."
        },
        {
          "image": "/journals/the-quiet-crorepatis/priority-3.png",
          "imagegenerationprompt": "An architectural vector illustration of a South Bengaluru apartment complex in an 80% greyscale monochrome palette with a Warm Coral #FF8A65 auto-rickshaw accent on the driveway, Scandinavian minimalism, soft ambient lighting, clean white background.",
          "title": "Visible geography & strong RWA",
          "scorePercentage": 90,
          "scoreLabel": "9/10",
          "description": "Located in South Bengaluru within easy reach, with audited society accounts."
        },
        {
          "image": "/journals/the-quiet-crorepatis/priority-4.png",
          "imagegenerationprompt": "A 3D vector illustration of a bedroom window in an 80% greyscale monochrome palette with a subtle Warm Coral #FF8A65 bedside lamp glow accent, Scandinavian minimalism, soft ambient lighting, clean white background.",
          "title": "Capital protection over yield",
          "scorePercentage": 85,
          "scoreLabel": "8.5/10",
          "description": "Buying sleep and capital safety rather than chasing speculative high returns."
        }
      ]
    },
    {
      "id": "journey",
      "name": "Journey",
      "label": "Journey",
      "bgColorHex": "#E2DFFD",
      "inactiveBgHex": "rgba(226, 223, 253, 0.45)",
      "textColor": "text-[#4A438A] font-semibold",
      "inactiveTextColor": "text-gray-500 hover:text-gray-700",
      "title": "How their journey actually unfolded.",
      "description": "From 6.4% FD renewal notices to strict OC photocopy rules and society audits, how Suresh & Veena secured their ideal ready home.",
      "metrics": [
        {
          "icon": "Briefcase",
          "label": "JOURNEY STAGE",
          "value": "Completed Purchase"
        },
        {
          "icon": "TrendingUp",
          "label": "FINAL PRICE",
          "value": "₹1.69 Cr All-In"
        },
        {
          "icon": "Calendar",
          "label": "TIMELINE",
          "value": "32-Day Close"
        },
        {
          "icon": "IndianRupee",
          "label": "LOAN APPETITE",
          "value": "Zero (All-Cash)"
        }
      ],
      "roadmapNodes": [
        {
          "id": "fd-renewal",
          "title": "FD Renewal Shock",
          "desc": "FD renewal at 6.4%; son's forwards; Suresh opens the 41-question ledger.",
          "icon": "CircleDollarSign",
          "x": 130,
          "y": 110,
          "width": 190
        },
        {
          "id": "jayanagar-shock",
          "title": "Jayanagar Price Shock",
          "desc": "Showflat rates at ₹15–21K/sqft recalibrate corpus expectations in a weekend.",
          "icon": "TrendingUp",
          "x": 340,
          "y": 160,
          "width": 190
        },
        {
          "id": "prestige-detour",
          "title": "Falcon City Detour",
          "desc": "Showflat ad glamour; EOI returned unsigned due to delivery risk.",
          "icon": "Compass",
          "x": 560,
          "y": 150,
          "width": 190
        },
        {
          "id": "oc-rule-born",
          "title": "Photocopied OC Rule",
          "desc": "Sarakki tower lacks OC; Suresh establishes rule #42: OC must be photocopied.",
          "icon": "FileSearch",
          "x": 740,
          "y": 130,
          "width": 190
        },
        {
          "id": "boutique-walkaway",
          "title": "Boutique Walk-Away",
          "desc": "Jayanagar 24-unit romance dies on un-audited society accounts & roof levy.",
          "icon": "BadgeCheck",
          "x": 880,
          "y": 290,
          "width": 180
        },
        {
          "id": "riya-reframe",
          "title": "Price the Sleep",
          "desc": "Riya reframes decision: 'Strict is how you sleep, sir.' Ledger gains sleep test.",
          "icon": "Lightbulb",
          "x": 710,
          "y": 400,
          "width": 190
        },
        {
          "id": "seller-theatre",
          "title": "Seller Theatre Walk-Away",
          "desc": "Walk-away #2 on twice-moving final price; brokers learn Suresh is serious.",
          "icon": "UserPlus",
          "x": 510,
          "y": 430,
          "width": 190
        },
        {
          "id": "brigade-gardenia",
          "title": "Brigade Gardenia Match",
          "desc": "Original-allottee 3BHK found in JP Nagar 7th Phase; 10-day co-nominee wobble resolved.",
          "icon": "LayoutList",
          "x": 330,
          "y": 450,
          "width": 190
        },
        {
          "id": "closing-ledger",
          "title": "Asset Transferred",
          "desc": "₹1.69 Cr paid, 32-day close; paper savings converted to brick. Sleep intact.",
          "icon": "Heart",
          "x": 530,
          "y": 740,
          "width": 190
        }
      ],
      "timelineTitle": "Where they stand today",
      "timelineSteps": [
        {
          "id": "planning",
          "label": "Planning",
          "icon": "Lightbulb"
        },
        {
          "id": "exploring",
          "label": "Exploring",
          "icon": "Feather"
        },
        {
          "id": "comparing",
          "label": "Comparing",
          "icon": "ArrowLeftRight"
        },
        {
          "id": "negotiating",
          "label": "Negotiating",
          "icon": "MessageSquare"
        },
        {
          "id": "post-booking",
          "label": "Post-booking",
          "icon": "CalendarPlus"
        },
        {
          "id": "buying",
          "label": "Buying",
          "icon": "Banknote",
          "active": true,
          "tag": "Completed"
        }
      ],
      "momentsTitle": "Moments that changed everything",
      "moments": [
        {
          "id": "ledger-opens",
          "title": "The 41-question ledger",
          "desc": "Suresh opened a fresh notebook to write down every diligence question after seeing 6.4% FD rates.",
          "imageSrc": "/journals/the-quiet-crorepatis/moment-1.png",
          "imagegenerationprompt": "A 3D vector illustration of a financial ledger in an 80% greyscale monochrome palette (#1E1E1E to #FFFFFF) with a single Warm Coral #FF8A65 bookmark accent, Scandinavian minimalism, soft ambient lighting, clean white background."
        },
        {
          "id": "oc-photocopy",
          "title": "The OC photocopy rule",
          "desc": "Rule #42 established: 'OC is a number I have photocopied. Not a sentence I have been told.'",
          "imageSrc": "/journals/the-quiet-crorepatis/moment-2.png",
          "imagegenerationprompt": "A 3D vector illustration of an Occupancy Certificate document in an 80% greyscale monochrome palette with a prominent Warm Coral #FF8A65 verified checkmark seal accent, Scandinavian minimalism, clean white background."
        },
        {
          "id": "society-accounts",
          "title": "The RWA audit walk-away",
          "desc": "Walking away from the Jayanagar boutique project after uncovering un-audited accounts and a ₹6L roof levy.",
          "imageSrc": "/journals/the-quiet-crorepatis/moment-3.png",
          "imagegenerationprompt": "A 3D vector illustration of society audit accounts in an 80% greyscale monochrome palette with a Warm Coral #FF8A65 highlighted line entry accent, Scandinavian minimalism, clean white background."
        },
        {
          "id": "closing-entry",
          "title": "Asset transferred to brick",
          "desc": "The final ledger entry at Brigade Gardenia: 'Asset transferred from paper to brick. Sleep intact.'",
          "imageSrc": "/journals/the-quiet-crorepatis/moment-4.png",
          "imagegenerationprompt": "A vector illustration of house keys on a balcony in an 80% greyscale monochrome palette with a Warm Coral #FF8A65 key ring accent, Scandinavian minimalism, soft ambient lighting, clean white background."
        }
      ],
      "voicesTitle": "Voices around them",
      "quotes": [
        {
          "text": "FD is losing to inflation, Appa.",
          "author": "— Son"
        },
        {
          "text": "Whatever we buy, I should be able to see it from an auto.",
          "author": "— Veena"
        },
        {
          "text": "OC applied, sir, any day now.",
          "author": "— Builder Sales Executive"
        },
        {
          "text": "Strict is how you sleep, sir.",
          "author": "— Riya"
        }
      ],
      "chatMessages": [
        {
          "sender": "Suresh",
          "avatar": "/journals/the-quiet-crorepatis/suresh.png",
          "text": "Thirty-four years I have heard 'any day now' — usually from borrowers. Document, illa."
        },
        {
          "sender": "Riya",
          "avatar": "/journals/avatar-riya.png",
          "text": "Sir, shall we make it a rule then? Not 'is it ready' — but 'what is the OC number, and where is my photocopy.'",
          "isRiya": true
        }
      ],
      "realityChecksTitle": "Reality checks along the way",
      "realityChecks": [
        {
          "icon": "Clock4",
          "title": "FD Rates Dropped",
          "description": "6.4% FD renewals failed to beat real inflation."
        },
        {
          "icon": "Banknote",
          "title": "Showflat Sticker Shock",
          "description": "Jayanagar rates at ₹15-21K/sqft recalibrated space expectations."
        },
        {
          "icon": "ShieldAlert",
          "title": "Uncertified Ready Stock",
          "description": "Many 'ready' buildings lacked an official Occupancy Certificate."
        },
        {
          "icon": "FileText",
          "title": "Hidden Society Arrears",
          "description": "RWA accounts unmasked future maintenance levies."
        },
        {
          "icon": "Hourglass",
          "title": "All-Cash Leverage",
          "description": "All-cash proof-of-funds secured a 32-day close on Brigade Gardenia."
        }
      ]
    },
    {
      "id": "search",
      "name": "Search",
      "label": "Search",
      "bgColorHex": "#FCDFE3",
      "inactiveBgHex": "rgba(252, 223, 227, 0.45)",
      "textColor": "text-[#8A3243] font-semibold",
      "inactiveTextColor": "text-gray-500 hover:text-gray-700",
      "tagline": "THE SEARCH",
      "title": "Where they looked and what they found.",
      "description": "Focusing exclusively on established South Bengaluru corridors with completed OC stock and clean titles.",
      "metrics": [
        {
          "icon": "Search",
          "label": "SEARCH STRATEGY",
          "value": "Capital Protection"
        },
        {
          "icon": "LayoutGrid",
          "label": "SEARCH COVERAGE",
          "value": "South Bengaluru"
        },
        {
          "icon": "ArrowLeftRight",
          "label": "COMPLETED PROJECTS",
          "value": "8 Evaluated"
        },
        {
          "icon": "FileCheck2",
          "label": "NON-NEGOTIABLES",
          "value": "Photocopied OC"
        }
      ],
      "exploredAreasTitle": "Areas they explored",
      "exploredAreas": [
        {
          "title": "JP Nagar 7th Phase (Chosen)",
          "description": "Established greenery, active RWAs, ready OC inventory within target price range.",
          "projects": 3,
          "siteVisits": 5,
          "imageSrc": "/journals/the-quiet-crorepatis/jp-nagar.png",
          "imagegenerationprompt": "A modern architectural vector render of JP Nagar 7th Phase residential corridor in an 80% greyscale monochrome palette with a Warm Coral #FF8A65 metro station sign accent, Scandinavian minimalism, soft ambient lighting, clean white background."
        },
        {
          "title": "Jayanagar 4th Block",
          "description": "Heritage neighborhood, highly familiar but premium rates ₹15-21K/sqft limited options.",
          "projects": 2,
          "siteVisits": 3,
          "imageSrc": "/journals/the-quiet-crorepatis/jayanagar.png",
          "imagegenerationprompt": "A modern architectural vector render of Jayanagar 4th Block market avenue in an 80% greyscale monochrome palette with a Warm Coral #FF8A65 coffee shop canopy accent, Scandinavian minimalism, clean white background."
        },
        {
          "title": "Banashankari & Konanakunte",
          "description": "Good connectivity, evaluated township options and boutique ready stock.",
          "projects": 3,
          "siteVisits": 4,
          "imageSrc": "/journals/the-quiet-crorepatis/banashankari.png",
          "imagegenerationprompt": "A modern architectural vector render of Banashankari neighborhood in an 80% greyscale monochrome palette with a Warm Coral #FF8A65 gateway pin accent, Scandinavian minimalism, clean white background."
        }
      ],
      "consideredAreasLabel": "Other areas considered: Rajajinagar • Sarakki • Kanakapura Road",
      "filtersTitle": "The Cost of Searching",
      "filters": [
        {
          "icon": "IndianRupee",
          "title": "Budget Limit",
          "value": "₹1.60 – ₹1.90 Cr",
          "description": "Zero loan appetite, ₹1 Cr emergency reserve preserved."
        },
        {
          "icon": "MapPin",
          "title": "Location",
          "value": "JP Nagar / Jayanagar",
          "description": "Visible from an auto, familiar South Bengaluru geography."
        },
        {
          "icon": "Calendar",
          "title": "Home Configuration",
          "value": "2.5 / 3 BHK",
          "description": "1,100–1,450 sqft"
        },
        {
          "icon": "Link2",
          "title": "Title & Compliance",
          "value": "A-Khata & Photocopied OC",
          "description": "30-year clean title chain and audited society accounts.",
          "isReraVerified": true
        }
      ],
      "filtersFooterLabel": "They were searching for capital safety and peaceful sleep, not speculative returns.",
      "insightTitle": "What I noticed while we were searching",
      "insightDescription": "“Suresh sir wasn't looking at the swimming pool or the clubhouse brochure. He was looking at the RWA sinking fund, the fire safety audit, and the photocopied OC. He wasn't buying real estate; he was buying a fortress for his life savings.”",
      "insightImage": "/journals/advisor.png",
      "imagegenerationprompt": "A digital portrait photo of Riya AI real estate guide in an 80% greyscale monochrome outfit with a Warm Coral #FF8A65 digital tablet accent, Scandinavian minimalism, soft ambient studio rim lighting, clean pearl white background."
    },
    {
      "id": "projects",
      "name": "Projects",
      "label": "Projects",
      "bgColorHex": "#D0F6E3",
      "inactiveBgHex": "rgba(208, 246, 227, 0.45)",
      "textColor": "text-[#2B6A4F] font-semibold",
      "inactiveTextColor": "text-gray-500 hover:text-gray-700",
      "tagline": "THE PROJECTS",
      "title": "Where they looked and what they found.",
      "description": "Evaluating completed projects in South Bengaluru based on legal compliance, RWA health, and seller reliability.",
      "metrics": [
        {
          "icon": "Search",
          "label": "SEARCH INTENT",
          "value": "Safe Harbour"
        },
        {
          "icon": "LayoutGrid",
          "label": "EVALUATED STOCK",
          "value": "Ready with OC"
        },
        {
          "icon": "ArrowLeftRight",
          "label": "WALK-AWAYS",
          "value": "2 Projects"
        },
        {
          "icon": "FileCheck",
          "label": "SELECTED HOME",
          "value": "Brigade Gardenia"
        }
      ],
      "prioritiesTitle": "What mattered most in their search",
      "priorities": [
        {
          "icon": "Lock",
          "title": "Photocopied OC",
          "subtitle": "in hand"
        },
        {
          "icon": "ShieldCheck",
          "title": "30-yr Title Chain",
          "subtitle": "clear & audited"
        },
        {
          "icon": "IndianRupee",
          "title": "Zero EMI",
          "subtitle": "all-cash purchase"
        },
        {
          "icon": "Building2",
          "title": "Active RWA",
          "subtitle": "& healthy sinking fund"
        },
        {
          "icon": "Hourglass",
          "title": "Ready to Move",
          "subtitle": "zero delivery delay"
        }
      ],
      "riyaConclusionTitle": "Why Riya concluded this",
      "riyaConclusionImage": "/journals/riya.png",
      "chatMessages": [
        {
          "sender": "Suresh",
          "avatar": "/journals/the-quiet-crorepatis/suresh.png",
          "text": "Strict is how you sleep, Riya. Rule 42: OC is a number I have photocopied."
        },
        {
          "sender": "Riya",
          "avatar": "/journals/avatar-riya.png",
          "text": "And that strictness is what protected your ₹1.69 Cr from delivery risks and un-audited society debt.",
          "isRiya": true
        }
      ],
      "audioLabel": "Hear entire conversation (88 sec)",
      "audioDurationLabel": "1:28",
      "whereTheySearchedTitle": "Where they searched",
      "mapImageSrc": "/journals/the-quiet-crorepatis/search-map.png",
      "mapImagePrompt": "A stylized geographic vector map of South Bengaluru in an 80% greyscale monochrome palette (#1E1E1E to #FFFFFF) with Warm Coral #FF8A65 location pin markers, Scandinavian minimalism, clean white background."
    },
    {
      "id": "learnings",
      "name": "Learnings",
      "label": "Learnings",
      "bgColorHex": "#FEF1CD",
      "inactiveBgHex": "rgba(254, 241, 205, 0.45)",
      "textColor": "text-[#7A601A] font-semibold",
      "inactiveTextColor": "text-gray-500 hover:text-gray-700",
      "tagline": "LEARNINGS",
      "title": "What this journey teaches us.",
      "description": "Key takeaways for conservative buyers deploying retirement savings into ready real estate.",
      "metrics": [
        {
          "icon": "Lightbulb",
          "label": "BIGGEST LESSON",
          "value": "Demand Photocopied OC"
        },
        {
          "icon": "HeartHandshake",
          "label": "BIGGEST PRIORITY",
          "value": "Capital Protection"
        },
        {
          "icon": "Triangle",
          "label": "BIGGEST MISTAKE",
          "value": "Chasing Launch Discount"
        },
        {
          "icon": "Zap",
          "label": "BIGGEST WIN",
          "value": "RWA Accounts Audit"
        }
      ],
      "lessonsTitle": "Lessons they learned",
      "lessons": [
        {
          "title": "Ready-to-move ≠ OC Received.",
          "description": "'Applied, sir, any day now' is not an OC. Demanding the photocopied OC number eliminated un-certified buildings instantly.",
          "imageSrc": "/journals/the-quiet-crorepatis/lesson-1.png",
          "imagegenerationprompt": "A 3D vector illustration of an Occupancy Certificate document in an 80% greyscale monochrome palette with a Warm Coral #FF8A65 official seal accent, Scandinavian minimalism, clean white background."
        },
        {
          "title": "Audit RWA accounts before buying.",
          "description": "The last 3 years of society AGM minutes unmasked sinking fund health and hidden roof repair levies.",
          "imageSrc": "/journals/the-quiet-crorepatis/lesson-2.png",
          "imagegenerationprompt": "A 3D vector illustration of an RWA financial audit page in an 80% greyscale monochrome palette with a Warm Coral #FF8A65 checkmark accent, Scandinavian minimalism, clean white background."
        },
        {
          "title": "Walk-away power sets the price.",
          "description": "Walking away twice from unreliable sellers established serious intent and secured an 8% discount on the third attempt.",
          "imageSrc": "/journals/the-quiet-crorepatis/lesson-3.png",
          "imagegenerationprompt": "A vector illustration of a handshake contract scene in an 80% greyscale monochrome palette with a Warm Coral #FF8A65 pen accent, Scandinavian minimalism, clean white background."
        },
        {
          "title": "Price the sleep, not just the yield.",
          "description": "Leaving 20% speculative appreciation on the table was worth the absolute peace of mind of a completed OC asset.",
          "imageSrc": "/journals/the-quiet-crorepatis/lesson-4.png",
          "imagegenerationprompt": "A vector illustration of a retired couple on a balcony in an 80% greyscale monochrome palette with a Warm Coral #FF8A65 coffee mug accent, Scandinavian minimalism, soft ambient lighting, clean white background."
        }
      ],
      "beforeTitle": "BEFORE",
      "beforeItems": [
        {
          "icon": "Home",
          "text": "FDs are the only safe harbour"
        },
        {
          "icon": "TrendingUp",
          "text": "Brochure promises mean completion"
        },
        {
          "icon": "LayoutGrid",
          "text": "Launch discounts save money"
        },
        {
          "icon": "LayoutList",
          "text": "Newer buildings are always better"
        }
      ],
      "afterTitle": "AFTER",
      "afterItems": [
        {
          "icon": "Home",
          "text": "Ready OC brick assets protect capital"
        },
        {
          "icon": "TrendingUp",
          "text": "Photocopied OC numbers confirm safety"
        },
        {
          "icon": "Smile",
          "text": "Zero delivery risk beats pre-launch discounts"
        },
        {
          "icon": "ArrowLeftRight",
          "text": "Audited 7-year-old RWAs offer true stability"
        }
      ],
      "differentlyTitle": "What they'd do differently",
      "differentlyCards": [
        {
          "icon": "PiggyBank",
          "title": "Start diligence earlier",
          "description": "Opening the ledger before FD renewals would have saved browsing months."
        },
        {
          "icon": "Search",
          "title": "Ask for OC on day 1",
          "description": "Demanding the photocopy on the first phone call eliminates unapproved projects."
        },
        {
          "icon": "MessageSquare",
          "title": "Inspect society AGM notes",
          "description": "RWA minutes reveal maintenance health faster than broker talk."
        },
        {
          "icon": "FileCheck2",
          "title": "Verify title chain early",
          "description": "Auditing 30-year Khata and title documents avoids closing delays."
        },
        {
          "icon": "IndianRupee",
          "title": "Compare future value",
          "description": "The cheapest option isn't always the smartest investment."
        }
      ],
      "riyaConclusionTitle": "Looking back",
      "riyaConclusionImage": "/journals/riya.png",
      "chatMessages": [
        {
          "sender": "Suresh",
          "avatar": "/journals/the-quiet-crorepatis/suresh.png",
          "text": "Asset transferred from paper to brick. Sleep intact."
        },
        {
          "sender": "Riya",
          "avatar": "/journals/avatar-riya.png",
          "text": "That is the ultimate victory for a first-generation retirement corpus.",
          "isRiya": true
        }
      ],
      "audioLabel": "Hear entire conversation (88 sec)",
      "audioDurationLabel": "1:28",
      "adviceTitle": "Advice for conservative investors",
      "adviceStoryboardImage": "/journals/journey-storyboard.png",
      "adviceStoryboardImagePrompt": "A horizontal 4-panel storyboard illustration in an 80% greyscale monochrome palette (#1E1E1E to #FFFFFF) with Warm Coral #FF8A65 focal highlights on key documents and keys, Scandinavian minimalism, clean white background.",
      "adviceDescription": "For retirees and conservative investors, confidence comes from document verification, zero debt, and physical asset visibility. Suresh and Veena proved that capital protection and peaceful sleep matter far more than speculative returns."
    },
    {
      "id": "start-here",
      "name": "Start here",
      "label": "Start here",
      "bgColorHex": "#D0EDFE",
      "inactiveBgHex": "rgba(208, 237, 254, 0.45)",
      "textColor": "text-[#1A5B7A] font-semibold",
      "inactiveTextColor": "text-gray-500 hover:text-gray-700",
      "tagline": "START HERE",
      "title": "Your name on the deed — the way Suresh & Veena did it?",
      "description": "If you have an FD corpus and want zero-loan capital safety, let Riya build your custom diligence roadmap.",
      "stepsTitle": "Your conversation becomes your journal",
      "steps": [
        {
          "id": 1,
          "title": "You",
          "description": "Share your corpus size, corridor preference, and non-negotiables.",
          "imageSrc": "/journals/the-quiet-crorepatis/step-1.png",
          "imagegenerationprompt": "A vector illustration of a homebuyer using a smartphone app in an 80% greyscale monochrome palette with a Warm Coral #FF8A65 screen button accent, Scandinavian minimalism, clean white background."
        },
        {
          "id": 2,
          "title": "Riya listens",
          "description": "Riya filters for completed projects with verified OC and audited titles.",
          "imageSrc": "/journals/the-quiet-crorepatis/step-2.png",
          "imagegenerationprompt": "A vector illustration of Riya the AI real estate guide reviewing property documents in an 80% greyscale monochrome palette with a Warm Coral #FF8A65 pen accent, Scandinavian minimalism, clean white background."
        },
        {
          "id": 3,
          "title": "Journal created",
          "description": "Your personalized safe-harbour journal is generated with legal checklists.",
          "imageSrc": "/journals/the-quiet-crorepatis/step-3.png",
          "imagegenerationprompt": "A 3D vector illustration of an open diligence journal in an 80% greyscale monochrome palette with a Warm Coral #FF8A65 bookmark ribbon accent, Scandinavian minimalism, clean white background."
        },
        {
          "id": 4,
          "title": "Clear recommendations",
          "description": "Receive verified ready-to-move suggestions matching your corpus.",
          "imageSrc": "/journals/the-quiet-crorepatis/step-4.png",
          "imagegenerationprompt": "A 3D vector illustration of verified property recommendation cards in an 80% greyscale monochrome palette with Warm Coral #FF8A65 star badge accents, Scandinavian minimalism, clean white background."
        }
      ],
      "valuePropsTitle": "What mattered most in their search",
      "valueProps": [
        {
          "id": 1,
          "title": "Photocopied OC verification",
          "description": "Verify official occupancy numbers before spending time on site visits.",
          "icon": "ShieldCheck"
        },
        {
          "id": 2,
          "title": "Zero EMI capital protection",
          "description": "Deploy liquid corpus without taking any loan or risking monthly stress.",
          "icon": "IndianRupee"
        },
        {
          "id": 3,
          "title": "RWA & Sinking fund audit",
          "description": "Review society AGM minutes and maintenance health to avoid surprise levies.",
          "icon": "BadgeCheck"
        },
        {
          "id": 4,
          "title": "30-year title chain check",
          "description": "Ensure clear legal ownership and A-Khata registration.",
          "icon": "FileCheck2"
        },
        {
          "id": 5,
          "title": "Your personal journal",
          "description": "A beautifully organized record of your search, diligence, and decisions.",
          "icon": "BookOpen"
        }
      ],
      "blankTitle": "This page is still blank.",
      "blankDescription": "Begin your conversation with Riya to build a capital-protection roadmap for your life savings.",
      "blankActionText": "Let's write it together.",
      "blankImageSrc": "/journals/the-quiet-crorepatis/open-book-illustration.png",
      "blankImagePrompt": "A 3D vector illustration of an open ruled ledger notebook in an 80% greyscale monochrome palette with a Warm Coral #FF8A65 leather bookmark accent, Scandinavian minimalism, clean white background.",
      "ctaTitle": "Ready to protect your capital?",
      "ctaDescription": "Let Riya help you evaluate ready OC properties with zero loan stress and complete peace of mind.",
      "ctaButtonText": "Copy Journal",
      "ctaCharacterImage": "/journals/the-quiet-crorepatis/riya-full-character.png",
      "ctaCharacterImagePrompt": "A full-length character illustration of Riya the AI real estate guide in an 80% greyscale monochrome suit holding a digital tablet with a Warm Coral #FF8A65 screen accent, Scandinavian minimalism, clean studio backdrop."
    }
  ]
}
