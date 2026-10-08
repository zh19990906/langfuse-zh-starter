#!/usr/bin/env bash
set -euo pipefail
cd upstream
exec ./node_modules/.bin/next start -H 0.0.0.0 -p "${PORT:-10000}"
