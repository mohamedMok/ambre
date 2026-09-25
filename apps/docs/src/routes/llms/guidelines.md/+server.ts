import { knowledge } from '@ambre-ds/mcp';

export const prerender = true;

export function GET() {
	return new Response(knowledge.guidelines, { headers: { 'content-type': 'text/markdown; charset=utf-8' } });
}
