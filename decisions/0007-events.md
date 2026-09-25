# 0007. Events

Status: accepted

## Context

A native `change` event is not composed. Fired by the input inside a shadow root, it stops at that root, so a listener on `amb-checkbox`, `amb-toggle`, `amb-select`, `amb-range`, `amb-text-field`, or `amb-text-area` never heard it. Radio fired `change` for the arrow keys but not for a click. The custom events that did exist were built by hand in each component, with no shared shape.

## Decision

- Every Ambre event bubbles, is composed, and is dispatched on the host through one helper, `emit(host, name, detail)`.
- A value control re-dispatches `change` on the host with the new value in `detail`: `{ value }`, or `{ checked, value }` for checked controls. `input` and `click` stay the browser's own: they are composed and retargeted to the host already.
- Names follow the platform: `change`, `input`, `toggle`, `close`. A new name is a verb for what a person did: `select` on the menu, `send` and `stop` on the prompt.
- Events report people. Setting a property from code fires nothing, as with native elements, so two-way bindings cannot loop.
- A default outcome that a listener can stop is a cancelable event (`send`).
- The contract lists every event with the TypeScript shape of its `detail`, or `native: true`. The check fails when a declared event is never emitted, has no detail, or when a component builds an event by hand. The manifest carries the type, each package exports it, and Storybook logs every declared event in the Actions panel from the manifest.

## Consequences

- `change` now reaches listeners on seven controls where it did not. Code that listened on the inner input through the shadow root keeps working.
- `amb-toggle`, `amb-range`, and `amb-text-area` gain a `change` event, and `amb-menu` a `select` event. This is additive: a minor release.
