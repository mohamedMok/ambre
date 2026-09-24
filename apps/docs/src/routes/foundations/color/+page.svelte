<script lang="ts">
	import CodeBlock from '$lib/CodeBlock.svelte';
	import { tokens, type TokenRecord } from '$lib/tokens';

	type Family = { id: string; title: string; summary: string };

	const order: Family[] = [
		{ id: 'bg', title: 'Background', summary: 'Surfaces from the page canvas to an inverted panel.' },
		{ id: 'fg', title: 'Foreground', summary: 'Text and icons. Every text color meets 4.5:1 on the canvas.' },
		{ id: 'border', title: 'Border', summary: 'Boundaries of controls and surfaces. The default meets 3:1.' },
		{ id: 'accent', title: 'Accent', summary: 'The brand color: primary actions, links, and selection.' },
		{ id: 'focus', title: 'Focus', summary: 'A solid ring that carries the contrast, and a soft halo that does not.' },
		{ id: 'status', title: 'Status', summary: 'Danger and success, as text on the canvas and as fills.' },
		{ id: 'highlight', title: 'Highlight', summary: 'A 1px top-edge light on raised controls. Never under text.' }
	];

	const darkByPath = new Map(tokens.dark.map((token) => [token.path, token]));
	const colors = tokens.system.filter((token) => token.type === 'color');

	const semantic = order
		.map((family) => ({
			...family,
			items: colors
				.filter((token) => token.path.split('.')[1] === family.id)
				.map((token) => ({ token, dark: darkByPath.get(token.path) ?? token }))
		}))
		.filter((family) => family.items.length > 0);

	function step(token: TokenRecord) {
		const last = token.path.split('.').at(-1) ?? '';
		const number = Number(last);
		return Number.isNaN(number) ? 0 : number;
	}

	const ramps = (() => {
		const groups = new Map<string, TokenRecord[]>();
		for (const token of tokens.reference) {
			if (token.type !== 'color') continue;
			const family = token.path.split('.')[1] ?? 'other';
			groups.set(family, [...(groups.get(family) ?? []), token]);
		}
		return [...groups.entries()].map(([family, list]) => ({
			family,
			list: [...list].sort((a, b) => step(a) - step(b))
		}));
	})();

	let copied = $state('');

	async function copy(value: string) {
		copied = value;
		try {
			await navigator.clipboard.writeText(value);
		} catch {
			// Clipboard access can be denied. The announcement still shows the value.
		}
	}

	const themingCode = `/* Theme a product: override system tokens, scoped to your root. */
:root,
[data-theme="light"] {
  --amb-color-accent-bg: #1f6f5c;
  --amb-color-accent-bg-hover: #185a4a;
  --amb-color-accent-bg-active: #11443a;
  --amb-color-accent-fg: #1f6f5c;
  --amb-color-focus-ring: #1f6f5c;
}

[data-theme="dark"] {
  --amb-color-accent-bg: #7fd1bb;
  --amb-color-accent-bg-hover: #a3e0cf;
  --amb-color-accent-bg-active: #5fbfa5;
  --amb-color-accent-fg: #a3e0cf;
  --amb-color-fg-on-accent: #0b1f1a;
  --amb-color-focus-ring: #a3e0cf;
}`;
</script>

<svelte:head>
	<title>Color — Ambre</title>
	<meta
		name="description"
		content="Ambre semantic color tokens in light and dark, the reference palette, and how to theme a product."
	/>
</svelte:head>

<header class="doc-header">
	<p class="eyebrow"><a href="/foundations">Foundations</a></p>
	<h1>Color</h1>
	<p class="lede">
		Color is a set of named decisions. Each system token has a light and a dark value. Components read the name,
		so a theme changes the value in one place.
	</p>
</header>

<p class="copy-note" aria-live="polite">
	{copied ? `Copied ${copied}` : 'Select a token name or a value to copy it.'}
</p>

<h2 id="semantic">Semantic tokens</h2>
<p class="section-lede">
	These are the public color API. The values shown are Ambre’s. A brand preset replaces them; the names stay the
	same.
</p>

{#each semantic as family}
	<h3 id={`family-${family.id}`}>{family.title}</h3>
	<p>{family.summary}</p>
	<div class="table-wrap">
		<table class="api color-table">
			<thead>
				<tr>
					<th scope="col">Token</th>
					<th scope="col">Light</th>
					<th scope="col">Dark</th>
				</tr>
			</thead>
			<tbody>
				{#each family.items as { token, dark }}
					<tr>
						<th scope="row">
							<button class="copy-token" type="button" onclick={() => copy(`var(${token.css})`)}>
								<code>{token.css}</code>
							</button>
							{#if token.description}
								<span class="note">{token.description}</span>
							{/if}
						</th>
						<td>
							<button class="copy-value" type="button" onclick={() => copy(String(token.value))}>
								<span class="swatch" data-theme="light" style:--swatch="var({token.css})"></span>
								<span class="value">{token.value}</span>
							</button>
						</td>
						<td>
							<button class="copy-value" type="button" onclick={() => copy(String(dark.value))}>
								<span class="swatch" data-theme="dark" style:--swatch="var({token.css})"></span>
								<span class="value">{dark.value}</span>
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/each}

<h2 id="palette">Reference palette</h2>
<p class="section-lede">
	The raw ramps behind the system tokens. They are private: the build does not emit them as CSS variables, and a
	component never reads them.
</p>

{#each ramps as ramp}
	<h3 id={`ramp-${ramp.family}`} class="ramp-title">{ramp.family}</h3>
	<ul class="ramp" aria-label={`${ramp.family} ramp`}>
		{#each ramp.list as token}
			<li>
				<button
					class="ramp-step"
					type="button"
					title={token.description || undefined}
					aria-label={`${ramp.family} ${token.path.split('.').at(-1)} ${token.value}`}
					onclick={() => copy(String(token.value))}
				>
					<span class="ramp-chip" style:background={String(token.value)}></span>
					<span class="ramp-label">{token.path.split('.').at(-1)}</span>
					<span class="ramp-value">{token.value}</span>
				</button>
			</li>
		{/each}
	</ul>
{/each}

<h2 id="theming">Theming</h2>
<p class="section-lede">
	Override system tokens for each theme. Set the whole family together, then check the pairs on the
	<a href="/foundations/accessibility#contrast">contrast table</a>.
</p>
<CodeBlock code={themingCode} lang="css" title="theme.css" />

<div class="guidance">
	<section class="guidance-card" data-kind="do">
		<h3>Do</h3>
		<ul>
			<li>Override <code>--amb-color-accent-bg</code> and its hover, active, and text siblings together.</li>
			<li>Give every override a dark value under <code>[data-theme="dark"]</code>.</li>
			<li>Pair a fill with its text token, such as <code>accent-bg</code> with <code>fg-on-accent</code>.</li>
			<li>Pair color with text or an icon for status. Color alone does not carry meaning.</li>
		</ul>
	</section>
	<section class="guidance-card" data-kind="dont">
		<h3>Don’t</h3>
		<ul>
			<li>Don’t reference the palette in product CSS. <code>color.amber.600</code> has no CSS variable on purpose.</li>
			<li>Don’t use <code>fg-subtle</code> on a subtle fill. Its 4.5:1 is measured on the canvas.</li>
			<li>Don’t use the focus halo as the only focus cue. The ring carries the 3:1 contrast.</li>
			<li>Don’t put text on <code>--amb-color-highlight</code>. It is a light edge, not a surface.</li>
		</ul>
	</section>
</div>

<style>
	.copy-note {
		margin: 0 0 8px;
		color: var(--amb-color-fg-subtle) !important;
		font-size: 14px;
	}

	.color-table th[scope='row'] {
		white-space: normal;
	}

	.color-table td {
		width: 26%;
		white-space: nowrap;
	}

	.copy-token,
	.copy-value,
	.ramp-step {
		padding: 0;
		border: 0;
		background: none;
		color: inherit;
		font: inherit;
		text-align: left;
		cursor: pointer;
	}

	.copy-token {
		border-radius: 6px;
	}

	.copy-token:hover code {
		border-color: var(--amb-color-border-default);
	}

	.copy-value {
		display: inline-flex;
		align-items: center;
		border-radius: 6px;
	}

	.swatch {
		width: 28px;
		height: 28px;
		margin-right: 10px;
		border-radius: 8px;
	}

	.value,
	.ramp-value {
		font-family: var(--amb-font-family-mono);
		font-size: 13px;
	}

	.copy-value:hover .value {
		color: var(--amb-color-fg-default);
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	.ramp-title {
		text-transform: capitalize;
	}

	.ramp {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(68px, 1fr));
		gap: 6px;
		margin: 0 0 16px;
		padding: 0;
		list-style: none;
	}

	.ramp-step {
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: 100%;
		border-radius: 8px;
	}

	.ramp-chip {
		display: block;
		width: 100%;
		height: 44px;
		border-radius: 8px;
		box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--amb-color-fg-default) 14%, transparent);
	}

	.ramp-label {
		color: var(--amb-color-fg-default);
		font-size: 13px;
		font-weight: var(--amb-font-weight-semibold);
	}

	.ramp-value {
		color: var(--amb-color-fg-subtle);
		font-size: 12px;
	}

	.ramp-step:hover .ramp-chip {
		box-shadow:
			inset 0 0 0 1px color-mix(in oklab, var(--amb-color-fg-default) 14%, transparent),
			var(--amb-elevation-2);
	}

	@media (forced-colors: active) {
		.swatch,
		.ramp-chip {
			forced-color-adjust: none;
			border: 1px solid CanvasText;
		}
	}
</style>
