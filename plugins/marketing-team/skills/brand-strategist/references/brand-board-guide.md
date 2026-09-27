# Brand board guide

## Strategy first
- The **positioning** is one sentence: *For [audience], [brand] is the [frame] that [benefit], because [reason to believe].* It must answer `brief.problem`.
- **Personality:** 3–4 adjectives that could guide a stranger's decisions. Avoid generic words like "quality" or "innovative".
- **Voice:** how the brand writes. Give 2 do's plus one sample line.
- **`say` / `never`:** 2–3 example lines each. `say` sounds like only this brand (for imports, the user's own lines); `never` holds what a competitor or a hype brand would write.
- **Tagline:** short and ownable, 2–4 words is ideal. It must not be a category cliché.

## Colour palette (5–6 colours)
- Use each role once or twice: Primary, Secondary, Accent, Light, Dark.
  - **Light** is the main background, e.g. a cream or tinted white.
  - **Dark** is used for text and reversed logos.
- Give each colour an evocative, product-linked name, such as "Forest Green", "Berry Crush" or "Vanilla Cream".
- `use` explains where the colour goes, e.g. "Logo, headlines", "Backgrounds, packaging base". It fits the voice: a calm brand's accent marks a detail ("Check-in highlights, QR frame"), never "promo badges".
- **Distinct:** no two entries within ΔE 15 (two near-identical creams or greens fail; vary lightness as well as hue).
- **Variants** differ in lightness as well as hue, so colour-blind viewers can tell them apart, and wherever a Variant colour appears its line name is printed too.
- **Contrast:** Dark on Light and Primary on Light must reach WCAG AA (4.5:1) for text. Accent colours are for shapes, not small text.
- The palette should look like the product world. Avoid default saturated web colours.

## Typography
- **Google Fonts only.** Canva has them too, so the user can reuse them.
- `headline`: the display face that carries personality. `body`: a highly readable companion. `accent`: optional, e.g. an italic serif for taglines.
- `weight` is a number (400/600/700/800). `style` is "normal" or "italic".
- `why` is one line citing visual evidence (width, x-height, letterforms, figures) for how the font expresses the personality. For imports it names what you matched in their material, and a changed face says "replaces <font>".
- **Avoid sameness.** For a new brand, don't default to the common set (Poppins, Montserrat, DM Sans, Inter, Outfit, Nunito) unless the brief justifies it, and never reuse another portfolio brand's headline font (conventions → Portfolio variety). Wider options: Fraunces, Young Serif, Gloock, Instrument Serif, Newsreader, DM Serif Display, Bricolage Grotesque, Schibsted Grotesk, Hanken Grotesk, Familjen Grotesk, Syne, Unbounded, Baloo 2, Righteous.

## Logos: `logos.js`
Make 5 logos in this order:

| id | name | bg | What |
|---|---|---|---|
| `logo-primary` | Primary logo | light | Symbol + wordmark, the hero lock-up |
| `logo-horizontal` | Horizontal logo | light | Symbol beside the wordmark, for narrow spaces |
| `logo-symbol` | Symbol / app icon | light | The mark alone inside a rounded square or circle in the Primary colour |
| `logo-reversed` | Reversed logo | dark | Primary lock-up in Light colours for dark backgrounds |
| `logo-mono` | One-colour logo | light | Primary lock-up in Dark only, for stamps and embossing |

Import whose product carries a wordmark: `logo-primary` (and its reversed and mono versions) is that wordmark alone; the symbol joins it only in `logo-horizontal` and `logo-symbol`.

Add 2–3 graphic elements with `"kind": "element"`:
- one that visualises the core mechanism, e.g. an honest result bar with its n= and the "no change" share, a check-in row, a label line (placeholder figures unless the user's material has them);
- a repeat pattern tile or a signature shape cut from the symbol, a letter or the pack (wave, arch, notch);
- optionally a badge that states a fact ("NEW", "Since 2026", "30 mL"). Badges never self-certify ("Verified", "Clean", "Proven").

### SVG rules (important)
- Start with `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 W H">`. Give **no width/height attributes**.
- The viewBox hugs the artwork, with about 6–10% padding on each side.
- **Wordmark:**
  - Use `<text>` with `font-family="'<Headline family>', sans-serif"` (exact Google Fonts name, **always in single quotes**, because names like `Baloo 2` are invalid CSS unquoted), `font-weight="<n>"`, `text-anchor="middle"` and an explicit `x`/`y` baseline.
  - Use `letter-spacing` where it helps.
  - Estimate the width as `characters × font-size × 0.62` for bold sans, or `× 0.55` for serif, and size the viewBox from that.
- **Symbol:** simple geometric construction from circles, rects, polygons and paths with a few curves. Compute polygon points properly. The symbol must read at 32px, so avoid hairlines under 2% of the width.
- **Symbol test** (state it in `kit.logo`): no stock UI glyph (checkbox, tick, heart, star, leaf, sparkle) unless the brand owns that meaning. Build it from something the brand owns: a letter, punctuation, the pack shape, the mechanism.
- **Colours:** only palette hex values.
- **Forbidden:** `<image>`, external links, `<foreignObject>`, filters, CSS `@import`, backticks, `${`.
- Keep each SVG under about 2.5 KB. Reuse shapes across the lock-ups so the family feels consistent.
- The wordmark text is the brand name exactly, usually uppercase or title case as the direction dictates.

## Direction paragraphs (`kit`)
Write 2–3 sentences each, concrete enough for another designer to follow:
- `illustration`: mascot concept (who it is, shape language, expression) or illustration style.
- `photography`: `direction` (subjects, composition, props, backgrounds), `lighting`, and 3 `do` and 3 `dont`.
- `graphicElements`: how shapes and patterns are used.
- `social`: grid feel, how photos, colour blocks and type combine, and the text-to-image ratio.
- `packaging`: materials, base colour, logo placement, how flavours or variants are colour-coded.
- `applications`: 3–4 touchpoints, e.g. cup, tote, storefront, uniform, delivery bag.

## promptBlock (40–70 words)
A reusable style paragraph that the HUB appends to every photo prompt of this brand. Keep it identical every time. Include:
- the palette by colour name tied to materials ("sage-green glass, oat linen"), never hex codes;
- lighting and camera style;
- surface and props vocabulary;
- mood words;
- "clean commercial product photography" or the illustration equivalent.

No negatives such as "no text": the HUB adds the branding line. Never name the brand in it.

## Image tasks: exactly 8, all with `"step": "brand-strategist"`, stored in `brand-strategist/step.js`

| id | group | ratio | refs | What |
|---|---|---|---|---|
| `bs-hero-product` | Photography direction | 4:5 | logo-primary | Hero product shot, the brand's signature image |
| `bs-product-detail` | Photography direction | 1:1 | – | Close-up of texture or ingredient |
| `bs-lifestyle` | Photography direction | 4:5 | – | A real moment of the audience using the product |
| `bs-mascot` | Mascot / illustration style | 1:1 | – | Mascot or illustration style sample on a plain background |
| `bs-social-1` | Social media visual style | 4:5 | – | A post background with a calm, empty lower area (the HTML layout adds the headline) |
| `bs-social-2` | Social media visual style | 4:5 | – | A different post type, e.g. flat lay or colour-block composition |
| `bs-packaging-family` | Packaging direction | 4:3 | logo-primary | The packaging range together, with the logo on each piece |
| `bs-brand-application` | Brand applications | 4:3 | logo-primary | Tote, bag or card with the real logo: `"tool": "Canva"` (a mockup, see conventions) |

Prompt rules:
- Follow the image-task rules in conventions: scene only, 50–90 words, colours by name, no hex, no "headline" or "text".
- **Never** ask the model to invent the logo or brand lettering. When a logo should appear:
  - put `logo-primary` in `refs`;
  - write "print the attached logo large, flat and facing the camera on the <surface>".
- Headlines are added later by the HTML layouts, so describe what fills the empty area instead, e.g. "the upper third is plain, softly lit plaster wall".
- `tool`: "Gemini" for most tasks. "ChatGPT" for `bs-hero-product` when it must reproduce a real product or a lineup. "Canva" for `bs-brand-application`.
- Lineups (`bs-packaging-family`, or any shot of different SKUs) follow the conventions' lineup rule: name each item left to right with its line, type and Variant colour, and use "ChatGPT" when the names must be legible.
- Don't repeat the promptBlock inside the prompt. The HUB adds it.
- For `bs-mascot`, set `"style": "none"` because it is an illustration. Describe the illustration style yourself.
- Never name the brand in a prompt without a logo ref. Say "an unbranded … pint".
- Composition: `bs-social-1` and `bs-social-2` are backgrounds for `l-photo` posts, so put the subject in the upper half and say what fills the calm lower 45% (e.g. "the plain face of the plinth"). Never write "headline" in the prompt.
