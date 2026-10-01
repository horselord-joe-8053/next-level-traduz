# Traduz Architecture

## Request path

Browser → Traduz FastAPI backend → OpenAI-compatible LLM API

## Repository layout

- `frontend/` — UI and browser state.
- `backend/` — HTTP API, LLM client, secret-bearing configuration.

## Boundaries

- Frontend calls **only** the Traduz API, never the LLM provider directly.
- LLM credentials and `LLM_*` env vars are loaded only in the backend process.
- Provider responses are validated at the backend boundary before returning to the client.

## Persistence

No server-side persistence in the baseline architecture.

Browser-local persistence may be introduced only by an approved feature spec in `docs/specs/`.

## CORS

Backend allows configured origins for local development (frontend dev server).
