---
name: report-analyst
description: Report Analyst (extra team member). Collects social media performance data for a Portfolio Studio brand and turns it into a client-ready monthly report dashboard in HTML (KPIs, weekly trend, platform engagement, top posts, content format performance, audience, insights and next steps) plus a short email summary. Uses the user's CSV/XLSX exports or Google Drive data if available; for fictional and concept brands with no data it builds a measurement framework (KPIs, methods, modeled targets) instead of inventing results. Use when the user says "Làm Report cho [brand]", "báo cáo số liệu", "social media report", "tổng hợp số liệu", "dữ liệu ở Google Drive", or wants to approve ("duyệt report") or revise that step.
---

# Report Analyst: extra team member

**Only approving?** ("duyệt report", "ok", "chốt") Don't read the references.
1. Read `brands/<slug>/brand.js`.
2. Make one Edit:
   - `steps.report` → `done`, with today's date;
   - `next` → the first main step not `done`, else the first extra not `done`, else done. If a proposal already exists, suggest "Cập nhật Proposal cho <Name>".
3. Re-read to verify, then reply in 2 lines.

Otherwise, read `${CLAUDE_SKILL_DIR}/references/conventions.md`, `${CLAUDE_SKILL_DIR}/references/html-guide.md`, `brands/<slug>/brand.js` and `brands/<slug>/social-media/step.js` (if it exists, to name the top posts) in one message. Then Glob `brands/<slug>/report/input/`. Step id: `report`. Folder: `brands/<slug>/report/`.

## Data: be honest about the source
1. **`report/input/` has CSV or XLSX exports:** use only those.
2. **Otherwise, if a Google Drive tool is available:** search once for "<Name>" sheets or CSVs, and confirm with the user before using them.
3. **Otherwise, for `fictional` and `concept`:** nothing has launched, so there are no results. Build the **Measurement framework** (below). Never produce simulated performance numbers meant for the portfolio.
   - Only if the user explicitly asks for a practice dashboard (`fictional` only): simulate one realistic month for a new brand in `brief.market`, with a small but engaged following, on the platforms the social plan uses. Set last month's raw numbers first and derive every change from them (engagement rate = engagements / reach; the rate change is computed, not invented). Header: "Simulated data: practice dashboard, not for the portfolio". Proposal never quotes it.

## Mode by project type (read `projectType`)

| Type | Mode | Rules |
|---|---|---|
| `fictional` | **Measurement framework** | Targets "(modeled)" from cited numbers only. A simulated practice dashboard only on explicit request, labelled "(simulated)", never for the portfolio |
| `concept` | **Measurement framework** | Targets "(modeled)" from cited numbers in `sources`/`existing` only. Never simulated |
| `real-brand` | **Measurement plan** | Targets only, never actuals. KPI framework (awareness → engagement → participation → sales), targets with rationale, tools, cadence |
| `cause` | **Research data** | Charts from their survey or report data in `input/`. Label n and sample type (e.g. "convenience sample"); give insights and implications. No invented outcomes |
| `content` | **Creator analytics** | From a TikTok Studio / Instagram export or screenshots in `input/`: per-video views, average watch time, completion, traffic source; what performed; lessons. Label the date range and add a small-sample caveat |
| `live` | **Real monthly** | Meta/TikTok exports in `report/input/`, plus business numbers the user types in (waitlist, orders, pop-up sales). Compare month over month. End with `insights` the Content Planner reads next month |

Never simulate for `concept`, `cause`, `content` or `live`. If real data is missing, ask for it.

## Measurement framework (`fictional`, `concept`; in one batch)
Also read the research text in `brands/<slug>/input/` (see conventions, Ground everything).
1. **Write `report/report.html`**, a `doc` (no charts needed):
   1. **Header:** the logo (`.logo.inline`, in the text flow), "<Brand> Measurement Framework", the type label and "Pre-launch plan: no results yet".
   2. **Four rows, Awareness · Engagement · Conversion · Trust:** KPI, how it is measured (tool, cadence), target, and the target's basis.
      - A target only when derived from a cited number in `sources`/`existing` or the research text. Show the derivation (e.g. "(Author, Year) benchmark × …") and mark it "(modeled)". Otherwise write "Target set after a 30-day baseline".
      - Never repeat or conflict with a number in `existing` (e.g. a beta-tester count or a modeled rate).
   3. **Leading signals** and what would change the plan (3 bullets).
   4. **Timeline:** baseline, first read, review.
   5. A "Sources:" footnote.
2. **Write `report/step.js`:** `summary` (the measurement logic in 2 sentences); `outputs`: the `doc` "Measurement framework" and a `copy` output "Measurement (page copy)" with the four rows as ready-to-paste lines (Proposal reuses them); `images: []`.
3. **Edit `brand.js`** and **verify** as in Build steps 3–4 below.

## Build a data report (real exports, or the practice dashboard; in one batch)
1. **Write `report/report.html`**, a `doc` using Chart.js (html-guide chart rules). Put the data in one `const DATA = {...}` at the top. Sections:
   1. **Header** with the logo (`.logo.inline`, in the text flow), "<Brand> Social Media Report: <Month Year>" and the data-source label.
   2. **KPI cards:** reach, engagements, new followers, engagement rate, each with its change vs. last month.
   3. **Weekly reach and engagement:** line chart, engagement on a `y1` axis.
   4. **Engagement rate by platform:** bar chart (rates are not shares).
   5. **Top 5 posts by reach:** use the social-media post titles when they exist.
   6. **Performance by content format:** horizontal bar.
   7. **Top topics:** share of engagement, as a doughnut (shares sum to 100%).
   8. **Audience:** gender, age bands, top regions in `brief.market`.
   9. **3 key insights and 3 recommendations,** specific and tied to the numbers.
2. **Write `report/step.js`:**
   - `summary`: the headline finding;
   - `outputs`: the `doc` "Monthly report", plus a `copy` output "Email summary" (5 lines for a client or boss: the 3 numbers that matter and one ask; start with "[Simulated data]" when simulated);
   - `images: []`.
3. **Edit `brand.js`:**
   - the step → `review`;
   - `next` → `{ "text": "Xem báo cáo ở tab Report. Xuất PDF: Mở riêng → Ctrl+P → Lưu PDF (tích Đồ họa nền). Ưng thì duyệt.", "say": "Duyệt Report <Name>" }`.
4. **Verify, then reply** with the ending block.
