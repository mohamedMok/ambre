<script lang="ts">
	import { formatColor, parseColor, toHex } from './color';
	import type { TokenDef } from './model';

	let {
		def,
		value,
		base,
		onchange
	}: { def: TokenDef; value: string; base: string; onchange: (value: string) => void } = $props();

	const id = $derived(`tok-${def.path.replaceAll('.', '-')}`);
	const changed = $derived(value !== base);

	// Colour
	const rgba = $derived(def.type === 'color' ? parseColor(value) : null);
	function setColor(hex: string, alpha = rgba?.a ?? 1) {
		const next = parseColor(hex);
		if (next) onchange(formatColor({ ...next, a: alpha }));
	}

	// Dimension: sensible slider ranges per family.
	const numeric = $derived(parseFloat(value));
	const range = $derived.by(() => {
		const p = def.path;
		if (p === 'radius.full') return [0, 9999, 1];
		if (p.startsWith('font.size')) return [8, 96, 1];
		if (p.startsWith('space')) return [0, 160, 1];
		if (p.startsWith('radius')) return [0, 40, 1];
		if (p.startsWith('size.control')) return [20, 80, 1];
		if (p.startsWith('size.icon')) return [10, 40, 1];
		if (p.startsWith('border')) return [0, 6, 1];
		if (p.startsWith('focus')) return [0, 10, 1];
		return [0, 100, 1];
	});

	// Duration
	const ms = $derived(parseFloat(value));

	// Cubic bézier
	const curve = $derived(
		/cubic-bezier\(([^)]+)\)/.exec(value)?.[1].split(',').map((n) => parseFloat(n)) ?? [0, 0, 1, 1]
	);
	const curves: Record<string, string> = {
		Standard: 'cubic-bezier(0.2, 0, 0, 1)',
		Enter: 'cubic-bezier(0, 0, 0.2, 1)',
		Exit: 'cubic-bezier(0.4, 0, 1, 1)',
		Spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
		Glide: 'cubic-bezier(0.16, 1, 0.3, 1)',
		Linear: 'cubic-bezier(0, 0, 1, 1)'
	};
	function setCurve(index: number, n: number) {
		const next = [...curve];
		next[index] = n;
		onchange(`cubic-bezier(${next.join(', ')})`);
	}
	const curvePath = $derived(
		`M0 40 C${curve[0] * 40} ${40 - curve[1] * 40} ${curve[2] * 40} ${40 - curve[3] * 40} 40 0`
	);

	// Font family
	const families: Record<string, string> = {
		'Source Sans 3': `'Source Sans 3', 'Segoe UI', sans-serif`,
		'Nunito Sans': `'Nunito Sans', 'Segoe UI', sans-serif`,
		'Source Serif 4': `'Source Serif 4', Georgia, serif`,
		'System UI': `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`,
		'Source Code Pro': `'Source Code Pro', ui-monospace, monospace`,
		'Material Symbols Outlined': `'Material Symbols Outlined', sans-serif`
	};
	const familyName = $derived(Object.entries(families).find(([, stack]) => stack === value)?.[0] ?? 'custom');
</script>

<div class="field" data-changed={changed}>
	<label class="field-label" for={id} title={def.description}>
		<span class="field-name">{def.label}</span>
		<span class="field-css">{def.css}</span>
	</label>

	<div class="field-control">
		{#if def.type === 'color' && rgba}
			<input
				class="swatch-input"
				type="color"
				aria-label={`${def.label} colour`}
				value={toHex(rgba)}
				oninput={(e) => setColor(e.currentTarget.value)}
			/>
			<input
				{id}
				class="text-input mono"
				type="text"
				spellcheck="false"
				{value}
				onchange={(e) => parseColor(e.currentTarget.value) && onchange(e.currentTarget.value.trim())}
			/>
			{#if rgba.a < 1 || def.path === 'color.highlight' || def.path === 'color.focus.halo'}
				<input
					class="range alpha"
					type="range"
					min="0"
					max="1"
					step="0.01"
					aria-label={`${def.label} opacity`}
					value={rgba.a}
					oninput={(e) => setColor(toHex(rgba), Number(e.currentTarget.value))}
				/>
			{/if}
		{:else if def.type === 'dimension'}
			<input
				class="range"
				type="range"
				min={range[0]}
				max={range[1]}
				step={range[2]}
				aria-label={def.label}
				value={Number.isFinite(numeric) ? numeric : 0}
				oninput={(e) => onchange(`${e.currentTarget.value}px`)}
			/>
			<input
				{id}
				class="text-input num"
				type="number"
				min="0"
				value={Number.isFinite(numeric) ? numeric : 0}
				onchange={(e) => onchange(`${e.currentTarget.value}px`)}
			/>
			<span class="unit">px</span>
		{:else if def.type === 'fontWeight'}
			<select {id} class="text-input" {value} onchange={(e) => onchange(e.currentTarget.value)}>
				{#each [300, 400, 500, 600, 700, 800] as weight}
					<option value={String(weight)}>{weight}</option>
				{/each}
			</select>
		{:else if def.type === 'number'}
			<input
				class="range"
				type="range"
				min={def.path.startsWith('opacity') ? 0 : 0.9}
				max={def.path.startsWith('opacity') ? 1 : 2.2}
				step="0.01"
				aria-label={def.label}
				{value}
				oninput={(e) => onchange(e.currentTarget.value)}
			/>
			<input {id} class="text-input num" type="number" step="0.01" {value} onchange={(e) => onchange(e.currentTarget.value)} />
		{:else if def.type === 'duration'}
			<input
				class="range"
				type="range"
				min="0"
				max="1500"
				step="10"
				aria-label={def.label}
				value={ms}
				oninput={(e) => onchange(`${e.currentTarget.value}ms`)}
			/>
			<input {id} class="text-input num" type="number" step="10" value={ms} onchange={(e) => onchange(`${e.currentTarget.value}ms`)} />
			<span class="unit">ms</span>
		{:else if def.type === 'cubicBezier'}
			<svg class="curve" viewBox="-4 -12 48 64" aria-hidden="true">
				<path d="M0 40 L40 0" class="curve-guide" />
				<path d={curvePath} class="curve-line" />
			</svg>
			<select
				{id}
				class="text-input"
				value={Object.entries(curves).find(([, v]) => v === value)?.[0] ?? ''}
				onchange={(e) => curves[e.currentTarget.value] && onchange(curves[e.currentTarget.value])}
			>
				<option value="">Custom</option>
				{#each Object.keys(curves) as name}
					<option value={name}>{name}</option>
				{/each}
			</select>
			<div class="bezier">
				{#each curve as n, index}
					<input
						class="text-input num"
						type="number"
						step="0.05"
						aria-label={`Control point ${index + 1}`}
						value={n}
						onchange={(e) => setCurve(index, Number(e.currentTarget.value))}
					/>
				{/each}
			</div>
		{:else if def.type === 'fontFamily'}
			<select
				{id}
				class="text-input"
				value={familyName}
				onchange={(e) => families[e.currentTarget.value] && onchange(families[e.currentTarget.value])}
			>
				{#each Object.keys(families) as name}
					<option value={name}>{name}</option>
				{/each}
				<option value="custom" disabled>Custom stack</option>
			</select>
			<input class="text-input mono wide" type="text" spellcheck="false" {value} aria-label={`${def.label} stack`} onchange={(e) => onchange(e.currentTarget.value)} />
		{:else}
			<input {id} class="text-input mono wide" type="text" spellcheck="false" {value} onchange={(e) => onchange(e.currentTarget.value)} />
		{/if}

		{#if changed}
			<button class="reset" type="button" title={`Reset to ${base}`} onclick={() => onchange(base)}>Reset</button>
		{/if}
	</div>
</div>

<style>
	.field {
		display: grid;
		gap: 6px;
		padding: 10px 12px;
		border-radius: 10px;
	}

	.field[data-changed='true'] {
		background: color-mix(in oklab, var(--amb-color-accent-fg) 7%, transparent);
	}

	.field-label {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px;
		min-width: 0;
	}

	.field-name {
		color: var(--amb-color-fg-default);
		font-size: 14px;
		font-weight: 600;
	}

	.field[data-changed='true'] .field-name::after {
		content: '';
		display: inline-block;
		width: 6px;
		height: 6px;
		margin-left: 6px;
		vertical-align: 2px;
		border-radius: 50%;
		background: var(--amb-color-accent-fg);
	}

	.field-css {
		overflow: hidden;
		color: var(--amb-color-fg-subtle);
		font-family: var(--amb-font-family-mono);
		font-size: 11px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.field-control {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
	}

	.text-input {
		box-sizing: border-box;
		height: 32px;
		min-width: 0;
		padding: 0 8px;
		border: 1px solid var(--rule-strong);
		border-radius: 8px;
		background: var(--amb-color-bg-surface);
		color: var(--amb-color-fg-default);
		font: inherit;
		font-size: 13px;
	}

	.text-input:focus-visible,
	.range:focus-visible,
	.swatch-input:focus-visible,
	.reset:focus-visible {
		outline: 2px solid var(--amb-color-focus-ring);
		outline-offset: 1px;
	}

	.mono {
		font-family: var(--amb-font-family-mono);
		font-size: 12px;
	}

	.text-input.mono:not(.wide) {
		flex: 1;
	}

	.wide {
		flex: 1 1 100%;
	}

	.num {
		width: 68px;
	}

	.unit {
		color: var(--amb-color-fg-subtle);
		font-size: 12px;
	}

	.range {
		flex: 1;
		min-width: 90px;
		accent-color: var(--amb-color-accent-bg);
	}

	.range.alpha {
		flex: 1 1 100%;
	}

	.swatch-input {
		flex: none;
		width: 36px;
		height: 32px;
		padding: 2px;
		border: 1px solid var(--rule-strong);
		border-radius: 8px;
		background: var(--amb-color-bg-surface);
		cursor: pointer;
	}

	.curve {
		flex: none;
		width: 36px;
		height: 40px;
		fill: none;
		stroke-linecap: round;
	}

	.curve-guide {
		stroke: var(--rule-strong);
		stroke-dasharray: 2 3;
	}

	.curve-line {
		stroke: var(--amb-color-accent-fg);
		stroke-width: 2.5;
	}

	.bezier {
		display: flex;
		gap: 4px;
		flex: 1 1 100%;
	}

	.bezier .num {
		flex: 1;
		width: auto;
	}

	.reset {
		height: 28px;
		padding: 0 10px;
		border: 0;
		border-radius: 999px;
		background: var(--amb-color-bg-subtle);
		color: var(--amb-color-fg-muted);
		font: inherit;
		font-size: 12px;
		cursor: pointer;
	}

	.reset:hover {
		color: var(--amb-color-fg-default);
	}
</style>
