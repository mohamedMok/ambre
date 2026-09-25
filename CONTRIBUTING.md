# Contributing to Ambre

Thank you for helping. Ambre is a design system, so a change reaches every product that uses it. This guide explains how the repository works and what a pull request needs to be merged.

- [Ways to help](#ways-to-help)
- [Set up](#set-up)
- [How the repository is organised](#how-the-repository-is-organised)
- [Add or change a component](#add-or-change-a-component)
- [Tokens and brands](#tokens-and-brands)
- [Checks](#checks)
- [Commits, changesets, and pull requests](#commits-changesets-and-pull-requests)
- [Releases](#releases)

## Ways to help

- **Report a bug** with the [bug form](https://github.com/mohamedMok/ambre/issues/new?template=bug_report.yml). A minimal HTML snippet and the brand and theme are the most useful parts.
- **Report an accessibility barrier** with the [accessibility form](https://github.com/mohamedMok/ambre/issues/new?template=accessibility.yml). These are fixed first.
- **Propose a component** with the [proposal form](https://github.com/mohamedMok/ambre/issues/new?template=component_proposal.yml) before writing code. A component enters the core library when it is a primitive, or when a second product needs it.
- **Improve the documentation.** Every page has an *Edit this page* link.
- **Pick up an issue** labelled `good first issue`. Say so in the issue, so two people do not do the same work.

## Set up

You need Node 22 and pnpm 12.

```bash
git clone https://github.com/mohamedMok/ambre.git
cd ambre
pnpm install
pnpm build        # tokens, then ui, commerce, and ai
pnpm test         # contrast pairs and contracts
pnpm docs         # documentation site on http://localhost:5173
pnpm storybook    # workshop on http://localhost:6006
```

## How the repository is organised

```text
packages/tokens     DTCG sources, the four brand presets, and the contrast pairs
packages/ui         core components: Svelte 5 custom elements
packages/commerce   shop compositions
packages/ai         conversation compositions
contracts           one YAML contract per component: the public API
apps/docs           documentation site, SvelteKit
apps/storybook      Storybook
decisions           architecture decision records
scripts             manifest, contract check, social images
```

Each kind of change has a written guide in `.cursor/skills/`. Read the one that owns your change:

| Change | Guide |
| --- | --- |
| Whether a part belongs in core, a pack, or a product | `ambre-inclusion` |
| Tokens, tiers, names, contrast pairs | `ambre-tokens` |
| A component's API | `ambre-contract` |
| A component's code and styles | `ambre-component` |
| Accessibility | `ambre-a11y` |
| Documentation pages | `ambre-docs` |
| Stories | `ambre-storybook` |
| Versions and breaking changes | `ambre-release` |

## Add or change a component

The contract is the API. Write it first, then the code, the stories, and the page.

1. **Contract.** Write `contracts/<id>.yaml`: props, slots, events with their `detail`, CSS parts, accessibility, and the tokens the component reads. It is validated against `contracts/component.schema.json`.
2. **Component.** `packages/ui/src/<id>/<Name>.svelte` and `register.ts`. Svelte 5 runes, tag `amb-<id>`, an open shadow root, and `ElementInternals` for form controls. Author text goes in slots.
3. **Styles.** `packages/ui/src/styles/components/<id>.scss`, in the ITCSS components layer, named with BEM (`.c-<id>`, `.c-<id>__element`, `.c-<id>--modifier`, `.is-state`). Read tokens with `token()`. No `<style>` in the component, no raw colour, no `var(--amb-…)`, no `!important`.
4. **Events.** Dispatch every event with `emit()` from `src/internal/events.ts`. Events report what a person did, never a property set from code. See [ADR 0007](decisions/0007-events.md).
5. **Register it.** Add the entry to `src/index.ts`, `vite.config.ts`, the `exports` of `package.json`, and the types in `types/index.d.ts`.
6. **Story.** `apps/storybook/src/<id>.stories.ts`, one story per variant and for the disabled state. Events appear in the Actions panel on their own.
7. **Page.** `apps/docs/src/routes/components/<id>/+page.svelte`, and an entry in `apps/docs/src/lib/sections.ts`. The live example comes first, then short *do* and *don't* guidance.

New components start with `status: draft` in their contract.

### Accessibility is the floor

WCAG 2.2 AA, and the [APG](https://www.w3.org/WAI/ARIA/apg/) pattern for the widget:

- The role comes from a native element inside the shadow root. Do not re-author it with ARIA.
- Every control works with the keyboard, shows `:focus-visible`, and leaves the tab order when disabled.
- Text meets 4.5:1, boundaries and the focus ring meet 3:1, in every brand and theme.
- Movement stops under `prefers-reduced-motion`, and the component stays usable under `forced-colors`.
- Test with a screen reader when you change a role, a name, or the keyboard. Say which one in the pull request.

## Tokens and brands

- Components read **system tokens** only. Reference tokens stay in the token files.
- A new token is a minor change. Removing or renaming one is breaking.
- A brand is one file in `packages/tokens/src/preset`. The [preset builder](https://mohamedmok-ambre.surge.sh/builder) exports that file.
- Every brand must pass the 40 pairs in `packages/tokens/src/contrast-pairs.json`, in light and dark. `pnpm test` checks them.

## Checks

Run these before you open a pull request. CI runs the same.

```bash
pnpm test                                   # contrast pairs, contracts, manifest
pnpm --filter @ambre-ds/storybook build     # Storybook builds
pnpm --filter @ambre-ds/docs build          # every page prerenders
```

`pnpm test` fails when:

- the source drifts from the contract;
- a component has a `<style>` block;
- a stylesheet is missing or holds a raw colour;
- an event in the contract is never emitted;
- a colour pair falls under its contrast ratio.

## Commits, changesets, and pull requests

- **Commits** are short, imperative sentences that say what changed: `Open the navigation drawer on every page on small screens`. No type prefix such as `feat:`.
- **Changeset.** Add one for any change a package user would notice:

  ```bash
  pnpm changeset
  ```

  A fix is a patch, and a new component, prop, token, or event is a minor change. Removing or renaming a tag, prop, part, slot, event, or public CSS variable is breaking: it needs an ADR in `decisions/`.
- **Pull request.** One change per pull request. Fill in the template: what changed, why, how you checked it, with a screenshot for anything visual, in light and dark.

## Releases

Releases are automated. When changesets reach `main`, the Release workflow opens a *Version packages* pull request. Merging it publishes every package to npm with provenance, and tags the release. The four packages share one version.

## Conduct

Be kind, assume good intent, and keep feedback about the work. Harassment of any kind is not tolerated. Report a problem to the maintainers through a private GitHub security advisory or by email to the repository owner.

## License

By contributing, you agree that your contribution is licensed under the [MIT license](LICENSE).
