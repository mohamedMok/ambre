import { knowledge } from '@ambre-ds/mcp';

export const prerender = true;

export function load() {
	return {
		examples: knowledge.examples.map(({ id, title, summary, topics, components }) => ({ id, title, summary, topics, components }))
	};
}
