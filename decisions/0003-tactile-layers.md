# Tactile layers

Ambre components read as physical layers. Actions are raised, inputs are sunken wells, and menus, tooltips and dialogs float.

Four system decisions carry the layers:

- `color.highlight` is a top-edge light, drawn only as a 1px inset line on raised controls. It never sits under text.
- `elevation.inset` is the inner shadow of a well: fields, tracks, tab lists and the quantity group.
- `color.focus.halo` and `focus.halo.width` add a soft glow outside the focus ring. The solid ring still carries the 3:1 contrast.
- `easing.spring` is a small overshoot for transforms: a press settling, a thumb sliding, a checkmark appearing. Color never springs.

Corners open up: `radius.sm` is 6px, `radius.md` 10px and `radius.lg` 16px. `radius.action` still aliases `radius.md`.

Fills do not change. Text keeps the pairs in `contrast-pairs.json`. Tinted fills mix at most 14% of a foreground color into the surface and use that foreground for their text.

Motion uses platform features rather than script: `@starting-style` for entry, individual transform properties, `transition-behavior: allow-discrete`, and `color-mix()` for tints and rims. Hover lift applies only under `@media (hover: hover)`. Reduced motion removes every transition and transform. Forced colors drop the shadows and keep system borders.

A preset can flatten the layers. Press sets the highlight and halo to fully transparent, the inset to an empty shadow, and the spring to linear.
