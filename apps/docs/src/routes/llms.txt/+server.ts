import { knowledge, llmsIndex } from '@ambre-ds/mcp';

export const prerender = true;

/** The index for language models, as described at llmstxt.org. */
export function GET() {
	return new Response(llmsIndex(knowledge), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
