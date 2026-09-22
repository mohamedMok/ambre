---
name: ambre-component
description: Builds Ambre Svelte 5 custom elements in packages/ui. Use when implementing or changing amb- components, shadow DOM, ElementInternals, or component CSS.
---

# Component

Implement the contract. Do not add a prop, token, or part the contract does not list.

## Rules

- Svelte 5 runes. `customElement` tag `amb-*`, shadow `{ mode: 'open', delegatesFocus: true }` for controls.
- Declare every public prop in `$props()` and in `customElement.props`.
- Put author text in `<slot />`. The inner control is a native element (`button`, `input`, `a`).
- Form participation uses `extend` with `formAssociated` and `ElementInternals`.
- Style only with `var(--amb-...)`. No raw hex, no Sass in the component.
- Reflect enum and boolean props. Default `type` on a button is `button`. The inner button stays `type="button"`; submit and reset go through the associated form.
- Internal Svelte components do not get a tag.

## Check

`pnpm --filter @ambre/ui test` after the manifest is generated. It fails if the source drifts from `contracts/button.yaml` or contains a hex color.

## Refuse

- Minting a token. That is `ambre-tokens`.
- A story or a doc page as the only change. Those are the other skills.
- `shadow: "none"`.
