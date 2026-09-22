# System shape

Ambre publishes two packages. `@ambre/tokens` holds DTCG sources and Style Dictionary output. `@ambre/ui` is the single web-component library.

Custom elements are prefixed `amb-`. The package scope is `@ambre`. CSS variables are prefixed `--amb-`.

Components are Svelte 5 custom elements with open shadow roots. Author text is slotted so it stays in the light DOM. Headings and links on documentation pages are native HTML.

Theme modes are two decision files, light and dark, compiled to CSS custom properties. Products override semantic variables. Reference tokens are resolved at build time and are not emitted as CSS.

The license is MIT.

Sass is an output (`_tokens.scss` and `_tokens-dark.scss`) for teams that already use it. Component styles are written against CSS variables inside the shadow root.
