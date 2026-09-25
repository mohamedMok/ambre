/**
 * Checks HTML that uses Ambre elements against the contracts. It catches what a model or a
 * person most often gets wrong: an element, attribute, slot, or value that does not exist,
 * `checked="false"`, a missing label, a slot on the wrong element, and inline handlers for
 * custom events.
 */
import { parse } from 'node-html-parser';
import { attributeOf, closest, component, knowledge } from './knowledge.js';

/** Attributes every HTML element takes. */
const global = new Set([
	'id', 'class', 'style', 'slot', 'part', 'lang', 'dir', 'title', 'hidden', 'tabindex', 'inert',
	'autofocus', 'draggable', 'translate', 'spellcheck', 'exportparts', 'is', 'nonce', 'popover',
	'accesskey', 'contenteditable', 'enterkeyhint', 'inputmode'
]);

/** Inline handler attributes the browser runs for any element. Custom events have none. */
const handlers = new Set([
	'onclick', 'oninput', 'onchange', 'ontoggle', 'onclose', 'onselect', 'onsubmit', 'onfocus', 'onblur',
	'onkeydown', 'onkeyup', 'onpointerdown', 'onpointerup', 'onmousedown', 'onmouseup', 'oncopy', 'oninvalid'
]);

function suggest(word, options) {
	const hit = closest(word, options);
	return hit ? ` Did you mean \`${hit}\`?` : '';
}

/** Text that belongs to the default slot: direct text and children without a slot attribute. */
function defaultSlotText(element) {
	return element.childNodes
		.map((node) => {
			if (node.nodeType === 3) return node.text;
			if (node.nodeType === 1 && !node.getAttribute('slot')) return node.text;
			return '';
		})
		.join('')
		.trim();
}

function hasDefaultSlotElement(element) {
	return element.childNodes.some((node) => node.nodeType === 1 && !node.getAttribute('slot'));
}

/** Whether the component names itself from its default slot. */
function namedBySlot(c) {
	// An element with a label attribute, such as amb-icon, is named by it, or is decorative without it.
	if (c.props.some((prop) => prop.name === 'label')) return false;
	const slot = c.slots.find((item) => item.name === 'default');
	return Boolean(slot && /accessible name/i.test(slot.description)) || /^slotted (text|label)/i.test(c.a11y.name);
}

/**
 * @param {string} html
 * @returns {{ valid: boolean, errors: Issue[], warnings: Issue[], elements: string[], packages: string[] }}
 * @typedef {{ line: number, element: string, message: string }} Issue
 */
export function validate(html) {
	const errors = [];
	const warnings = [];
	const used = new Set();
	const source = String(html);
	const root = parse(source, { comment: false, blockTextElements: { script: true, style: true, pre: true } });

	const lineOf = (node) => (node.range ? source.slice(0, node.range[0]).split('\n').length : 0);
	const report = (list, node, message) => list.push({ line: lineOf(node), element: `<${node.rawTagName}>`, message });

	function visit(node, parent) {
		if (node.nodeType !== 1) return;
		const tag = (node.rawTagName ?? '').toLowerCase();

		// A slot attribute only works on a direct child of the element that has the slot.
		const slot = node.getAttribute('slot');
		if (slot !== undefined && parent && !(parent.rawTagName ?? '').toLowerCase().startsWith('amb-') && tag !== 'template') {
			const host = findAmbAncestor(parent);
			if (host) {
				report(warnings, node, `\`slot="${slot}"\` is not on a direct child of <${host.rawTagName}>, so it is ignored. Move it to the child of <${host.rawTagName}>.`);
			}
		}

		if (tag.startsWith('amb-')) visitComponent(node, tag);
		for (const child of node.childNodes) visit(child, node);
	}

	function findAmbAncestor(node) {
		let current = node;
		while (current) {
			if ((current.rawTagName ?? '').toLowerCase().startsWith('amb-')) return current;
			current = current.parentNode;
		}
		return undefined;
	}

	function visitComponent(node, tag) {
		const c = component(tag);
		if (!c) {
			report(errors, node, `Unknown element.${suggest(tag, knowledge.components.map((item) => item.tag))}`);
			return;
		}
		used.add(c);
		const props = new Map(c.props.map((prop) => [attributeOf(prop), prop]));
		const events = new Map(c.events.map((event) => [event.name, event]));

		for (const [raw, value] of Object.entries(node.attributes)) {
			const name = raw.toLowerCase();
			const prop = props.get(name);
			if (prop) {
				if (prop.type === 'boolean' && /^(false|0|no|off)$/i.test(value)) {
					report(errors, node, `\`${name}="${value}"\` makes it true: a boolean attribute is true when present. Remove the attribute for false.`);
				} else if (prop.type === 'enum' && !prop.values.includes(value)) {
					report(errors, node, `\`${name}="${value}"\` is not a value of ${name}. Use one of ${prop.values.map((v) => `\`${v}\``).join(', ')}.`);
				} else if (prop.type === 'number' && (value.trim() === '' || Number.isNaN(Number(value)))) {
					report(errors, node, `\`${name}="${value}"\` is not a number.`);
				}
				continue;
			}
			if (global.has(name) || name.startsWith('aria-') || name.startsWith('data-')) continue;
			if (name === 'role') {
				report(warnings, node, 'Do not set a role: the element takes its role from a native element inside it.');
				continue;
			}
			if (name.startsWith('on')) {
				const event = name.slice(2);
				if (events.has(event) && !handlers.has(name)) {
					report(errors, node, `\`${name}\` does nothing: \`${event}\` is a custom event and has no inline handler. Use addEventListener('${event}', …) or your framework's event binding.`);
				} else {
					report(warnings, node, `Prefer addEventListener('${event}', …) over the inline \`${name}\` attribute.`);
				}
				continue;
			}
			const known = [...props.keys()];
			report(errors, node, `<${tag}> has no \`${name}\` attribute.${suggest(name, known)}${known.length ? ` Its attributes are ${known.map((k) => `\`${k}\``).join(', ')}.` : ' It takes no attributes.'}`);
		}

		// Children with a slot attribute must name a slot the element has.
		const slots = new Set(c.slots.map((item) => item.name));
		for (const child of node.childNodes) {
			if (child.nodeType !== 1) continue;
			const name = child.getAttribute('slot');
			if (name === undefined) {
				if (!slots.has('default') && (child.rawTagName ?? '').toLowerCase() !== 'option') {
					report(warnings, child, `<${tag}> has no default slot, so this child is not shown.`);
				}
				continue;
			}
			if (!slots.has(name)) {
				const named = [...slots].filter((item) => item !== 'default');
				report(errors, child, `<${tag}> has no \`${name}\` slot.${suggest(name, named)}${named.length ? ` Its slots are ${named.map((s) => `\`${s}\``).join(', ')}.` : ' It has only the default slot.'}`);
			}
		}

		// The visible label is the slotted text.
		if (namedBySlot(c) && !defaultSlotText(node) && !hasDefaultSlotElement(node) && !node.getAttribute('aria-label') && !node.getAttribute('aria-labelledby')) {
			report(errors, node, `<${tag}> has no label. Put the visible label text inside the element, such as <${tag}>${c.title}</${tag}>.`);
		}

		// Rules a contract states in words.
		if (['amb-radio', 'amb-radio-card'].includes(tag) && !node.getAttribute('name')) {
			report(warnings, node, 'Give every radio in a group the same `name`, or the arrow keys and the form value do not work.');
		}
		if (['amb-card', 'amb-tile'].includes(tag) && node.getAttribute('href') !== undefined) {
			const needs = tag === 'amb-card' ? 'heading' : 'default';
			const named =
				needs === 'heading'
					? node.childNodes.some((child) => child.nodeType === 1 && child.getAttribute('slot') === 'heading' && child.text.trim())
					: Boolean(defaultSlotText(node));
			if (!named) report(errors, node, `With \`href\`, <${tag}> needs ${needs === 'heading' ? 'a `heading` slot' : 'title text'}: it is the link's name.`);
		}
		if (tag === 'amb-layout' && root.querySelectorAll('amb-layout').length > 1) {
			report(warnings, node, 'Use one <amb-layout> per page: its default slot is the main landmark.');
		}
	}

	for (const child of root.childNodes) visit(child, undefined);

	const packages = [...new Set([...used].map((c) => c.package))].sort();
	const byLine = (a, b) => a.line - b.line;
	return {
		valid: errors.length === 0,
		errors: errors.sort(byLine),
		warnings: warnings.sort(byLine),
		elements: [...used].map((c) => c.tag).sort(),
		packages
	};
}

/** The result as a short report, for a model to read. */
export function report(result) {
	const lines = [];
	lines.push(result.valid ? 'Valid: no errors.' : `${result.errors.length} error${result.errors.length === 1 ? '' : 's'}.`);
	for (const issue of result.errors) lines.push(`- Error, line ${issue.line}, ${issue.element}: ${issue.message}`);
	for (const issue of result.warnings) lines.push(`- Warning, line ${issue.line}, ${issue.element}: ${issue.message}`);
	if (result.elements.length) {
		lines.push('', `Elements: ${result.elements.join(', ')}`);
		lines.push(`Load: import '@ambre-ds/tokens/css'; ${result.packages.map((pkg) => `import '${pkg}';`).join(' ')}`);
	}
	return lines.join('\n');
}
