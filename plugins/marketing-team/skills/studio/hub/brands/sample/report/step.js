HUB.step("sample", "report", {
  "summary": "October's first full month shows CEMMY's engagement rate climbing to 6.8% (from 6.0%) even as reach grew 33%, led by the 'Bring The Group' promo post, while new-follower growth cools off the launch spike as expected.",
  "outputs": [
    { "id": "report", "type": "doc", "title": "Monthly report", "file": "report/report.html", "width": 1200 },
    { "id": "email-summary", "type": "copy", "title": "Email summary", "items": [
      { "label": "Email summary", "text": "[Simulated data] CEMMY social media, October 2026:\nReach: 128,400 (+33% vs September)\nEngagements: 8,750 (+51%), engagement rate up to 6.8% from 6.0%\nTop post: 'Bring The Group' promo, best reach and engagement of the month\nNew followers cooled 31% off the launch spike, in line with expectations\nAsk: approve a small paid boost for November's new-flavour post to re-accelerate follower growth" }
    ] }
  ],
  "images": []
});
