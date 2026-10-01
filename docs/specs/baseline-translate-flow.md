# Feature: Baseline translate flow

## Goal

Let a user enter Brazilian Portuguese text in the browser, submit it, and read the English translation—or a clear error if translation cannot be completed.

This spec defines the **baseline** product behavior for Traduz before history, copy-to-clipboard, or other v1 add-ons.

## User-visible behavior

- The user sees a single-page UI labeled for **Brazilian Portuguese → English** with a text area, a submit control, an area for errors, and an area for the English result.
- While a request is in flight, submit shows a loading state and is not double-submitted casually (control disabled or equivalent).
- On success, the English translation replaces any prior translation on the page and any prior error is cleared.
- On failure (validation, backend, network, or misconfiguration), a human-readable error message is shown (`role="alert"` or equivalent) and the previous successful translation is cleared for that attempt.
- No history, copy button, accounts, or language picker in this feature.

## Functional requirements

- **FR1:** The browser sends translation requests only to the Traduz backend (`POST /translate` with JSON `{ "text": "<user input>" }`), never to the LLM provider.
- **FR2:** The backend accepts non-empty source text up to **5,000 characters** inclusive; outside that range the API rejects the request with a client error (HTTP 422) without calling the LLM.
- **FR3:** On valid input, the backend calls an OpenAI-compatible chat/completions API using server-side `LLM_*` configuration and returns JSON `{ "translation": "<English text>" }`.
- **FR4:** The LLM is instructed to return **translation only** (no unsolicited explanation or meta-commentary) per `docs/PRODUCT.md`.
- **FR5:** The backend exposes `GET /health` returning `{ "status": "ok" }` for liveness checks.
- **FR6:** When `LLM_API_KEY` is missing or the provider returns an HTTP error, the API responds with an appropriate error status and a string `detail` the frontend can display.
- **FR7:** CORS allows the configured local frontend origin(s) for development.

## Constraints and invariants

- Source/target languages: **PT-BR → EN** only (`docs/PRODUCT.md`); no runtime language detection requirement in this feature.
- **No persistence:** neither server nor browser stores translation history for this feature (`docs/ARCHITECTURE.md`, `docs/SECURITY.md`).
- Secrets stay server-side; `.env` is never committed (`docs/SECURITY.md`).
- Automated tests mock the LLM at the HTTP/client boundary; CI must not call a live provider (`docs/TRADUZ-TDD.md`).

## Non-goals

- Translation history, clipboard copy, offline mode, auth, rate limiting UI, server-side logging of user text, analytics, multi-language pairs, file upload, or streaming responses.
- Proving linguistic quality of the model output (only that a non-empty English string is returned when the provider succeeds).

## Acceptance criteria

- [ ] **AC1:** `GET /health` returns HTTP 200 and body `{ "status": "ok" }`.
- [ ] **AC2:** `POST /translate` with `{ "text": "" }` or whitespace-only text treated as invalid returns HTTP **422** (validation error).
- [ ] **AC3:** `POST /translate` with text longer than **5,000** characters returns HTTP **422**.
- [ ] **AC4:** `POST /translate` with valid text and a mocked LLM HTTP response returns HTTP **200** and `{ "translation": "<expected English>" }` matching the provider mock (trimmed).
- [ ] **AC5:** With LLM mocked to succeed, submitting Portuguese text from the UI shows the English translation in the result area.
- [ ] **AC6:** When the backend is unreachable, the UI shows an error message indicating the translation service could not be reached (no silent failure).
- [ ] **AC7:** When the API returns a non-success HTTP status with a string `detail`, the UI displays that message (or a safe fallback if `detail` is absent).
- [ ] **AC8:** A new successful translation clears a previously shown error from the same session flow; a failed attempt clears the previously shown translation for that attempt.

## Verification expectations

| AC | Seam | Evidence |
|----|------|----------|
| AC1–AC4 | HTTP API | `backend/tests/` via pytest + `TestClient`; LLM mocked with `httpx.MockTransport` or injected translator |
| AC5–AC8 | React UI | `frontend/src/App.test.tsx` (Vitest + Testing Library) with `fetch` stubbed; optional manual smoke with backend + `.env` locally |
| All | Gate | `./scripts/verify.sh` and CI job **verify** green |

Tracer-bullet order for gaps (if any AC not yet covered by tests): health → validation → success API → UI error → UI success.

## Open questions / human decisions

None blocking. **Note for implement/evaluate:** Linguistic correctness of Portuguese input is **not** validated in code; the product relies on the LLM system prompt and user intent.
