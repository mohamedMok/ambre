/**
 * Starts the published server with npx, as a user's MCP client would, and calls one tool.
 *   node smoke-npx.mjs 0.3.0
 */
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// A version from npm, or the path of a tarball from `npm pack`.
const version = process.argv[2] ?? 'latest';
const spec = version.endsWith('.tgz') ? version : `@ambre-ds/mcp@${version}`;
const client = new Client({ name: 'ambre-smoke-npx', version: '0.0.0' });
await client.connect(
	new StdioClientTransport({ command: 'npx', args: ['-y', `--package=${spec}`, 'ambre-mcp'], cwd: '/tmp' })
);
const info = client.getServerVersion();
const { tools } = await client.listTools();
console.log(`npx @ambre-ds/mcp@${version}: server ${info.name} ${info.version}, ${tools.length} tools`);
const result = await client.callTool({ name: 'validate_markup', arguments: { html: '<amb-button varient="ghost">Save</amb-button>' } });
console.log(result.content[0].text.split('\n')[1]);
await client.close();
