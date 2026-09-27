---
name: ads-manager
description: Ads Manager (extra team member). Researches competitor advertising for a Portfolio Studio brand (hooks, CTAs, visual patterns, copy structures), finds the white space, and proposes 3 new ad concepts with Meta-ready copy and 1080x1080 ad visuals. The output is a multi-section HTML analysis report ("Read the competition. Find the gap. Make new ads."). Works best when the user saves competitor ad screenshots from the Meta Ad Library. Use when the user says "Làm Ads research cho [brand]", "phân tích quảng cáo đối thủ", "Meta Ads Library", "làm ads", or wants to approve ("duyệt ads") or revise that step.
---

# Ads Manager: extra team member

**Only approving?** ("duyệt ads", "ok", "chốt") Don't read the references.
1. Read `brands/<slug>/brand.js`.
2. Make one Edit:
   - `steps.ads` → `done`, with today's date;
   - `next` → the first main step not `done`, else the first extra not `done`, else done. If a proposal already exists, suggest "Cập nhật Proposal cho <Name>".
3. Re-read to verify, then reply in 2 lines.

Otherwise, read `${CLAUDE_SKILL_DIR}/references/conventions.md`, `${CLAUDE_SKILL_DIR}/references/html-guide.md`, `brands/<slug>/brand.js` and `brands/<slug>/campaign/step.js` (if it exists: don't repeat its concepts; complement them) in one message. Then Glob `brands/<slug>/ads/competitors/`. Step id: `ads`. Folder: `brands/<slug>/ads/`.

## Evidence: be honest about the source
1. **Screenshots in `ads/competitors/`:** real ads from the Meta Ad Library. Read up to 10. This is the primary evidence, so counts are real.
2. **Web search tool available:** run up to 5 searches on `brief.competitors` (recent campaigns, angles, offers). Cite what you found.
3. **Otherwise, desk research** from general knowledge. The report header says "Desk research: unverified, check in Meta Ad Library". The stat row shows "Ads reviewed: 0 (desk research)", not an invented count. Use hedged language ("often", "commonly") and no absolutes ("every", "no competitor").
   - In chat, tell the user in one line: for real analysis, open facebook.com/ads/library, screenshot 5–10 competitor ads into the brand's `ads/competitors` folder (the HUB's Ads card has the folder path), then run this step again.

## By project type (read `projectType`)
- **`concept` / `real-brand`:** use real Ad Library screenshots whenever the analysis makes claims. Without them, use desk-research mode (as above).
- **`live`:** real mode.
  - Screenshots are required; if there are none, ask for them.
  - Add a `copy` output "**Budget plan**":
    - boost organic winners at $5–10 a day in a local radius, in 7-day tests;
    - kill/scale rules;
    - KPIs: CPM, cost per profile visit, cost per waitlist signup;
    - when to try Partnership/Spark ads.
  - Run compliance.md (disclosures, no health claims) and fill `checks`.
- **`cause` / `content`:** skipped unless the user asks.

## Build (in one batch)
1. **Write `ads/analysis.html`**, a `doc` in the html-guide document style.
   - **Header:** "<Brand>: Competitive Ads Analysis", and "Read the competition. Find the gap. Make new ads for <Brand>."
   - **Stat row:** ads reviewed, brands, patterns found, concepts proposed.
   - **Pattern tables:** hooks (type / example / who uses it), CTAs, visual patterns, copy structures.
   - **The gap:** 3 opportunities tied to `brief.audience`.
   - **3 concepts:** name, angle, why it wins.
   - **Test plan:** an A/B idea and a KPI per concept.
2. **Ad visuals** (1080x1080), one per concept, each with a different kit layout (e.g. `l-photo`, `l-split`, `l-type`): `ad-1`, `ad-2`, `ad-3`, each with `title` and `copy`.
   - Photo tasks `ad-1-bg`, `ad-2-bg` and `ad-3-bg`, with ratios from the slot table.
   - A badge must add information, not repeat the headline.
3. **Write `ads/step.js`:**
   - `summary`: starts with "Desk research (unverified):" when there are no screenshots or search;
   - `outputs`:
     - the `doc` "Competitive analysis";
     - the 3 visuals;
     - a `copy` output "Ad copy (Meta)" with, per concept, primary text (≤125 characters), headline (≤40), description (≤30) and CTA button;
   - `images`.
4. **Edit `brand.js`:**
   - the step → `review`;
   - `next` → `{ "text": "Đọc báo cáo ở tab Ads, xem 3 mẫu ads. Ưng thì duyệt. (Campaign sẽ dùng insight này nếu làm sau.)", "say": "Duyệt Ads <Name>" }`.
5. **Verify, then reply** with the ending block.
