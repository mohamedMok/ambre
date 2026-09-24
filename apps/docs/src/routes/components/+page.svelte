<script lang="ts">
	import { onMount } from 'svelte';
	import { scope } from '$lib/brands';
	import { preview } from '$lib/preview.svelte';
	import { componentGroups, components } from '$lib/sections';

	let theme = $state<string | null>(null);
	const attrs = $derived(scope(preview.brand, theme));

	onMount(() => {
		const root = document.documentElement;
		const read = () => (theme = root.dataset.theme === 'dark' ? 'dark' : 'light');
		read();
		const observer = new MutationObserver(read);
		observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
		return () => observer.disconnect();
	});

	const idOf = (href: string) => href.split('/').pop() ?? '';
</script>

<svelte:head>
	<title>Components — Ambre</title>
	<meta
		name="description"
		content="Every Ambre component: basics, forms, feedback, navigation, and commerce compositions, each with a live preview."
	/>
</svelte:head>

{#snippet sample(id: string)}
	{#if id === 'button'}
		<amb-button size="sm">Save</amb-button>
		<amb-button size="sm" variant="secondary">Cancel</amb-button>
	{:else if id === 'link'}
		<amb-link href="/get-started">Read the install guide</amb-link>
	{:else if id === 'disclosure'}
		<div class="fill">
			<amb-disclosure>
				Shipping details
				<p slot="panel">Arrives in two days.</p>
			</amb-disclosure>
		</div>
	{:else if id === 'icon'}
		<amb-icon name="favorite" label="Favorite"></amb-icon>
		<amb-icon name="search" label="Search"></amb-icon>
		<amb-icon name="settings" size="lg" label="Settings"></amb-icon>
	{:else if id === 'text-field'}
		<div class="fill">
			<amb-text-field type="email" placeholder="ada@example.com">Email</amb-text-field>
		</div>
	{:else if id === 'text-area'}
		<div class="fill">
			<amb-text-area rows={2} placeholder="What changed?">Note</amb-text-area>
		</div>
	{:else if id === 'checkbox'}
		<amb-checkbox checked>Send product updates</amb-checkbox>
	{:else if id === 'radio'}
		<div class="stack">
			<amb-radio name="preview-plan" value="annual" checked>Annual</amb-radio>
			<amb-radio name="preview-plan" value="monthly">Monthly</amb-radio>
		</div>
	{:else if id === 'select'}
		<div class="fill">
			<amb-select>
				Country
				<option value="fr" selected>France</option>
				<option value="jp">Japan</option>
			</amb-select>
		</div>
	{:else if id === 'toggle'}
		<amb-toggle checked>Email alerts</amb-toggle>
	{:else if id === 'range'}
		<div class="fill">
			<amb-range value={40} min={0} max={100}>Volume</amb-range>
		</div>
	{:else if id === 'badge'}
		<amb-badge>Draft</amb-badge>
		<amb-badge variant="success">Saved</amb-badge>
		<amb-badge variant="danger">Failed</amb-badge>
	{:else if id === 'tag'}
		<amb-tag>Design systems</amb-tag>
		<amb-tag variant="accent">Featured</amb-tag>
	{:else if id === 'banner'}
		<div class="fill">
			<amb-banner variant="success">Changes saved.</amb-banner>
		</div>
	{:else if id === 'progress'}
		<div class="fill">
			<amb-progress value={64} max={100} label="Upload"></amb-progress>
		</div>
	{:else if id === 'spinner'}
		<amb-spinner label="Loading articles"></amb-spinner>
	{:else if id === 'skeleton'}
		<div class="fill stack">
			<amb-skeleton></amb-skeleton>
			<amb-skeleton></amb-skeleton>
		</div>
	{:else if id === 'tooltip'}
		<amb-tooltip text="Saves the draft on this page">
			<amb-button size="sm" variant="secondary">Save</amb-button>
		</amb-tooltip>
	{:else if id === 'breadcrumbs'}
		<amb-breadcrumbs>
			<li><a href="/">Home</a></li>
			<li><a href="/components">Components</a></li>
			<li>Breadcrumbs</li>
		</amb-breadcrumbs>
	{:else if id === 'pagination'}
		<amb-pagination label="Preview pages">
			<li><a href="/components/pagination" aria-current="page">1</a></li>
			<li><a href="/components/pagination">2</a></li>
			<li><a href="/components/pagination">Next</a></li>
		</amb-pagination>
	{:else if id === 'tabs'}
		<div class="fill">
			<amb-tabs>
				<button slot="tab" type="button">Tokens</button>
				<button slot="tab" type="button">Components</button>
				<div slot="panel">A brand is one preset.</div>
				<div slot="panel">The markup stays still.</div>
			</amb-tabs>
		</div>
	{:else if id === 'menu'}
		<amb-menu>
			Share
			<button slot="panel" type="button">Copy link</button>
			<button slot="panel" type="button">Email</button>
		</amb-menu>
	{:else if id === 'dialog'}
		<!-- A modal cannot open inside a card. This is a static picture of the dialog surface. -->
		<div class="dialog-sample">
			<p class="dialog-title">Save the draft?</p>
			<div class="row">
				<amb-button size="sm" variant="secondary">Cancel</amb-button>
				<amb-button size="sm">Save</amb-button>
			</div>
		</div>
	{:else if id === 'quantity'}
		<amb-quantity value={2} min={1} max={8}>Linen sheet</amb-quantity>
	{/if}
{/snippet}

<header class="doc-header">
	<p class="eyebrow">Components</p>
	<h1>Components</h1>
	<p class="lede">
		{components.length} elements in five groups. Each one is a web component with a contract, a Storybook story, and
		tokens that follow the brand. The previews render in the brand chosen in any example.
	</p>
</header>

{#each componentGroups as group}
	<h2 id={group.title.toLowerCase()}>{group.title}</h2>
	<p class="section-lede">{group.summary}</p>
	<ul class="card-grid">
		{#each group.items as item}
			<li class="component-card">
				<div class="preview" inert aria-hidden="true" {...attrs}>
					{@render sample(idOf(item.href))}
				</div>
				<div class="card-body">
					<h3><a href={item.href}>{item.label}</a></h3>
					<p>{item.summary}</p>
				</div>
			</li>
		{/each}
	</ul>
{/each}

<style>
	.component-card {
		position: relative;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border: 1px solid var(--rule-strong);
		border-radius: 14px;
		background: var(--amb-color-bg-surface);
		transition:
			border-color var(--amb-duration-fast) var(--amb-easing-standard),
			box-shadow var(--amb-duration-fast) var(--amb-easing-standard),
			translate var(--amb-duration-moderate) var(--amb-easing-spring);
	}

	.component-card:hover {
		border-color: var(--amb-color-border-default);
		box-shadow: var(--amb-elevation-2);
		translate: 0 -2px;
	}

	.component-card:has(a:focus-visible) {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
	}

	/* The preview is a small canvas in the preview brand. It is decorative and not interactive. */
	.preview {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: var(--amb-space-200);
		height: 140px;
		padding: var(--amb-space-400);
		overflow: hidden;
		border-bottom: 1px solid var(--rule);
		background: var(--amb-color-bg-canvas);
		color: var(--amb-color-fg-default);
		font-family: var(--amb-font-family-sans);
		font-size: var(--amb-font-size-300);
		line-height: var(--amb-font-line-height-body);
		pointer-events: none;
		user-select: none;
	}

	.preview p {
		margin: 0;
	}

	.fill {
		width: 100%;
	}

	.stack {
		display: grid;
		gap: var(--amb-space-200);
	}

	.row {
		display: flex;
		justify-content: flex-end;
		gap: var(--amb-space-200);
	}

	.dialog-sample {
		display: grid;
		gap: var(--amb-space-300);
		padding: var(--amb-space-400);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-surface);
		box-shadow: var(--amb-elevation-3);
	}

	.preview .dialog-title {
		color: var(--amb-color-fg-default);
		font-weight: var(--amb-font-weight-semibold);
	}

	.card-body {
		display: grid;
		gap: 6px;
		padding: 16px 20px 18px;
	}

	.card-body h3 {
		margin: 0;
		font-size: 16px;
	}

	.card-body a {
		color: var(--amb-color-fg-default);
		text-decoration: none;
	}

	.card-body a:focus-visible {
		outline: none;
	}

	/* The whole card is the link target. */
	.card-body a::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	.card-body p {
		margin: 0;
		color: var(--amb-color-fg-muted);
		font-size: 14px;
		line-height: 1.5;
	}
</style>
