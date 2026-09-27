# HTML deliverables guide (visuals and documents)

Visuals are built in HTML. This keeps brand fonts, colours and copy exact.
- Photos come from the user's image tasks; logos come from `logos.js`. `compose.js` pulls both in.
- Layouts come from the tested layout kit (`_system/layouts.css`). Headlines that don't fit are shrunk automatically.
- Remaining problems are flagged in the HUB as "⚠ Bố cục cần sửa".

## Skeleton of every visual
```html
<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>CEMMY: Launch post</title>
<link rel="stylesheet" href="../brand.css">
<link rel="stylesheet" href="../../../_system/layouts.css">
<script src="../../../_system/compose.js"></script>
</head><body>
<main class="frame" style="width:1080px;height:1350px">
  <div class="l-photo">
    <div class="photo-layer"><img data-img="sm-launch" class="photo" alt=""></div>
    <div class="scrim"></div>
    <div class="logo tl" data-logo="logo-reversed"></div>
    <span class="badge">NEW</span>
    <div class="copy"><p class="kicker">just dropped</p><h1 class="headline">Two Flavors. One Star.</h1>
      <p class="sub">Strawberry + blueberry, made to split.</p><span class="cta">Grab your half →</span></div>
  </div>
</main>
</body></html>
```
The frame's inline `width`/`height` equal the output's `size`.

## Layout kit
Pick one layout per visual and put it on the single child of `.frame`. Vary layouts across a set.

| Layout | Children | Best for |
|---|---|---|
| `l-photo` | `.photo-layer > img.photo`, `.scrim`, `.copy` (bottom; `.copy.top` moves it up) | Hero, launch, story, photo-led pieces |
| `l-split` | `.panel.t-…` (copy) + `.photo-layer`. Side by side unless the frame is taller than wide | Promo, offers |
| `l-card` + theme | `.copy` + `.photo-layer` (rounded card) | Personality, mascot, product card |
| `l-type` + theme | `.copy` (big centred headline) + `.photo-layer` (small circle) | Seasonal, quotes, announcements |
| `l-hero` + theme | `.panel` (copy) + `.photo-layer` | Key visuals, banners |
| `l-ooh` + theme | `.panel` (headline + `.logo.inline.lg`) + `.photo-layer` | Billboard, poster |

- **Themes:** `t-primary`, `t-secondary`, `t-accent`, `t-light`, `t-dark`. Put them on the layout or on a `.panel`.
- **Text:** `.kicker` (accent font, 8 words or fewer), `.headline` (plus `.xl` or `.sm`), `.sub`, `.cta`.
- **Logo:** every visual has **exactly one** logo, usually `<div class="logo tl|tr|bl|br|bc [sm|lg]" data-logo="…">`.
  - It is a **direct child of the layout element**.
  - Use `.logo.inline` inside a panel or copy, to sit in the text flow.
  - Choose `logo-horizontal` for corners, `logo-reversed` on dark or photo backgrounds, `logo-primary` on light, and `logo-symbol` for tiny corners.
- **Badge:** at most one `<span class="badge">…</span>` of **3 words or fewer**, never a hashtag sentence (add `.round` for a circle sticker, `.left` to move it left). It is a direct child of the layout, or sits inside `.photo-layer`.
- **Decoration:** at most 3 `<i class="shape star|sparkle|circle" style="top:…cqw;left:…cqw">`.
- **Custom CSS** is allowed in a small `<style>` block:
  - use `cqw`/`cqh` units;
  - use only `var(--…)` colours and fonts, and never hard-code hex values or font names;
  - never place text over `.photo-layer`, except in `l-photo`, which has a scrim.

### Photo slot ratios (set each image task's `ratio` to its slot)

| Layout | 1080×1350 | 1080×1920 | 1080×1080 | 1920×1080 · 2400×1200 |
|---|---|---|---|---|
| `l-photo` | 4:5 | 9:16 | 1:1 | 16:9 · 2:1 |
| `l-split` | 16:10 | 1:1 | 1:2 | 1:1 |
| `l-hero` | 3:2 | 1:1 | 9:16 | 1:1 |
| `l-card` | 5:4 | 4:5 | 4:3 | 1:1 |
| `l-type` | 1:1 | 1:1 | 1:1 | 1:1 |
| `l-ooh` | 5:4 (poster 1200×1800) | – | 1:2 | 1:1 |

The placeholder in each design shows the real slot size, e.g. "📷 sm-promo · 1080×675 (16:10)".

## Copy rules
- **Per visual:** one headline of **7 words or fewer**, one supporting line, at most one CTA and at most one badge, and one logo.
- For a two-sentence headline, break at the sentence boundary with `<br>`.
- **OOH:** 7 words or fewer in total.
- Everything is in English, specific to the brand, in `kit.essence.voice`. Never lorem ipsum.
- Regulatory or small print (net weight, legal) goes in `--primary` or `--dark` on a solid field.
- **Allowed scripts:**
  - `compose.js`;
  - GSAP (`https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js`) for motion;
  - Chart.js (`https://cdn.jsdelivr.net/npm/chart.js@4`) for reports.
- No external images.

## Motion (GSAP)
- Start timelines inside `document.addEventListener('compose:ready', () => { … })`. Logos and placeholders are ready by then.
- Animate your own absolutely positioned scene layers. Use `.headline`, `.sub`, `.cta`, `.logo` and `.shape` for styling.

## Documents (proposal, reports, analysis)
Documents don't use `.frame`. Link `../brand.css` and `compose.js`; logos and images still work.
- **Screen:** a readable width of around 1200px, numbered sections ("01: The Problem"), generous white space, and brand tints (`color-mix(in srgb, var(--primary) 8%, white)`) instead of greys. Keep responsive rules inside `@media screen and (max-width: …)`.
- **Slides** (1600×900): `.slide { width:1600px; height:900px; display:flex; flex-direction:column; justify-content:center; break-after:page }` with `@page { size: 1600px 900px; margin: 0 }`.
- **Long documents:** `@page { size: A4; margin: 12mm }`, sections use `break-inside: avoid` (not `break-after: page`), and add `addEventListener('beforeprint', () => Object.values(Chart.instances || {}).forEach(c => c.resize()))`.
- **Embedding another step's visual:**
  ```html
  <div class="embed" style="width:540px;height:675px;overflow:hidden"><iframe src="../social-media/post-launch.html" style="width:1080px;height:1350px;border:0;transform:scale(.5);transform-origin:0 0"></iframe></div>
  ```
- **Mockup photos:** use `<img data-img="oh-billboard-mockup">`. They show once generated.
- **Typography:** typographic apostrophes and quotes (’ “ ”). Follow the case style of the user's own materials; otherwise use sentence case for headlines.
- **The user's own photos:** `<img data-img="input/back-label.png">` (a path relative to the brand folder) shows that file as is. Use it instead of an image task whenever `input/` already has the right shot.

### Chart.js rules
- Fonts: `Chart.defaults.font.family = getComputedStyle(document.documentElement).getPropertyValue('--font-body')`. **Never** assign a whole object to `Chart.defaults.font`, because it causes infinite recursion.
- Colours: read them with `getComputedStyle(document.documentElement).getPropertyValue('--primary')`. Never use `--light` or `--secondary` as a data colour on white. Use at most 6 colours.
- Wrap each canvas in `<div style="position:relative;height:280px">` and pass `maintainAspectRatio: false`.
- Use a doughnut only for shares that sum to 100%. Rates go in bars. Metrics on different scales get separate charts or a second `y1` axis.
- Keep axis labels short so they aren't clipped.

## Exports
The HUB and the standalone view explain exports, so don't repeat them in chat.
- **PNG:** "Mở riêng", then Win+Shift+S.
- **Exact-size PDF:** Ctrl+P.
- **MP4:** Win+Shift+R.
