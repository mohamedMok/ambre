---
name: ambre-tokens
description: Authors Ambre DTCG design tokens, tiers, names, and contrast pairs. Use when changing color, type, space, radius, elevation, motion, or any file in packages/tokens.
---

# Tokens

Edit `packages/tokens/src` only. Style Dictionary compiles them. Do not hand-edit `dist`.

## Tiers

- `src/reference` — palette and dimension scale. Not emitted as CSS.
- `src/system` — public decisions. CSS variables `--amb-*`.
- `src/theme/light` and `src/theme/dark` — decisions that change with theme.

A component-level token waits until a second component needs it. Until then, the component uses a system token.

## Format

DTCG keys are `$value`, `$type`, and `$description`. Colors use the 2025.10 object with `colorSpace`, `components`, and `hex`. Dimensions use `{ "value", "unit" }`. Aliases use `{path.to.token}`.

Names are the object path. The CSS prefix `amb` is applied by the build.

## After an edit

1. Add or update a pair in `src/contrast-pairs.json` when a color is used for text (4.5) or a UI boundary (3).
2. Run `pnpm --filter @ambre/tokens test`.
3. Do not put a raw hex in a component.

## Refuse

- Gradient and resolver tokens. Style Dictionary does not implement them yet.
- A new public name for an existing decision. Add an alias or write an ADR.
