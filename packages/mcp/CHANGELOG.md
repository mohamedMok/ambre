# @ambre-ds/mcp

## 0.4.0

### Minor Changes

- d95d175: `ambre-lint` checks the amb- markup of a whole project, HTML strictly and Svelte, Vue, JSX, TSX, and Astro templates in framework mode: directives, expressions, and framework event bindings are left alone. Inside GitHub Actions it annotates each problem on the pull request, and a composite action runs it in one line: `uses: mohamedMok/ambre/lint@main`.

  `validate()` takes `{ framework: true }` for component templates. The tool definitions are exported as `tools`, with `jsonSchema()`, for any model API with tool calling.

## 0.3.0

### Minor Changes

- c2869b6: New in `@ambre-ds/ai`: `amb-tool-call`, a step an agent took with its input and output, and `amb-code-block`, code with its language and a copy button that keeps up with a streamed answer.

  New package `@ambre-ds/mcp`: an MCP server that looks up every element, finds the right one for a need, serves complete examples, and validates markup against the component contracts. The same knowledge feeds llms.txt and a usage skill on the documentation site.
