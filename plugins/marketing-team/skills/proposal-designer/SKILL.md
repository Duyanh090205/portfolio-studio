---
name: proposal-designer
description: Team member 6, Proposal Designer. Collects everything made for a Portfolio Studio brand into one polished proposal/case-study deck in HTML (exportable to PDF) plus ready-to-paste portfolio page copy. Covers the problem, insight, brand direction, key visual direction, social media examples, packaging and poster application, campaign mockup preview, use across platforms, and extras such as video, ads and report. Use when the user says "Làm Proposal cho [brand]", "gom thành proposal", "làm case study", "làm portfolio", "Cập nhật Proposal cho [brand]", or wants to approve ("duyệt proposal") or revise that step.
---

# Proposal Designer: team member 6

**Only approving?** ("duyệt proposal", "ok", "chốt") Don't read the references.
1. Read `brands/<slug>/brand.js`.
2. Make one Edit:
   - `steps.proposal` → `done`, with today's date;
   - `next`: the first extra not `done` (video → ads → report), or the "Brand hoàn tất 🎉" next from the conventions.
3. Re-read to verify, then reply in 2 lines.

Hiring managers read the **portfolio page**, not the deck, so the page copy gets the most care. Both read like a Strategic Communication case study (brief → research → insight → strategy → executions → measurement → reflection), not a picture dump. Match the user's portfolio style: numbered sections ("01 — The Problem"), headline stats, and a one-line takeaway per section.

Read `${CLAUDE_SKILL_DIR}/references/conventions.md`, `${CLAUDE_SKILL_DIR}/references/html-guide.md`, `brands/<slug>/brand.js`, every `brands/<slug>/*/step.js` and the text files in `brands/<slug>/input/` (research, her page text) in one message (Glob first). Don't open HTML visuals or images; reference them by path. Step id: `proposal`. Folder: `brands/<slug>/proposal/`.

**Honesty** (see conventions, Ground everything and Honesty):
- Every claim and number comes from `brief`, `existing`, `sources` or the research text in `input/`, and never contradicts them. Stats are cited (Author, Year). An unrun study is "my research proposal"; an anecdote is "(founder story)", never research.
- Keep every source label as a "Sources:" footnote per slide or section, never on embedded artwork. Ads claims stay "(desk research, unverified)" unless the ads step used real screenshots. Assumptions stay "(assumed)".
- **Never quote simulated numbers** in the deck, brief or page; use Measurement instead. Real report numbers (`cause`, `content`) keep their label.
- The work is the user's: "My role: …", never "the team".

## House format (match the user's portfolio site)
- **Numbering** everywhere (deck, brief, page): "01 — The Problem", em dash, in order with no gaps. Skipped sections leave no holes.
- **Brief card** (top of the deck, of `brief.html` and of the page copy): the type label from `projectType` (Fictional Brand · Concept Brand · Spec Campaign · Cause Campaign · Content Series), **Problem / Insight / Strategy** (15 words or fewer each), **Audience** (who, age, market, behaviour) and **My role** (`brand.role.mine`, else `[Your role: …]`).
- **Section arc:**
  - **01 — The Problem:** the research first: method, n, date (or "my research proposal"), 2–3 stats from `brand.sources` as (Author, Year), one quote if the research has one.
  - **02 — The Insight:** the theory or model it rests on, by name; the audience demographics; one quotable insight line (prefer the user's own words).
  - **03 — How It Works:** only if `existing` has a system, app or UI. Show her screens and renders with `<img data-img="input/…">` (`kit.existingImages`).
  - **The Strategy / Idea:** positioning (`kit.essence`) and the campaign big idea.
  - **Brand System:** **one** panel: logo, named swatches, type specimen, one line of personality. Never a full board, logo sheet or billboard set.
  - **Executions:** 3–6 visuals per page, after the strategy, each captioned with its output's `why`.
  - **Measurement**, just before **Reflection** ("What I learned / What I'd test next", `[Your reflection: …]`).
- **Measurement:** four rows, **Awareness · Engagement · Conversion · Trust**, each with KPI, how measured and target.
  - A target exists only when derived from a cited number in `existing`/`sources`. Show the derivation and mark it "(modeled)". Otherwise write "Target set after a baseline".
  - Never repeat or conflict with a number in `existing` (e.g. a beta-tester count or a modeled rate).
  - Reuse the framework in `report/step.js` if there is one.
- **Footer** (deck closing, brief, page copy): "My role: …", the AI line built from the image tasks' tools (conventions, Role and AI lines), credits by role for group work (`brand.role.team`), and the type line: `concept`/`fictional` "Concept brand, not a real company."; `real-brand`/`cause` `brand.disclaimer`.
- **"Portfolio page copy"** is a `copy` output with items in the site's block order:
  1. Eyebrow ("<Type label> · <Basis>", e.g. "Concept Brand · Built From An Original Research Proposal");
  2. Title;
  3. Hero line (two beats, e.g. "Awareness isn't the lever. / Behavior is.");
  4. Hook (first person). Use `[Your story: …]` unless the user supplied it;
  5. 3 stat chips (number + label + (Author, Year)), from `sources` only;
  6. My role + Brief card;
  7. then one item per arc section from 01 — The Problem to Executions: "0X — Title", a two-line headline and a body of 90 words or fewer, with a "Sources: …" line where it cites (Executions lists its 3–6 visuals with their captions);
  8. Risk management;
  9. Competitive positioning (Brand / What they did / What <Name> adds);
  10. Measurement;
  11. Reflection;
  12. Download (one-page brief);
  13. Footer.
- **Add-on mode** (the project already has a live page: her page text in `input/` or a page URL in `sources`):
  - the **first** item is a **Section map**: the full renumbered order 01 → N (N ≤ 13) with no gaps, each marked existing, new or renumbered;
  - new work goes in **at most 2** new sections, placed after her last product section; Measurement goes just before Reflection;
  - then only the new or changed blocks, each labelled with its anchor (e.g. "Insert after 05 — Product Line"). A missing My role, Brief card or footer counts as a new block;
  - never re-output or replace her existing blocks or stat chips.
- **"Image list"** is a `copy` output, one item per image on the page: descriptive file name (`the-label-kv-portrait.png`), real alt text (what is shown, 125 characters or fewer, never a file name) and the caption (the output's `why`). Captions of AI scenes say which tool made them from which of her renders, using the task's `tool` and `refs` (e.g. "Scene generated with Gemini from my serum render").
- **"Fixes for your live page"** is a `copy` output, only when `input/` has her page text: one item per issue (label = where, text = problem + exact fix): typos, numbering gaps, alt texts that are file names, stats without a source, missing My role / AI / disclaimer lines.
- **One-page brief:** `proposal/brief.html`, a `doc` at Letter size (`@page { size: letter; margin: 12mm }`): Brief card, 2–3 cited stats, the idea, deliverables, Measurement, timeline, footer.

## By project type (read `projectType`)
- **Imported projects** (`concept`, `real-brand`, `cause`, `content`) with a live page use **add-on mode** (above). The deck covers the new work, with a short recap of what existed.
- **`concept` / `fictional`:** "Concept brand, not a real company." on the deck cover and in the footer. No outcomes reported as if they happened.
- **`real-brand` / `cause`:** the disclaimer goes on the deck cover and in the page copy footer.
- **`content`:** a mini case: 01 — The Channel / 02 — What Performed / 03 — What I Learned / 04 — The System.
- **`live`:** usually `skip`. On request, make a partner or wholesale deck or a press kit instead.

## Build ("Cập nhật Proposal" = rebuild with the latest steps)
1. **Write `proposal/proposal.html` and `proposal/brief.html` in one message.** The deck is 16:9, 1600×900 slides.
   - Use the html-guide slide rules (`@page { size: 1600px 900px }`, vertically centred slides).
   - Skip any slide whose source doesn't exist, and keep the numbering gap-free.
   - Slides:
     1. **Cover:** the logo as `.logo.inline` with an explicit size, in the text flow above the tagline, never over a title (don't repeat the name as text if the logo contains it); tagline; type label; the concept line or disclaimer.
     2. **Brief card.**
     3. **01 — The Problem** (research, cited stats).
     4. **02 — The Insight** (theory, audience, quotable line).
     5. **03 — How It Works** (only with a system or UI in `existing`).
     6. **The Idea:** positioning, the big idea, and `campaign/kv-portrait.html` + `kv-landscape.html`.
     7. **Brand System:** one panel.
     8. **Executions** (1–2 slides): the strongest posts and the story, the pack artwork with `pk-range`, and `oh-billboard-mockup` / `oh-poster-mockup` via `data-img` (billboard HTML as a fallback embed). Each embed has its `why` caption underneath.
     9. **Use Across Platforms:** 4 cards (Social Media · In-store & Packaging · Outdoor & Digital Ads · Community & UGC), with one concrete use each.
     10. **Motion & Ads:** only if video or ads exist. Embed `video/motion.html` and 1–2 ad visuals.
     11. **Measurement** (four rows).
     12. **Reflection:** What I learned / What I'd test next.
     13. **Closing:** the takeaway line and the footer.
   - At most one headline and three bullets per slide.
   - **Embeds** (html-guide): the `.embed` box equals the iframe size × scale exactly; scale ≥ .3 for 1080-wide posts (e.g. .4 → 432×540) and ≥ .45 for 1920-wide banners; at most 4 embeds per slide.
2. **Write `proposal/step.js`:**
   - `summary`: the story arc in 2 sentences;
   - `outputs`:
     - a `doc` output "Proposal deck" (`proposal/proposal.html`, `"width": 1600`);
     - a `doc` output "One-page brief" (`proposal/brief.html`);
     - the `copy` outputs "Portfolio page copy" and "Image list" (House format), plus "Fixes for your live page" when it applies;
   - `images: []`.
3. **Edit `brand.js`:**
   - the step → `review`;
   - `next` → `{ "text": "Xem deck ở tab Proposal. Xuất PDF: Mở riêng → Ctrl+P → Lưu PDF (tích Đồ họa nền). Copy 'Portfolio page copy' lên Squarespace. Ưng thì duyệt.", "say": "Duyệt Proposal <Name>" }`.
4. **Verify, then reply** with the ending block.
