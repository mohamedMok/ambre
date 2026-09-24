# @ambre-ds/tokens

Design tokens for the [Ambre](https://mohamedmok-ambre.surge.sh) design system, authored in the DTCG format and compiled with Style Dictionary.

```bash
npm install @ambre-ds/tokens
```

| Entry point | Contents |
| --- | --- |
| `@ambre-ds/tokens/css` | Every public `--amb-` custom property, for light (`:root`, `[data-theme="light"]`) and dark (`[data-theme="dark"]`) |
| `@ambre-ds/tokens/css/presets` | The brand presets, under `[data-brand="atlas" \| "verdant" \| "noir" \| "press"]` |
| `@ambre-ds/tokens/scss` | The same decisions as Sass variables (`$amb-…`), light; `…/scss/dark` for dark |
| `@ambre-ds/tokens/json` | Every token with its path, CSS name, value and description, per theme and preset |
| `@ambre-ds/tokens` | The tokens as a JS object, and `presetList` |

```js
import '@ambre-ds/tokens/css';
import '@ambre-ds/tokens/css/presets';
```

## Tiers

- **Reference**: the palette and dimension scale. Never emitted as CSS.
- **System**: the public decisions (`--amb-color-accent-bg`, `--amb-space-400`, `--amb-radius-md` …). Theme a product by overriding these.
- **Component**: the `@ambre-ds/ui` elements read system tokens only.

Every text pair (4.5:1) and UI boundary (3:1) is checked in every brand and theme on every build. When you override a colour, check it the same way.

The DTCG sources ship in `src/` for tools that read them. MIT license.
