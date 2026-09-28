/**
 * The Ambre tools, defined once. The MCP server registers them, and the benchmark hands the
 * same definitions to a model through tool calling, so what is measured is what users get.
 *
 * Each input field is { type, description, enum?, optional? }, a subset both JSON Schema and zod express.
 */
import { closest, component, example, find, knowledge } from './knowledge.js';
import { componentMarkdown, exampleMarkdown } from './markdown.js';
import { report, validate } from './validate.js';

const ok = (text) => ({ text, isError: false });
const fail = (text) => ({ text, isError: true });

export const instructions =
	'Ambre is a design system of amb-* web components. Call get_guidelines once before writing Ambre markup. ' +
	'Call get_component before using an element whose API you have not read in this session: never guess an attribute, slot, or event. ' +
	'Start screens from get_example. Call validate_markup on the markup you wrote, and fix every error before you finish.';

export const tools = [
	{
		name: 'get_guidelines',
		title: 'Ambre guidelines',
		description:
			'How to install and load Ambre, the markup rules, how events work, theming and brands, and how to choose a component. Read once before writing Ambre markup.',
		input: {},
		run: () => ok(knowledge.guidelines)
	},
	{
		name: 'list_components',
		title: 'List Ambre components',
		description: 'Every Ambre element with its tag, package, and one-line summary.',
		input: {
			package: {
				type: 'string',
				enum: ['@ambre-ds/ui', '@ambre-ds/commerce', '@ambre-ds/ai'],
				optional: true,
				description: 'Only the elements of this package.'
			}
		},
		run: ({ package: pkg } = {}) =>
			ok(
				knowledge.components
					.filter((c) => !pkg || c.package === pkg)
					.map((c) => `- <${c.tag}> (${c.package}, ${c.status}): ${c.summary}`)
					.join('\n')
			)
	},
	{
		name: 'get_component',
		title: 'Get an Ambre component',
		description:
			'The full reference of one element: attributes with types and defaults, slots, events with the shape of event.detail, CSS parts, keyboard and screen reader behaviour, minimal markup, and the examples that use it.',
		input: {
			name: { type: 'string', description: 'The tag, id, or title, such as amb-date-picker, date-picker, or Date picker.' }
		},
		run: ({ name }) => {
			const c = component(name);
			if (c) return ok(componentMarkdown(c, knowledge));
			const tags = knowledge.components.map((item) => item.tag);
			const typo = closest(String(name).toLowerCase(), tags) ?? closest(`amb-${String(name).toLowerCase()}`, tags);
			const guesses = typo ? [`<${typo}>`] : find(name, 3).map((item) => `<${item.tag}>`);
			return fail(
				`No Ambre element is called ${name}.${guesses.length ? ` Did you mean ${guesses.join(', ')}?` : ''} Call list_components for all of them.`
			);
		}
	},
	{
		name: 'find_components',
		title: 'Find Ambre components for a need',
		description: 'Ranks the elements for a need in plain words, such as "pick a date", "show a key figure", or "a step the agent took".',
		input: {
			need: { type: 'string', description: 'What the interface has to do.' },
			limit: { type: 'integer', optional: true, description: 'How many to return, from 1 to 10. 5 by default.' }
		},
		run: ({ need, limit }) => {
			const hits = find(need, Math.min(10, Math.max(1, limit ?? 5)));
			if (!hits.length) return ok('Nothing matched. Call list_components and pick from the summaries.');
			return ok(hits.map((c) => `- <${c.tag}> (${c.package}): ${c.summary}`).join('\n'));
		}
	},
	{
		name: 'list_examples',
		title: 'List Ambre examples',
		description: 'Complete, working screens built with Ambre, such as sign in, checkout, settings, dashboard, and an AI assistant.',
		input: {
			element: { type: 'string', optional: true, description: 'Only the examples that use this element, such as amb-date-picker.' }
		},
		run: ({ element } = {}) => {
			const tag = element ? component(element)?.tag : undefined;
			const items = knowledge.examples.filter((e) => !tag || e.components.includes(tag));
			if (!items.length) return ok('No example uses that element yet. Call get_component for its minimal markup.');
			return ok(items.map((e) => `- ${e.id}: ${e.title}. ${e.summary}`).join('\n'));
		}
	},
	{
		name: 'get_example',
		title: 'Get an Ambre example',
		description: 'The full HTML and script of one example screen. Adapt it rather than starting from nothing.',
		input: {
			id: { type: 'string', description: 'The example id from list_examples, such as checkout.' }
		},
		run: ({ id }) => {
			const e = example(id);
			if (!e) return fail(`No example called ${id}. Examples: ${knowledge.examples.map((item) => item.id).join(', ')}.`);
			return ok(exampleMarkdown(e, knowledge));
		}
	},
	{
		name: 'validate_markup',
		title: 'Validate Ambre markup',
		description:
			'Checks HTML against the Ambre contracts: unknown elements, attributes, slots, and values, boolean attributes set to "false", missing labels, slots on the wrong element, and inline handlers for custom events. Returns each problem with its line and a fix, and the packages to import.',
		input: {
			html: { type: 'string', description: 'The HTML to check. JSX works too, when its attributes are written as in HTML.' }
		},
		run: ({ html }) => ok(report(validate(html)))
	}
];

/** A tool's input as JSON Schema, for model APIs with tool calling. */
export function jsonSchema(tool) {
	const properties = {};
	const required = [];
	for (const [key, field] of Object.entries(tool.input)) {
		properties[key] = { type: field.type, description: field.description, ...(field.enum ? { enum: field.enum } : {}) };
		if (!field.optional) required.push(key);
	}
	return { type: 'object', properties, required };
}
