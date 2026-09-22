# Ambre

Open-source design system. One library of web components, built with Svelte 5.

Custom elements use the `amb-` prefix. Packages use the `@ambre` scope.

## Packages

- `@ambre/tokens` — design tokens in the [DTCG 2025.10](https://www.designtokens.org/TR/2025.10/format/) format, compiled with Style Dictionary to CSS variables, Sass variables, and JSON.
- `@ambre/ui` — the component library. The basics are `amb-button`, `amb-link`, `amb-disclosure`, and `amb-icon`. Forms are `amb-text-field`, `amb-checkbox`, `amb-radio`, and `amb-select`.

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
import '@ambre/tokens/css';
import '@ambre/tokens/css/presets';
import '@ambre/ui';
```

```html
<amb-button type="submit">Save changes</amb-button>
```

Theme a product by overriding semantic variables such as `--amb-color-accent-bg`. Reference palette tokens are not part of the CSS output.

Set `data-theme="dark"` on an ancestor to switch the dark decisions.

A brand is one file in `packages/tokens/src/preset`. The build writes every file onto the same variables. Set `data-brand="apple"` or `data-brand="airbnb"` on an ancestor. Omit it for Ambre. The product loads the font the preset names.

## Layout

```text
packages/tokens/src   DTCG sources, including src/preset for brands
contracts             component contracts
packages/ui           Svelte custom elements
apps/docs             documentation site
apps/storybook        Storybook
decisions             architectural decision records
```

Agents that work in this repository should read [AGENTS.md](AGENTS.md).
