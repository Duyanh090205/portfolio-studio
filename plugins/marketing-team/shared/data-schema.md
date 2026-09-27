# Portfolio Studio: data schema (new-brand, brand-strategist, studio)

## portfolio.js
```js
HUB.portfolio({
  "owner": "Alex",
  "brands": ["cemmy"]
});
```
When you create a brand, append its slug to `brands`.

## Slugs
The slug is lowercase ASCII from `[a-z0-9-]`:
- strip Vietnamese diacritics (đ → d, ă/â → a, …);
- turn spaces into hyphens.

For example "Bếp Nhà Mây" → `bep-nha-may`.

## brand.js (full)
```js
HUB.brand({
  "slug": "cemmy", "name": "CEMMY", "category": "Premium ice cream",
  "oneLiner": "Strawberry-and-blueberry ice cream made for sharing.", "tagline": "",
  "created": "2026-09-26", "cover": "bs-hero-product",
  "steps": {
    "brief":            { "status": "done", "updated": "2026-09-26", "note": "Brief captured." },
    "brand-strategist": { "status": "todo" },
    "social-media":     { "status": "todo" },
    "campaign":         { "status": "todo" },
    "packaging":        { "status": "todo" },
    "ooh":              { "status": "todo" },
    "proposal":         { "status": "todo" },
    "video":            { "status": "todo" },
    "ads":              { "status": "todo" },
    "report":           { "status": "todo" }
  },
  "next": { "text": "…", "say": "…" },
  "projectType": "fictional",
  "disclaimer": "",
  "existing": [], "gaps": [], "locked": [], "sources": [], "role": null, "checklist": [],
  "brief": {
    "product": "What is sold, and its key product truth",
    "audience": "A specific person: behaviour or tension, not a demographic list",
    "market": "Where the brand sells, e.g. 'US college towns' or 'Ho Chi Minh City'",
    "problem": "The audience tension or category convention the brand breaks",
    "personality": ["Playful", "Warm", "Fresh"],
    "competitors": ["Brand A", "Brand B"],
    "mustHave": "Wishes and constraints from the user",
    "assumptions": "What Claude assumed (assumed)"
  },
  "kit": { }
});
```
- Keep each `steps` entry on **one line**. A step that doesn't apply to the project type has `{ "status": "skip" }`.
- **`projectType`:** `fictional` | `concept` | `real-brand` | `cause` | `content` | `live` (see conventions → Project types).
- **Imported projects fill these fields:**
  - `existing`: strings for what the user already made, e.g. "Serum bottle render (front)";
  - `gaps`: strings for what is worth adding;
  - `locked`: strings for what must never change, e.g. "Wordmark 'The Label' in Inter Bold";
  - `sources`: `[{ "title", "url", "note" }]`;
  - `role`: `{ "mine": "…", "team": "…" }` for group work.
- **`checklist`** (for `live`): `[{ "text": "USPTO search, class 30 + 43", "url": "https://www.uspto.gov/trademarks/search", "done": false }]`.
- **`disclaimer`:** for `real-brand`, "Unsolicited concept. Not affiliated with or endorsed by <Owner>. Trademarks belong to their owners." For `cause`, "Concept extension, not commissioned by <Client>."
- `kit` is added by brand-strategist.
- Keep `directions` and brand-strategist image tasks **out** of brand.js. They live in `brand-strategist/step.js`.

## kit (written by brand-strategist)
```json
"kit": {
  "essence": { "positioning": "For …, X is the … that …, because …", "personality": ["…"], "voice": "…", "keywords": ["…"] },
  "colors": [ { "name": "Pistachio Deep", "hex": "#1F4A36", "role": "Primary", "use": "Logo, headlines" } ],
  "typography": {
    "headline": { "family": "Baloo 2", "weight": 800, "style": "normal", "why": "…" },
    "body":     { "family": "Nunito", "weight": 400, "style": "normal", "why": "…" },
    "accent":   { "family": "Caveat", "weight": 600, "style": "normal", "why": "…" }
  },
  "logo": "…", "illustration": "…",
  "photography": { "direction": "…", "lighting": "…", "do": ["…"], "dont": ["…"] },
  "graphicElements": "…", "social": "…", "packaging": "…", "applications": "…",
  "promptBlock": "60–90 words: palette by name + hex, lighting, camera, props, mood, 'clean commercial product photography, no text, no watermark, no extra logos'"
}
```
- **`colors`:** 5–6 entries. `role` is one of Primary, Secondary, Accent, Light, Dark.
- **`typography`:** Google Fonts only. `accent` is optional.

## brand-strategist/step.js
```js
HUB.step("cemmy", "brand-strategist", {
  "summary": "Why this direction answers the brief.",
  "directions": [
    { "id": "A", "name": "Berry Social Club", "idea": "One line: the audience truth it plays on",
      "colors": [ { "name": "Forest Green", "hex": "#1E4D3B" } ],
      "fonts": { "headline": "Poppins", "headlineWeight": 800, "body": "DM Sans" },
      "logo": "One line describing the mark", "mood": ["playful", "social", "fresh"] }
  ],
  "chosen": "C",
  "outputs": [],
  "images": [ { "id": "bs-hero-product", "step": "brand-strategist", "group": "Photography direction", "title": "Hero product shot",
                "ratio": "4:5", "tool": "Gemini", "refs": ["logo-primary"], "prompt": "…" } ]
});
```
- Before the user chooses, the file has `directions` but no `chosen` and no `images`.
- The HUB shows the directions as cards.

## logos.js
```js
HUB.logos("cemmy", [
  { "id": "logo-primary", "name": "Primary logo", "bg": "light", "svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180">…</svg>` },
  { "id": "pattern-stars", "name": "Star pattern", "kind": "element", "bg": "light", "svg": `<svg …>…</svg>` }
]);
```
- **`svg`** goes inside a JS template literal: never put a backtick or `${` in it.
- **Official logo files** (real brands, imported identities) use `"src": "input/logo.png"` (a path relative to the brand folder) instead of `svg`. The HUB and compose.js display the file as is. Never redraw a trademark as SVG.
- **`bg`** is `light` or `dark`.
- **`kind: "element"`** marks graphic elements. The first logo is the Main logo.

## brand.css
```css
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;800&family=Nunito:wght@400;700&family=Caveat:wght@600&display=swap');
:root {
  --primary: #1F4A36; --secondary: #FFB9CE; --accent: #C9B6F2; --accent-2: #E4568A; --light: #FFF8F3; --dark: #241B22;
  --font-headline: 'Baloo 2', sans-serif; --headline-weight: 800;
  --font-body: 'Nunito', sans-serif; --font-accent: 'Caveat', cursive;
}
```
