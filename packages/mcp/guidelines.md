# Building with Ambre

Ambre is a design system of accessible web components (`amb-*` custom elements) themed by semantic tokens. The same tags work in plain HTML, React, Vue, Svelte, and Angular. A brand is a preset: the markup never changes.

## Install and load

```bash
npm install @ambre-ds/tokens @ambre-ds/ui
npm install @ambre-ds/ai          # only for conversation interfaces
npm install @ambre-ds/commerce    # only for amb-quantity
```

Load in this order, once, on the client:

```js
import '@ambre-ds/tokens/css';          // every --amb- variable, light and dark
import '@ambre-ds/tokens/css/presets';  // only when data-brand is used
import '@ambre-ds/ui';                  // registers the core amb- elements
import '@ambre-ds/ai';                  // registers the AI elements, if used
```

Load the font the brand names. The default brand uses Source Sans 3 (`@fontsource/source-sans-3`). `amb-icon` with a `name` needs `@fontsource/material-symbols-outlined`.

With server rendering (SvelteKit, Next.js, Nuxt, Astro), import the packages in a client-only hook. `customElements` does not exist on the server. Render the tags and their text on the server.

## Write the markup

1. **Use only the attributes, slots, and events in the component's reference.** Never invent one. If you are not sure, read the reference first.
2. **The label is the slotted text.** Write `<amb-button>Save</amb-button>` and `<amb-text-field name="email">Email</amb-text-field>`. Do not use `aria-label` when a visible label exists.
3. **Boolean attributes are true when present.** Write `<amb-checkbox checked>`, and remove the attribute for false. Never write `checked="false"`: it means checked.
4. **Enum attributes take one of the listed values exactly**, such as `variant="secondary"`.
5. **`slot="name"` goes on a direct child of the `amb-` element.** A slot attribute on a grandchild does nothing.
6. **Form controls are form-associated.** Give them a `name` inside a native `<form>`. They submit, reset, and validate like native fields. Use `required`, `min`, `max` rather than custom validation.
7. **Native HTML stays native.** Headings, paragraphs, lists, links in navigation, and `<form>` are plain HTML. There is no heading or text component.
8. **Group related choices.** Radios and radio cards share one `name` and sit in a `<fieldset>` with a `<legend>`. Several cards or tiles go in a `<ul>`.
9. **A link goes somewhere, a button does something.** `amb-link` and `href` on `amb-card` or `amb-tile` navigate. `amb-button` acts.
10. **Do not reach into the shadow root.** Style only through documented `::part()` names and semantic tokens.

## Listen to events

Every Ambre event bubbles and crosses the shadow root. Its data is in `event.detail`. Setting a property from code fires nothing.

| Event | Elements | `event.detail` |
| --- | --- | --- |
| `change` | checkbox, toggle, checkbox card | `{ checked, value }` |
| `change` | radio, radio card, select, text field, text area, date picker | `{ value }` |
| `change` | range, quantity | `{ value }` as a number |
| `change` | tabs | `{ index }` |
| `toggle` | disclosure, menu, tool call | `{ open }` |
| `select` | menu | `{ item, value }` |
| `close` | dialog | `{}` |
| `send` | prompt | `{ value }`, cancelable: `preventDefault()` keeps the text |
| `stop` | prompt | `{}` |
| `copied` | code block | `{ value }` |
| `input`, `click` | text inputs, range, date picker, prompt; button, link, suggestion | native: read `event.target` |

- Plain JavaScript: `element.addEventListener('change', (event) => …)`. One listener on a `<form>` hears every field.
- React: attach the listener to a `ref` with `addEventListener` in `useEffect`. This works in React 18 and 19.
- Vue: `@change="handler"`, with `compilerOptions.isCustomElement: (tag) => tag.startsWith('amb-')`.
- Svelte 5: `onchange={handler}`.
- Angular: `(change)="handler($event)"`, with `CUSTOM_ELEMENTS_SCHEMA`.
- Inline `onsend="…"` attributes do not work for custom events. Use `addEventListener`.

## Theme and brand

- Pick a brand and a theme on any ancestor: `<html data-brand="atlas" data-theme="dark">`. Put both attributes on the same element. Omit `data-brand` for the default brand, Ambre.
- Brands: `atlas` (enterprise, dense), `verdant` (public services, large and AAA), `noir` (luxury, monochrome), `press` (editorial, serif).
- To adjust a colour, override a semantic variable after the tokens, such as `--amb-color-accent-bg`. Never paint a component with a raw colour or a reference token.
- Page layout CSS may read the tokens: `gap: var(--amb-space-400)`.

## Choose a component

- One subject with a heading and optional image: `amb-card`. A compact entry point with an icon: `amb-tile`. A key figure with its change: `amb-stat-tile`.
- The page frame with header, navigation, main, aside, and footer: `amb-layout` with `variant="sidebar"`, `"split"`, or `"stacked"`. Use one per page.
- A choice that needs explanation: `amb-checkbox-card`, `amb-radio-card`. A short list of plain choices: `amb-checkbox`, `amb-radio`. A long list: `amb-select`.
- A date: `amb-date-picker`. Its value is `YYYY-MM-DD`.
- A conversation: `amb-message` turns in a container with `role="log"`, `amb-thinking` while the model works, `amb-tool-call` for each agent step, `amb-code-block` for code, `amb-suggestion` for starter prompts, and `amb-prompt` to send.

## Check your work

- Validate generated markup against the contracts: the `validate_markup` tool of the Ambre MCP server (`npx -y @ambre-ds/mcp`) reports unknown elements, attributes, slots, and values, missing labels, and misplaced slots.
- Complete, working screens are in the examples. Start from the closest one.
