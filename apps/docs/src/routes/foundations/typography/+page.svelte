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

	const familyNotes: Record<string, string> = {
		sans: 'Interface text: labels, body, and headings.',
		mono: 'Code, token names, and tabular figures.',
		icon: 'Material Symbols ligatures for amb-icon.'
	};
	const faceOrder = ['sans', 'mono', 'icon'];
	const allFaces = [...byPrefix(tokens.system, 'font.family')].sort(
		(a, b) => faceOrder.indexOf(a.path.split('.').at(-1) ?? '') - faceOrder.indexOf(b.path.split('.').at(-1) ?? '')
	);
	const faces = allFaces.filter((token) => token.path !== 'font.family.icon');
	const sizes = [...byPrefix(tokens.system, 'font.size.')].sort(
		(a, b) => Number(a.path.split('.').at(-1)) - Number(b.path.split('.').at(-1))
	);
	const weights = [...byPrefix(tokens.system, 'font.weight.')].sort((a, b) => Number(a.value) - Number(b.value));
	const leading = [...byPrefix(tokens.system, 'font.lineHeight.')].sort((a, b) => Number(a.value) - Number(b.value));

	const samples: Record<string, string> = {
		'100': 'Updated two minutes ago',
		'200': 'Filter by status',
		'300': 'Your order ships in two days.',
		'400': 'Choose a delivery window',
		'500': 'Payment details',
		'600': 'Account settings',
		'700': 'Order summary',
		'800': 'Spring collection',
		'900': 'Made to last'
	};

	const sample = (token: TokenRecord) => samples[token.path.split('.').at(-1) ?? ''] ?? 'The quick brown fox';

	const facesCode = faces
		.map((token) => `<p style="font-family: var(${token.css})">Ambre sets type in two families.</p>`)
		.join('\n');

	const scaleCode = [...sizes]
		.reverse()
		.map(
			(token) =>
				`<p style="font-size: var(${token.css}); line-height: var(--amb-font-line-height-tight)">${sample(token)}</p>`
		)
		.join('\n');

	const weightCode = weights
		.map((token) => `<p style="font-weight: var(${token.css})">Review and pay</p>`)
		.join('\n');

	const paragraph =
		'Returns are free for thirty days. Pack the item in its original box, print the label from your order page, and drop it at any post office.';

	const leadingCode = leading
		.map((token) => `<p style="line-height: var(${token.css})">${paragraph}</p>`)
		.join('\n');
</script>

<svelte:head>
	<title>Typography — Ambre</title>
	<meta
		name="description"
		content="Ambre type families, the size scale, weights, and line heights. A brand preset replaces the face and the numbers."
	/>
</svelte:head>

<header class="doc-header">
	<p class="eyebrow"><a href="/foundations">Foundations</a></p>
	<h1>Typography</h1>
	<p class="lede">
		One sans face, one mono face, nine sizes, three weights, and three line heights. A brand preset replaces the
		stack and the numbers. The token names stay the same.
	</p>
</header>

<h2 id="families">Families</h2>
<p class="section-lede">
	Ambre sets text in Source Sans 3 and code in Source Code Pro, both under the SIL Open Font License. The tokens
	name the stack; they do not ship font files. Load the face the brand names.
</p>
<Stage label="Font families" align="stretch" padding="md" code={facesCode}>
	<div class="faces">
		{#each faces as token}
			<div class="face">
				<p class="face-sample" style:font-family="var({token.css})">Aa Bb Cc 0123</p>
				<p class="face-meta">
					<code class="face-token">{token.css}</code>
					<span>{familyNotes[token.path.split('.').at(-1) ?? ''] ?? ''}</span>
				</p>
			</div>
		{/each}
	</div>
</Stage>
<div class="table-wrap">
	<table class="api">
		<thead>
			<tr>
				<th scope="col">Token</th>
				<th scope="col">Stack in {brandName}</th>
			</tr>
		</thead>
		<tbody>
			{#each allFaces as token}
				<tr>
					<th scope="row"><code>{token.css}</code></th>
					<td>
						<code>{valueOf(token, preview.brand)}</code>
						<span class="note">{familyNotes[token.path.split('.').at(-1) ?? ''] ?? token.description}</span>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<h2 id="scale">Type scale</h2>
<p class="section-lede">
	Nine steps from caption to display. <code>300</code> is body text and the default control size. The pixel values
	are {brandName}’s; switch the preview brand to compare.
</p>
<Stage label="Type scale" align="stretch" padding="md" code={scaleCode}>
	<ol class="scale-list">
		{#each [...sizes].reverse() as token}
			<li class="scale-row">
				<span class="scale-meta">
					<code class="face-token">{token.path.split('.').at(-1)}</code>
					<span>{valueOf(token, preview.brand)}</span>
				</span>
				<span class="scale-sample" style:font-size="var({token.css})">{sample(token)}</span>
			</li>
		{/each}
	</ol>
</Stage>
<div class="table-wrap">
	<table class="api">
		<thead>
			<tr>
				<th scope="col">Token</th>
				<th scope="col">{brandName}</th>
				<th scope="col">Use</th>
			</tr>
		</thead>
		<tbody>
			{#each sizes as token}
				<tr>
					<th scope="row"><code>{token.css}</code></th>
					<td>{valueOf(token, preview.brand)}</td>
					<td>{token.description}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<h2 id="weights">Weights</h2>
<p class="section-lede">
	Regular for reading, medium for emphasis inside a sentence, semibold for controls and headings. There is no bold
	token: headings get their weight from size and semibold.
</p>
<Stage label="Weights" align="stretch" padding="md" code={weightCode}>
	<ul class="weight-list">
		{#each weights as token}
			<li class="weight-row">
				<span class="weight-sample" style:font-weight="var({token.css})">Review and pay</span>
				<span class="scale-meta">
					<code class="face-token">{token.css}</code>
					<span>{valueOf(token, preview.brand)}</span>
				</span>
			</li>
		{/each}
	</ul>
</Stage>

<h2 id="line-height">Line height</h2>
<p class="section-lede">
	Tight for single lines in controls and headings. Body for paragraphs. Loose for long reading, such as an article.
</p>
<Stage label="Line heights" align="stretch" padding="md" code={leadingCode}>
	<div class="leading-grid">
		{#each leading as token}
			<div class="leading-item">
				<p class="scale-meta">
					<code class="face-token">{token.path.split('.').at(-1)}</code>
					<span>{valueOf(token, preview.brand)}</span>
				</p>
				<p class="leading-sample" style:line-height="var({token.css})">{paragraph}</p>
			</div>
		{/each}
	</div>
</Stage>

<h2 id="guidance">Guidance</h2>
<div class="guidance">
	<section class="guidance-card" data-kind="do">
		<h3>Do</h3>
		<ul>
			<li>Set body text at <code>--amb-font-size-300</code> with <code>--amb-font-line-height-body</code>.</li>
			<li>Use one heading level per step in the outline. Pick the size for the visual weight, not the level.</li>
			<li>Keep a line of reading text between 45 and 75 characters.</li>
			<li>Let text reflow at 200% zoom. Size containers in <code>rem</code> or leave them fluid.</li>
		</ul>
	</section>
	<section class="guidance-card" data-kind="dont">
		<h3>Don’t</h3>
		<ul>
			<li>Don’t set text below <code>--amb-font-size-100</code>. Captions are the floor.</li>
			<li>Don’t hard-code a font stack. A brand swaps <code>--amb-font-family-sans</code>.</li>
			<li>Don’t use tight line height on a paragraph. It is for one line.</li>
			<li>Don’t put a paragraph in capitals. Keep uppercase for short labels.</li>
		</ul>
	</section>
</div>

<style>
	.faces {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: var(--amb-space-400);
	}

	.face {
		display: grid;
		gap: var(--amb-space-300);
		padding: var(--amb-space-500);
		border: var(--amb-border-width-default) solid var(--amb-color-border-disabled);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-surface);
	}

	.face p,
	.scale-meta,
	.leading-item p {
		margin: 0;
	}

	.face-sample {
		color: var(--amb-color-fg-default);
		font-size: var(--amb-font-size-800);
		line-height: var(--amb-font-line-height-tight);
	}

	.face-meta {
		display: grid;
		gap: var(--amb-space-100);
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
	}

	.face-token {
		font-family: var(--amb-font-family-mono);
		font-size: var(--amb-font-size-100);
	}

	.scale-list,
	.weight-list {
		display: grid;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.scale-row,
	.weight-row {
		display: grid;
		grid-template-columns: 7.5rem minmax(0, 1fr);
		align-items: baseline;
		gap: var(--amb-space-400);
		padding-block: var(--amb-space-300);
		border-bottom: var(--amb-border-width-default) solid var(--amb-color-border-disabled);
	}

	.scale-row:last-child,
	.weight-row:last-child {
		border-bottom: 0;
	}

	.weight-row {
		grid-template-columns: minmax(0, 1fr) auto;
	}

	.scale-meta {
		display: inline-flex;
		gap: var(--amb-space-200);
		align-items: baseline;
		color: var(--amb-color-fg-subtle);
		font-size: var(--amb-font-size-200);
	}

	.scale-sample {
		overflow: hidden;
		color: var(--amb-color-fg-default);
		line-height: var(--amb-font-line-height-tight);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.weight-sample {
		color: var(--amb-color-fg-default);
		font-size: var(--amb-font-size-600);
		line-height: var(--amb-font-line-height-tight);
	}

	.leading-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--amb-space-500);
	}

	.leading-item {
		display: grid;
		align-content: start;
		gap: var(--amb-space-200);
	}

	.leading-sample {
		color: var(--amb-color-fg-default);
		font-size: var(--amb-font-size-300);
		background-image: repeating-linear-gradient(
			to bottom,
			transparent 0,
			transparent calc(1lh - 1px),
			var(--amb-color-border-disabled) calc(1lh - 1px),
			var(--amb-color-border-disabled) 1lh
		);
	}

	@media (max-width: 560px) {
		.scale-row {
			grid-template-columns: minmax(0, 1fr);
			gap: var(--amb-space-100);
		}
	}
</style>
