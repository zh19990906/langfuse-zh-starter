#!/usr/bin/env python3
"""Strip runtime-only API endpoints for a documentation-only static export.

This changes the temporary upstream checkout, never the original source repository.
"""
from pathlib import Path
import shutil
import sys
root = Path(sys.argv[1]).resolve()
api = root / "app" / "api"
if not (root / "next.config.mjs").is_file():
    raise SystemExit("Not a Langfuse Docs source checkout")
if api.exists():
    shutil.rmtree(api)
    print("Removed runtime API routes from static documentation build")
