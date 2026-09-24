# Styles outside components: Sass, ITCSS, BEM

Component styles no longer live in `<style>` blocks inside `.svelte` files. They live in `packages/ui/src/styles`, in Sass, organised by ITCSS and named with BEM.

## Layers

| Layer | Folder | Output | Names |
| --- | --- | --- | --- |
| Settings | `settings/` | none | configuration |
| Tools | `tools/` | none | `token()`, `depth()`, `tint()`, `rim()`, `halo()`, mixins |
| Generic | `generic/` | resets inside a shadow root | element selectors in `:where()` |
| Objects | `objects/` | undecorated patterns | `.o-*` |
| Components | `components/` | one sheet per element | `.c-<id>`, `__element`, `--modifier`, `.is-state` |
| Utilities | `utilities/` | single-purpose overrides | `.u-*` |

CSS cascade layers (`@layer generic, objects, components, utilities`) enforce the same order in the browser, whatever order the sheets load in.

## Delivery

The elements keep open shadow roots, slots and `ElementInternals`. A page stylesheet cannot reach inside a shadow root, and removing the shadow root would break every slot and every consumer. So each sheet compiles to a CSS string (`?inline`), and `adopt()` turns it into one constructable stylesheet shared by every instance of the element. The base sheet (generic, objects, utilities) is shared by every element on the page. The styles are adopted in the element's constructor, before the first render.

`@ambre/commerce` uses the same tools and layers. Its sheets live in `packages/commerce/src/styles/components`.

## Rules

- `token(name)` is the only way to read a token. It fails the build on a name the tokens package does not emit, so a typo or a reference token cannot reach the CSS.
- Movement and transitions are declared inside `@include motion`, so reduced motion needs no overrides.
- CI (`scripts/check-contract.mjs`) fails on a `<style>` block in a component, a missing sheet, a sheet without its `.c-<id>` block, a raw hex, a raw `var(--amb-…)`, or `!important`.

This supersedes the sentence in ADR 0001 that component styles are written inside the shadow root. Sass is now an authoring language as well as an output.
