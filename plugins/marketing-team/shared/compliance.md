# Compliance checklist: real brands and real-brand campaigns

This file covers `live` (the user's real business) and `real-brand` (unsolicited spec campaign) projects, and the claims and pack rules of `concept` brands, so their portfolio pieces would survive a real launch. It is not legal advice. Tell the user to confirm anything uncertain with the relevant agency.

## Food and drink claims (US: FDA + FTC)
- **Allowed:** taste, texture, origin (only if verifiable, e.g. with a COA or supplier documents), process, ritual, serving ideas, and measured caffeine per serving.
- **Avoid in all copy, including ads, captions and packaging:**
  - "boosts metabolism", "burns fat", "detox", "cleanse";
  - "calms anxiety", "improves focus", "immunity";
  - "cures/prevents", "superfood" as a health promise.
- **Nutrient claims** ("high in antioxidants", "low sugar", "0 calories") trigger FDA labelling rules. They also cancel the small-business nutrition-label exemption. Leave them out unless the user has lab data and a compliant label.
- **"Ceremonial grade"** is not a regulated term. Explain it (harvest, origin, grind) rather than implying a certification.
- **Origin** claims like "Uji", "Japan" or "single-origin" must match supplier documents. Flag them for the user to verify.

## Cosmetics (US: FDA + FTC; not legal advice)
- **Net contents** on the principal display panel, in its lower 30%, e.g. "1 fl oz (30 mL)".
- **Ingredients:** INCI names in descending order of amount; those at 1% or less may follow in any order.
- **Distributor:** "Distributed by <name>, <city>, <state> <ZIP>".
- **MoCRA:** a US phone number, address or website where consumers can report adverse events.
- **AHA products** (glycolic, lactic, mandelic acid) carry the FDA Sunburn Alert: "Sunburn Alert: This product contains an alpha hydroxy acid (AHA) that may increase your skin's sensitivity to the sun and particularly the possibility of sunburn. Use a sunscreen, wear protective clothing, and limit sun exposure while using this product and for a week afterwards."
- **No drug words** on a cosmetic: "acne", "rosacea", "treats", "heals", "cures" (they make it a drug).
- **No self-certifying badges** ("Verified", "Clinically proven", "Dermatologist approved") without evidence the user can show.
- **Outcome lines** carry a footnote: "*Based on <n> <who> at week <x>." For `concept` brands, outcome numbers come only from the user's own mock UI, clearly marked "Prototype screen; sample entries."

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
