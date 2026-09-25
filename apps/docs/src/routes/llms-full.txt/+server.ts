import { knowledge, llmsFull } from '@ambre-ds/mcp';

export const prerender = true;

/** The guidelines, every component, and every example, in one file. */
export function GET() {
	return new Response(llmsFull(knowledge), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
