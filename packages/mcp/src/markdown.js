/**
 * Markdown views of the knowledge, for llms.txt, the MCP tools, and the usage skill.
 * Every function takes the knowledge as an argument, so the build can use it before it is written.
 */

const cell = (text) => String(text ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');

function attributeOf(prop) {
	return prop.attribute ?? prop.name.toLowerCase();
}

function importOf(c) {
	return c.package === '@ambre-ds/ui' ? `import '@ambre-ds/ui/${c.id}';` : `import '${c.package}';`;
}

/** A small, valid starting point for the element, built from its contract. */
export function snippet(c) {
	const label = c.slots.find((slot) => slot.name === 'default') ? c.title : '';
	const required = c.props.filter((prop) => prop.name === 'name');
	const attrs = required.map((prop) => ` ${attributeOf(prop)}="${c.id.replace(/-/g, '')}"`).join('');
	const labelled = c.props.find((prop) => prop.name === 'label' && prop.type === 'string');
	const labelAttr = labelled && !label ? ` label="${c.title}"` : '';
	return `<${c.tag}${attrs}${labelAttr}>${label}</${c.tag}>`;
}

/** The full reference of one component. */
export function componentMarkdown(c, k) {
	const lines = [];
	lines.push(`# <${c.tag}>: ${c.title}`, '');
	lines.push(c.summary, '');
	lines.push(`- Package: \`${c.package}\`, registered with \`${importOf(c)}\``);
	lines.push(`- Status: ${c.status}`);
	lines.push(`- Documentation: ${k.site}/components/${c.id}`, '');

	lines.push('## Attributes', '');
	if (c.props.length) {
		lines.push('| Attribute | Type | Default | Description |', '| --- | --- | --- | --- |');
		for (const prop of c.props) {
			const type = prop.values ? prop.values.map((value) => `\`${value}\``).join(' \\| ') : prop.type;
			const name = prop.attribute ? `\`${prop.attribute}\`` : `\`${prop.name}\` (property)`;
			const fallback = prop.default === undefined || prop.default === '' ? '' : `\`${prop.default}\``;
			lines.push(`| ${name} | ${type} | ${fallback} | ${cell(prop.description)} |`);
		}
		if (c.props.some((prop) => prop.type === 'boolean')) {
			lines.push('', 'Boolean attributes are true when present. Remove the attribute for false; never write `="false"`.');
		}
	} else {
		lines.push('None, beyond the global HTML attributes.');
	}
	lines.push('');

	lines.push('## Slots', '');
	if (c.slots.length) {
		lines.push('| Slot | Description |', '| --- | --- |');
		for (const slot of c.slots) {
			lines.push(`| ${slot.name === 'default' ? '(default)' : `\`${slot.name}\``} | ${cell(slot.description)} |`);
		}
		lines.push('', 'A named slot goes on a direct child: `<span slot="description">…</span>`.');
	} else {
		lines.push('None. The element has no content.');
	}
	lines.push('');

	lines.push('## Events', '');
	if (c.events.length) {
		lines.push('| Event | `event.detail` | Description |', '| --- | --- | --- |');
		for (const event of c.events) {
			const detail = event.native ? 'native, read `event.target`' : `\`${event.detail}\``;
			const flags = event.cancelable ? ' Cancelable.' : '';
			lines.push(`| \`${event.name}\` | ${cell(detail)} | ${cell(event.description)}${flags} |`);
		}
		const first = c.events.find((event) => !event.native) ?? c.events[0];
		lines.push(
			'',
			'```js',
			`document.querySelector('${c.tag}').addEventListener('${first.name}', (event) => {`,
			`  console.log(${first.native ? 'event.target' : 'event.detail'});`,
			'});',
			'```'
		);
	} else {
		lines.push('None.');
	}
	lines.push('');

	if (c.parts.length) {
		lines.push('## CSS parts', '');
		lines.push(c.parts.map((part) => `\`::part(${part.name})\` (${part.element})`).join(', '), '');
	}

	lines.push('## Accessibility', '');
	lines.push(`- Role: ${c.a11y.role}`);
	lines.push(`- Accessible name: ${c.a11y.name}`);
	for (const key of c.a11y.keyboard ?? []) lines.push(`- Keyboard: ${key}`);
	for (const note of c.a11y.notes ?? []) lines.push(`- ${note}`);
	lines.push('');

	lines.push('## Minimal markup', '', '```html', snippet(c), '```', '');

	const used = k.examples.filter((item) => item.components.includes(c.tag));
	if (used.length) {
		lines.push('## Used in examples', '');
		for (const item of used) lines.push(`- [${item.title}](${k.site}/llms/examples/${item.id}.md): ${item.summary}`);
		lines.push('');
	}
	return lines.join('\n');
}

export function exampleMarkdown(e, k) {
	return [
		`# Example: ${e.title}`,
		'',
		e.summary,
		'',
		`Elements: ${e.components.map((tag) => `\`<${tag}>\``).join(', ')}`,
		'',
		'```html',
		e.html,
		'```',
		'',
		`Load \`@ambre-ds/tokens/css\` and the packages of these elements first. See ${k.site}/llms/guidelines.md.`,
		''
	].join('\n');
}

function componentIndex(k, link) {
	const groups = new Map();
	for (const c of k.components) {
		if (!groups.has(c.package)) groups.set(c.package, []);
		groups.get(c.package).push(c);
	}
	const lines = [];
	for (const [pkg, items] of groups) {
		lines.push(`### ${pkg}`, '');
		for (const c of items) {
			lines.push(link ? `- [<${c.tag}>](${k.site}/llms/components/${c.id}.md): ${c.summary}` : `- \`<${c.tag}>\`: ${c.summary}`);
		}
		lines.push('');
	}
	return lines.join('\n');
}

/** llms.txt: what Ambre is, and where each part of the reference lives. See llmstxt.org. */
export function llmsIndex(k) {
	return [
		'# Ambre',
		'',
		'> Accessible web components (amb-* custom elements) themed by semantic tokens. One library, any brand: the same markup follows any brand preset, in plain HTML, React, Vue, Svelte, or Angular.',
		'',
		`Version ${k.version}. Packages: @ambre-ds/tokens, @ambre-ds/ui, @ambre-ds/commerce, @ambre-ds/ai, and @ambre-ds/mcp for agents. Every reference below is generated from the component contracts, which CI keeps in step with the code.`,
		'',
		'## Start here',
		'',
		`- [Guidelines for AI](${k.site}/llms/guidelines.md): install, load order, markup rules, events, theming, and how to choose a component.`,
		`- [Full reference](${k.site}/llms-full.txt): the guidelines, every component, and every example in one file.`,
		`- [MCP server](${k.site}/get-started/ai): \`npx -y @ambre-ds/mcp\`, with tools to look up components and validate markup.`,
		'',
		'## Components',
		'',
		componentIndex(k, true),
		'## Examples',
		'',
		...k.examples.map((e) => `- [${e.title}](${k.site}/llms/examples/${e.id}.md): ${e.summary}`),
		'',
		'## Optional',
		'',
		`- [Documentation site](${k.site}): the same content for people, with live examples.`,
		`- [Storybook](${k.site}/storybook/): every variant and state.`,
		`- [Usage skill](${k.site}/skills/ambre/SKILL.md): a SKILL.md for agents such as Claude Code.`,
		''
	].join('\n');
}

/** llms-full.txt: everything, in one file. */
export function llmsFull(k) {
	return [
		k.guidelines.trim(),
		'',
		'# Components',
		'',
		...k.components.map((c) => componentMarkdown(c, k).replace(/^# /gm, '## ').replace(/^## (?!<)/gm, '### ')),
		'# Examples',
		'',
		...k.examples.map((e) => exampleMarkdown(e, k).replace(/^# /gm, '## ')),
		''
	].join('\n');
}

/** A SKILL.md for agents that build with Ambre, in another project. */
export function skill(k) {
	return [
		'---',
		'name: ambre',
		'description: Builds interfaces with the Ambre design system (amb-* web components, @ambre-ds packages). Use when writing or reviewing HTML, React, Vue, Svelte, or Angular code that uses amb- elements, Ambre tokens, or brand presets.',
		'---',
		'',
		k.guidelines.replace(/^# .*\n/, '# Ambre\n').trim(),
		'',
		'## Components',
		'',
		`Before using an element you have not used in this session, read its reference at ${k.site}/llms/components/<id>.md, or call \`get_component\` when the Ambre MCP server is connected. Never guess an attribute, a slot, or an event.`,
		'',
		componentIndex(k, false),
		'## Examples',
		'',
		'Start from the closest complete screen:',
		'',
		...k.examples.map((e) => `- ${e.title}: ${k.site}/llms/examples/${e.id}.md`),
		'',
		'## Before you finish',
		'',
		'- Run `validate_markup` from the Ambre MCP server on the markup you wrote, and fix every error.',
		'- Check that every control has visible label text, that choices are grouped in a fieldset, and that events are read from `event.detail`.',
		''
	].join('\n');
}
