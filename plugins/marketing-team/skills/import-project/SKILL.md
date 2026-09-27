---
name: import-project
description: Bring an EXISTING portfolio project into Portfolio Studio so the team builds on the user's real work instead of inventing it. Handles an own concept brand (e.g. a skincare concept from a research proposal), an unsolicited campaign for a real brand (e.g. a Share A Coke proposal), a social-issue/PSA campaign (e.g. a water-safety research project), or a content series/creator channel. Reads the user's PDFs, page text, screenshots, URLs and logo files, then writes the brief, what exists, gaps, locked items, sources, role, disclaimer and which team members apply. Use when the user says "Nhập dự án có sẵn", "import project", "dự án The Label / Share A Coke / Water Safety của mình", "làm tiếp dự án cũ", "mình đã có sẵn research/brief".
---

# Import an existing project

Read `${CLAUDE_SKILL_DIR}/references/conventions.md`, `${CLAUDE_SKILL_DIR}/references/data-schema.md` and `${CLAUDE_SKILL_DIR}/references/compliance.md` (in plain chat they sit in `references/` next to this file). Then find the workspace.

## 1. Ask (one message, only what is missing)
1. **Project name**, and **which type:**

| Type | Example |
|---|---|
| `concept` | Your own concept brand: you built the brand from your research |
| `real-brand` | A campaign for a real company, not commissioned (spec work) |
| `cause` | A social-issue or public-health campaign, often a group or client project |
| `content` | A content series or your own channel |

2. **Materials.** Ask the user to drop them into `brands/<slug>/input/`:
   - PDFs (research proposal, brief, deck);
   - page text or the project URL;
   - screenshots of existing visuals;
   - logo files (PNG/SVG), fonts and hex colours if known;
   - survey or analytics exports.

   Create that folder first, with a `.keep` file. If they give a URL, fetch it (WebFetch) instead of asking for text.
3. **For group work:** which parts were theirs and which were the team's.
4. **Anything that must not change** (locked), e.g. the name, the wordmark or the key numbers.

## 2. Read the materials (one batch of parallel reads)
Read the PDFs, text and screenshots. Look at at most 8 images, since images cost many tokens; ask which ones matter if there are more. Take the facts from **their** materials.

## 3. Write `brands/<slug>/brand.js` (template: data-schema)
- **`projectType`:** as chosen.
- **`name`, `category`, `oneLiner`, `tagline`** from their materials.
- **`brief`:** product/subject, audience, market, problem, personality, competitors, mustHave. Label facts "(from my research)" or "(<source>, <year>)", and label your own additions "(assumed)".
- **`existing`, `gaps`, `locked`, `sources`, `role`:** fill these from what you read.
  - Gaps are what a hiring manager would miss. Examples: no identity system, only 1 of 10 products shown, no launch plan or KPIs, no data visuals, no disclaimer.
  - Also note hygiene issues you noticed (numbering, typos, contradictions) as gaps starting "Fix:".
- **`disclaimer`:**
  - `real-brand`: "Unsolicited concept. Not affiliated with or endorsed by <Owner>. Trademarks belong to their owners."
  - `cause`: "Concept extension, not commissioned by <Client>." (only for new work beyond what was delivered).
- **`kit`:**
  - If the materials show colours, fonts or a logo, write a starter kit with those values. Mark unknowns "(to confirm)".
  - Brand-strategist completes it in import mode.
  - For `real-brand`, describe the master brand in words only.
- **`steps`:**
  - `brief` is `done`;
  - apply the type's preset from the conventions table (non-applying steps are `{ "status": "skip" }`);
  - steps already fully covered by `existing` are `done`, with the note "Existing work (imported)".
- **Logos:**
  - If the user supplied logo files, write `logos.js` entries with `"src": "input/<file>"`.
  - Never draw a real company's trademark.
  - Otherwise use `HUB.logos("<slug>", [])`.
- **`next`:** point to the first step worth doing, with a one-line reason in `text`, e.g. "Bắt đầu bằng Brand Strategist (nhập nhận diện) để có brand board".

Also append the slug to `portfolio.js`. Verify by re-reading `brand.js`.

## 4. Reply (Vietnamese, short)
- **3–5 bullets:** what you understood, the top 3 gaps worth filling (and why a recruiter would care), the steps you recommend and the order, and anything you need to confirm.
- **Ending block:**
  - 👀 HUB.html → <Name> → tab Brief
  - ➡️ `next.say`
