#!/usr/bin/env python3
"""Prepare an upstream Langfuse checkout for docs-only Next.js static export.

Only remove routes from a temporary upstream checkout (never the upstream repo).
Preserve all MDX content and the shared app layout/components.
"""
from pathlib import Path
import shutil
import sys
import os

root = Path(sys.argv[1]).resolve()
app = root / "app"
if not (root / "next.config.mjs").is_file() or not (app / "docs").is_dir():
    raise SystemExit("Not a supported Langfuse Docs checkout")
for route in app.iterdir():
    if route.is_dir() and route.name != "docs":
        shutil.rmtree(route)
        print("Excluded non-doc route:", route.name)
print("Preserved app/docs and shared app layouts for static export")

# In a project GitHub Pages site all URLs are served below /<repository>.
# Apply basePath during build without modifying the upstream repository.
base = os.environ.get("GITHUB_PAGES_BASE_PATH", "").rstrip("/")
if base:
    if not base.startswith("/") or base == "/":
        raise SystemExit("Invalid GITHUB_PAGES_BASE_PATH")
    config = root / "next.config.mjs"
    original = config.read_text(encoding="utf-8")
    marker = "const nextConfig = {"
    if original.count(marker) != 1:
        raise SystemExit("Could not patch upstream Next.js config safely")
    original = original.replace(marker, marker + '\n  basePath: process.env.GITHUB_PAGES_BASE_PATH,\n  assetPrefix: process.env.GITHUB_PAGES_BASE_PATH,', 1)
    config.write_text(original, encoding="utf-8")
    print("Configured Pages base path:", base)
