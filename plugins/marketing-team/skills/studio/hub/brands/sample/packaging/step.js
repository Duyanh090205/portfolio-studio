HUB.step("sample", "packaging", {
  "summary": "The pint tub stays the hero pack, its cream sign-panel repeating the plaque logo and a Caveat flavour line. Variants are colour-coded by a lid band, Neon Blush for strawberry-led, Blueberry Night for blueberry-led, and a Marquee Gold band marks a limited 'Meet Under The Star' run, tying packaging straight back to the campaign.",
  "outputs": [
    { "id": "pack-front", "type": "visual", "title": "Pint tub front", "file": "packaging/pack-front.html", "size": "1200x1500",
      "note": "Hero pack: logo, flavour claim and net content on the Parlour Green field",
      "copy": { "kicker": "signature swirl", "headline": "Two Flavors.<br>One Star.", "sub": "Strawberry & blueberry, swirled for sharing.", "badge": "1 PINT · 473 ML" } },
    { "id": "pack-seal", "type": "visual", "title": "Lid seal", "file": "packaging/pack-seal.html", "size": "1000x1000",
      "note": "Sticker for the pint lid, doubles as a box or bag seal",
      "copy": { "headline": "Meet Us<br>Tonight", "sub": "under the star" } },
    { "id": "bag-front", "type": "visual", "title": "Paper bag", "file": "packaging/bag-front.html", "size": "1200x1400",
      "note": "Takeaway and delivery bag front",
      "copy": { "kicker": "meet under the star", "sub": "Tonight, two scoops, one table." } },
    { "id": "thank-you-card", "type": "visual", "title": "Thank-you card", "file": "packaging/thank-you-card.html", "size": "1500x1050",
      "note": "A6 insert card dropped into every bag",
      "copy": { "kicker": "thank you", "headline": "Thanks For<br>Stopping By.", "sub": "The star's on again tomorrow. Bring the group back.", "cta": "Tag @cemmy #MeetUnderTheStar" } },
    { "id": "copy", "type": "copy", "title": "Pack copy", "items": [
      { "label": "Product name", "text": "CEMMY Signature Swirl" },
      { "label": "Variant: Signature Swirl", "text": "Strawberry x blueberry, half and half in one scoop, the house special." },
      { "label": "Variant: Blush Strawberry", "text": "Strawberry-led, coded Neon Blush on the lid band." },
      { "label": "Variant: Night Blueberry", "text": "Blueberry-led, coded Blueberry Night on the lid band." },
      { "label": "Variant: Star Gold (limited)", "text": "Limited 'Meet Under The Star' run, coded Marquee Gold on the lid band." },
      { "label": "Key claim", "text": "Two Flavors. One Star." },
      { "label": "Back-of-pack story", "text": "Tonight, the star's on. Inside this tub: a swirl of Saigon strawberries and blueberries, spun together under warm bulb light, made for more than one spoon. Grab two, pull up a table, and let it melt slow. When the sign glows, CEMMY's the plan. Meet us under the star." },
      { "label": "Tone check", "text": "Short, plural-address, invitation-plus-time, in the shop-sign voice from the brand kit (assumed consistent, worth a read-aloud check before print)." }
    ] }
  ],
  "images": [
    { "id": "pk-product", "step": "packaging", "group": "Pint tub front", "title": "Swirl product art", "ratio": "1:1", "tool": "Gemini", "style": "none", "refs": [],
      "prompt": "Flat vector illustration of a scoop of strawberry and blueberry swirled ice cream, thick uniform Midnight Cocoa outlines, three flat fills per shape, no gradients. Pink and deep purple swirl in a simple cream cup, a small gold star with rounded tips and a friendly dot-eyed face peeking from behind the scoop, one stubby arm waving. Centered composition on a transparent-feeling flat cream background, playful and warm, no text." },
    { "id": "pk-range", "step": "packaging", "group": "Packaging range", "title": "Full packaging range", "ratio": "4:3", "tool": "Gemini", "refs": ["logo-primary"],
      "prompt": "Product photography of an ice cream packaging range on cream terrazzo: a deep green pint tub with an attached logo on a cream sign-panel label, two cream paper cups with gold spoons, and a small cream paper bag, arranged together with pink and blueberry swirl ice cream visible in one open cup. Deep green glazed tile background, warm bulb key light low and off-axis, pink light spill, gold specular highlights, dusk mood. Clean commercial product photography." },
    { "id": "pk-bags", "step": "packaging", "group": "Paper bag & tote", "title": "Bag, tote and tape", "ratio": "4:3", "tool": "Gemini", "refs": ["logo-primary"],
      "prompt": "Flat lay of cream paper packaging: a paper delivery bag with the attached logo printed large on the front, a cream canvas tote with a small embroidered star symbol, and a roll of cream packing tape with a repeating gold sparkle and pink dot pattern, on a deep green glazed tile surface. Warm bulb light from one side, pink light spill, gold specular highlights, dusk mood, no extra props." },
    { "id": "pk-unboxing", "step": "packaging", "group": "Unboxing moment", "title": "Opening the pack", "ratio": "4:5", "tool": "Gemini", "refs": ["logo-primary"],
      "prompt": "Close, candid photo of two hands lifting the lid off a deep green pint tub with the attached logo on its cream sign-panel label, strawberry and blueberry swirl ice cream visible inside, on a cream terrazzo table with a gold spoon resting nearby. Warm bulb key light low and off-axis, pink light spill, gold specular highlight on the tub's rim, dusk bokeh in the background, nostalgic and generous mood, shallow depth of field." }
  ]
});
