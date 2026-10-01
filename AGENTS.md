# Traduz Agent Guide

Traduz is a small Brazilian Portuguese → English translation web app (`frontend/` React + TypeScript, `backend/` FastAPI).

## Sources of truth

- Product: `docs/PRODUCT.md`
- Architecture: `docs/ARCHITECTURE.md`
- Security/privacy: `docs/SECURITY.md`
- TDD policy: `docs/TRADUZ-TDD.md`
- Artifact templates: `docs/templates/`
- Approved feature specs: `docs/specs/`
- Durable plans: `docs/plans/`

## Feature-development lifecycle

For a non-trivial feature or behavior change:

**SPEC → PLAN → IMPLEMENT → VERIFY → EVALUATE → COMPLETE**

Proceed autonomously unless human judgment is required.

- **SPEC:** use the `specify-feature` skill.
- **PLAN:** inspect the repository; persist a plan under `docs/plans/` only when complexity warrants it.
- **IMPLEMENT:** use the `implement-feature` skill (strict TDD per `docs/TRADUZ-TDD.md`).
- **VERIFY:** run `./scripts/verify.sh`; do not treat the change as ready while it fails.
- **EVALUATE:** independently compare the result with the approved spec (evaluator subagent when valuable).
- **COMPLETE:** only after required verification and evaluation pass.

If VERIFY fails, repair and rerun VERIFY.

If EVALUATE finds an implementation defect, return to IMPLEMENT.

If it finds a plan defect, return to PLAN.

If it finds a requirement/spec defect, return to SPEC.

## Human escalation

Ask before proceeding when there is a material unresolved product, architecture, security/privacy, destructive, or irreversible decision.

Confirm **test seams** with the human before writing tests when implementing (see `docs/TRADUZ-TDD.md`).

## Core invariants

- Browser never receives the LLM provider API key.
- Frontend never calls the LLM provider directly; only the Traduz API.
- Source language: Brazilian Portuguese. Target: English (unless product scope is intentionally changed).
- Default: translation content is not persisted server-side; browser-local persistence requires an approved spec.

## Skills

Project skills live under `.agents/skills/`. Prefer them for specify / implement / debug procedures.
