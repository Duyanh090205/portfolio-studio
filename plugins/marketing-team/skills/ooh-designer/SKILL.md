---
name: ooh-designer
description: Team member 5, OOH Designer. Takes a Portfolio Studio campaign from online into the street. Designs a billboard and a bus-shelter or 6-sheet poster as HTML, with simplified type and image so they read from far away, plus photoreal in-context mockup tasks and a placement plan. Use when the user says "Làm OOH cho [brand]", "làm billboard", "poster ngoài trời", "quảng cáo ngoài trời", or wants to approve ("duyệt OOH") or revise that step.
---

# OOH Designer: team member 5

**Only approving?** ("duyệt OOH", "ok", "chốt") Don't read the references.
1. Read `brands/<slug>/brand.js`.
2. Make one Edit:
   - `steps.ooh` → `done`, with today's date;
   - `next` → the first main step not `done`. Use its approve phrase if it's `review`, its choose phrase if `doing`, and "Làm <Step> cho <Name>" if `todo`.
3. Re-read to verify, then reply in 2 lines.

Otherwise, read `${CLAUDE_SKILL_DIR}/references/conventions.md`, `${CLAUDE_SKILL_DIR}/references/html-guide.md`, `brands/<slug>/brand.js` and `brands/<slug>/campaign/step.js` in one message. Reuse the campaign's headline, CTA and hero image. If there is no campaign yet, say so in one line and build from the brand tagline. Step id: `ooh`. Folder: `brands/<slug>/ooh/`.

## By project type (read `projectType`)
- **`concept`:** **in-store** pieces: shelf talker (1200x800) and end-cap poster (1200x1800), `l-ooh`. Glob `packaging/shelf-tag.html`: if it exists, the shelf talker extends it (a header card above the tag, same Variant strip, type and QR) instead of being a second shelf card.
- **`real-brand`:** in-store (cooler or shelf wrap) plus one billboard. Official logo via `src` only. Disclaimer in notes.
- **`cause`:** **community print**: waiting-room poster (Letter 1275x1650), school flyer (1275x1650, EN + other languages as separate files, labelled "needs native review"), poolside or venue sign (1200x1800).
- **`live`:** **pop-up signage** only if a pop-up is planned: menu board (1080x1350), A-frame (1200x1800), QR table tent (1000x1400). Prices come from the user; never invent them.

## OOH rules (by viewing distance)

| Piece | Distance | Copy |
|---|---|---|
| Billboard | 30 m+ | 7 words or fewer in total; no QR. Must work in 3 seconds from a moving car |
| Poster, end-cap | 2–5 m | Headline of 7 words or fewer + CTA; the product fills at least 40% of the photo slot |
| Shelf talker, table tent | 1 m or less | Headline + one proof line (12 words or fewer) + QR |

- One image, very high contrast. Shorten the campaign headline if needed; don't add new messages.
- The headline stands alone: no "theirs", "it" or "this" whose referent lives only in the key visual.
- Break the lines at sentence boundaries (`<br>`).
- If the CTA says "scan", add `.qr` (conventions → Scan means QR) at 25% or more of the short side (portrait: `style="width:25cqw;height:25cqw"`).

## Build
1. **Visuals**, in one batch, both `l-ooh` with the logo as `.logo.inline.lg` under the headline: `logo-horizontal`, so the wordmark reads at distance (`logo-reversed` on a dark panel). Each output has `title`, `copy` and `why`.

| Output id | Title | Size |
|---|---|---|
| `billboard` | Billboard | 2400x1200 |
| `poster` | Bus-shelter poster | 1200x1800 |

   Photos: reuse `cp-hero` / `cp-hero-wide` through `data-img` if the campaign has them (on posters, only if the product fills at least 40% of the slot). Otherwise add `oh-hero` (1:1).
2. **Mockup image tasks**, one per visual, with `"style": "none"`, `"composite": "Canva"` and `"design": "<output id>"` (the design goes in with Canva, not the AI):

| Id | Ratio | What |
|---|---|---|
| `oh-billboard-mockup` | 16:9 | Daylight street scene with a blank billboard |
| `oh-poster-mockup` | 4:5 | Bus shelter with a blank lit poster |

   Other types use `oh-<output id>-mockup` in the piece's real setting. Each prompt describes the board **blank, flat, evenly lit and facing the camera** and follows the conventions' composite-scene rules: the category's real fixture and stock, the blank area's proportion in words equal to the design, unbranded surroundings, and at a point of sale the real product via its photo ref. No logo `refs`. The HUB tells the user to add the design PNG in Canva Mockups.
3. **Write `ooh/step.js`:**
   - `summary`;
   - `outputs`: the visuals, plus a `copy` output "OOH copy & placement" (final line, placements and why, based on `brief.market`);
   - `images`.
4. **Edit `brand.js`:**
   - the step → `review`;
   - `next` → `{ "text": "Xem billboard & poster ở tab OOH. Để làm mockup: tạo cảnh billboard trống bằng Gemini, rồi ghép thiết kế trong Canva (hướng dẫn ở tab Ảnh cần tạo). Ưng thì duyệt.", "say": "Duyệt OOH <Name>" }`.
5. **Verify, then reply** with the ending block.
