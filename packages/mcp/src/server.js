/**
 * The Ambre MCP server. It answers from the component contracts, so an agent can look up the
 * exact API of any element, find the right one for a need, start from a complete example, and
 * check the markup it wrote.
 *
 *   npx -y @ambre-ds/mcp
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { knowledge } from './knowledge.js';
import { instructions, tools } from './tools.js';

/** The zod shape of a tool's input, from the shared definition. */
function shape(input) {
	return Object.fromEntries(
		Object.entries(input).map(([key, field]) => {
			let type = field.enum ? z.enum(field.enum) : field.type === 'integer' ? z.number().int() : z.string();
			type = type.describe(field.description);
			return [key, field.optional ? type.optional() : type];
		})
	);
}

export function createServer() {
	const server = new McpServer(
		{ name: 'ambre', title: 'Ambre design system', version: knowledge.version },
		{ instructions }
	);
	for (const tool of tools) {
		server.registerTool(
			tool.name,
			{ title: tool.title, description: tool.description, inputSchema: shape(tool.input), annotations: { readOnlyHint: true } },
			async (args) => {
				const result = tool.run(args ?? {});
				return { content: [{ type: 'text', text: result.text }], ...(result.isError ? { isError: true } : {}) };
			}
		);
	}
	return server;
}

export async function start() {
	await createServer().connect(new StdioServerTransport());
}
