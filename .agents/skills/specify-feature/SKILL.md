---
name: specify-feature
description: Turn a feature request into a repository-grounded, testable feature specification for Traduz.
---

1. Read `AGENTS.md`, `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, and `docs/SECURITY.md`.
2. Read `docs/templates/feature-spec.md`.
3. Inspect current behavior only as needed (once `frontend/` and `backend/` exist).
4. Identify material ambiguity or conflicts with product/security baselines.
5. Ask the human only when judgment is required (persistence, privacy, scope).
6. Generate `docs/specs/<feature-slug>.md` using the template shape.
7. Keep requirements observable; tie acceptance criteria to verifiable outcomes and `docs/TRADUZ-TDD.md` seams where helpful.
8. Do not proceed to implementation while a blocking open question remains in the spec.
