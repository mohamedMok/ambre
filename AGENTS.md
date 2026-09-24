# Ambre agents

Read the skill that owns the change. Do not do another skill's job in the same edit.

| Skill | Owns |
| --- | --- |
| `ambre-inclusion` | Whether a part belongs in core, a later domain pack, or stays in a product |
| `ambre-tokens` | DTCG sources, tiers, names, contrast pairs |
| `ambre-contract` | `contracts/*.yaml` and the manifest |
| `ambre-component` | Svelte 5 custom elements in `@ambre/ui` |
| `ambre-a11y` | WCAG 2.2 AA and the APG pattern for the component |
| `ambre-docs` | The SvelteKit documentation site |
| `ambre-storybook` | Stories for every variant and state |
| `ambre-release` | Semver and the public API |

Hard rules:

- Element prefix is `amb-`. Package scope is `@ambre`. CSS variables use `--amb-`.
- Reference tokens stay out of component CSS. System tokens are the theme API.
- Component styles live in `packages/*/src/styles`, in Sass, organised by ITCSS and named with BEM. No `<style>` in a component.
- A component token is allowed when a second component needs the same decision.
- The contract is the API. Svelte, Storybook, and docs implement it.
- Author text goes in slots. Headings, paragraphs, and links on the docs site stay native HTML.
- Shadow roots stay open. Form controls use `ElementInternals`.
- No prop name starts with `on`.
- Run `pnpm test` after a token or component change.
