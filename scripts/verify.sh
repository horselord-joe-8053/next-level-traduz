#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "== backend: ruff =="
cd backend
if [[ ! -d .venv ]]; then
  python3 -m venv .venv
fi
# shellcheck source=/dev/null
source .venv/bin/activate
pip install -q -e ".[dev]"
ruff check app tests
echo "== backend: pytest =="
pytest -q
cd "$ROOT"

echo "== frontend: typecheck =="
cd frontend
if [[ ! -d node_modules ]]; then
  npm ci
fi
npm run typecheck
echo "== frontend: vitest =="
npm run test
cd "$ROOT"

echo "verify.sh: all checks passed"
