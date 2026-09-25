/**
 * Starts the server over stdio, as an MCP client would, and calls every tool once.
 *   node smoke.mjs
 */
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const client = new Client({ name: 'ambre-smoke', version: '0.0.0' });
await client.connect(new StdioClientTransport({ command: 'node', args: ['bin/ambre-mcp.js'] }));

const info = client.getServerVersion();
const { tools } = await client.listTools();
console.log(`server ${info.name} ${info.version}: ${tools.map((tool) => tool.name).join(', ')}`);

const calls = [
	['find_components', { need: 'pick a date for a booking' }],
	['get_component', { name: 'tool call' }],
	['get_example', { id: 'checkout' }],
	['validate_markup', { html: '<amb-card href="/linen">\n  <amb-checkbox checked="false" color="red"></amb-checkbox>\n  <p slot="body">Washed linen</p>\n</amb-card>' }],
	['get_component', { name: 'amb-datepicker' }]
];

for (const [name, args] of calls) {
	const result = await client.callTool({ name, arguments: args });
	const text = result.content[0].text;
	console.log(`\n── ${name} ${JSON.stringify(args).slice(0, 60)}${result.isError ? ' (error)' : ''}`);
	console.log(text.split('\n').slice(0, name === 'validate_markup' ? 12 : 6).join('\n'));
}

await client.close();
