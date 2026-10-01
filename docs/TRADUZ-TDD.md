# Traduz TDD policy

All implementation follows **red → green** cycles: one failing test, then minimal code to pass. Refactoring belongs in review/evaluation, not inside the loop.

Reference: `../../docs/traduz-cursor-practice-guide.md` §2 (monorepo practice guide).

## Loop

1. Map acceptance criteria to **tracer-bullet** slices (smallest user-visible behavior).
2. **Confirm test seams** with the human before writing tests.
3. **Red:** one failing test at one seam.
4. **Green:** minimal change; run that test, then `./scripts/verify.sh`.
5. Repeat until spec acceptance criteria are covered.

## Default seams

| Seam | Tool | Observe (public behavior) |
|------|------|---------------------------|
| HTTP API | pytest + FastAPI `TestClient` | `GET /health`; `POST /translate` success, validation errors, length limit |
| LLM provider | Mock at HTTP/client boundary | Fixed fake completion; **no live LLM in unit/CI tests** |
| React UI | Vitest + Testing Library | Submit shows translation or error; controls per spec |
| Browser persistence | Vitest (`localStorage` mock) or Playwright | History after reload; cap; clear |

## Anti-patterns

- Horizontal slicing: all tests first, then all implementation.
- Tests coupled to private helpers or internal mock chains.
- Tautological assertions (expected value computed like production code).
- Calling live LLM APIs in automated tests.

## Implement skill

The `implement-feature` skill requires this policy on every change.
