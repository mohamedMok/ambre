<script lang="ts">
	import CodeBlock from '$lib/CodeBlock.svelte';
	import { siteUrl } from '$lib/site';

	let { data } = $props();

	const claudeCode = `claude mcp add ambre -- npx -y @ambre-ds/mcp`;

	const jsonConfig = `{
  "mcpServers": {
    "ambre": {
      "command": "npx",
      "args": ["-y", "@ambre-ds/mcp"]
    }
  }
}`;

	const vscodeConfig = `{
  "servers": {
    "ambre": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@ambre-ds/mcp"]
    }
  }
}`;

	const skillInstall = `mkdir -p .claude/skills/ambre
curl -o .claude/skills/ambre/SKILL.md ${siteUrl}/skills/ambre/SKILL.md`;

	const rules = `## Ambre

This project uses the Ambre design system (amb-* web components).

- Read ${siteUrl}/llms/guidelines.md before writing Ambre markup.
- Before using an element, read its reference at ${siteUrl}/llms/components/<id>.md.
  Never guess an attribute, a slot, or an event.
- The visible label is the slotted text. Boolean attributes are true when present.
- Events bubble with their data in event.detail. Listen with addEventListener.
- Start screens from ${siteUrl}/llms.txt#examples.
- If the Ambre MCP server is connected, call validate_markup before you finish.`;


	const tools = [
		['get_guidelines', 'Install, load order, markup rules, events, theming, and how to choose a component.'],
		['list_components', 'Every element, with its package and a one-line summary.'],
		['get_component', 'The full reference of one element: attributes, slots, events with their detail, parts, keyboard, and minimal markup.'],
		['find_components', 'The right element for a need in plain words, such as “pick a date” or “a step the agent took”.'],
		['list_examples', 'Complete screens, optionally only those that use a given element.'],
		['get_example', 'The full source of one screen, to adapt rather than start from nothing.'],
		['validate_markup', 'Checks HTML or JSX against the contracts and returns each problem with its line and a fix.']
	];
</script>

<svelte:head>
	<title>Use with AI — Ambre</title>
	<meta
		name="description"
		content="Make Claude, Cursor, Copilot, and other AI tools write correct Ambre code: llms.txt, an MCP server with a markup validator, a usage skill, and complete examples."
	/>
</svelte:head>

<header class="doc-header">
	<p class="eyebrow">Get started</p>
	<h1>Use with AI</h1>
	<p class="lede">
		AI tools write correct Ambre code when they read the real API instead of guessing it. Everything here is generated
		from the component contracts, which CI keeps in step with the code, so it cannot go out of date.
	</p>
</header>

<h2 id="mcp">MCP server</h2>
<p>
	The <code>@ambre-ds/mcp</code> server gives an agent the exact API of every element, finds the right one for a need,
	serves complete examples, and checks the markup it wrote. It runs locally and reads no files of yours.
</p>

<h3>Claude Code</h3>
<CodeBlock code={claudeCode} lang="bash" title="Terminal" />

<h3>Cursor, Claude Desktop, Windsurf</h3>
<p>Add the server to <code>.cursor/mcp.json</code>, <code>claude_desktop_config.json</code>, or your tool's MCP settings.</p>
<CodeBlock code={jsonConfig} lang="js" title="mcp.json" />

<h3>VS Code</h3>
<CodeBlock code={vscodeConfig} lang="js" title=".vscode/mcp.json" />

<h3>Tools</h3>
<div class="table-wrap">
	<table class="api">
		<thead><tr><th scope="col">Tool</th><th scope="col">What it returns</th></tr></thead>
		<tbody>
			{#each tools as [name, description]}
				<tr><th scope="row"><code>{name}</code></th><td>{description}</td></tr>
			{/each}
		</tbody>
	</table>
</div>

<h3 id="validate">The validator</h3>
<p>
	<code>validate_markup</code> catches what models get wrong most often: an attribute or a slot that does not exist, a
	value outside an enum, <code>checked="false"</code>, a control with no label, a slot on a grandchild, and an inline
	handler for a custom event. Given this:
</p>
<CodeBlock code={data.invalid} lang="html" title="Generated markup" />
<p>it answers:</p>
<CodeBlock code={data.verdict} lang="bash" title="validate_markup" />
<p>
	Every example on this site passes it in CI. It is also a library:
	<code>import &#123; validate &#125; from '@ambre-ds/mcp'</code>, for a lint step or a code review bot.
</p>

<h2 id="llms-txt">llms.txt</h2>
<p>
	For tools that read the web rather than call a server, the reference is plain Markdown, following the
	<a href="https://llmstxt.org" rel="external">llms.txt</a> convention.
</p>
<ul>
	<li><a href="/llms.txt"><code>/llms.txt</code></a>: the index, with a link to every component and example.</li>
	<li><a href="/llms-full.txt"><code>/llms-full.txt</code></a>: the guidelines, every component, and every example in one file, for a context window.</li>
	<li><a href="/llms/guidelines.md"><code>/llms/guidelines.md</code></a>: the rules for writing Ambre markup.</li>
	<li><a href="/llms/components/date-picker.md"><code>/llms/components/&lt;id&gt;.md</code></a>: one element's reference.</li>
</ul>

<h2 id="skill">Skill</h2>
<p>
	A <a href="/skills/ambre/SKILL.md">SKILL.md</a> teaches an agent the rules and the component index once, so it reads the
	reference only when it needs it. Save it in your project for Claude Code:
</p>
<CodeBlock code={skillInstall} lang="bash" title="Terminal" />
<p>The same file ships in the npm package, at <code>@ambre-ds/mcp/skill</code>.</p>

<h2 id="rules">Project rules</h2>
<p>
	Any agent reads a rules file: <code>AGENTS.md</code>, <code>CLAUDE.md</code>, <code>.cursor/rules</code>, or
	<code>.github/copilot-instructions.md</code>. Paste this section into yours:
</p>
<CodeBlock code={rules} lang="bash" title="AGENTS.md" />

<h2 id="examples">Examples</h2>
<p>
	Models learn composition from complete screens better than from API tables. The <a href="/examples">examples</a> cover
	sign in, checkout, settings, a dashboard, pricing, booking, search, onboarding, an article, and an AI assistant. Each
	one is served to agents by <code>get_example</code> and at <code>/llms/examples/&lt;id&gt;.md</code>.
</p>
