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
import { closest, component, example, find, knowledge } from './knowledge.js';
import { componentMarkdown, exampleMarkdown } from './markdown.js';
import { report, validate } from './validate.js';

const text = (value) => ({ content: [{ type: 'text', text: value }] });
const miss = (value) => ({ content: [{ type: 'text', text: value }], isError: true });

export function createServer() {
	const server = new McpServer(
		{ name: 'ambre', title: 'Ambre design system', version: knowledge.version },
		{
			instructions:
				'Ambre is a design system of amb-* web components. Call get_guidelines once before writing Ambre markup. ' +
				'Call get_component before using an element whose API you have not read in this session: never guess an attribute, slot, or event. ' +
				'Start screens from get_example. Call validate_markup on the markup you wrote, and fix every error before you finish.'
		}
	);

	server.registerTool(
		'get_guidelines',
		{
			title: 'Ambre guidelines',
			description: 'How to install and load Ambre, the markup rules, how events work, theming and brands, and how to choose a component. Read once before writing Ambre markup.',
			inputSchema: {},
			annotations: { readOnlyHint: true }
		},
		async () => text(knowledge.guidelines)
	);

	server.registerTool(
		'list_components',
		{
			title: 'List Ambre components',
			description: 'Every Ambre element with its tag, package, and one-line summary.',
			inputSchema: {
				package: z
					.enum(['@ambre-ds/ui', '@ambre-ds/commerce', '@ambre-ds/ai'])
					.optional()
					.describe('Only the elements of this package.')
			},
			annotations: { readOnlyHint: true }
		},
		async ({ package: pkg }) => {
			const items = knowledge.components.filter((c) => !pkg || c.package === pkg);
			return text(items.map((c) => `- <${c.tag}> (${c.package}, ${c.status}): ${c.summary}`).join('\n'));
		}
	);

	server.registerTool(
		'get_component',
		{
			title: 'Get an Ambre component',
			description: 'The full reference of one element: attributes with types and defaults, slots, events with the shape of event.detail, CSS parts, keyboard and screen reader behaviour, minimal markup, and the examples that use it.',
			inputSchema: {
				name: z.string().describe('The tag, id, or title, such as amb-date-picker, date-picker, or Date picker.')
			},
			annotations: { readOnlyHint: true }
		},
		async ({ name }) => {
			const c = component(name);
			if (!c) {
				const tags = knowledge.components.map((item) => item.tag);
				const typo = closest(String(name).toLowerCase(), tags) ?? closest(`amb-${String(name).toLowerCase()}`, tags);
				const guesses = typo ? [`<${typo}>`] : find(name, 3).map((item) => `<${item.tag}>`);
				return miss(`No Ambre element is called ${name}.${guesses.length ? ` Did you mean ${guesses.join(', ')}?` : ''} Call list_components for all of them.`);
			}
			return text(componentMarkdown(c, knowledge));
		}
	);

	server.registerTool(
		'find_components',
		{
			title: 'Find Ambre components for a need',
			description: 'Ranks the elements for a need in plain words, such as "pick a date", "show a key figure", or "a step the agent took".',
			inputSchema: {
				need: z.string().describe('What the interface has to do.'),
				limit: z.number().int().min(1).max(10).optional().describe('How many to return. 5 by default.')
			},
			annotations: { readOnlyHint: true }
		},
		async ({ need, limit }) => {
			const hits = find(need, limit ?? 5);
			if (!hits.length) return text('Nothing matched. Call list_components and pick from the summaries.');
			return text(hits.map((c) => `- <${c.tag}> (${c.package}): ${c.summary}`).join('\n'));
		}
	);

	server.registerTool(
		'list_examples',
		{
			title: 'List Ambre examples',
			description: 'Complete, working screens built with Ambre, such as sign in, checkout, settings, dashboard, and an AI assistant.',
			inputSchema: {
				element: z.string().optional().describe('Only the examples that use this element, such as amb-date-picker.')
			},
			annotations: { readOnlyHint: true }
		},
		async ({ element }) => {
			const tag = element ? component(element)?.tag : undefined;
			const items = knowledge.examples.filter((e) => !tag || e.components.includes(tag));
			if (!items.length) return text('No example uses that element yet. Call get_component for its minimal markup.');
			return text(items.map((e) => `- ${e.id}: ${e.title}. ${e.summary}`).join('\n'));
		}
	);

	server.registerTool(
		'get_example',
		{
			title: 'Get an Ambre example',
			description: 'The full HTML and script of one example screen. Adapt it rather than starting from nothing.',
			inputSchema: {
				id: z.string().describe('The example id from list_examples, such as checkout.')
			},
			annotations: { readOnlyHint: true }
		},
		async ({ id }) => {
			const e = example(id);
			if (!e) return miss(`No example called ${id}. Examples: ${knowledge.examples.map((item) => item.id).join(', ')}.`);
			return text(exampleMarkdown(e, knowledge));
		}
	);

	server.registerTool(
		'validate_markup',
		{
			title: 'Validate Ambre markup',
			description: 'Checks HTML against the Ambre contracts: unknown elements, attributes, slots, and values, boolean attributes set to "false", missing labels, slots on the wrong element, and inline handlers for custom events. Returns each problem with its line and a fix, and the packages to import.',
			inputSchema: {
				html: z.string().describe('The HTML to check. JSX works too, when its attributes are written as in HTML.')
			},
			annotations: { readOnlyHint: true }
		},
		async ({ html }) => text(report(validate(html)))
	);

	return server;
}

export async function start() {
	const server = createServer();
	await server.connect(new StdioServerTransport());
}
