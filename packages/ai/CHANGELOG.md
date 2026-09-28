# @ambre-ds/ai

## 0.3.0

### Minor Changes

- c2869b6: New in `@ambre-ds/ai`: `amb-tool-call`, a step an agent took with its input and output, and `amb-code-block`, code with its language and a copy button that keeps up with a streamed answer.

  New package `@ambre-ds/mcp`: an MCP server that looks up every element, finds the right one for a need, serves complete examples, and validates markup against the component contracts. The same knowledge feeds llms.txt and a usage skill on the documentation site.

### Patch Changes

- @ambre-ds/tokens@0.3.0

## 0.2.0

### Minor Changes

- 4b1184c: Events reach the page. `change` now crosses the shadow root on checkbox, toggle, radio, select, range, text field, and text area, with the new value in `event.detail`. `amb-menu` fires `select` with the picked item. Every event bubbles, is composed, and has an exported TypeScript type.
- 25021af: New components in `@ambre-ds/ui`: `amb-date-picker`, `amb-checkbox-card`, `amb-radio-card`, `amb-card`, `amb-tile`, `amb-stat-tile`, and `amb-layout` with the sidebar, split, and stacked layouts.

  New package `@ambre-ds/ai` with `amb-prompt`, `amb-message`, `amb-thinking`, and `amb-suggestion`.

### Patch Changes

- @ambre-ds/tokens@0.2.0
