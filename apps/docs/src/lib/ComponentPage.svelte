<script lang="ts">
	import type { Snippet } from 'svelte';
	import { contract, packageFor, sourcePath, tokenInfo } from './contracts';
	import { componentGroups } from './sections';
	import { repoUrl, storybookUrl } from './site';
	import CodeBlock from './CodeBlock.svelte';
	import Glyph from './Glyph.svelte';
	import Stage from './Stage.svelte';

	let {
		id,
		hero,
		heroCode,
		heroAlign = 'center',
		heroMinHeight = 0,
		usage = { do: [], dont: [] },
		children
	}: {
		id: string;
		hero: Snippet;
		heroCode: string;
		heroAlign?: 'center' | 'start' | 'stretch';
		heroMinHeight?: number;
		usage?: { do: string[]; dont: string[] };
		children?: Snippet;
	} = $props();

	const c = $derived(contract(id));
	const group = $derived(componentGroups.find((g) => g.items.some((item) => item.href === `/components/${id}`)));
	const title = $derived(group?.items.find((item) => item.href === `/components/${id}`)?.label ?? id);
	const pkg = $derived(packageFor(id));
	const tokenRows = $derived(c.tokens.map(tokenInfo));
	const colorRows = $derived(tokenRows.filter((row) => row.type === 'color'));
	const otherRows = $derived(tokenRows.filter((row) => row.type !== 'color'));
	const parts = $derived(c.anatomy.filter((part) => part.part));
	const importLine = $derived(
		pkg === '@ambre-ds/commerce' ? `import '@ambre-ds/commerce';` : `import '${pkg}/${id}';`
	);
</script>

<svelte:head>
	<title>{title} — Ambre</title>
	<meta name="description" content={c.summary} />
</svelte:head>

<header class="doc-header">
	<p class="eyebrow">
		<a href="/components">Components</a>
		{#if group}<span aria-hidden="true">/</span> {group.title}{/if}
	</p>
	<h1>{title}</h1>
	<p class="lede">{c.summary}</p>
	<ul class="meta" aria-label="Details">
		<li><code class="chip chip-code">&lt;{c.tag}&gt;</code></li>
		<li><span class="chip chip-status" data-status={c.status}>{c.status === 'stable' ? 'Stable' : c.status}</span></li>
		<li><span class="chip">{pkg}</span></li>
		<li>
			<a class="meta-link" href={`${repoUrl}/blob/main/${sourcePath(c)}`} target="_blank" rel="external noreferrer">
				<Glyph name="github" size={16} /> Source
			</a>
		</li>
		<li>
			<a class="meta-link" href={`${repoUrl}/blob/main/contracts/${c.id}.yaml`} target="_blank" rel="external noreferrer">
				<Glyph name="layers" size={16} /> Contract
			</a>
		</li>
		<li>
			<a class="meta-link" href={storybookUrl} target="_blank" rel="external noreferrer">
				<Glyph name="external" size={16} /> Storybook
			</a>
		</li>
	</ul>
</header>

<Stage label="Preview" code={heroCode} align={heroAlign} minHeight={heroMinHeight}>
	{@render hero()}
</Stage>

<CodeBlock title="Import" lang="js" code={importLine} />

{#if children}
	{@render children()}
{/if}

{#if usage.do.length || usage.dont.length}
	<h2 id="usage">Usage</h2>
	<div class="guidance">
		<section class="guidance-card" data-kind="do">
			<h3><Glyph name="check" size={18} /> Do</h3>
			<ul>
				{#each usage.do as line}<li>{@html line}</li>{/each}
			</ul>
		</section>
		<section class="guidance-card" data-kind="dont">
			<h3><Glyph name="close" size={18} /> Don't</h3>
			<ul>
				{#each usage.dont as line}<li>{@html line}</li>{/each}
			</ul>
		</section>
	</div>
{/if}

<h2 id="api">API</h2>
<p class="section-lede">Generated from <code>contracts/{c.id}.yaml</code>. The contract is the API; the element, its stories, and this page implement it.</p>

{#if c.props.length}
	<h3>Attributes and properties</h3>
	<div class="table-wrap">
		<table class="api">
			<thead>
				<tr><th scope="col">Name</th><th scope="col">Type</th><th scope="col">Default</th><th scope="col">Description</th></tr>
			</thead>
			<tbody>
				{#each c.props as prop}
					<tr>
						<th scope="row">
							<code>{prop.attribute ?? prop.name}</code>
							{#if !prop.attribute}<span class="note">property</span>{/if}
						</th>
						<td>
							{#if prop.values}
								<span class="values">{#each prop.values as value}<code>{value}</code>{/each}</span>
							{:else}
								<code>{prop.type}</code>
							{/if}
						</td>
						<td>{#if prop.default !== undefined && prop.default !== ''}<code>{String(prop.default)}</code>{:else}<span class="muted">—</span>{/if}</td>
						<td>{prop.description}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

{#if c.slots.length}
	<h3>Slots</h3>
	<div class="table-wrap">
		<table class="api">
			<thead><tr><th scope="col">Name</th><th scope="col">Description</th></tr></thead>
			<tbody>
				{#each c.slots as slot}
					<tr><th scope="row"><code>{slot.name === 'default' ? '(default)' : slot.name}</code></th><td>{slot.description}</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

{#if c.events.length}
	<h3>Events</h3>
	<div class="table-wrap">
		<table class="api">
			<thead><tr><th scope="col">Name</th><th scope="col">Description</th></tr></thead>
			<tbody>
				{#each c.events as event}
					<tr><th scope="row"><code>{event.name}</code></th><td>{event.description}</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

{#if parts.length}
	<h3>CSS parts</h3>
	<div class="table-wrap">
		<table class="api">
			<thead><tr><th scope="col">Part</th><th scope="col">Element</th></tr></thead>
			<tbody>
				{#each parts as part}
					<tr><th scope="row"><code>::part({part.part})</code></th><td><code>{part.element ?? part.id}</code></td></tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<h2 id="accessibility">Accessibility</h2>
<dl class="a11y">
	<div><dt>Role</dt><dd><code>{c.a11y.role}</code></dd></div>
	<div><dt>Accessible name</dt><dd>{c.a11y.name}</dd></div>
</dl>
{#if c.a11y.keyboard.length}
	<h3>Keyboard</h3>
	<ul class="keys">
		{#each c.a11y.keyboard as line}
			<li>{line}</li>
		{/each}
	</ul>
{/if}
{#if c.a11y.notes.length}
	<h3>Notes</h3>
	<ul class="notes">
		{#each c.a11y.notes as line}
			<li>{line}</li>
		{/each}
	</ul>
{/if}

<h2 id="tokens">Design tokens</h2>
<p class="section-lede">Override these semantic variables to theme the component. Never paint it with a raw color.</p>
{#if colorRows.length}
	<div class="table-wrap">
		<table class="api tokens">
			<thead><tr><th scope="col">Color</th><th scope="col">Light</th><th scope="col">Dark</th></tr></thead>
			<tbody>
				{#each colorRows as row}
					<tr>
						<th scope="row"><code>{row.css}</code></th>
						<td><span class="swatch" data-theme="light" style:--swatch={`var(${row.css})`}></span><code>{row.light}</code></td>
						<td><span class="swatch" data-theme="dark" style:--swatch={`var(${row.css})`}></span><code>{row.dark}</code></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
{#if otherRows.length}
	<div class="table-wrap">
		<table class="api tokens">
			<thead><tr><th scope="col">Token</th><th scope="col">Value</th></tr></thead>
			<tbody>
				{#each otherRows as row}
					<tr><th scope="row"><code>{row.css}</code></th><td><code>{row.light}</code></td></tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
