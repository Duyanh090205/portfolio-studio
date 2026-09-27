---
name: video-editor
description: Video Editor (extra team member). Turns a Portfolio Studio brand's campaign, or the user's own script, into a short motion-graphic ad. Writes a storyboard/script, then builds an HTML/SVG animation (GSAP) at 1080x1920 that plays in the browser and can be screen-recorded to MP4, which makes fast motion demos without After Effects. Use when the user says "Làm Video cho [brand]", "làm motion", "làm video quảng cáo", "animation", describes scenes for a video, or wants to approve ("duyệt video") or revise that step.
---

# Video Editor: extra team member

**Only approving?** ("duyệt video", "ok", "chốt") Don't read the references.
1. Read `brands/<slug>/brand.js`.
2. Make one Edit:
   - `steps.video` → `done`, with today's date;
   - `next` → the first main step not `done`, else the first extra not `done`, else done. If a proposal already exists, suggest "Cập nhật Proposal cho <Name>".
3. Re-read to verify, then reply in 2 lines.

Otherwise, read `${CLAUDE_SKILL_DIR}/references/conventions.md`, `${CLAUDE_SKILL_DIR}/references/html-guide.md`, `brands/<slug>/brand.js` and `brands/<slug>/campaign/step.js` (if it exists) in one message. Step id: `video`. Folder: `brands/<slug>/video/`.

**Input:** if the user described scenes, a script or a CTA, follow them exactly. Otherwise build from the campaign's headline and CTA, or from the brand tagline, and mention in one line that they can send their own script next time.

## By project type (read `projectType`)
- **`real-brand`:** no real people, celebrities or creators. The official logo only via `src`. Put the disclaimer in small text on the end card.
- **`live`:** real footage beats motion graphics. Deliver a **shot list for the user to film**, plus a motion template for text overlays, the end card and CTA. Photo or video tasks are `"tool": "Camera"`.
- **`cause`:** add captions for accessibility, and put translated supers in separate files, labelled "needs native review".

## Build (in one batch)
1. **Storyboard:** 12–15 seconds, 5–6 scenes. Write it as a `copy` output "Storyboard & script", one item per scene: label `"0.0–2.5s"`, text = visual + on-screen text + motion. End on the logo and CTA.
2. **Write `video/motion.html`:**
   - `.frame` is 1080x1920. Link `brand.css`, `layouts.css` and `compose.js`.
   - Load GSAP from the CDN in the html-guide. Build one `gsap.timeline({ repeat: -1, repeatDelay: 1 })` **inside** `document.addEventListener('compose:ready', …)`.
   - Animate absolutely positioned scene layers: brand shapes, `data-img` photos (reuse `cp-hero`, `sm-launch` and similar, or add `vd-` tasks), kinetic type using `.headline`/`.sub`/`.cta`, and the logo via `data-logo`.
   - Keep text inside the story safe zones (top 12%, bottom 14% clear). Centre CTAs in centred scenes. Use snappy, playful easing that fits the personality.
   - Keep it under about 150 lines. Every scene must look intentional while photos are still placeholders.
3. **Write `video/step.js`:**
   - `summary`;
   - `outputs`: `{ "id": "motion", "type": "visual", "title": "Motion ad (15s, 9:16)", "file": "video/motion.html", "size": "1080x1920", "motion": true, "copy": {…} }` plus the storyboard copy;
   - `images`: any `vd-` tasks.
4. **Edit `brand.js`:**
   - the step → `review`;
   - `next` → `{ "text": "Xem video ở tab Video. Xuất MP4: Mở riêng → F11 → Win+Shift+R quay 1 vòng. Ưng thì duyệt.", "say": "Duyệt Video <Name>" }`.
5. **Verify, then reply** with the ending block.
