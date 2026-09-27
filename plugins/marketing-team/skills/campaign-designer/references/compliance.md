# Compliance checklist: real brands and real-brand campaigns

This file covers `live` (the user's real business) and `real-brand` (unsolicited spec campaign) projects. It is not legal advice. Tell the user to confirm anything uncertain with the relevant agency.

## Food and drink claims (US: FDA + FTC)
- **Allowed:** taste, texture, origin (only if verifiable, e.g. with a COA or supplier documents), process, ritual, serving ideas, and measured caffeine per serving.
- **Avoid in all copy, including ads, captions and packaging:**
  - "boosts metabolism", "burns fat", "detox", "cleanse";
  - "calms anxiety", "improves focus", "immunity";
  - "cures/prevents", "superfood" as a health promise.
- **Nutrient claims** ("high in antioxidants", "low sugar", "0 calories") trigger FDA labelling rules. They also cancel the small-business nutrition-label exemption. Leave them out unless the user has lab data and a compliant label.
- **"Ceremonial grade"** is not a regulated term. Explain it (harvest, origin, grind) rather than implying a certification.
- **Origin** claims like "Uji", "Japan" or "single-origin" must match supplier documents. Flag them for the user to verify.

## Endorsements and reviews (FTC)
- Gifted or paid creators must disclose clearly: #ad, #gifted, or "Paid partnership". Put the reminder in every creator DM template.
- **Never** write fake reviews or testimonials, including AI-generated "customers". Only quote real people who gave permission.

## AI content labels
- AI-generated photoreal images and video posted by a real brand should use the platform's AI label (Instagram "AI info", TikTok "AI-generated"). ChatGPT and Gemini images carry C2PA/SynthID metadata and may be labelled automatically.
- Prefer real product photos. Use AI only for moodboards, backgrounds, illustration and textures, and mark those tasks `"ai": true`.

## Names, trademarks, permits
- **Before launch** (put these in `brand.checklist`):
  - USPTO trademark search (tea is class 30, café services class 43: https://www.uspto.gov/trademarks/search);
  - Instagram/TikTok handle and domain availability (https://namechk.com/).
- **Florida food businesses:** repacking or selling food/drinks may need an FDACS food permit or a DBPR temporary-event licence. Tell the user to ask the agency; don't assert the answer.
- **`real-brand` spec work:**
  - never redraw or imitate the real logo;
  - use official files the user supplies, or a "[brand logo]" placeholder;
  - no real employees, celebrities or creators by name or face;
  - add the disclaimer: "Unsolicited concept. Not affiliated with or endorsed by <Owner>. Trademarks belong to their owners."
  - Check the concept against the brand's own rules the user quoted, e.g. "no health claims on pack" means no "0 CALORIES".

## How to report it
Add `"checks": ["…", "…"]` to your step.js. List each rule you checked with ✔, and each problem with ⚠ plus a fix. Mention any ⚠ items to the user in one line.
