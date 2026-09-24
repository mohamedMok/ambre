---
name: ambre-docs
description: Writes the Ambre SvelteKit documentation site in apps/docs. Use when changing doc pages, foundation pages, component guidelines, or public examples.
---

# Docs

The site is the public, crawlable surface. Storybook is the workshop.

## Page shape

1. One `h1`. A `svelte:head` title.
2. The rendered component or swatch before the explanation.
3. Copyable HTML.
4. Short imperative guidance. A do list and a don't list for components.
5. Semantic tokens only. No raw hex in CSS.

Headings, links, and landmarks are native HTML. Custom elements are imported from `@ambre-ds/ui` on the client. Slotted text is in the server HTML.

Each page is a real route under `src/routes`. Color swatches copy the CSS variable, not the reference hex, for semantic tokens.

## Refuse

- A page that only restates the prop table.
- Hiding the only copy of a guideline inside Storybook.
- A new product term that the contract does not use.
