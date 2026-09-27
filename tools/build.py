"""Build release artifacts into dist/:

  dist/marketing-team.zip             the plugin, for Claude Desktop → Customize → Plugins → Upload plugin
  dist/portfolio-studio-starter.zip   the workspace template (HUB + sample brand), manual-setup fallback

Also syncs shared/ into every skill and normalises text files to LF. Run:  python tools/build.py
"""
from pathlib import Path
import runpy
import zipfile

ROOT = Path(__file__).resolve().parent.parent
PLUGIN = ROOT / "plugins" / "marketing-team"
WORKSPACE = PLUGIN / "skills" / "studio" / "hub"
DIST = ROOT / "dist"
TEXT = {".md", ".js", ".json", ".css", ".html", ".txt", ".py", ".svg"}

runpy.run_path(str(ROOT / "tools" / "sync_shared.py"))

# normalise line endings to LF (some skill loaders reject "---\r\n" frontmatter)
for p in list(PLUGIN.rglob("*")) + list((ROOT / ".claude-plugin").rglob("*")):
    if p.is_file() and p.suffix.lower() in TEXT:
        b = p.read_bytes()
        if b"\r\n" in b:
            p.write_bytes(b.replace(b"\r\n", b"\n"))

DIST.mkdir(exist_ok=True)


def zip_dir(src: Path, out: Path, skip=lambda rel: False) -> int:
    n = 0
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for p in sorted(src.rglob("*")):
            rel = p.relative_to(src).as_posix()
            if p.is_file() and not skip(rel):
                z.write(p, rel)
                n += 1
    return n


n1 = zip_dir(PLUGIN, DIST / "marketing-team.zip", skip=lambda rel: rel.startswith("shared/"))
n2 = zip_dir(WORKSPACE, DIST / "portfolio-studio-starter.zip")
version = (WORKSPACE / "_system" / "VERSION").read_text().strip()
print(f"built v{version}: marketing-team.zip ({n1} files), portfolio-studio-starter.zip ({n2} files)")
