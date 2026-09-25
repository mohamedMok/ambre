# @ambre-ds/mcp

The [Ambre](https://mohamedmok-ambre.surge.sh) design system for AI agents. An [MCP](https://modelcontextprotocol.io) server that gives Claude, Cursor, Copilot, and other tools the exact API of every `amb-` element, finds the right one for a need, serves complete examples, and validates the markup they write against the component contracts.

## Connect

Claude Code:

```bash
claude mcp add ambre -- npx -y @ambre-ds/mcp
```

Cursor, Claude Desktop, and other clients:

```json
{
  "mcpServers": {
    "ambre": { "command": "npx", "args": ["-y", "@ambre-ds/mcp"] }
  }
}
```

## Tools

| Tool | Returns |
| --- | --- |
| `get_guidelines` | Install, load order, markup rules, events, theming, and how to choose a component |
| `list_components` | Every element, with its package and summary |
| `get_component` | One element's attributes, slots, events with their `detail`, parts, keyboard, and minimal markup |
| `find_components` | The right element for a need in plain words |
| `list_examples`, `get_example` | Complete screens to adapt |
| `validate_markup` | Every problem in a piece of HTML, with its line and a fix |

## As a library

```js
import { validate, report, component, find } from '@ambre-ds/mcp';

const result = validate('<amb-checkbox checked="false"></amb-checkbox>');
console.log(report(result));
// 2 errors.
// - Error, line 1, <amb-checkbox>: `checked="false"` makes it true …
// - Error, line 1, <amb-checkbox>: <amb-checkbox> has no label …
```

The usage skill for agents is at `@ambre-ds/mcp/skill`, and the whole knowledge base at `@ambre-ds/mcp/knowledge.json`. Both are generated from the contracts in the Ambre repository.

Documentation: [mohamedmok-ambre.surge.sh/get-started/ai](https://mohamedmok-ambre.surge.sh/get-started/ai) · MIT license.
