#!/usr/bin/env python3
"""Prepare an upstream Langfuse checkout for docs-only Next.js static export.

Only remove routes from a temporary upstream checkout (never the upstream repo).
Preserve all MDX content and the shared app layout/components.
"""
from pathlib import Path
import shutil
import sys

root = Path(sys.argv[1]).resolve()
app = root / "app"
if not (root / "next.config.mjs").is_file() or not (app / "docs").is_dir():
    raise SystemExit("Not a supported Langfuse Docs checkout")
for route in app.iterdir():
    if route.is_dir() and route.name != "docs":
        shutil.rmtree(route)
        print("Excluded non-doc route:", route.name)
print("Preserved app/docs and shared app layouts for static export")
