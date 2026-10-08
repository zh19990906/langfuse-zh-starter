#!/usr/bin/env python3
"""Apply independently maintained Chinese MDX files to official Langfuse docs."""
import argparse
import json
from pathlib import Path
import shutil

parser = argparse.ArgumentParser()
parser.add_argument("upstream", type=Path)
args = parser.parse_args()
upstream = args.upstream.resolve()
root = Path(__file__).resolve().parents[1]
meta = upstream / "content/docs/meta.json"
if not meta.is_file():
    raise SystemExit("Expected an upstream langfuse-docs checkout")
for source in (root / "overrides").rglob("*"):
    if source.is_file():
        destination = upstream / source.relative_to(root / "overrides")
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)
        print("Translated:", destination.relative_to(upstream))
data = json.loads(meta.read_text(encoding="utf-8"))
translations = {
    "---Get Started---": "---快速开始---",
    "---Products---": "---核心产品---",
    "---Platform---": "---平台---",
    "---More---": "---更多---",
}
data["title"] = "文档"
data["pages"] = [
    translations.get(page, page)
    .replace("[Start Tracing]", "[开始追踪]")
    .replace("[Use Prompt Management]", "[使用提示词管理]")
    .replace("[Set up Evals]", "[设置评估]")
    .replace("[Security & Compliance ↗]", "[安全与合规 ↗]")
    .replace("[Support ↗]", "[支持 ↗]")
    for page in data["pages"]
]
meta.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("Updated top-level navigation")
