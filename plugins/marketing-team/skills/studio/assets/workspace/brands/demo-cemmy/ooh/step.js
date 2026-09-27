HUB.step("demo-cemmy", "ooh", {
  "summary": "Takes the campaign's key visual to the street: the same headline and evening parlour scene, cut down to one image, one giant logo and five words, built to read from a moving car or a bus queue.",
  "outputs": [
    { "id": "billboard", "type": "visual", "title": "Billboard", "file": "ooh/billboard.html", "size": "2400x1200",
      "note": "Roadside billboard, headline and logo on the left, evening parlour scene on the right",
      "copy": { "headline": "The Star's On.<br>We're Here." } },
    { "id": "poster", "type": "visual", "title": "Bus-shelter poster", "file": "ooh/poster.html", "size": "1200x1800",
      "note": "Bus-shelter or 6-sheet poster, scene on top, headline and logo below",
      "copy": { "headline": "The Star's On.<br>We're Here." } },
    { "id": "copy", "type": "copy", "title": "OOH copy & placement", "items": [
      { "label": "Final line", "text": "The Star's On. We're Here." },
      { "label": "Placement: billboard", "text": "Main roads and intersections near CEMMY parlours in Ho Chi Minh City, timed for the 5-9pm commute so the lit-sign idea lands right when the evening ritual starts." },
      { "label": "Placement: bus-shelter poster", "text": "Bus shelters and 6-sheet frames within a short walk of each parlour, catching foot traffic already deciding where to go for the evening." },
      { "label": "Why", "text": "Both formats keep the campaign's single idea, the lit star sign as an open invitation, readable in three seconds with no supporting copy needed (assumed: placements based on typical HCMC parlour catchment, not a media plan)." }
    ] }
  ],
  "images": [
    { "id": "oh-billboard-mockup", "step": "ooh", "group": "Billboard", "title": "Billboard street mockup", "ratio": "16:9", "tool": "Gemini", "refs": [], "style": "none",
      "prompt": "A daylight street scene in Ho Chi Minh City with a large blank roadside billboard on steel legs beside a busy road, motorbikes and cars passing, palm trees and low buildings in the background, soft midday light. Place the attached billboard design onto the blank board, keep it undistorted." },
    { "id": "oh-poster-mockup", "step": "ooh", "group": "Bus-shelter poster", "title": "Bus-shelter poster mockup", "ratio": "4:5", "tool": "Gemini", "refs": [], "style": "none",
      "prompt": "A city bus shelter at dusk with a blank illuminated poster panel on its side wall, a bus stop sign and pavement in view, a few pedestrians waiting, warm street lamps starting to glow. Place the attached poster design onto the blank lit poster, keep it undistorted." }
  ]
});
