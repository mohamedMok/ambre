<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Examples — Ambre</title>
	<meta
		name="description"
		content="Complete screens built with Ambre: sign in, checkout, settings, a dashboard, pricing, booking, and an AI assistant. Copy one and adapt it."
	/>
</svelte:head>

<header class="doc-header">
	<p class="eyebrow">Examples</p>
	<h1>Examples</h1>
	<p class="lede">
		Complete screens, each one valid against the component contracts. Copy the closest one and adapt it. The same
		examples are served to AI tools through <a href="/get-started/ai">llms.txt and the MCP server</a>.
	</p>
</header>

<ul class="examples">
	{#each data.examples as example}
		<li class="example">
			<h2><a href={`/examples/${example.id}`}>{example.title}</a></h2>
			<p>{example.summary}</p>
			<ul class="tags" aria-label="Elements">
				{#each example.components.slice(0, 6) as tag}
					<li><code>&lt;{tag}&gt;</code></li>
				{/each}
				{#if example.components.length > 6}<li class="more">+{example.components.length - 6}</li>{/if}
			</ul>
		</li>
	{/each}
</ul>

<style>
	.examples {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		gap: var(--amb-space-400);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.example {
		position: relative;
		display: grid;
		align-content: start;
		gap: var(--amb-space-200);
		padding: var(--amb-space-500);
		border: 1px solid var(--rule-strong);
		border-radius: 14px;
		background: var(--amb-color-bg-surface);
		transition:
			border-color var(--amb-duration-fast) var(--amb-easing-standard),
			box-shadow var(--amb-duration-fast) var(--amb-easing-standard);
	}

	.example:hover {
		border-color: var(--amb-color-border-default);
		box-shadow: var(--amb-elevation-2);
	}

	.example:has(a:focus-visible) {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
	}

	.example h2 {
		margin: 0;
		font-size: 18px;
	}

	.example a {
		color: var(--amb-color-fg-default);
		text-decoration: none;
	}

	.example a:focus-visible {
		outline: none;
	}

	/* The whole card is the target. */
	.example a::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	.example p {
		margin: 0;
		color: var(--amb-color-fg-muted);
		font-size: 14px;
		line-height: 1.5;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin: var(--amb-space-200) 0 0;
		padding: 0;
		list-style: none;
	}

	.tags code,
	.more {
		color: var(--amb-color-fg-subtle);
		font-size: 12px;
	}
</style>
