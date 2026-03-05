# Agent Notes for Bridalform

## Purpose
This repository contains a Google Apps Script HTMLService web app for Dublin Cleaners bridal intake.

## Guardrails
- Keep production app files in repository root limited to:
  - `appsscript.json`
  - `Code.gs`
  - `index.html`
  - `print.html`
  - `scripts.html`
  - `styles.html`
- Put process and setup documentation under `docs/`.
- Keep tests under `test/` and make them runnable with `npm test` from `test/`.

## Quality Expectations
- Preserve authorization gating in both server (`submitIntake`) and UI rendering.
- Maintain accessibility features: labels, keyboardable autocomplete, and aria-live status.
- Ensure every submission path writes to Sheets, generates PDF, and sends email.
