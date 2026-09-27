---
name: project-check
description: Quality check before publishing a Portfolio Studio project to a portfolio or social media. Cheap review (Sonnet) of the project's files and optionally the user's live project page. Checks section numbering gaps, typos and grammar, contradictions with the brief's mandatories (e.g. "no health claims" vs "0 CALORIES" on a can), charts whose bars don't match their numbers, missing disclaimers, alt texts and captions, honesty labels, and compliance for real brands. Use when the user says "Kiểm tra dự án [name]", "soát lỗi", "check trước khi đăng", "review portfolio page".
---

# Project check: quality gate

Read `${CLAUDE_SKILL_DIR}/references/conventions.md` and `${CLAUDE_SKILL_DIR}/references/compliance.md`. In plain chat they sit in `references/` next to this file. Then read, in one batch:
- `brands/<slug>/brand.js`;
- every `brands/<slug>/*/step.js`;
- the text of the HTML deliverables (skim for copy; ignore CSS);
- the project URL if the user gives one (WebFetch).

Don't open image files.

## Check (list each item as ✔ or ⚠ with a concrete fix)
1. **Structure:** numbered sections run in order with no gaps ("01 — …", "02 — …"). Headings are consistent. No leftover placeholders ("[Your story: …]", "lorem").
2. **Language:** typos, grammar (subject–verb agreement, "They doesn't"), names used consistently (a collection called two different names), and captions matching the images they describe.
3. **Consistency with the brief:** copy that breaks a stated mandatory or brand rule; numbers that differ between places; headlines that contradict the core idea.
4. **Data integrity:** chart values against the stated numbers (a 63% bar drawn the same as a 41% bar); percentages that don't add up; deltas that don't follow from the raw numbers.
5. **Honesty labels:** every stat has a source label. Simulated or desk-research content is labelled. Team vs. own work is attributed for group projects.
6. **Legal and ethics** (compliance.md): a disclaimer for `real-brand`/`cause`; no redrawn trademarks; no health claims or fake testimonials; creator disclosures; AI-image labels for `live`.
7. **Portfolio readiness:** every visual has a descriptive file name, alt text and caption. A one-page brief or PDF exists. Hero stats are on the page.

## Write the result
- **`brands/<slug>/check/step.js`** (no pipeline status; the HUB shows it as the "Kiểm tra" tab):
  - `summary`: counts of ✔ and ⚠, plus the top 3 issues;
  - `outputs`: one `copy` output "Checklist" whose items are the ⚠ findings, each with label = where it is and text = the problem + the exact fix, followed by a `copy` output "Passed" listing the ✔ items briefly;
  - `images: []`.
- **Don't change `steps`,** and don't fix files yourself. Offer: "Muốn mình sửa luôn các mục ⚠ không?" If the user says yes, fix them in the owning step's files (Revise mode), then re-run this check.
- **Reply in Vietnamese:** the top 3 issues, then the ending block (👀 tab Kiểm tra).
