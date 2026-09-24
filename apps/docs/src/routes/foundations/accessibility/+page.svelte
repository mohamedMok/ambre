<script lang="ts">
	import { onMount } from 'svelte';
	import data from '@ambre/tokens/json';
	import pairsSource from '../../../../../../packages/tokens/src/contrast-pairs.json';
	import CodeBlock from '$lib/CodeBlock.svelte';
	import Glyph from '$lib/Glyph.svelte';
	import Stage from '$lib/Stage.svelte';
	import { brands } from '$lib/brands';
	import { preview } from '$lib/preview.svelte';

	type Entry = { path: string; value: string | number };
	type Theme = 'light' | 'dark';
	type Pair = { fg: string; bg: string; theme: string; min: number; purpose: string };
	type Check = { theme: Theme; fg: string | null; bg: string | null; ratio: number | null; min: number; pass: boolean | null };
	type Row = { key: string; fg: string; bg: string; purpose: string; checks: Partial<Record<Theme, Check>> };

	const json = data as unknown as {
		system: Entry[];
		dark: Entry[];
		presets?: Record<string, { name: string; light: Entry[]; dark: Entry[] }>;
	};
	const pairs = pairsSource as Pair[];

	/* ---------- WCAG 2.2 relative luminance and contrast ratio ---------- */

	const HEX = /^#?([0-9a-f]{6})$/i;

	function linear(channel: number) {
		const c = channel / 255;
		return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	}

	/** Relative luminance of a 6-digit hex color, or null for anything else. */
	function luminance(value: string | null) {
		const match = value ? HEX.exec(value.trim()) : null;
		if (!match) return null;
		const hex = match[1];
		const [r, g, b] = [0, 2, 4].map((index) => linear(parseInt(hex.slice(index, index + 2), 16)));
		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	}

	function ratio(fg: string | null, bg: string | null) {
		const a = luminance(fg);
		const b = luminance(bg);
		if (a === null || b === null) return null;
		return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
	}

	/* ---------- Resolve every brand's light and dark values ---------- */

	const index = (list: Entry[]) => Object.fromEntries(list.map((token) => [token.path, String(token.value)]));
	const baseLight = index(json.system);
	const baseDark = { ...baseLight, ...index(json.dark) };
	const presetEntries = Object.entries(json.presets ?? {});

	const brandValues: { id: string; name: string; light: Record<string, string>; dark: Record<string, string> }[] = [
		{ id: 'ambre', name: 'Ambre', light: baseLight, dark: baseDark },
		...presetEntries.map(([id, preset]) => ({
			id,
			name: preset.name || id,
			light: { ...baseLight, ...index(preset.light) },
			dark: { ...baseDark, ...index(preset.dark) }
		}))
	];

	function rowsFor(values: (typeof brandValues)[number]) {
		const rows = new Map<string, Row>();
		for (const pair of pairs) {
			const theme: Theme = pair.theme === 'dark' ? 'dark' : 'light';
			const key = `${pair.fg}|${pair.bg}`;
			const row = rows.get(key) ?? { key, fg: pair.fg, bg: pair.bg, purpose: pair.purpose, checks: {} };
			const map = values[theme];
			const fg = map[pair.fg] ?? null;
			const bg = map[pair.bg] ?? null;
			const value = ratio(fg, bg);
			row.checks[theme] = {
				theme,
				fg,
				bg,
				ratio: value,
				min: pair.min,
				pass: value === null ? null : value + 0.001 >= pair.min
			};
			rows.set(key, row);
		}
		return [...rows.values()];
	}

	/* Computed once, at build time when the page is prerendered. */
	const report = brandValues.map((values) => {
		const rows = rowsFor(values);
		const checks = rows.flatMap((row) => Object.values(row.checks));
		return {
			id: values.id,
			name: values.name,
			rows,
			total: checks.filter((check) => check.pass !== null).length,
			passed: checks.filter((check) => check.pass === true).length,
			skipped: checks.filter((check) => check.pass === null).length
		};
	});

	let selected = $state('ambre');
	const current = $derived(report.find((brand) => brand.id === selected) ?? report[0]);

	onMount(() => {
		if (report.some((brand) => brand.id === preview.brand)) selected = preview.brand;
	});

	const themes: Theme[] = ['light', 'dark'];
	const format = (value: number) => `${(Math.floor(value * 100) / 100).toFixed(2)}:1`;
	const short = (path: string) => path.replace(/^color\./, '');

	/* ---------- Target sizes per brand ---------- */

	const sizeKeys = ['sm', 'md', 'lg'] as const;
	const targets = brands.map((brand) => {
		const preset = json.presets?.[brand.id];
		const overrides = preset ? index(preset.light) : {};
		return {
			id: brand.id,
			name: brand.name,
			sizes: sizeKeys.map((key) => overrides[`size.control.${key}`] ?? baseLight[`size.control.${key}`] ?? '')
		};
	});

	const focusCode = `<amb-button>Save changes</amb-button>
<amb-text-field name="email" type="email" autocomplete="email">Email</amb-text-field>`;

	const forcedCode = `@media (forced-colors: active) {
  .card {
    border: 1px solid CanvasText;
  }
  .card[aria-selected="true"] {
    outline: 2px solid Highlight;
  }
}`;
</script>

<svelte:head>
	<title>Accessibility — Ambre</title>
	<meta
		name="description"
		content="Ambre's accessibility commitments: WCAG 2.2 AA, APG patterns, focus, target size, reduced motion, forced colors, and the contrast pairs every brand must pass."
	/>
</svelte:head>

<header class="doc-header">
	<p class="eyebrow"><a href="/foundations">Foundations</a></p>
	<h1>Accessibility</h1>
	<p class="lede">
		WCAG 2.2 AA is the floor for every component and every brand. The tokens carry the contrast, the elements carry
		the semantics, and the build fails when a brand breaks a pair.
	</p>
</header>

<h2 id="commitments">Commitments</h2>
<p class="section-lede">What Ambre guarantees, and what stays with the product.</p>

<h3>WCAG 2.2 AA is the floor</h3>
<p>
	Every component meets WCAG 2.2 level AA in both themes and in every preset. A brand that fails a contrast pair
	does not build. Verdant goes further and sets text to AAA.
</p>

<h3>Patterns follow the APG</h3>
<p>
	Interactive components follow the WAI-ARIA Authoring Practices Guide: tabs move with arrow keys, a menu opens
	from a button, a dialog traps focus and closes on <kbd>Esc</kbd>. Where a native element exists, the component
	uses it inside its shadow root, so the role comes from HTML, not from ARIA.
</p>

<h3>A visible focus ring, and a halo</h3>
<p>
	Focus draws a solid ring of <code>--amb-focus-ring-width</code> at <code>--amb-focus-ring-offset</code>. The ring
	carries the 3:1 contrast against the canvas and surfaces. Outside it, a soft halo of
	<code>--amb-focus-halo-width</code> adds presence. The halo is decoration, never the only cue. Tab into the
	example.
</p>
<Stage label="Focus" code={focusCode}>
	<span class="focus-sample" aria-hidden="true">Ring and halo</span>
	<amb-button>Save changes</amb-button>
	<amb-text-field name="email" type="email" autocomplete="email">Email</amb-text-field>
</Stage>

<h3>Targets of at least 24px</h3>
<p>
	WCAG 2.2 asks for pointer targets of at least 24 by 24 pixels. Every control height in every preset clears it.
	Use the medium size for touch.
</p>
<div class="table-wrap">
	<table class="api">
		<thead>
			<tr>
				<th scope="col">Brand</th>
				<th scope="col">Small</th>
				<th scope="col">Medium</th>
				<th scope="col">Large</th>
			</tr>
		</thead>
		<tbody>
			{#each targets as brand}
				<tr>
					<th scope="row">{brand.name}</th>
					{#each brand.sizes as size}
						<td>{size}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<h3>Reduced motion</h3>
<p>
	With <code>prefers-reduced-motion: reduce</code>, components drop their transitions and entrance animations.
	Nothing depends on seeing a movement. See <a href="/foundations/motion#reduced-motion">Motion</a>.
</p>

<h3>Forced colors</h3>
<p>
	In Windows high contrast and other forced-color modes, components keep a visible boundary and a visible focus
	indicator with system colors. Shadows and fills disappear in these modes, so never let a shadow or a fill be the
	only edge. Do the same in product CSS:
</p>
<CodeBlock code={forcedCode} lang="css" />

<h3>What stays with the product</h3>
<ul>
	<li>Visible labels in the slot of every control. An element without text has no accessible name.</li>
	<li>One <code>h1</code> per page and headings in order.</li>
	<li>Text alternatives for images, and captions for video.</li>
	<li>Error messages that say what went wrong and how to fix it.</li>
	<li>Color plus text or an icon for every status.</li>
</ul>

<h2 id="contrast">Contrast</h2>
<p class="section-lede">
	Every brand is checked against the same pairs, in light and dark. Text needs 4.5:1. Borders, focus rings, and
	disabled controls need 3:1. The ratios below are computed from the built tokens when this page is generated.
</p>

<div class="brand-picker" role="group" aria-label="Brand">
	{#each report as brand}
		<button type="button" aria-pressed={selected === brand.id} onclick={() => (selected = brand.id)}>
			{brand.name}
		</button>
	{/each}
</div>

<p class="contrast-summary" aria-live="polite">
	<strong>{current.name}</strong>: {current.passed} of {current.total} checks pass.
	{#if current.skipped > 0}
		{current.skipped} skipped because a value is not a 6-digit hex color.
	{/if}
</p>

<div class="table-wrap">
	<table class="api contrast-table">
		<caption class="visually-hidden">Contrast pairs for {current.name}, light and dark</caption>
		<thead>
			<tr>
				<th scope="col">Pair</th>
				<th scope="col">Minimum</th>
				<th scope="col">Light</th>
				<th scope="col">Dark</th>
			</tr>
		</thead>
		<tbody>
			{#each current.rows as row (row.key)}
				<tr>
					<th scope="row">
						<span class="pair-purpose">{row.purpose}</span>
						<span class="note"><code>{short(row.fg)}</code> on <code>{short(row.bg)}</code></span>
					</th>
					<td>{(row.checks.light ?? row.checks.dark)?.min ?? ''}:1</td>
					{#each themes as theme}
						{@const check = row.checks[theme]}
						<td>
							{#if !check}
								<span class="muted">Not checked</span>
							{:else if check.ratio === null}
								<span class="muted">Skipped</span>
							{:else}
								<span class="result">
									<span
										class="sample"
										aria-hidden="true"
										style:color={check.fg}
										style:background-color={check.bg}>Aa</span
									>
									<span class="ratio">{format(check.ratio)}</span>
									<span class="verdict" data-pass={String(check.pass)}>
										{#if check.pass}
											<Glyph name="check" size={14} />
											Pass
										{:else}
											<Glyph name="close" size={14} />
											Fail
										{/if}
									</span>
								</span>
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<p>
	The same check runs in <code>pnpm test</code> for the tokens package. To add a pair, edit
	<code>packages/tokens/src/contrast-pairs.json</code>; this table and the test both read it.
</p>

<style>
	.focus-sample {
		display: inline-grid;
		place-items: center;
		height: var(--amb-size-control-md);
		padding-inline: var(--amb-space-400);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-md);
		background: var(--amb-color-bg-surface);
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
		box-shadow: 0 0 0 calc(var(--amb-focus-ring-offset) + var(--amb-focus-ring-width) + var(--amb-focus-halo-width))
			var(--amb-color-focus-halo);
	}

	.brand-picker {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 2px;
		margin: 8px 0 12px;
		padding: 3px;
		border: 1px solid var(--rule-strong);
		border-radius: 999px;
		background: var(--amb-color-bg-subtle);
		box-shadow: var(--amb-elevation-inset);
	}

	.brand-picker button {
		height: 32px;
		padding-inline: 14px;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--amb-color-fg-muted);
		font: inherit;
		font-size: 14px;
		font-weight: var(--amb-font-weight-medium);
		cursor: pointer;
	}

	.brand-picker button:hover {
		color: var(--amb-color-fg-default);
	}

	.brand-picker button[aria-pressed='true'] {
		background: var(--amb-color-bg-surface);
		box-shadow:
			inset 0 1px 0 var(--amb-color-highlight),
			var(--amb-elevation-1);
		color: var(--amb-color-fg-default);
		font-weight: var(--amb-font-weight-semibold);
	}

	.contrast-summary {
		font-size: 15px;
	}

	.contrast-table th[scope='row'] {
		white-space: normal;
	}

	.contrast-table td {
		white-space: nowrap;
	}

	.pair-purpose {
		color: var(--amb-color-fg-default);
	}

	.result {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	.sample {
		display: inline-grid;
		place-items: center;
		width: 34px;
		height: 26px;
		border-radius: 6px;
		box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--amb-color-fg-default) 16%, transparent);
		font-size: 13px;
		font-weight: var(--amb-font-weight-semibold);
	}

	.ratio {
		min-width: 4.5em;
		color: var(--amb-color-fg-default);
		font-family: var(--amb-font-family-mono);
		font-size: 13px;
		font-variant-numeric: tabular-nums;
	}

	.verdict {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 13px;
		font-weight: var(--amb-font-weight-semibold);
	}

	.verdict[data-pass='true'] {
		color: var(--amb-color-status-success-fg);
	}

	.verdict[data-pass='false'] {
		color: var(--amb-color-status-danger-fg);
	}

	@media (forced-colors: active) {
		.brand-picker button[aria-pressed='true'] {
			outline: 2px solid Highlight;
		}

		.sample {
			forced-color-adjust: none;
		}
	}
</style>
