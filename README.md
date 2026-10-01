# Traduz

Minimal Brazilian Portuguese → English translation web app (practice project for AI-assisted harness engineering).

## Layout (planned)

- `frontend/` — React, TypeScript, Vite
- `backend/` — FastAPI (Python)
- `docs/` — product, architecture, specs, templates
- `scripts/verify.sh` — canonical local verification

## Local development

```bash
# Backend
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
cp ../.env.example .env   # add LLM_API_KEY
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Frontend (second terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

Never commit secrets.

## Verification

```bash
./scripts/verify.sh
```

## Engineering guidance

- Agent policy: `AGENTS.md`
- TDD: `docs/TRADUZ-TDD.md`
- Parent monorepo practice guide: `../../docs/traduz-cursor-practice-guide.md`

## Remote

GitHub: [github.com/horselord-joe-8053/next-level-traduz](https://github.com/horselord-joe-8053/next-level-traduz)

First commit (no `.env` — only `.env.example`):

```bash
cd projects/traduz
git add -A
git status   # confirm .env, .venv/, node_modules/ are not listed
git commit -m "Bootstrap Traduz harness, TDD skeleton, and CI"
```

Create repo, push, and set `origin`:

```bash
gh repo create horselord-joe-8053/next-level-traduz --public --source=. --remote=origin --push
```

If the repo already exists:

```bash
git remote add origin https://github.com/horselord-joe-8053/next-level-traduz.git
git push -u origin main
```

**Branch protection (UI):** Repository → **Settings** → **Branches** → **Add branch protection rule** (or ruleset) for `main` → enable **Require status checks to pass** → select check **`verify`** (from workflow job `verify` in `.github/workflows/ci.yml`) → save. Run CI on `main` at least once so the check appears in the picker.
