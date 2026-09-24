# npm scope: @ambre-ds

The packages publish as `@ambre-ds/tokens`, `@ambre-ds/ui` and `@ambre-ds/commerce`.

The `@ambre` scope on npm belongs to another organisation, which published `@ambre/ui` in 2022. A scope cannot be shared, so the packages move to `@ambre-ds`. This supersedes the package scope in ADR 0001.

Only the npm scope changes. The element prefix stays `amb-`, the CSS variables stay `--amb-`, and the brand is still Ambre.

The three packages are versioned together with Changesets and published from the Release workflow with npm provenance. Publishing needs the `ambre-ds` organisation on npm and an `NPM_TOKEN` repository secret; until the secret exists, the workflow stays green and publishes nothing.
