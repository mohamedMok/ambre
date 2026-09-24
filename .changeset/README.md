# Changesets

Every change to a published package (`@ambre-ds/tokens`, `@ambre-ds/ui`, `@ambre-ds/commerce`) comes with a changeset:

```bash
pnpm changeset
```

Pick the packages, the semver bump, and write one sentence for the changelog, in the voice of the docs.

- **major**: a removed or renamed prop, slot, part, event, token, or preset; a changed default.
- **minor**: a new component, prop, token, or preset.
- **patch**: a fix that keeps the API, including a visual fix.

The three packages are versioned together. On `main`, the Release workflow opens a "Version packages" pull request. Merging it publishes to npm.
