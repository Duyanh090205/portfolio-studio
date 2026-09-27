---
name: new-brand
description: Start a new fictional brand in Portfolio Studio. Interviews the user briefly in Vietnamese, writes an English strategic brief and registers the brand so it appears in the HUB. Use when the user says "tạo brand mới", "làm brand mới", "new brand", "mình có ý tưởng brand…", or describes a product or brand idea they want to build a portfolio project around.
---

# New brand: capture the brief

Read `${CLAUDE_SKILL_DIR}/references/conventions.md` and `${CLAUDE_SKILL_DIR}/references/data-schema.md`. In plain chat these files sit in `references/` next to this file. Then find the workspace.

## 1. Interview (one round at most)
Ask **only** what is missing, in **one** message of up to 5 short Vietnamese questions:
1. **Product/category.** What is sold, and what is special about it?
2. **Name.** If they have none, offer 3 short, ownable English name ideas.
3. **Audience + market.** Who it is for (age, lifestyle, what they care about), and where it sells, e.g. US college towns or Ho Chi Minh City.
4. **Personality.** Three words for how the brand should feel.
5. **References.** Competitors to stand apart from, colours or moods they love or hate, any must-haves.

If the user already gave enough, or says "tự quyết" / "chọn giúp", ask nothing. Fill the gaps with specific assumptions, labelled in `brief.assumptions`.

## 1b. Portfolio brand or real business?
If it isn't clear, ask: "Đây là brand giả định để làm portfolio, hay brand thật bạn sẽ vận hành (bán thật)?"
- **Portfolio brand:** `projectType: "fictional"`.
- **Real business:** `projectType: "live"`.
  - Also ask (same message): business model (online, pop-up, café or wholesale), sourcing/supplier and whether they have a COA, monthly budget, target launch date, and language (EN, VI or bilingual).
  - Set `steps`: `proposal` → `skip`, `ooh` → `skip` (the user can turn it on for pop-ups), `content` → `todo`.
  - Fill `checklist` from compliance.md: USPTO search (tea is class 30, café class 43), handles and domain check, ask FDACS/DBPR about permits, supplier COA, and set up AI labels and creator disclosures.
- **Existing project** (a brand or campaign they already made): hand over to `import-project` ("Nhập dự án có sẵn").

## 2. Think like a strategist
- **`audience`:** a specific person with a behaviour or tension, not a demographic list.
- **`problem`:** the unmet need or the category convention the brand breaks. It becomes the idea.
- Keep each field to 1–2 sentences, in English.

## 3. Write the files, in one batch
1. **Slug:** ASCII from `[a-z0-9-]` (see data-schema). If `brands/<slug>/` already exists, ask whether to overwrite or rename.
2. **Create `brands/<slug>/brand.js`** from `${CLAUDE_SKILL_DIR}/assets/brand-template.js`:
   - replace the placeholders and dates;
   - fill in `brief`, including `market`;
   - leave `tagline` empty.
3. **Create `brands/<slug>/logos.js`** containing `HUB.logos("<slug>", []);`
4. **Create empty `.keep` files** in `brands/<slug>/images/`, `brands/<slug>/ads/competitors/` and `brands/<slug>/report/input/`, using the Write tool. This creates the folders.
5. **Register the brand:** add the slug to `portfolio.js` → `brands` with one Edit.
6. **Verify:** read back `brand.js` (conventions → Verify).

## 4. Reply (short, in Vietnamese)
- **2–3 lines reflecting the brief:** who the brand is for, the tension it answers, and the assumptions made, so the user can correct them.
- **Ending block:**
  - ✅ Đã tạo brand <Name>
  - 👀 Mở HUB.html → <Name> → tab Brief
  - ➡️ Mở **chat mới**, chọn model **Opus**, gõ "Làm Brand Strategist cho <Name>"
