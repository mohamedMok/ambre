---
"@ambre-ds/mcp": minor
---

`ambre-lint` checks the amb- markup of a whole project, HTML strictly and Svelte, Vue, JSX, TSX, and Astro templates in framework mode: directives, expressions, and framework event bindings are left alone. Inside GitHub Actions it annotates each problem on the pull request, and a composite action runs it in one line: `uses: mohamedMok/ambre/lint@main`.

`validate()` takes `{ framework: true }` for component templates. The tool definitions are exported as `tools`, with `jsonSchema()`, for any model API with tool calling.
