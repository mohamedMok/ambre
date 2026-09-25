import { error } from '@sveltejs/kit';
import { example, knowledge } from '@ambre-ds/mcp';

export const prerender = true;

export function entries() {
	return knowledge.examples.map((e) => ({ id: e.id }));
}

/**
 * The preview is the example without its script, with the links and images made local:
 * the example links to pages of an imaginary product, and the site prerenders every link it finds.
 */
export function load({ params }) {
	const e = example(params.id);
	if (!e) error(404, `No example ${params.id}`);
	const script = e.html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1] ?? '';
	const preview = e.html
		.replace(/<script[\s\S]*?<\/script>/g, '')
		.replace(/\shref="\/[^"]*"/g, ` href="#preview"`)
		.replace(/\saction="\/[^"]*"/g, '')
		.replace(
			/\ssrc="\/[^"]*"/g,
			` src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='%23d9cbb6'/%3E%3C/svg%3E"`
		)
		.trim();
	return { example: e, preview, script };
}
