---
name: project-check
description: Quality check before publishing a Portfolio Studio project to a portfolio or social media. Cheap review (Sonnet) of the project's files and optionally the user's live project page. Checks section numbering gaps, typos and grammar, contradictions with the brief's mandatories (e.g. "no health claims" vs "0 CALORIES" on a can), charts whose bars don't match their numbers, missing disclaimers, alt texts and captions, honesty labels, and compliance for real brands. Use when the user says "Kiểm tra dự án [name]", "soát lỗi", "check trước khi đăng", "review portfolio page". Also checks ONE step before it is approved ("Kiểm tra Social Media [name]", "Kiểm tra brand board [name]", "Kiểm tra Campaign [name]", "kiểm tra bước này").
---

# Project check: quality gate

**Two modes.** "Kiểm tra dự án <Name>" = the whole project (everything below). "Kiểm tra <Step> <Name>" (e.g. "Kiểm tra Social Media The Label", "Kiểm tra brand board The Label") = **step mode**: one step, before the user approves it, after they pasted its images. See "Step mode" at the end.

Read `${CLAUDE_SKILL_DIR}/references/conventions.md` and `${CLAUDE_SKILL_DIR}/references/compliance.md`. In plain chat they sit in `references/` next to this file. Then read, in one batch:
- `brands/<slug>/brand.js` (including `sources`, `existing`, `locked`);
- every `brands/<slug>/*/step.js`;
- the text of the HTML deliverables (skim for copy and for `data-logo` / `.embed` markup; ignore other CSS);
- the text files in `brands/<slug>/input/` (research, her live page text);
- the project URL if the user gives one (WebFetch).

Open image files only for checks 13 and 14, and only the ones they name.

## Check (list each item as ✔, ⚠ or ✗ with a concrete fix; ✗ = must fix before publishing)
1. **Structure:** numbered sections run in order with no gaps ("01 — …", "02 — …"). Headings are consistent. No leftover placeholders ("[Your story: …]", "lorem").
2. **Language:** typos, grammar (subject–verb agreement, "They doesn't"), names used consistently (a collection called two different names), and captions matching the images they describe.
3. **Consistency with the brief:** copy that breaks a stated mandatory or brand rule; numbers that differ between places; headlines that contradict the core idea.
4. **Data integrity:** chart values against the stated numbers (a 63% bar drawn the same as a 41% bar); percentages that don't add up; deltas that don't follow from the raw numbers.
5. **Honesty labels:** every stat has a source label. Simulated or desk-research content is labelled. Team vs. own work is attributed for group projects.
6. **Legal and ethics** (compliance.md): a disclaimer for `real-brand`/`cause`; no redrawn trademarks; no health claims or fake testimonials; creator disclosures; AI-image labels for `live`.
7. **Portfolio readiness:** every visual has a descriptive file name, alt text and caption. A one-page brief or PDF exists. Hero stats are on the page.
8. **Documents** (proposal, brief, report): a `data-logo` without the `inline` class (it can sit over a title), or an `.embed` box whose width/height differ from the iframe size × scale, or a scale below .3 for 1080-wide posts / .45 for 1920-wide banners → ⚠.
9. **Artwork hygiene:** source labels ("(from my research)", "(Author, Year)", "Sources:") or production notes printed on a `visual` → ⚠ (move them to `note` or the document footnote).
10. **Goals and KPIs** vs numbers in `existing`/`sources`: a collision (same metric, different number), a repeated number, an unsourced target, or a projection not marked "(modeled)" → ⚠. Simulated results on a portfolio page → ✗.
11. **Research fidelity:** deck, brief and page claims vs `brand.sources` and the research text in `input/`. Any contradiction, an anecdote presented as research, or an unrun study presented as findings → ✗.
12. **Role, AI and type lines:** every deck, brief and page copy has "My role: …" and an AI line that matches the image tasks' tools; `concept`/`fictional` have "Concept brand, not a real company."; `real-brand` has the non-affiliation disclaimer; no "the team" → ⚠ per missing line.
13. **AI-drawn text:** open every image in `images/` that shows the product front or a logo (its task has a logo or product photo in `refs`, or its title names a pack, label or hero shot). Compare its printed words with `input/` and the logo names. Flag each misspelling or wrong or copied product name with a ready Gemini fix phrase: "Keep everything identical; only correct '<wrong>' to read exactly '<right>'."
14. **Visual review:** render the key visuals and look at them, at most 6 (the hero ones: key visual, deck cover, lead post, pack front, billboard).
    - On Windows (PowerShell), with W,H = the output `size` (1600,900 for deck slides):
      `& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=W,H --screenshot="<abs path>\check\shots\<id>.png" "file:///<abs path to html>?shot"`
      Create `check/shots/` first. Use forward slashes and `%20` for spaces in the `file:///` URL; `?shot` gives a clean capture. Then Read the PNG.
    - Flag overlapping or clipped text, placeholders where a photo should be, text too small to read at post size, a logo over a title.
    - If no browser is available, skip this check and say so in one line.
15. **Score** 5 dimensions 0–10, each with one cited piece of evidence (file + what you saw): fidelity to the kit and `locked` items, legibility at size, craft (conventions, Craft bar), fit to the brief and insight, distinctiveness. Then **Keep** (2–3 strongest pieces), **Fix** (the ✗/⚠ that matter most) and **Quick wins** (under 5 minutes each).
16. **Live page:** if `input/` has her live page text (or the user gave a URL), run checks 1, 2, 5, 7 and 10–12 on it too and list its fixes, labelled "Live page".

## Write the result
- **`brands/<slug>/check/step.js`** (no pipeline status; the HUB shows it as the "Kiểm tra" tab):
  - `summary`: counts of ✔, ⚠ and ✗, plus the top 3 issues;
  - `outputs`: one `copy` output "Checklist" whose items are the ✗ then ⚠ findings, each with label = where it is and text = the problem + the exact fix; a `copy` output "Scorecard" (the 5 scores with evidence, then Keep / Fix / Quick wins); then a `copy` output "Passed" listing the ✔ items briefly;
  - `images: []`.
- **Don't change `steps`,** and don't fix files yourself. Offer: "Muốn mình sửa luôn các mục ✗ và ⚠ không?" If the user says yes, fix them in the owning step's files (Revise mode), then re-run this check.
- **Reply in Vietnamese:** the scores in one line, the top 3 issues, then the ending block (👀 tab Kiểm tra).

## Step mode ("Kiểm tra <Step> <Name>")
Cheap and focused: one step, usually right after its images were pasted.
1. **Read in one batch:** `brand.js` (brief, kit, sources, existing, locked), that step's `step.js` and HTML files, and the research text in `input/` only if the step makes claims (campaign, proposal, report).
2. **Checks:** 2, 3, 5, 9, 11 (claims only), 13 (only the images this step's tasks and HTML use), 14 (at most 3 of this step's visuals), plus conventions → Craft bar (mechanism shown, no stock marks or lines, variety, scan means QR) and fidelity to the kit (logo, colours, fonts, the real product). Brand board: logo symbol test, palette, fonts vs the user's material.
3. **Score** the 5 dimensions of check 15, each with one piece of evidence.
4. **Write** into that step's own `step.js` (one Edit, strict JSON), keeping everything else:
   `"review": { "date": "YYYY-MM-DD", "scores": { "fidelity": 8, "legibility": 7, "craft": 7, "fit": 8, "distinct": 6 }, "verdict": "One line: ready to approve or what blocks it", "items": [ { "level": "✗", "where": "post-promo image", "text": "Problem + the exact fix (or the Gemini fix phrase)" } ] }`
   Order items ✗, ⚠, then 2–3 ✔. Don't change `steps` or `next`.
5. **Reply in Vietnamese:** scores in one line, the top 3 issues, then either "Ưng thì gõ '<approve phrase>'" or "Muốn mình sửa luôn các mục ✗ và ⚠ không? Gõ 'Sửa các mục cần sửa của <Step> <Name>'". When fixing, use the owning step's Revise mode, then clear `review` so the HUB shows it needs a new check.

