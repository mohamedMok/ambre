# Ambre Eval

How often does a model write valid Ambre markup, and how much do the usage skill and the MCP tools help?

Each of the 40 tasks in [`tasks.json`](tasks.json) is a screen to build, from a sign-in form to an agent's answer with its tool calls. Each one runs under three conditions:

| Condition | What the model gets |
| --- | --- |
| No help | Only its own knowledge of Ambre |
| Skill in the prompt | The usage skill: the guidelines and the component index, as in `/skills/ambre/SKILL.md` |
| MCP tools | The Ambre tools through tool calling, with the same definitions as `@ambre-ds/mcp` |

Every answer is checked by the validator in `@ambre-ds/mcp`, against the component contracts. A screen is **valid** when it uses Ambre and the validator reports no error. The report also counts invented elements, errors by kind, the share of the expected elements the answer used, tool calls, and tokens.

## Run it

```bash
ANTHROPIC_API_KEY=… pnpm eval                             # claude-sonnet-5 by default
ANTHROPIC_API_KEY=… pnpm eval --model claude-opus-5-5
OPENAI_API_KEY=… pnpm eval --provider openai --model <model>
pnpm eval --provider mock                                 # no API: checks the pipeline
```

Options: `--conditions none,skill,mcp`, `--tasks sign-in,booking`, `--limit 10`, `--runs 3`, `--concurrency 4`.

A full run is 120 answers per model and run. The MCP condition makes several calls per answer, so it costs the most.

Results land in `results/<date>-<provider>-<model>.md` and `.json`, with every generated screen, so each number can be checked by hand.
