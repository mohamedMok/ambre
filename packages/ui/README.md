# @ambre-ds/ui

Accessible web components for the [Ambre](https://mohamedmok-ambre.surge.sh) design system. Standard custom elements (`amb-*`), so the same tags work in React, Vue, Angular, Svelte, or plain HTML. Every element reads the semantic tokens from `@ambre-ds/tokens`, so a brand preset restyles all of them without touching the markup.

```bash
npm install @ambre-ds/ui @ambre-ds/tokens
```

```js
import '@ambre-ds/tokens/css';          // every --amb- variable, light and dark
import '@ambre-ds/tokens/css/presets';  // optional: brand presets (data-brand)
import '@ambre-ds/ui';                  // registers every amb- element
// or one element at a time:
import '@ambre-ds/ui/button';
```

```html
<form method="post">
  <amb-text-field name="email" type="email" autocomplete="email" required>Email</amb-text-field>
  <amb-button type="submit">Sign in</amb-button>
</form>
```

Load the fonts the theme names (Source Sans 3 and Source Code Pro for the default brand, for example with `@fontsource/source-sans-3`), and Material Symbols Outlined if you use `amb-icon` with a `name`.

## Elements

Button, Link, Icon, Disclosure, Text field, Text area, Select, Checkbox, Radio, Toggle, Range, Badge, Tag, Banner, Progress, Spinner, Skeleton, Tooltip, Tabs, Breadcrumbs, Pagination, Menu, Dialog.

- Open shadow roots. Form controls are form-associated through `ElementInternals`.
- WCAG 2.2 AA: native roles, visible focus ring, reduced motion and forced colors handled.
- Style hooks: the documented `::part()` names and the `--amb-` custom properties. The internal classes are not an API.
- `custom-elements.json` describes every element for editors and tooling.

## Theme and brand

```html
<html data-theme="dark">                          <!-- dark decisions -->
<section data-brand="atlas" data-theme="light">   <!-- a brand preset -->
```

Presets: `atlas` (enterprise), `verdant` (public services, accessibility first), `noir` (luxury and retail), `press` (editorial). Omit `data-brand` for Ambre.

Documentation: [mohamedmok-ambre.surge.sh](https://mohamedmok-ambre.surge.sh) · Storybook: [mohamedmok-ambre.surge.sh/storybook](https://mohamedmok-ambre.surge.sh/storybook/) · MIT license.
