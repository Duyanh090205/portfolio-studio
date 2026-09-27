---
name: content-planner
description: Content Planner (for real brands the user runs, e.g. her own matcha brand on Instagram/TikTok, and for content series). Plans a month of social content (pillars × formats × dates, Trial Reel hooks, Stories), then each week produces a shoot pack (Reels scripts with hooks, beats, on-screen text and voice-over, plus a shot list she films herself) and a caption batch in English (+ Vietnamese). Use when the user says "Lên lịch nội dung tháng này cho [brand]", "content calendar", "lịch đăng", "Làm shoot pack tuần này cho [brand]", "kịch bản reels", "viết caption tuần này", or wants to approve ("duyệt lịch nội dung") or revise it.
---

# Content Planner: extra team member (real brands)

**Only approving?** ("duyệt lịch nội dung", "ok") Don't read the references.
1. Read `brands/<slug>/brand.js`.
2. Make one Edit: `steps.content` → `done` with today's date; `next` → the first main step not `done`, else "Làm shoot pack tuần này cho <Name>".
3. Re-read to verify, then reply in 2 lines.

Otherwise, read `${CLAUDE_SKILL_DIR}/references/conventions.md`, `${CLAUDE_SKILL_DIR}/references/html-guide.md`, `${CLAUDE_SKILL_DIR}/references/compliance.md`, `brands/<slug>/brand.js`, `brands/<slug>/social-media/step.js` (pillars) and `brands/<slug>/report/step.js` (insights, if any) in one message. Step id: `content`. Folder: `brands/<slug>/content/`.

## What works (2026, small real brands)
- **Mix:**
  - 3–4 Instagram feed posts a week (2 Reels, 1 carousel, 1 flexible);
  - Stories most days;
  - 2–3 Trial Reels a week to test hooks;
  - 3–5 TikToks a week reusing the same vertical videos.
- **Pillars:**
  - a repeatable ritual/ASMR prep series;
  - education (origin, grades, how to make it), usually as carousels;
  - founder journey, built in public;
  - community/local (UGC, pop-ups, café collabs).
  - Keep promotion to 20% or less.
- **Hooks:**
  - say the keyword in the first 2 seconds;
  - talking to camera beats static graphics;
  - optimise for sends and shares (e.g. "send this to your matcha friend").
- **Filming:** one 2–3 hour filming block a week, plus one editing block.

## Mode 1: month plan ("Lên lịch nội dung tháng …")
Write `content/<yyyy-mm>.html`, a `doc`:
- **Calendar grid:** one card per post with date, platform, format, pillar, hook and status (planned).
- **Stories rhythm.**
- **Key dates:** holidays, local events, and cultural moments for the audience (e.g. Tết, Trung Thu for a Vietnamese-American audience).
- **Launch sequence** if the brand isn't launched yet: tease → founder story → sourcing proof → waitlist → launch day → recap.
- **The month's goal and 3 KPIs.** These are real targets, not results.

Add or merge into `content/step.js`: a `doc` output "Content calendar <Month>" plus a `copy` output "Month hooks" (all hooks, one per line).

## Mode 2: weekly shoot pack ("Làm shoot pack tuần này…")
For the week's planned posts:
- **Reels scripts:**
  - hook (0–2s);
  - 3–5 beats with on-screen text;
  - voice-over in EN (+ VI line if the brand is bilingual);
  - CTA;
  - trending-audio suggestion as a description, not a real track name.
- **Shot list:** one per scene, with angle, lens/distance, light, props, background, ASMR sound to capture, and shooting order to minimise setup changes.
- **Image tasks:** one per hero frame, with `"tool": "Camera"` and ids like `ct-w42-whisk`.
- **Caption batch:** EN first (+ VI), a CTA that drives sends/saves, and 3–5 specific hashtags. Include gifting/ad disclosures where needed.

Write `content/<yyyy>-w<week>.html` (a `doc`: the shoot pack, printable). Add to `content/step.js`:
- a `copy` output "Captions week <n>";
- the `images` tasks;
- `checks` from compliance.md (no health claims, disclosures, AI labels).

## Then
- **Edit `brand.js`:**
  - `steps.content` → `review`;
  - `next` → `{ "text": "Xem lịch / shoot pack ở tab Lịch. Quay theo shot list, đăng theo lịch. Cuối tháng xuất số liệu Meta/TikTok bỏ vào report/input.", "say": "Duyệt lịch nội dung <Name>" }`.
- **Verify, then reply** with the ending block. Mention any ⚠ compliance flags.
