<script lang="ts">
	import { onMount } from 'svelte';
	import CodeBlock from '$lib/CodeBlock.svelte';
	import Stage from '$lib/Stage.svelte';

	let { data } = $props();
	let status = $state('');

	// The example's own script runs against the preview, so its events and interactions work.
	onMount(() => {
		if (!data.script) return;
		const script = document.createElement('script');
		script.type = 'module';
		script.textContent = data.script;
		document.body.append(script);
		return () => script.remove();
	});

	// A form in an example posts to an imaginary server. Here it reports what it would send.
	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!(event.target instanceof HTMLFormElement)) return;
		const entries = [...new FormData(event.target).entries()].map(([key, value]) => `${key}=${value}`);
		status = entries.length ? `The form would send ${entries.join(', ')}.` : 'The form would send no values.';
	}
</script>

<svelte:head>
	<title>{data.example.title} example — Ambre</title>
	<meta name="description" content={data.example.summary} />
</svelte:head>

<header class="doc-header">
	<p class="eyebrow"><a href="/examples">Examples</a></p>
	<h1>{data.example.title}</h1>
	<p class="lede">{data.example.summary}</p>
	<ul class="meta" aria-label="Details">
		{#each data.example.components as tag}
			<li><a class="chip chip-code" href={`/components/${tag.replace(/^amb-/, '')}`}>&lt;{tag}&gt;</a></li>
		{/each}
	</ul>
</header>

<Stage label="Preview" align="stretch" padding="md">
	<!-- The markup is the repository's own example file, checked against the contracts in CI. -->
	<div class="preview" id="preview" onsubmit={onSubmit}>
		{@html data.preview}
	</div>
</Stage>
{#if status}<p class="status" aria-live="polite">{status}</p>{/if}

<h2 id="code">Code</h2>
<CodeBlock title={`examples/${data.example.id}.html`} lang="html" code={data.example.html} />

<p>
	For an AI tool, the same example is at <a href={`/llms/examples/${data.example.id}.md`}>/llms/examples/{data.example.id}.md</a>,
	and through the <code>get_example</code> tool of the <a href="/get-started/ai">MCP server</a>.
</p>

<style>
	.preview {
		width: 100%;
		color: var(--amb-color-fg-default);
		font-family: var(--amb-font-family-sans);
	}

	/* A page frame inside a page: keep it a readable height. */
	.preview :global(amb-layout) {
		min-height: 32rem;
		border-radius: var(--amb-radius-lg);
		overflow: hidden;
	}

	.status {
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
	}

	.meta a {
		text-decoration: none;
	}
</style>
