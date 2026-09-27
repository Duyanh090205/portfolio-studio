HUB.step("demo-cemmy", "ads", {
  "summary": "Desk research (unverified): no competitor screenshots or live search were available, so patterns below come from general knowledge of Baskin Robbins, Häagen-Dazs and Van Leeuwen. Across the category, ads sell the product (flavor, texture, order-now); none sell the group hangout occasion. CEMMY's lit marquee star and evening-parlour world are an ownable ritual cue no competitor uses, so all three concepts extend the 'Meet Under The Star' platform into paid social.",
  "outputs": [
    { "id": "analysis", "type": "doc", "title": "Competitive analysis", "file": "ads/analysis.html" },
    { "id": "ad-1", "type": "visual", "title": "Ad: The Star's On", "file": "ads/ad-1.html", "size": "1080x1080",
      "note": "Photo-led hero ad, evening invite angle",
      "copy": { "kicker": "meet under the star", "headline": "Tonight, The Star Is Lit", "sub": "Grab a table before it melts.", "cta": "Find your table tonight →", "badge": "OPEN TONIGHT" } },
    { "id": "ad-2", "type": "visual", "title": "Ad: Built To Split", "file": "ads/ad-2.html", "size": "1080x1080",
      "note": "Split layout, social-object angle",
      "copy": { "kicker": "built to split", "headline": "One Scoop.<br>Two Spoons.", "sub": "Strawberry meets blueberry, made to share.", "cta": "Split the star scoop →", "badge": "2 SPOONS" } },
    { "id": "ad-3", "type": "visual", "title": "Ad: Tag Your Star Table", "file": "ads/ad-3.html", "size": "1080x1080",
      "note": "Type-led layout, UGC mechanic angle",
      "copy": { "kicker": "the mechanic", "headline": "Tag Your<br>Star Table", "sub": "Every table's got a number. Yours is next.", "cta": "Claim your table →", "badge": "#MeetUnderTheStar" } },
    { "id": "ad-copy", "type": "copy", "title": "Ad copy (Meta)", "items": [
      { "label": "The Star's On — Primary text", "text": "The star's on — that's tonight's invite. Grab the crew and split a swirl under the lights." },
      { "label": "The Star's On — Headline", "text": "The Star's On. We're Here." },
      { "label": "The Star's On — Description", "text": "Find your table tonight" },
      { "label": "The Star's On — CTA button", "text": "Get Directions" },
      { "label": "Built To Split — Primary text", "text": "Strawberry meets blueberry in one swirl built for two spoons. Bring someone worth splitting a scoop with." },
      { "label": "Built To Split — Headline", "text": "One Scoop, Two Spoons" },
      { "label": "Built To Split — Description", "text": "Split the star scoop" },
      { "label": "Built To Split — CTA button", "text": "Order Now" },
      { "label": "Tag Your Star Table — Primary text", "text": "Every CEMMY table sits under its own numbered star. Tag yours, claim it, and watch the map light up." },
      { "label": "Tag Your Star Table — Headline", "text": "Tag Your Star Table" },
      { "label": "Tag Your Star Table — Description", "text": "Claim table No. tonight" },
      { "label": "Tag Your Star Table — CTA button", "text": "Learn More" }
    ] }
  ],
  "images": [
    { "id": "ad-1-bg", "step": "ads", "group": "Ad: The Star's On", "title": "Evening star-sign invite", "ratio": "1:1", "tool": "Gemini", "refs": [],
      "prompt": "An evening ice cream parlour storefront at dusk, seen from across the street, with a glowing gold star sign lit above a pink scalloped awning and a deep green tiled facade. A few young friends are walking toward the entrance, warm bulb light spilling onto the cream terrazzo doorstep. Strings of small bulbs line the awning edge, dusk bokeh from street lights in the background. Warm bulb key light, low and off-axis, pink light spill, gold specular highlights. Nostalgic, inviting, night-bright mood, shot from a slight low angle." },
    { "id": "ad-2-bg", "step": "ads", "group": "Ad: Built To Split", "title": "Two spoons splitting one scoop", "ratio": "1:2", "tool": "Gemini", "refs": [],
      "prompt": "Close-up of two gold spoons meeting in the middle of one cream cup filled with a swirled pink and blue ice cream scoop, held between two pairs of hands from opposite sides of a small round table. Deep green tiled surface below, a few blueberries and strawberry pieces scattered nearby, warm bulb light glowing softly out of focus behind. Warm bulb key light, low and off-axis, pink light spill, gold specular highlights on the spoons. Playful, generous, close and candid mood, shallow depth of field." },
    { "id": "ad-3-bg", "step": "ads", "group": "Ad: Tag Your Star Table", "title": "Numbered star table marker", "ratio": "1:1", "tool": "Gemini", "refs": [],
      "prompt": "A small round parlour table seen from above, cream terrazzo tabletop, with a small round brass table-number marker shaped like a star sitting in the center next to two cups of pastel pink and blueberry swirled ice cream and two gold spoons. Deep green tile visible at the table's edge, warm bulb light glowing from just outside the frame. Warm bulb key light, low and off-axis, pink light spill, gold specular highlights on the brass marker and spoons. Playful, inviting, shareable mood, flat overhead composition with room around the edges." }
  ]
});
