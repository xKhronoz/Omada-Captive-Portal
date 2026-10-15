# Contributing

Keep changes focused and preserve the controller's endpoint and payload contracts. Start with the [source layout](docs/CONTROLLER_INTEGRATION.md) and [build guide](docs/BUILD_AND_DEPLOY.md).

## Development workflow

1. Edit original files in `src/` or the template adapter in `scripts/`.
2. Run `npm run check`.
3. Build production and preview variants using a privately supplied compatible template and separate empty output directories.
4. Exercise changed flows in a browser, including keyboard controls and a narrow mobile viewport.
5. For authentication or adapter changes, test on the target controller. Report the controller/gateway version and method tested without including credentials or client identifiers.

There is no dependency installation step. Syntax checks cover the browser scripts and build/adapter scripts; they do not replace runtime or controller testing.

For UI changes, check branding visibility combinations, enabled languages, language switching without losing inputs, menus above the heading, chevron padding, error feedback and countdown controls. For translations, update all affected messages and policy dialogs and obtain a fluent-language review.

## Repository contents

Commit original UI, generic artwork, translations, build tooling, examples and documentation. Do not commit controller templates, generated vendor code, jQuery, survey images, official brand assets, ZIPs, credentials, real guest data or operator-private configuration. Keep local overrides under ignored `private/`.

Review `git diff --check` and `git status --short` before committing. Explain what changed and how it was verified. State any controller behaviour that remains untested.

## Licence

Contributions to original project material follow the MIT licence in LICENSE. Retain existing attribution and update THIRD_PARTY_NOTICES.md when adding third-party material; do not assume a vendor file is covered by the project licence.
