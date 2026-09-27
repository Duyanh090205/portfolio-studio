HUB.step("demo-cemmy", "video", {
  "summary": "A 15-second vertical motion ad that replays the 'Meet Under The Star' idea as a light-up ritual: the star switches on, the invite headline lands, a real evening photo grounds it, then the CTA and logo close the loop.",
  "outputs": [
    {
      "id": "motion",
      "type": "visual",
      "title": "Motion ad (15s, 9:16)",
      "file": "video/motion.html",
      "size": "1080x1920",
      "motion": true,
      "copy": {
        "kicker": "meet under the star",
        "headline": "The Star's On.<br>We're Here.",
        "sub": "Two scoops, one table, tonight.",
        "cta": "Find your table tonight →",
        "badge": "#MeetUnderTheStar"
      }
    },
    {
      "id": "storyboard",
      "type": "copy",
      "title": "Storyboard & script",
      "items": [
        { "label": "0.0–3.0s", "text": "Deep green screen. A gold star grows in with a bounce, five gold bulbs light up left to right along the bottom edge. Text fades in below: 'meet under the star'." },
        { "label": "3.0–7.0s", "text": "Kinetic type, one line per beat, bouncing up into place: 'The Star's On.' / 'We're Here.' Deep green background holds." },
        { "label": "7.0–10.5s", "text": "Cut to a real evening parlour photo (friends at a lit table), dark scrim rises from the bottom. Subline fades up: 'Two scoops, one table, tonight.'" },
        { "label": "10.5–13.0s", "text": "Cut to a gold colour-block card. CTA pill bounces in: 'Find your table tonight →', hashtag '#MeetUnderTheStar' settles underneath." },
        { "label": "13.0–15.0s", "text": "Cut to deep green end card. Logo scales in centre, tagline 'Meet Under The Star' appears in the handwritten accent font. Loop holds, then repeats." }
      ]
    }
  ],
  "images": [
    { "id": "vd-hero-night", "step": "video", "group": "Motion ad", "title": "Vertical evening star-table scene", "ratio": "9:16", "tool": "Gemini", "refs": [],
      "prompt": "A friend group of three young Vietnamese people leaning into a small round table at an evening ice cream parlour, laughing over pastel pink and deep green swirled scoops in cream cups, gold spoons catching warm bulb light. Deep green tiled wall behind them, strings of small glowing bulbs, pink scalloped awning edge visible near the top of the frame. Subject and table fill the upper half of the composition, the lower part of the frame stays calmer with soft terrazzo floor and shadow. Warm bulb key light low and off-axis, pink light spill, gold specular highlights, dusk bokeh. Nostalgic, playful, night-out mood, shot close and candid, shallow depth of field." }
  ]
});
