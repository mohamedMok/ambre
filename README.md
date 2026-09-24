# Ambre

Open-source design system. One library of web components, built with Svelte 5.

Custom elements use the `amb-` prefix. Packages use the `@ambre-ds` scope.

## Packages

- `@ambre-ds/tokens` — design tokens in the [DTCG 2025.10](https://www.designtokens.org/TR/2025.10/format/) format, compiled with Style Dictionary to CSS variables, Sass variables, and JSON.
- `@ambre-ds/ui` — the component library. Basics, forms, feedback, and navigation. Icons use a Material Symbols ligature or a slotted SVG.
- `@ambre-ds/commerce` — shop compositions built from the core library. Quantity is the first. Checkout stays in the product.

Documentation is a SvelteKit site. Storybook is the workshop.

## Develop

Node 22 and pnpm 12.

```sh
pnpm install
pnpm build
pnpm test
pnpm docs
pnpm storybook
```

Load the theme once, then the library:

```js
import '@ambre-ds/tokens/css';
import '@ambre-ds/tokens/css/presets';
import '@ambre-ds/ui';
import '@ambre-ds/commerce';
```

```html
<amb-button type="submit">Save changes</amb-button>
```

Theme a product by overriding semantic variables such as `--amb-color-accent-bg`. Reference palette tokens are not part of the CSS output.

Set `data-theme="dark"` on an ancestor to switch the dark decisions.

A brand is one file in `packages/tokens/src/preset`. The build writes every file onto the same variables: color, type, radius, border width, space, control size, focus, motion, and elevation. Set `data-brand` and `data-theme` on an ancestor. Omit `data-brand` for Ambre. The product loads the font the preset names.

| Preset | For | Character |
| --- | --- | --- |
| `atlas` | Enterprise and data | System face at 14px, 36px controls, ink-blue actions |
| `verdant` | Public services and health | 18px Nunito Sans, 52px controls, AAA text, yellow focus halo |
| `noir` | Luxury and retail | Monochrome ink, square fields, pill actions, slow motion |
| `press` | Editorial and media | Source Serif 4, square corners, hard offset shadows |

## Layout

```text
packages/tokens/src   DTCG sources, including src/preset for brands
contracts             component contracts
packages/ui           Svelte custom elements
packages/commerce     shop compositions, starting with quantity
apps/docs             documentation site
apps/storybook        Storybook
decisions             architectural decision records
```

Agents that work in this repository should read [AGENTS.md](AGENTS.md).
