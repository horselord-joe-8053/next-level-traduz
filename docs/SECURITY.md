# Traduz Security and Privacy

## Secrets

- LLM credentials are server-side only (`LLM_API_KEY`, optional `LLM_BASE_URL`, `LLM_MODEL`).
- Secrets must never be committed, logged, or exposed to the browser.

## User text

- Treat translation input and output as user data.
- Do not add persistence, analytics capture, or logging of translation text unless an approved feature specification requires it and documents impact.

## Browser storage

If a feature uses browser storage, the spec must state:

- what is stored;
- retention / size limit;
- clear / delete behavior;
- whether stored data is ever transmitted to the backend (default: no).

## Dependencies

Prefer minimal dependencies; review new packages that handle network, crypto, or storage.
