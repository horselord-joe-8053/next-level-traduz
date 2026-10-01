---
name: debug
description: Reproduce, diagnose, repair, and regression-test a Traduz defect.
---

1. Reproduce before changing code when feasible; capture minimal failing evidence (test or steps).
2. Use `docs/templates/bug-report.md` when recording a non-trivial defect.
3. Determine root cause; distinguish symptom from cause.
4. Fix with strict TDD when adding behavior: failing regression test first, then minimal repair.
5. Run `./scripts/verify.sh`.
6. Report root cause, fix, and evidence to the human.
