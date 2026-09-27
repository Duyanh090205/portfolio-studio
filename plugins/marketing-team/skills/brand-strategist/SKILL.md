---
name: brand-strategist
description: Team member 1, Brand Strategist. Builds the brand foundation for a Portfolio Studio brand. It proposes 3 creative directions, then writes the brand kit (positioning, colour palette, typography, logo, photography, illustration, social, packaging and application direction), SVG logos and variations, graphic elements, brand.css, and the photo tasks that fill the brand board. Also handles choosing ("chọn hướng A/B/C cho [brand]", "chọn giúp mình hướng tốt nhất", "chọn màu của A + font của B", "mix A + C"), approving ("duyệt brand board", "chốt brand") and revising ("đổi màu", "sửa logo", "font khác"). Use when the user says "Làm Brand Strategist cho [brand]", "làm brand board", "làm logo/màu/font cho [brand]".
---

# Brand Strategist: team member 1

**Only approving?** ("duyệt brand board", "ok", "chốt") Don't read the references.
1. Read `brands/<slug>/brand.js`.
2. Make one Edit:
   - `steps.brand-strategist` → `done` with today's date;
   - `next` → `{ "text": "Brand board đã chốt 🎉 Tiếp theo: Social Media Creative (mở chat mới, Sonnet là đủ).", "say": "Làm Social Media cho <Name>" }`.
3. Re-read to verify, then reply in 2 lines of Vietnamese.

Otherwise:
- Read `${CLAUDE_SKILL_DIR}/references/conventions.md`, `${CLAUDE_SKILL_DIR}/references/data-schema.md` and `${CLAUDE_SKILL_DIR}/references/brand-board-guide.md` in one message. In plain chat they sit in `references/` next to this file.
- Then read `brands/<slug>/brand.js` and `brands/<slug>/brand-strategist/step.js` if it exists.
- If there are several brands and the user didn't say which, ask.

You are a senior brand strategist and identity designer. Everything later depends on what you decide here, so make it distinctive, coherent and easy to reuse.

## By project type (read `projectType` in brand.js)
- **`fictional` / `live`:** modes A1 → A2 below.
  - For `live`: product and drink photo tasks are `"tool": "Camera"` shot briefs; AI tasks only for mood or backgrounds, with `"ai": true`.
  - Remind the user that the name checks are in the Brief checklist.
- **`concept` (import):** no 3 directions. Build the kit from `existing`, `locked` and the files in `input/`:
  - keep their wordmark, colours and fonts; match fonts to the closest Google Fonts, labelled "(to confirm)";
  - only fill `gaps`, e.g. variant colour-coding, secondary lock-ups, a pattern;
  - recreating their own wordmark as SVG is fine; a supplied logo file uses `"src"`;
  - then run A2, adding image tasks only for the gaps.
- **`real-brand` (campaign identity):**
  - **never** recreate the company's logo;
  - the master brand stays reference: colours by name and hex, with Google-font stand-ins labelled "stand-in";
  - the official logo goes in `logos.js` via `"src"` if supplied; otherwise leave `data-logo` slots empty;
  - build a **campaign mark** (e.g. a hashtag or collection lock-up in SVG), a campaign palette extension, and graphic devices.
- **`cause`:** a campaign mark (never the client's logo) plus an accessible palette (AA contrast). Use fonts with Latin Extended if messages will be translated.
- **`content`:** a light import of the channel's look (colours and type from screenshots) plus a series title-card style. No 3 directions.

## Mode A1: propose 3 directions (no `directions` exist yet)
Base them on the brief. Make them strategically different, not just different in colour.
1. **Write `brands/<slug>/brand-strategist/step.js`:** `summary` plus `directions`, 3 of them. Each has 4 colours, a Google Fonts headline + body pair, a logo idea and 3 mood words. Use `outputs: []` and `images: []`.
2. **Edit `brand.js`:**
   - `steps.brand-strategist` → `doing`, with the note "3 directions proposed";
   - `next` → `{ "text": "So sánh 3 hướng trong tab Brand board rồi chọn một (hoặc mix).", "say": "Chọn hướng A cho <Name>" }`.
3. **Reply:**
   - one Vietnamese line per direction: letter, name and core idea;
   - then: "Mở HUB → <Name> → Brand board để xem màu và font. Chọn A, B hay C, hoặc mix ('màu của A + logo của B'). Nói 'chọn giúp' là mình tự chọn."

Skip A1 and go straight to A2 in two cases:
- The user said "chọn giúp" / "tự quyết". Still write the 3 directions, then choose one and explain why in one line.
- The user named a direction and directions already exist.

## Mode A2: build the chosen direction
Write everything in English, following brand-board-guide. Write all files **in one batch**:
1. **`brand.js`**, one Edit:
   - `tagline`, `cover: "bs-hero-product"` and `kit`;
   - `steps.brand-strategist` → `review`, with a note;
   - `next` → `{ "text": "Xem brand board, rồi tạo 8 ảnh ở tab Ảnh cần tạo (copy prompt → Gemini; đính kèm logo PNG khi được nhắc). Ưng thì duyệt, hoặc gõ thẳng lệnh bước tiếp theo.", "say": "Duyệt brand board <Name>" }`.
2. **`logos.js`:** 5 logos and 2–3 graphic elements (SVG rules are in the guide).
3. **`brand.css`**, from the kit (format in data-schema).
4. **`brand-strategist/step.js`:** keep `directions`, and add `"chosen"` and the 8 `images` (ids starting `bs-`).
5. **Verify:**
   - the JSON is strict;
   - there are no backticks or `${` inside the SVGs;
   - re-read `brand.js`.

Reply with the ending block. Remind the user to download the **logo PNG** from the HUB for tasks that ask for it.

## Mode B: revise ("đổi màu…", "logo khác…", "font…")
- Change **only** what was asked. If a colour or font changes, update it everywhere:
  - `kit`, `promptBlock`, `brand.css`;
  - the SVG fills in `logos.js`;
  - the image prompts that name it.
- If the step was `done`, set it back to `review`.
- Warn about images or later steps that are now off-brand, and name them.
  - HTML deliverables pick up `brand.css` automatically.
  - Photos already generated need redoing.
