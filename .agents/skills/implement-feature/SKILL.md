---
name: implement-feature
description: Implement an approved Traduz feature specification with strict TDD and verification evidence.
---

1. Read the approved feature spec in `docs/specs/`.
2. Read `docs/TRADUZ-TDD.md` and follow it on **every** change (mandatory).
3. Read relevant architecture/security guidance and any durable plan in `docs/plans/`.
4. List tracer-bullet slices from acceptance criteria; **propose test seams and wait for human confirmation** before writing tests.
5. For each slice: **failing test → minimal code → pass** (no horizontal batch of all tests then all code).
6. Mock the LLM at the HTTP/client boundary in backend tests; no live LLM in CI/unit tests.
7. Implement the smallest coherent change satisfying the spec.
8. Run `./scripts/verify.sh`; on failure diagnose, repair, rerun.
9. Do not weaken valid tests merely to obtain a pass.
10. Do not claim completion before required evaluation per `AGENTS.md`.
