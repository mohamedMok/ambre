import { report, validate } from '@ambre-ds/mcp';

export const prerender = true;

const invalid = `<amb-card href="/linen">
  <amb-checkbox checked="false" color="red"></amb-checkbox>
  <p slot="body">Washed linen</p>
</amb-card>`;

/** The validator's real answer, computed at build time by the same library the MCP server uses. */
export function load() {
	return { invalid, verdict: report(validate(invalid)) };
}
