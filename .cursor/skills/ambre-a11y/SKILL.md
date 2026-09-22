---
name: ambre-a11y
description: Reviews Ambre components for WCAG 2.2 AA, APG keyboard behavior, names, and contrast. Use when building or changing a component, token color, focus style, or form control.
---

# Accessibility

WCAG 2.2 AA is the floor. Follow the APG pattern for the widget.

## Check

- Role comes from a native element inside the shadow root.
- The accessible name is the slotted text.
- Enter and Space activate buttons. Disabled controls leave the tab order.
- Focus uses `:focus-visible`, `--amb-color-focus-ring`, width, and offset.
- Text pairs meet 4.5:1. UI boundaries and the focus ring meet 3:1. `pnpm --filter @ambre/tokens test` is the evidence.
- `prefers-reduced-motion: reduce` removes transitions.
- `forced-colors: active` keeps a border and system colors.
- Target height is at least 24px. Default controls use `--amb-size-control-md` (44px).

## Refuse

- `role="button"` on a native button.
- A Storybook story as proof.
- Opacity as a way to fade text below contrast.
