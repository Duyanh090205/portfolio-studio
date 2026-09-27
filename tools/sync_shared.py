"""Copy plugins/marketing-team/shared/* into the skills' references/ folders.

Skills must be self-contained (claude.ai chat loads each skill folder on its own),
so shared files are duplicated at build time. Edit the files in shared/, then run:

    python tools/sync_shared.py
"""
from pathlib import Path
import shutil

PLUGIN = Path(__file__).resolve().parent.parent / "plugins" / "marketing-team"
SHARED = PLUGIN / "shared"
# Which shared files each skill gets (conventions.md goes to every skill).
SCHEMA_SKILLS = {"studio", "new-brand", "brand-strategist", "import-project"}          # data-schema.md
NO_HTML = {"studio", "new-brand", "brand-strategist", "import-project", "project-check"}                 # html-guide.md goes to the rest


COMPLIANCE_SKILLS = {"new-brand", "import-project", "social-media-creative", "campaign-designer", "packaging-designer",
                     "ooh-designer", "ads-manager", "content-planner", "project-check", "video-editor"}


def wanted(skill: str, name: str) -> bool:
    if name == "data-schema.md":
        return skill in SCHEMA_SKILLS
    if name == "compliance.md":
        return skill in COMPLIANCE_SKILLS
    if name == "html-guide.md":
        return skill not in NO_HTML
    return True


for skill in sorted((PLUGIN / "skills").iterdir()):
    if not (skill / "SKILL.md").exists():
        continue
    refs = skill / "references"
    refs.mkdir(exist_ok=True)
    for f in SHARED.iterdir():
        target = refs / f.name
        if wanted(skill.name, f.name):
            shutil.copy2(f, target)
        elif target.exists():
            target.unlink()
    print(f"synced -> {skill.name}/references: {sorted(p.name for p in refs.iterdir())}")
