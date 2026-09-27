HUB.step("demo-cemmy", "campaign", {
  "summary": "Groups don't schedule an ice-cream stop, they drift toward whoever's table is already lit up and posting — CEMMY can own that pull instead of competing on flavor claims alone (assumed).",
  "choices": [
    {
      "id": "A",
      "name": "Two Flavors, One Star",
      "summary": "Make the swirl itself the reason to share: one scoop built for two spoons.",
      "details": [
        "Insight: Splitting a scoop with a friend already feels like teamwork before the first bite (assumed: validate with a poll or social listening).",
        "Headline: One Scoop, Two Of You.",
        "CTA: Split the star scoop tonight",
        "Why it works: Turns the strawberry-blueberry swirl from a flavor fact into a social object, product truth carries the whole campaign."
      ]
    },
    {
      "id": "B",
      "name": "Meet Under The Star",
      "summary": "Own the evening ritual: the lit star sign becomes the city's unofficial meet-up spot.",
      "details": [
        "Insight: nobody plans an ice-cream run in advance, they show up where a friend is already sitting, so the invite has to come from the shop, not the calendar (assumed).",
        "Headline: The Star's On. We're Here.",
        "CTA: Find your table tonight",
        "Why it works: Builds directly on the existing tagline and parlour-marquee world, gives the brand a nightly occasion instead of a generic 'treat' claim."
      ]
    },
    {
      "id": "C",
      "name": "Star Table Tags",
      "summary": "A UGC mechanic: every table sits under its own numbered star light, and tagging it is the whole post.",
      "details": [
        "Insight: Gen Z already photographs the moment before it melts, giving the ritual a name and a number turns their own habit into a shareable format (assumed).",
        "Headline: Tag Your Star Table.",
        "CTA: Claim table No. under the star",
        "Why it works: Community mechanic that scales itself through repost and check-ins, builds a visible map of stars across the city over time."
      ]
    }
  ],
  "chosen": "B",
  "outputs": [
    {
      "id": "platform",
      "type": "copy",
      "title": "Campaign platform",
      "items": [
        { "label": "Campaign name", "text": "Meet Under The Star" },
        { "label": "Objective (business)", "text": "Drive evening foot traffic and repeat visits at CEMMY parlours (goal)." },
        { "label": "Objective (communication)", "text": "Position CEMMY as the city's go-to evening meet-up spot, not just an ice cream stop." },
        { "label": "Target", "text": "Gen Z and young millennials in Ho Chi Minh City who turn a spontaneous evening into a hangout." },
        { "label": "Insight", "text": "Nobody plans an ice-cream run in advance, they show up where a friend is already sitting, so the invite has to come from the shop, not the calendar (assumed: validate with a poll or social listening)." },
        { "label": "Big idea", "text": "The lit star sign is an open invitation: when it's on, the parlour is the plan." },
        { "label": "Key message", "text": "The star's on, we're here. Come sit under it." },
        { "label": "Reason to believe", "text": "Every CEMMY parlour has a working gold star sign that switches on at dusk, a ready-made evening ritual built into the storefront itself." },
        { "label": "Headline", "text": "The Star's On. We're Here." },
        { "label": "Subline", "text": "Two scoops, one table, tonight." },
        { "label": "CTA", "text": "Find your table tonight" },
        { "label": "Hashtag", "text": "#MeetUnderTheStar" },
        { "label": "Channels & roll-out", "text": "IG/TikTok story series of the star switching on at dusk as the daily 'invite', geo-boosted 6-9pm; the storefront marquee is the activation itself; local micro-influencers post 'star table' check-ins (assumed)." },
        { "label": "Success metrics", "text": "+20% evening (6-9pm) foot traffic in 6 weeks (goal); 500+ #MeetUnderTheStar tags in the first month (goal)." }
      ]
    },
    {
      "id": "kv-portrait",
      "type": "visual",
      "title": "Key visual (portrait)",
      "file": "campaign/kv-portrait.html",
      "size": "1080x1350",
      "note": "Master key visual for feed and print",
      "copy": { "kicker": "meet under the star", "headline": "The Star's On.<br>We're Here.", "sub": "Two scoops, one table, tonight.", "cta": "Find your table tonight →", "badge": "OPEN" }
    },
    {
      "id": "kv-landscape",
      "type": "visual",
      "title": "Key visual (banner)",
      "file": "campaign/kv-landscape.html",
      "size": "1920x1080",
      "note": "Same idea for web banner or YouTube",
      "copy": { "kicker": "meet under the star", "headline": "The Star's On.<br>We're Here.", "sub": "Two scoops, one table, tonight.", "cta": "Find your table tonight →", "badge": "OPEN" }
    }
  ],
  "images": [
    { "id": "cp-hero", "step": "campaign", "group": "Key visual (portrait)", "title": "Evening star-table scene", "ratio": "3:2", "tool": "Gemini", "refs": [],
      "prompt": "A friend group of three young Vietnamese people leaning into a small round table at an evening ice cream parlour, laughing over pastel pink and deep green swirled scoops in cream cups, gold spoons catching warm bulb light. Deep green tiled wall behind them, strings of small glowing bulbs, pink scalloped awning edge just visible at frame top. Warm bulb key light low and off-axis, pink light spill, gold specular highlights, dusk bokeh outside a window. Nostalgic, playful, night-out mood, shot close and candid, shallow depth of field." },
    { "id": "cp-hero-wide", "step": "campaign", "group": "Key visual (banner)", "title": "Wide evening parlour scene", "ratio": "1:1", "tool": "Gemini", "refs": [],
      "prompt": "Wide view inside an evening ice cream parlour, two friend groups at separate small round tables under a row of glowing gold bulbs, cream terrazzo floor and deep green tiled wall, pastel pink and blueberry swirled scoops on the tables. Warm bulb key light low and off-axis, pink light spill, gold specular highlights on spoons and glass, dusk bokeh through a window in the background. Nostalgic, playful, generous, night-bright mood, candid documentary framing with room left on both sides for text panels." }
  ]
});
