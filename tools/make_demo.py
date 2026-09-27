"""Package a finished test brand as the read-only sample brand shipped with the plugin.

    python tools/make_demo.py "E:/Portfolio Studio Test v3/brands/cemmy"

Copies it to skills/studio/assets/workspace/brands/demo-cemmy, renames the slug, marks it
"demo": true with every step done, and lists it in the template portfolio.js.
"""
from pathlib import Path
import json
import re
import shutil
import sys

ROOT = Path(__file__).resolve().parent.parent
WS = ROOT / "plugins" / "marketing-team" / "skills" / "studio" / "assets" / "workspace"
SLUG = "demo-cemmy"

src = Path(sys.argv[1])
old = src.name
dst = WS / "brands" / SLUG
if dst.exists():
    shutil.rmtree(dst)
shutil.copytree(src, dst)

for p in dst.rglob("*.js"):
    s = p.read_text(encoding="utf-8")
    s = s.replace(f'HUB.logos("{old}"', f'HUB.logos("{SLUG}"').replace(f'HUB.step("{old}"', f'HUB.step("{SLUG}"')
    if p.name == "brand.js":
        body = s[s.index("(") + 1: s.rindex(")")]
        d = json.loads(body)
        d["slug"] = SLUG
        d["demo"] = True
        for k in d.get("steps", {}):
            d["steps"][k]["status"] = "done"
        d["next"] = {"text": "Đây là brand mẫu để tham khảo: mỗi tab là kết quả của một thành viên. Bắt đầu brand của bạn:",
                     "say": "Tạo brand mới"}
        s = "HUB.brand(" + json.dumps(d, ensure_ascii=False, indent=2) + ");\n"
    p.write_text(s, encoding="utf-8", newline="\n")

(WS / "portfolio.js").write_text('HUB.portfolio({\n  "owner": "",\n  "brands": ["' + SLUG + '"]\n});\n', encoding="utf-8", newline="\n")
n = sum(1 for _ in dst.rglob("*") if _.is_file())
print(f"sample brand -> {dst} ({n} files)")
