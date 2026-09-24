<script lang="ts">
	import data from '@ambre-ds/tokens/json';
	import Stage from '$lib/Stage.svelte';
	import { brands } from '$lib/brands';
	import { preview } from '$lib/preview.svelte';
	import { byPrefix, tokens, type TokenRecord } from '$lib/tokens';

	type Entry = { path: string; value: string | number };
	const presets = (data as unknown as { presets?: Record<string, { light: Entry[] }> }).presets ?? {};

	/** The value a token has in the preview brand, falling back to Ambre's. */
	function valueOf(token: TokenRecord, brand: string) {
		return presets[brand]?.light.find((entry) => entry.path === token.path)?.value ?? token.value;
	}

	const brandName = $derived(brands.find((brand) => brand.id === preview.brand)?.name ?? 'Ambre');
	const name = (token: TokenRecord) => token.path.split('.').at(-1) ?? token.path;
	const numeric = (a: TokenRecord, b: TokenRecord) => Number(name(a)) - Number(name(b));

	const space = [...byPrefix(tokens.system, 'space.')].sort(numeric);
	const radiusOrder = ['none', 'sm', 'md', 'action', 'lg', 'full'];
	const radius = [...byPrefix(tokens.system, 'radius.')].sort(
		(a, b) => radiusOrder.indexOf(name(a)) - radiusOrder.indexOf(name(b))
	);
	const sizeOrder = ['sm', 'md', 'lg'];
	const control = [...byPrefix(tokens.system, 'size.control.')].sort(
		(a, b) => sizeOrder.indexOf(name(a)) - sizeOrder.indexOf(name(b))
	);
	const borders = byPrefix(tokens.system, 'border.width.');
	const elevation = byPrefix(tokens.system, 'elevation.');

	const elevationNotes: Record<string, string> = {
		'1': 'Raised controls and cards.',
		'2': 'Menus, popovers, and tooltips.',
		'3': 'Dialogs.',
		inset: 'Wells: fields, tracks, and tab lists.'
	};

	const controlLabels: Record<string, string> = { sm: 'Small', md: 'Medium', lg: 'Large' };

	const spaceCode = space
		.map((token) => `<div style="width: var(${token.css}); height: var(--amb-space-500)"></div>`)
		.join('\n');

	const radiusCode = radius
		.map((token) => `<div style="border-radius: var(${token.css})"></div>`)
		.join('\n');

	const controlCode = `<amb-button size="sm">Small</amb-button>
<amb-button size="md">Medium</amb-button>
<amb-button size="lg">Large</amb-button>`;

	const borderCode = borders
		.map(
			(token) =>
				`<div style="border: var(${token.css}) solid var(--amb-color-border-default)"></div>`
		)
		.join('\n');

	const elevationCode = elevation
		.map(
			(token) =>
				`<div style="background: var(--amb-color-bg-surface); box-shadow: var(${token.css})"></div>`
		)
		.join('\n');
</script>

<svelte:head>
	<title>Space and shape — Ambre</title>
	<meta
		name="description"
		content="Ambre space scale, corner radii, control heights, border widths, and elevation."
	/>
</svelte:head>

<header class="doc-header">
	<p class="eyebrow"><a href="/foundations">Foundations</a></p>
	<h1>Space and shape</h1>
	<p class="lede">
		A 4px rhythm, six corners, three control heights, two strokes, and four shadows. A brand changes the numbers;
		the examples on this page follow the preview brand.
	</p>
</header>

<h2 id="space">Space</h2>
<p class="section-lede">
	Ten steps. Ambre’s base is 4px; a dense brand such as Atlas tightens the middle. Use small steps inside a control, middle steps between related items, and the top of
	the scale between sections. Values are {brandName}’s.
</p>
<Stage label="Space scale" align="stretch" padding="md" code={spaceCode}>
	<ol class="space-list">
		{#each space as token}
			<li class="space-row">
				<code class="token-name">{name(token)}</code>
				<span class="space-track">
					<span class="space-bar" style:width="var({token.css})"></span>
				</span>
				<span class="token-value">{valueOf(token, preview.brand)}</span>
			</li>
		{/each}
	</ol>
</Stage>

<h2 id="radius">Radius</h2>
<p class="section-lede">
	Corners get larger as surfaces get larger. <code>radius.action</code> is the button corner: it matches
	<code>md</code> until a brand sets its own, such as a pill action beside a square field.
</p>
<Stage label="Radius" padding="md" code={radiusCode}>
	<ul class="tile-list">
		{#each radius as token}
			<li class="tile-item">
				<span class="radius-tile" style:border-radius="var({token.css})"></span>
				<code class="token-name">{name(token)}</code>
				<span class="token-value">{valueOf(token, preview.brand)}</span>
			</li>
		{/each}
	</ul>
</Stage>

<h2 id="controls">Control heights</h2>
<p class="section-lede">
	Buttons, fields, and selects share one height per size, so they line up in a row. Ambre’s smallest control is
	32px, above the 24px target minimum in WCAG 2.2.
</p>
<Stage label="Control heights" padding="md" code={controlCode}>
	<ul class="control-list">
		{#each control as token}
			<li class="control-item">
				<span class="control-bar" style:height="var({token.css})" aria-hidden="true"></span>
				<amb-button size={name(token) as 'sm' | 'md' | 'lg'}>{controlLabels[name(token)] ?? name(token)}</amb-button>
				<span class="control-meta">
					<code class="token-name">{name(token)}</code>
					<span class="token-value">{valueOf(token, preview.brand)}</span>
				</span>
			</li>
		{/each}
	</ul>
</Stage>

<h2 id="borders">Border width</h2>
<p class="section-lede">
	The default stroke draws field and card edges. The strong stroke marks selection and emphasis. An accessibility
	first brand can set both to 2px.
</p>
<Stage label="Border width" padding="md" code={borderCode}>
	<ul class="tile-list">
		{#each borders as token}
			<li class="tile-item">
				<span class="border-tile" style:border-width="var({token.css})"></span>
				<code class="token-name">{name(token)}</code>
				<span class="token-value">{valueOf(token, preview.brand)}</span>
			</li>
		{/each}
	</ul>
</Stage>

<h2 id="elevation">Elevation</h2>
<p class="section-lede">
	Shadows separate layers. Each has a light and a dark value, and the dark ones are denser so a layer still reads
	on a dark canvas. Switch the example theme to compare.
</p>
<Stage label="Elevation" padding="lg" code={elevationCode}>
	<ul class="tile-list elevation-list">
		{#each elevation as token}
			<li class="tile-item">
				<span class="elevation-tile" style:box-shadow="var({token.css})"></span>
				<code class="token-name">elevation.{name(token)}</code>
				<span class="token-value">{elevationNotes[name(token)] ?? token.description}</span>
			</li>
		{/each}
	</ul>
</Stage>

<h2 id="guidance">Guidance</h2>
<div class="guidance">
	<section class="guidance-card" data-kind="do">
		<h3>Do</h3>
		<ul>
			<li>Space with <code>--amb-space-*</code>. Put more space between groups than inside them.</li>
			<li>Match the control size across a row: a small field beside a small button.</li>
			<li>Pair a raised layer with a border. A shadow alone disappears in forced colors.</li>
		</ul>
	</section>
	<section class="guidance-card" data-kind="dont">
		<h3>Don’t</h3>
		<ul>
			<li>Don’t use a raw pixel value for padding or gap. It will not follow a brand.</li>
			<li>Don’t shrink a control below <code>size.control.sm</code> to fit a dense table.</li>
			<li>Don’t stack <code>elevation.3</code> inside another layer. It is for dialogs.</li>
		</ul>
	</section>
</div>

<style>
	.token-name {
		color: var(--amb-color-fg-default);
		font-family: var(--amb-font-family-mono);
		font-size: var(--amb-font-size-200);
	}

	.token-value {
		color: var(--amb-color-fg-subtle);
		font-size: var(--amb-font-size-200);
	}

	.space-list,
	.tile-list,
	.control-list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.space-list {
		display: grid;
		gap: var(--amb-space-200);
	}

	.space-row {
		display: grid;
		grid-template-columns: 3.5rem minmax(0, 1fr) 3.5rem;
		align-items: center;
		gap: var(--amb-space-400);
	}

	.space-row .token-value {
		text-align: right;
	}

	.space-track {
		display: block;
		height: var(--amb-space-500);
		border-radius: var(--amb-radius-sm);
		background: var(--amb-color-bg-subtle);
		box-shadow: var(--amb-elevation-inset);
	}

	.space-bar {
		display: block;
		max-width: 100%;
		height: 100%;
		border-radius: var(--amb-radius-sm);
		background: var(--amb-color-accent-bg);
	}

	.tile-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--amb-space-500);
	}

	.tile-item {
		display: grid;
		justify-items: center;
		gap: var(--amb-space-100);
		min-width: 6rem;
		text-align: center;
	}

	.tile-item .token-name {
		margin-top: var(--amb-space-200);
	}

	.radius-tile,
	.border-tile,
	.elevation-tile {
		display: block;
		width: 5.5rem;
		height: 5.5rem;
		background: var(--amb-color-bg-surface);
	}

	.radius-tile {
		border: var(--amb-border-width-strong) solid var(--amb-color-accent-bg);
		background: color-mix(in oklab, var(--amb-color-accent-bg) 12%, var(--amb-color-bg-surface));
	}

	.border-tile {
		border-style: solid;
		border-color: var(--amb-color-border-default);
		border-radius: var(--amb-radius-md);
	}

	.elevation-list {
		gap: var(--amb-space-600);
	}

	.elevation-list .tile-item {
		max-width: 9rem;
	}

	.elevation-tile {
		width: 7.5rem;
		border-radius: var(--amb-radius-lg);
	}

	.control-list {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: center;
		gap: var(--amb-space-600);
	}

	.control-item {
		display: grid;
		grid-template-columns: auto auto;
		grid-template-rows: auto auto;
		align-items: end;
		column-gap: var(--amb-space-300);
		row-gap: var(--amb-space-200);
	}

	.control-bar {
		width: var(--amb-space-200);
		border-radius: var(--amb-radius-sm);
		background: var(--amb-color-accent-bg);
	}

	.control-meta {
		display: inline-flex;
		grid-column: 1 / -1;
		gap: var(--amb-space-200);
		align-items: baseline;
	}

	@media (forced-colors: active) {
		.elevation-tile,
		.space-track {
			border: 1px solid CanvasText;
		}
	}
</style>
