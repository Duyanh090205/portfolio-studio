---
name: studio
description: Home base of the Portfolio Studio marketing team. Use to set up or update the workspace and its HUB dashboard ("Setup Portfolio Studio", "cài đặt", "bắt đầu"), to report progress or what to do next ("tiến độ", "đang tới đâu rồi", "làm gì tiếp"), to explain usage ("hướng dẫn", "dùng sao"), to fix a broken data file ("sửa lỗi file brand.js / step.js"), to handle a bare approval with no step named ("duyệt", "ok", "chốt"), to fix a flagged layout ("Sửa bố cục [design] của [brand]"), or when unsure which marketing-team role to use.
---

# Studio: setup, progress, routing

Read `${CLAUDE_SKILL_DIR}/references/conventions.md` and `${CLAUDE_SKILL_DIR}/references/data-schema.md`. In plain chat these files sit in `references/` next to this file.

## 1. Setup / update ("Setup Portfolio Studio")
1. **Choose the workspace.**
   - Use the connected folder, or its `Portfolio Studio/` subfolder if that already holds `HUB.html`.
   - If `HUB.html` exists, go to step 4.
   - Otherwise set up in the connected folder if it is empty or nearly empty. If not, set up in a new `Portfolio Studio/` subfolder.
2. **Copy the template with one shell command:** `cp -r "${CLAUDE_SKILL_DIR}/assets/workspace/." "<workspace>/"`. Use the workspace path as the shell sees it; check it with `ls` first.
   - **Never recreate these files by reading and retyping them.** `app.js` alone is about 20k tokens.
   - If the command is refused or the shell can't see the folder, reply: "Claude cần quyền copy file để cài HUB. Khi hộp xin quyền hiện ra, bấm **Allow / Cho phép**, rồi gõ lại: Setup Portfolio Studio." If it fails again, give the starter-zip fallback from the project README: download `portfolio-studio-starter.zip`, then unzip it into the folder.
3. **Verify the copy.** Read `<workspace>/_system/VERSION`; if it is missing, the copy failed (see above). Then ask the user's name if unknown and set `"owner"` in `portfolio.js` with one Edit.
4. **Update an outdated HUB.** Compare `<workspace>/_system/VERSION` with `${CLAUDE_SKILL_DIR}/assets/workspace/_system/VERSION`. If the workspace's is older or missing, copy **only** `HUB.html` and `_system/`, the same way. Never touch `portfolio.js` or `brands/`.
5. **Reply in Vietnamese:**
   - Open the folder and double-click **HUB.html** (Chrome or Edge), then pin the tab.
   - A sample brand, CEMMY, is included to show what each team member produces.
   - Start with **"Tạo brand mới"**.

## 2. Progress ("tiến độ", "làm gì tiếp")
- For each brand in `portfolio.js`, Read the first 30 lines of `brands/<slug>/brand.js`. Skip brands with `"demo": true` unless asked.
- Reply one line per brand: the current step and its status, plus `next.say`.
- Silently run the version check from step 4.

## 3. Bare approval ("duyệt", "ok", "chốt" with no step named)
- Find the steps in `review`. If there are several brands, work in the one the user is working on.
- **Exactly one step in review:** approve it (conventions → Modes → Approve).
- **Several:** ask which one, as a numbered list of approve phrases.

## 4. Fix a broken data file ("sửa lỗi file …")
The HUB flags syntax errors in `brand.js`, `logos.js`, `portfolio.js` or `<step>/step.js`.
1. Read that file.
2. Find the problem. Common causes: a trailing comma, a missing quote, an unescaped `"`, a backtick inside an SVG.
3. Fix it with a minimal edit.
4. Tell the user to press **↻ Làm mới**.

## 5. Fix a flagged layout ("Sửa bố cục <design> của <brand>: …")
- Find the design by its title in `brands/<slug>/*/step.js`, and hand it to that step's skill in Revise mode.
- **Usual fixes:**
  - shorten the headline to 7 words or fewer;
  - move the logo or badge to a direct child of the layout;
  - choose a layout with more room (see html-guide in that skill).

## 6. How to use ("hướng dẫn")
- Explain briefly, in Vietnamese: the user is the Creative Director, each member does one job, and the HUB's **Việc tiếp theo** box always shows the next phrase.
- Point to HUB → **Hướng dẫn → Đội ngũ của bạn**.

## 7. Routing

| The user wants | Skill |
|---|---|
| A new brand (portfolio or real business) | `new-brand` |
| An existing project to import (The Label, Share A Coke, a PSA, a channel) | `import-project` |
| Monthly content calendar, weekly shoot pack, captions (real brands) | `content-planner` |
| Check a project before publishing | `project-check` |
| Logo, colours, fonts, brand board; choosing a direction; approving or revising the brand | `brand-strategist` |
| Social posts and captions | `social-media-creative` |
| Campaign idea and key visual | `campaign-designer` |
| Packaging, stickers, cards, bags | `packaging-designer` |
| Billboard, outdoor poster | `ooh-designer` |
| Proposal deck, case study, portfolio page copy | `proposal-designer` |
| Motion or video ad | `video-editor` |
| Competitor ads research, new ad concepts | `ads-manager` |
| Performance report | `report-analyst` |
| Turn a skipped step back on ("Bật lại <Step> cho <Name>") | Set that step to `todo` in brand.js, then hand over to its skill |
| Remove the sample brand ("xoá brand mẫu") | Remove its slug from `portfolio.js` and tell the user they may delete `brands/demo-cemmy/` |
