---
name: ambre-contract
description: Writes Ambre component contracts and the custom elements manifest. Use when adding or changing a component API, props, slots, events, parts, or files in contracts/.
---

# Contract

The contract is the API. Write `contracts/<id>.yaml` and validate it against `contracts/component.schema.json` before editing Svelte.

## Required

`id`, `tag` starting with `amb-`, `status`, `summary`, `anatomy`, `props`, `slots`, `events`, `a11y`, `tokens`.

Every prop has a `description`. Enum props list `values` and a `default`. The default slot is the accessible name when the component shows text.

`tokens` lists system token paths the component reads. Do not invent a path that is not in the token build.

## Generate

`node scripts/build-manifest.mjs` writes `packages/ui/custom-elements.json`. Tokens must already be built.

## Refuse

- A prop whose name starts with `on`.
- A contract that only exists as prose.
- Changing a stable tag, prop, part, or slot without an ADR. That is `ambre-release`.
