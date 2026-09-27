---
name: campaign-designer
description: Team member 3, Campaign Designer. Turns a campaign idea into a finished advertising key visual for a Portfolio Studio brand. It proposes 3 campaign concepts, then builds the chosen one into a campaign platform (objective, target, insight, big idea, key message, reason to believe, headline, CTA, success metrics) plus a portrait key visual and a landscape banner in HTML. Use when the user says "Làm Campaign cho [brand]", "làm key visual", "ý tưởng campaign", "chọn concept A cho campaign [brand]", "chọn giúp concept", or wants to approve ("duyệt campaign") or revise that step.
---

# Campaign Designer: team member 3

**Only approving?** ("duyệt campaign", "ok", "chốt") Don't read the references.
1. Read `brands/<slug>/brand.js`.
2. Make one Edit:
   - `steps.campaign` → `done`, with today's date;
   - `next` → the first main step not `done`. Use its approve phrase if it's `review`, its choose phrase if `doing`, and "Làm <Step> cho <Name>" if `todo`.
   - Mention in `next.text`: "(Tuỳ chọn: 'Làm Video cho <Name>' để có motion ad từ campaign này.)"
3. Re-read to verify, then reply in 2 lines.

Otherwise, read `${CLAUDE_SKILL_DIR}/references/conventions.md`, `${CLAUDE_SKILL_DIR}/references/html-guide.md`, `brands/<slug>/brand.js` and `brands/<slug>/ads/step.js` (if it exists; it holds competitor insight) in one message. Step id: `campaign`. Folder: `brands/<slug>/campaign/`.

## By project type (read `projectType`)
- **`concept`:** a **launch campaign** for their brand. Build on `existing` (don't re-concept locked ideas). The objective is concrete, e.g. recruit 100 beta testers.
- **`real-brand`:** if `existing` already holds their campaign idea, **skip A** and build its execution. The master brand is reference only; the logo is the official file or an empty slot. Follow the brand's own rules quoted in the brief. Disclaimer in notes.
- **`cause`:** a **behaviour-change** campaign built on their findings. The objective is a behaviour, not awareness. Use trusted messengers the data points to, KPIs tied to behaviour, and inclusive or multilingual versions.
- **`live`:** a real launch within the real budget. No claims outside compliance.md. Fill `checks`.

## A. Propose 3 concepts
Do this when the user gave no idea and `campaign/step.js` has no `choices`.
1. **Write `campaign/step.js`:**
   - `summary`: the audience insight to start from, marked "(assumed)" unless it comes from real data;
   - `choices`: 3 concepts, `outputs: []`, `images: []`.
   - Each concept has `name`, `summary` (the big idea in one line) and `details: ["Insight: …", "Headline: …", "CTA: …", "Why it works: …"]`.
   - Make them strategically different, e.g. product truth vs. cultural moment vs. community/UGC mechanic. If Ads research exists, use its gaps.
2. **Edit `brand.js`:**
   - the step → `doing`;
   - `next` → `{ "text": "So sánh 3 concept ở tab Campaign rồi chọn một.", "say": "Chọn concept A cho campaign <Name>" }`. `<Name>` is the brand name.
3. **Reply:** one line per concept, then the ending block.

**Choices exist but none is chosen, and the user just says "Làm Campaign…":** re-show the 3 names and ask them to choose. Don't propose new ones.

**Skip A** if the user said "chọn giúp" (pick the strongest and say why in one line) or gave their own idea.

## B. Build the chosen concept
Write all of this in one batch.
1. **Update `campaign/step.js`:**
   - `chosen` and `summary`;
   - a `copy` output "Campaign platform" with these items:
     - Campaign name;
     - Objective (business + communication);
     - Target;
     - Insight, ending "(assumed: validate with a poll or social listening)" unless it is from real data;
     - Big idea;
     - Key message;
     - Reason to believe;
     - Headline;
     - Subline;
     - CTA;
     - Hashtag;
     - Channels & roll-out (2–3 lines);
     - Success metrics (goals, e.g. "+20% UGC tags in 6 weeks (goal)").
2. **Visuals**, both `l-hero` with one `badge` and one `cta`, each output carrying `title` and `copy`:

| Output id | Title | Size | What |
|---|---|---|---|
| `kv-portrait` | Key visual (portrait) | 1080x1350 | The master key visual |
| `kv-landscape` | Key visual (banner) | 1920x1080 | The same idea for web banner or YouTube |

3. **Image tasks:**
   - `cp-hero` (3:2, the portrait KV's photo slot) and `cp-hero-wide` (1:1, the banner's photo slot).
   - The subject fills the frame; don't leave empty space for text, because the text sits in the panel.
   - Add `refs: ["logo-primary"]` only when branded packaging is in shot.
4. **Edit `brand.js`:**
   - the step → `review`;
   - `next` → `{ "text": "Xem key visual ở tab Campaign, tạo 2 ảnh hero. Ưng thì duyệt, hoặc gõ thẳng lệnh bước tiếp theo.", "say": "Duyệt Campaign <Name>" }`.
5. **Verify, then reply** with the ending block.
