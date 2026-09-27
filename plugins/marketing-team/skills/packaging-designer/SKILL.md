---
name: packaging-designer
description: Team member 4, Packaging Designer. Designs the packaging and printed pieces for a Portfolio Studio brand. Makes flat artwork as HTML (primary pack front or cup wrap, lid/seal sticker, paper bag, thank-you card), pack copy, and photoreal mockup tasks (packaging range, bags and tote, unboxing), so the brand stays consistent in the customer's hands. Use when the user says "Làm Packaging cho [brand]", "thiết kế bao bì", "làm hộp/ly/túi/sticker/thẻ cảm ơn", or wants to approve ("duyệt packaging") or revise that step.
---

# Packaging Designer: team member 4

**Only approving?** ("duyệt packaging", "ok", "chốt") Don't read the references.
1. Read `brands/<slug>/brand.js`.
2. Make one Edit:
   - `steps.packaging` → `done`, with today's date;
   - `next` → the first main step not `done`. Use its approve phrase if it's `review`, its choose phrase if `doing`, and "Làm <Step> cho <Name>" if `todo`.
3. Re-read to verify, then reply in 2 lines.

Otherwise, read `${CLAUDE_SKILL_DIR}/references/conventions.md`, `${CLAUDE_SKILL_DIR}/references/html-guide.md`, `brands/<slug>/brand.js` (especially `kit.packaging`) and `brands/<slug>/campaign/step.js` (if it exists, for a limited-edition tie-in) in one message. Step id: `packaging`. Folder: `brands/<slug>/packaging/`.

## By project type (read `projectType`)
- **`concept`:** show the **whole range**:
  - `range-sheet` (1600x1000): every variant side by side, colour-coded;
  - `shelf-tag` (1000x600), with a QR placeholder if the concept uses one;
  - `pack-front` for the hero variant, plus `thank-you-card`.
- **`real-brand`:** usually `skip`. On request, make a limited-edition wrap only, using the official logo file via `src`. No nutrient or health claims on pack.
- **`cause`:** usually `skip`. On request, make a small community kit (tag or card).
- **`live`:** a **print handoff**. Flat artwork comps as below, plus two `copy` outputs:
  - "**Print spec sheet**": per item, size, 0.125" bleed, safe zone, CMYK, 300 dpi, outlined fonts, "request the printer's dieline", and how to rebuild in Canva Pro or Claude Design (export PDF Print, CMYK, crop marks + bleed).
  - "**Label copy (regulatory)**": statement of identity, net weight, ingredients, distributor name + address, country of origin, lot/best-by.

  Run compliance.md and fill `checks`. The HTML artwork is a design comp, not a print file. Say so.

## Build
1. **Decide the pack system:**
   - the primary format (pint tub, cup, box, bottle, pouch…);
   - variant colour-coding;
   - logo placement, following `kit.packaging`.

   If the product is sold in cups, `pack-front` is the **cup wrap**.
2. **Flat artwork visuals**, in one batch. Use `l-type`/`l-card` where they fit; otherwise a small `<style>` with `cqw` units and `var(--…)` only. Each output has `title` and `copy`.

| Output id | Title | Size | What |
|---|---|---|---|
| `pack-front` | Pack front | 1200x1500 | Logo, product name, variant, key claim. Net content in `--primary` on a solid field. Fill the middle with product art or an `img data-img="pk-product"` slot, never dead space |
| `pack-seal` | Lid seal | 1000x1000 | Lid, seal or sticker (circle or scallop inside the square). Logo at least 35% of the width |
| `bag-front` | Paper bag | 1200x1400 | Paper bag or tote front: a big logo or pattern, one line of copy |
| `thank-you-card` | Thank-you card | 1500x1050 | A6 insert card in brand voice with a small community CTA |

3. **Mockup image tasks** (photoreal, prompts naming the pack shape and colours by name):
   - `pk-range`:
     - if `input/` has a photo of the user's real product, put it in `refs`, use `"tool": "ChatGPT"`, and show the range "exactly as in the attached product photo" with only the variant colours changed (see `Variant` colours). No `composite`.
     - otherwise `"tool": "Gemini"` with `"composite": "Canva"` and no `refs`: the packs are **blank, flat and facing the camera**, so the user drops the real artwork PNGs in with Canva Mockups.
   - `pk-bags`: `"tool": "Gemini"` with `"composite": "Canva"`, no `refs`: bag, tote and box fronts are **blank, flat and facing the camera**.
   - `pk-unboxing`: `refs: ["logo-primary"]`, logo printed large and flat on the lid. If `input/` has a photo of the real product, add it to `refs`.

| Id | Ratio | What |
|---|---|---|
| `pk-range` | 4:3 | The packaging range together |
| `pk-bags` | 4:3 | Paper bag, tote and tape |
| `pk-unboxing` | 4:5 | Hands opening the pack, lifestyle |
| `pk-product` | 1:1 | Only if `pack-front` uses it: product/ingredient art, `"style": "none"` for an illustrated look |

4. **Write `packaging/step.js`:**
   - `summary`: the pack system logic;
   - `outputs`: the visuals, plus a `copy` output "Pack copy" (product name, variant names and descriptors, key claim, a back-of-pack story of about 50 words, a tone check);
   - `images`.
5. **Edit `brand.js`:**
   - the step → `review`;
   - `next` → `{ "text": "Xem artwork ở tab Packaging, tạo ảnh mockup rồi ghép artwork trong Canva (hướng dẫn ở tab Ảnh cần tạo). Ưng thì duyệt, hoặc gõ thẳng lệnh bước tiếp theo.", "say": "Duyệt Packaging <Name>" }`.
6. **Verify, then reply** with the ending block.
