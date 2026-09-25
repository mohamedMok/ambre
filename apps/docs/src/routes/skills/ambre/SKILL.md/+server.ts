import { knowledge, skill } from '@ambre-ds/mcp';

export const prerender = true;

/** The usage skill, for agents such as Claude Code: save it as .claude/skills/ambre/SKILL.md. */
export function GET() {
	return new Response(skill(knowledge), { headers: { 'content-type': 'text/markdown; charset=utf-8' } });
}
