/**
 * The Ambre knowledge base: every component contract, the examples, and the guidelines.
 * Built from the repository by build.mjs.
 */
import data from '../dist/knowledge.json' with { type: 'json' };

export const knowledge = data;

const byKey = new Map();
for (const component of knowledge.components) {
	for (const key of [component.id, component.tag, component.title.toLowerCase()]) byKey.set(key, component);
}

/** Finds a component by tag (`amb-date-picker`), id (`date-picker`), or title (`Date picker`). */
export function component(name) {
	const key = String(name).trim().toLowerCase().replace(/^<|>$/g, '');
	return byKey.get(key) ?? byKey.get(key.replace(/\s+/g, '-')) ?? byKey.get(`amb-${key.replace(/\s+/g, '-')}`);
}

/** Edit distance between two words. */
export function distance(a, b) {
	const row = Array.from({ length: b.length + 1 }, (_, index) => index);
	for (let i = 1; i <= a.length; i += 1) {
		let previous = row[0];
		row[0] = i;
		for (let j = 1; j <= b.length; j += 1) {
			const current = row[j];
			row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
			previous = current;
		}
	}
	return row[b.length];
}

/** The option closest in spelling to a word, when it is close enough to be a typo. */
export function closest(word, options) {
	let best;
	let score = Infinity;
	for (const option of options) {
		const d = distance(word, option);
		if (d < score) [best, score] = [option, d];
	}
	return score <= Math.max(2, Math.floor(word.length / 3)) ? best : undefined;
}

export function example(id) {
	return knowledge.examples.find((item) => item.id === String(id).trim().toLowerCase());
}

/** The attribute name a prop is set with in HTML. */
export function attributeOf(prop) {
	return prop.attribute ?? prop.name.toLowerCase();
}

const stop = new Set(['a', 'an', 'the', 'to', 'of', 'for', 'and', 'or', 'in', 'on', 'with', 'i', 'my', 'need', 'want', 'some', 'that', 'is', 'it', 'be']);

function words(text) {
	return String(text)
		.toLowerCase()
		.split(/[^a-z0-9]+/)
		.filter((word) => word.length > 1 && !stop.has(word))
		// A light singular, applied the same way to the query and the text, so "dates" meets "date".
		.map((word) => (word.endsWith('ies') ? `${word.slice(0, -3)}y` : word.endsWith('s') && !word.endsWith('ss') ? word.slice(0, -1) : word));
}

/**
 * Ranks the components for a need written in plain words, such as "pick a date" or "show a figure".
 * The tag and the summary weigh most, then the slots, props, and events.
 */
export function find(query, limit = 5) {
	const wanted = words(query);
	if (!wanted.length) return [];
	const scored = knowledge.components.map((c) => {
		const fields = [
			[`${c.id} ${c.title}`, 5],
			[c.summary, 3],
			[c.slots.map((slot) => `${slot.name} ${slot.description}`).join(' '), 1],
			[c.props.map((prop) => `${prop.name} ${prop.description}`).join(' '), 1],
			[c.events.map((event) => `${event.name} ${event.description}`).join(' '), 1]
		];
		let score = 0;
		for (const [text, weight] of fields) {
			const have = new Set(words(text));
			for (const word of wanted) {
				if (have.has(word)) score += weight;
				else if ([...have].some((term) => term.startsWith(word) || word.startsWith(term))) score += weight / 3;
			}
		}
		return { component: c, score };
	});
	return scored
		.filter((entry) => entry.score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, limit)
		.map((entry) => entry.component);
}
