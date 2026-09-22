---
name: ambre-release
description: Protects the Ambre public API and versioning. Use when renaming a tag, prop, token, part, slot, event, or CSS variable, or when preparing a release.
---

# Release

Packages are `0.0.0` and `private` until a deliberate publish. Do not remove `private` as a side effect of a component change.

## Breaking

These are breaking changes and need an ADR in `decisions/` plus a major bump once versions exist:

- Remove or rename a tag, prop, part, slot, event, or public CSS variable.
- Change a default in a way that changes rendered output for existing markup.
- Stop resolving an alias that products override.

Adding an optional prop or a new token is minor.

## Refuse

- A silent rename of `--amb-*` or `amb-*`.
- Publishing from a local build without `pnpm test` and the docs and Storybook builds.
