#!/usr/bin/env bash
set -euo pipefail
# Render deploys from this overlay repository, not the official docs repository.
# Fetch upstream and apply tracked Chinese translations at build time.
if [[ ! -d upstream/.git ]]; then
  git clone --depth 1 https://github.com/langfuse/langfuse-docs.git upstream
fi
python3 scripts/apply-langfuse-zh.py upstream
cd upstream
corepack enable
corepack pnpm install --frozen-lockfile
corepack pnpm build
