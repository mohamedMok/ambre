import { error } from '@sveltejs/kit';
import { example, exampleMarkdown, knowledge } from '@ambre-ds/mcp';

export const prerender = true;

export function entries() {
	return knowledge.examples.map((e) => ({ id: e.id }));
}

export function GET({ params }) {
	const e = example(params.id);
	if (!e) error(404, `No example ${params.id}`);
	return new Response(exampleMarkdown(e, knowledge), { headers: { 'content-type': 'text/markdown; charset=utf-8' } });
}
