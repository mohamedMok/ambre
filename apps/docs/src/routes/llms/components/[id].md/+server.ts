import { error } from '@sveltejs/kit';
import { component, componentMarkdown, knowledge } from '@ambre-ds/mcp';

export const prerender = true;

export function entries() {
	return knowledge.components.map((c) => ({ id: c.id }));
}

/** One component's reference in Markdown, generated from its contract. */
export function GET({ params }) {
	const c = component(params.id);
	if (!c) error(404, `No component ${params.id}`);
	return new Response(componentMarkdown(c, knowledge), { headers: { 'content-type': 'text/markdown; charset=utf-8' } });
}
