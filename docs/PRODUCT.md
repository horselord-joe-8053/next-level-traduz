# Traduz Product Contract

## Purpose

Translate Brazilian Portuguese text into English with a deliberately small UI.

## Current scope

- Source language: Brazilian Portuguese.
- Target language: English.
- Maximum input: 5,000 characters per request.
- Translation output shows the translation, not unsolicited explanation.

## Persistence policy

Translation content is **not** persisted by default (no server-side store).

Any persistence feature must specify in an approved spec:

- storage location (e.g. browser `localStorage` only);
- retention / size limit;
- deletion / clear behavior;
- privacy implications (what is never sent to the backend).

## Planned v1 features (training)

- Baseline translate flow.
- Optional: persistent history across refresh (browser-local).
- Optional: copy translation to clipboard.
