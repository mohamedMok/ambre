---
name: ambre-component
description: Builds Ambre Svelte 5 custom elements in packages/ui. Use when implementing or changing amb- components, shadow DOM, ElementInternals, or component styles in src/styles.
---

# Component

Implement the contract. Do not add a prop, token, or part the contract does not list.

## Rules

- Svelte 5 runes. `customElement` tag `amb-*`, shadow `{ mode: 'open', delegatesFocus: true }` for controls.
- Declare every public prop in `$props()` and in `customElement.props`.
- Put author text in `<slot />`. The inner control is a native element (`button`, `input`, `a`).
- Form participation uses `extend` with `formAssociated` and `ElementInternals`.
- Reflect enum and boolean props. Default `type` on a button is `button`. The inner button stays `type="button"`; submit and reset go through the associated form.
- Internal Svelte components do not get a tag.

## Events

Every event in the contract is dispatched with `emit(host, name, detail)` from `src/internal/events.ts`. It bubbles and is composed. See ADR 0007.

- A native `change` stops at the shadow root. Re-dispatch it with the value in `detail`: `{ value }`, or `{ checked, value }` for a checkbox.
- `input` and `click` are composed already. Mark them `native: true` in the contract and add nothing.
- Fire for what a person did, never when a property is set from code.
- Use the platform name when one fits (`change`, `input`, `toggle`, `close`). A new name is a verb for what happened (`select`, `send`).
- Never `new Event()` or `new CustomEvent()` in a component. The check fails on it, and on a contract event that is never emitted or has no `detail`.

## Styles

Styles never live in the `.svelte` file. See `src/styles/README.md`.

- One sheet per component: `src/styles/components/<id>.scss`, inside `@layer components`, starting with `@use 'tools' as *;`.
- The component imports it with `?inline` in `<script module>` and calls `adopt(this.shadowRoot, styles)` in the `extend` constructor.
- BEM with ITCSS namespaces: block `.c-<id>`, flat elements `.c-<id>__<name>`, modifiers `.c-<id>--<value>` computed from props, prop-driven states `.is-<state>`. Objects are `.o-*`, utilities `.u-*`.
- Read tokens with `token(name)`. It fails the build on a name the tokens package does not emit. Never write `var(--amb-…)`, a raw hex, or `!important`.
- Use the tools: `depth()`, `focus-visible`, `hover`, `active`, `tint()`, `rim()`. Every transition and movement goes inside `@include motion`.

## Check

`pnpm --filter @ambre-ds/ui test` after the manifest is generated. It fails if the source drifts from the contract, if a `.svelte` file has a `<style>` block, or if a sheet is missing, has no `.c-<id>` block, or contains a hex color, a raw `var(--amb-…)` or `!important`.

## Refuse

- Minting a token. That is `ambre-tokens`.
- A story or a doc page as the only change. Those are the other skills.
- `shadow: "none"`.
- A `<style>` block in a component.
