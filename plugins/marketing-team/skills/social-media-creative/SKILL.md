---
name: social-media-creative
description: Team member 2, Social Media Creative. Turns the approved brand kit into on-brand social content for a Portfolio Studio brand. Makes 3 content pillars, 4 feed posts plus 1 story as HTML visuals, captions with hashtags, and the background photo tasks. Use when the user says "Làm Social Media cho [brand]", "làm post", "làm content mạng xã hội", "social media", "làm tiếp social", or wants to approve ("duyệt social") or revise ("sửa post…", "đổi headline…") that step.
---

# Social Media Creative: team member 2

**Only approving?** ("duyệt social", "ok", "chốt") Don't read the references.
1. Read `brands/<slug>/brand.js`.
2. Make one Edit:
   - `steps.social-media` → `done`, with today's date;
   - `next` → the first main step not `done` (brand-strategist, social-media, campaign, packaging, ooh, proposal). Use its approve phrase if it's `review`, its choose phrase if `doing`, and "Làm <Step> cho <Name>" if `todo`.
   - Add to `next.text`: "(Tuỳ chọn: 'Làm Ads research cho <Name>' trước để Campaign có insight đối thủ.)"
3. Re-read to verify, then reply in 2 lines.

Otherwise, read `${CLAUDE_SKILL_DIR}/references/conventions.md`, `${CLAUDE_SKILL_DIR}/references/html-guide.md` and `brands/<slug>/brand.js` in one message. In plain chat the references sit in `references/` next to this file. Follow the conventions' Build, Revise and Continue modes. Step id: `social-media`. Folder: `brands/<slug>/social-media/`.

## By project type (read `projectType`)

| Type | Build instead of, or in addition to, the 5 standard posts |
|---|---|
| `fictional` / `concept` | The standard set below |
| `real-brand` | TikTok-first: 2 trend or format **storyboards** (a `doc` with 6–8 frames each: shot, on-screen text, audio idea), a **creator brief** (`doc`: deliverables, do/don't, disclosure, KPIs, no real creator names) and 3 posts. Put the disclaimer in each visual's `note` |
| `cause` | **Partner toolkit:** 4 shareable posts that partners (schools, clinics, community groups) can repost, 1 story, and caption variants per partner. Flag translations "needs native review" |
| `content` | **Series system:** 3 pillar cover templates (1080x1920), hook rewrites for the best videos (from report/step.js), and a posting rhythm |
| `live` | **Launch kit:**<br>• bio (EN + VI)<br>• 5 highlight covers (1080x1920)<br>• 3 pinned posts<br>• a 3-post teaser sequence<br>• a `copy` output "**Reply playbook**": FAQs (caffeine, grade, origin, shipping), handling negative comments, creator DM templates with gifting disclosure, and a do-not-say list.<br>Product photos are `"tool": "Camera"` shot briefs. Run compliance.md and fill `checks` |

## Build
1. **Plan the feed.** Choose 3 content pillars that serve `brief.audience` and `kit.essence`. Every post must support the brand's core idea, and none may contradict it. For example, a "made for two" brand never says "split three ways".
   - For `concept`, check every line against the user's own material in `input/` (how the system works, product names, timings) and never report outcomes as if they exist (conventions, Honesty).
   - If `input/` has screens of the product's app or system, show one in the set with `data-img="input/…"`: it proves the idea better than any claim.
2. **Write these 5 visuals in one batch.** Each is a small HTML file using the layout kit, with exactly one logo.

| Output id | Title | Size | Layout | Purpose |
|---|---|---|---|---|
| `post-launch` | Launch post | 1080x1350 | `l-photo` | Product launch or hero announcement |
| `post-promo` | Promo post | 1080x1350 | `l-split` + `badge round` with the offer | A clear offer that fits the brand, e.g. a bundle, second-item deal or free topping |
| `post-awareness` | Brand personality post | 1080x1350 | `l-card` | Mascot, value or ritual |
| `post-seasonal` | Seasonal post | 1080x1350 | `l-type` | A seasonal or cultural moment for the audience's market |
| `story-launch` | Launch story | 1080x1920 | `l-photo` | Story version. No CTA pill (the user adds a link sticker in the app); write the sticker text in `note` |

3. **Image tasks:** one photo per visual unless an existing photo fits (reuse first, see conventions), with ids `sm-launch`, `sm-promo`, `sm-awareness`, `sm-seasonal` and `sm-story`. Set each `ratio` from the html-guide slot table:
   - launch 4:5;
   - promo 16:10;
   - awareness 5:4;
   - seasonal 1:1;
   - story 9:16.

   Write each composition for its layout.
4. **Write `social-media/step.js`:**
   - `summary`: the pillars and how the feed stays consistent;
   - `outputs`: the 5 visuals, each with `title` and `copy`, plus a `copy` output "Captions & hashtags" with two items per post:
     - `"<Title>"`: 2–4 short lines in brand voice, ending "Link in bio." (captions can't hold tappable arrows), then at most 5 relevant hashtags (no generic hype tags, none owned by other brands);
     - `"<Title> · alt text"`: "Text: <the on-image text>." then what the photo actually shows.
     - The story item holds only the link-sticker text, with no hashtags.
   - `images`: the 5 photo tasks.
5. **Edit `brand.js`:**
   - `steps.social-media` → `review`;
   - `next` → `{ "text": "Xem 5 thiết kế ở tab Social, rồi tạo ảnh ở tab Ảnh cần tạo. Ưng thì duyệt, hoặc gõ thẳng lệnh bước tiếp theo.", "say": "Duyệt Social Media <Name>" }`.
6. **Verify, then reply** with the ending block.
