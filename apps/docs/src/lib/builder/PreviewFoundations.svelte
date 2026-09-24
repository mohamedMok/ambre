<script lang="ts">
	let { values }: { values: Record<string, string> } = $props();

	const surfaces = ['bg.canvas', 'bg.surface', 'bg.subtle', 'bg.muted', 'bg.inverse', 'bg.disabled'];
	const text = ['fg.default', 'fg.muted', 'fg.subtle', 'fg.inverse', 'fg.on-accent', 'fg.disabled'];
	const accents = ['accent.bg', 'accent.bg-hover', 'accent.bg-active', 'accent.fg', 'focus.ring', 'border.default', 'border.strong'];
	const status = ['status.danger.fg', 'status.danger.bg', 'status.success.fg', 'status.success.bg'];
	const sizes = ['900', '800', '700', '600', '500', '400', '300', '200', '100'];
	const spaces = ['100', '200', '300', '400', '500', '600', '700', '800', '900'];
	const radii = ['none', 'sm', 'md', 'action', 'lg', 'full'];
	const css = (path: string) => `var(--amb-${path.replaceAll('.', '-').replace('lineHeight', 'line-height')})`;

	let played = $state(false);
	function replay() {
		played = false;
		requestAnimationFrame(() => requestAnimationFrame(() => (played = true)));
	}
</script>

<section class="pf" aria-label="Foundations preview">
	<div class="pf-block">
		<h3 class="pf-title">Color</h3>
		<div class="pf-swatches">
			{#each [surfaces, text, accents, status] as row}
				<div class="pf-row">
					{#each row as path}
						<div class="pf-swatch">
							<span class="pf-chip" style:background={css(`color.${path}`)}></span>
							<span class="pf-name">{path}</span>
							<span class="pf-value">{values[`color.${path}`]}</span>
						</div>
					{/each}
				</div>
			{/each}
		</div>
		<div class="pf-pairs">
			<p style:background={css('color.bg.canvas')} style:color={css('color.fg.default')}>Default text on the canvas</p>
			<p style:background={css('color.bg.surface')} style:color={css('color.fg.muted')}>Muted text on a surface</p>
			<p style:background={css('color.accent.bg')} style:color={css('color.fg.on-accent')}>Label on the accent</p>
			<p style:background={css('color.bg.inverse')} style:color={css('color.fg.inverse')}>Inverse text</p>
		</div>
	</div>

	<div class="pf-block">
		<h3 class="pf-title">Typography</h3>
		<div class="pf-type">
			{#each sizes as step}
				<div class="pf-type-row">
					<span class="pf-meta">{step} · {values[`font.size.${step}`]}</span>
					<span
						class="pf-sample"
						style:font-size={css(`font.size.${step}`)}
						style:font-weight={Number(step) >= 500 ? css('font.weight.semibold') : css('font.weight.regular')}
						style:line-height={css('font.lineHeight.tight')}
					>
						{Number(step) >= 500 ? 'Northwind settings' : 'The quick brown fox signs the order.'}
					</span>
				</div>
			{/each}
		</div>
		<p class="pf-body" style:line-height={css('font.lineHeight.body')}>
			Body copy sets the reading rhythm. A preset replaces the face, the scale, the weights and the leading, and every
			component follows. <strong style:font-weight={css('font.weight.semibold')}>Semibold</strong> carries controls
			and headings; <span style:font-weight={css('font.weight.medium')}>medium</span> marks emphasis.
			<code style:font-family={css('font.family.mono')}>--amb-font-size-300</code>
		</p>
	</div>

	<div class="pf-grid">
		<div class="pf-block">
			<h3 class="pf-title">Space</h3>
			<div class="pf-space">
				{#each spaces as step}
					<div class="pf-space-row">
						<span class="pf-meta">{step}</span>
						<span class="pf-bar" style:width={css(`space.${step}`)}></span>
						<span class="pf-meta">{values[`space.${step}`]}</span>
					</div>
				{/each}
			</div>
		</div>

		<div class="pf-block">
			<h3 class="pf-title">Shape and depth</h3>
			<div class="pf-tiles">
				{#each radii as r}
					<div class="pf-tile" style:border-radius={css(`radius.${r}`)}>
						<span>{r}</span>
					</div>
				{/each}
			</div>
			<div class="pf-tiles">
				{#each ['inset', '1', '2', '3'] as level}
					<div class="pf-tile pf-elev" style:box-shadow={css(`elevation.${level}`)}>
						<span>elevation {level}</span>
					</div>
				{/each}
			</div>
			<div class="pf-controls">
				{#each ['sm', 'md', 'lg'] as s}
					<span class="pf-control" style:height={css(`size.control.${s}`)}>{s} · {values[`size.control.${s}`]}</span>
				{/each}
			</div>
		</div>
	</div>

	<div class="pf-block">
		<h3 class="pf-title">Motion</h3>
		<div class="pf-motion">
			<button class="pf-replay" type="button" onclick={replay}>Replay</button>
			{#each [['standard', 'moderate'], ['enter', 'slow'], ['exit', 'moderate'], ['spring', 'slow']] as [easing, duration]}
				<div class="pf-lane">
					<span class="pf-meta">{easing} · {values[`duration.${duration}`]}</span>
					<span class="pf-track">
						<span
							class="pf-dot"
							class:played
							style:transition-duration={css(`duration.${duration}`)}
							style:transition-timing-function={css(`easing.${easing}`)}
						></span>
					</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.pf {
		display: grid;
		gap: var(--amb-space-500);
		color: var(--amb-color-fg-default);
		font-family: var(--amb-font-family-sans);
	}

	.pf-block {
		display: grid;
		gap: var(--amb-space-400);
		padding: var(--amb-space-500);
		border: var(--amb-border-width-default) solid color-mix(in oklab, var(--amb-color-border-default) 40%, transparent);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-surface);
		box-shadow: var(--amb-elevation-1);
	}

	.pf-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--amb-space-500);
	}

	.pf-title {
		margin: 0;
		font-size: var(--amb-font-size-400);
		font-weight: var(--amb-font-weight-semibold);
		line-height: var(--amb-font-line-height-tight);
	}

	.pf-swatches {
		display: grid;
		gap: var(--amb-space-300);
	}

	.pf-row {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
		gap: var(--amb-space-200);
	}

	.pf-swatch {
		display: grid;
		gap: 2px;
		min-width: 0;
	}

	.pf-chip {
		height: 44px;
		border-radius: var(--amb-radius-md);
		box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--amb-color-fg-default) 14%, transparent);
	}

	.pf-name {
		font-size: 12px;
		font-weight: 600;
	}

	.pf-value,
	.pf-meta {
		overflow: hidden;
		color: var(--amb-color-fg-subtle);
		font-family: var(--amb-font-family-mono);
		font-size: 11px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.pf-pairs {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
		gap: var(--amb-space-200);
	}

	.pf-pairs p {
		margin: 0;
		padding: var(--amb-space-300) var(--amb-space-400);
		border-radius: var(--amb-radius-md);
		box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--amb-color-border-default) 40%, transparent);
		font-size: var(--amb-font-size-200);
		font-weight: var(--amb-font-weight-semibold);
	}

	.pf-type {
		display: grid;
		gap: var(--amb-space-200);
	}

	.pf-type-row {
		display: grid;
		grid-template-columns: 110px 1fr;
		align-items: baseline;
		gap: var(--amb-space-300);
		min-width: 0;
	}

	.pf-sample {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.pf-body {
		max-width: 62ch;
		margin: 0;
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-300);
	}

	.pf-space {
		display: grid;
		gap: var(--amb-space-200);
	}

	.pf-space-row {
		display: grid;
		grid-template-columns: 34px 1fr 44px;
		align-items: center;
		gap: var(--amb-space-200);
	}

	.pf-bar {
		height: 12px;
		max-width: 100%;
		border-radius: var(--amb-radius-sm);
		background: var(--amb-color-accent-bg);
	}

	.pf-tiles {
		display: flex;
		flex-wrap: wrap;
		gap: var(--amb-space-300);
	}

	.pf-tile {
		display: grid;
		place-items: end start;
		width: 72px;
		height: 60px;
		padding: 6px 8px;
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		background: var(--amb-color-bg-subtle);
		font-size: 11px;
	}

	.pf-elev {
		width: 96px;
		border-color: transparent;
		border-radius: var(--amb-radius-md);
		background: var(--amb-color-bg-surface);
	}

	.pf-controls {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: var(--amb-space-300);
	}

	.pf-control {
		display: inline-flex;
		align-items: center;
		padding-inline: var(--amb-space-400);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-action);
		font-size: 12px;
	}

	.pf-motion {
		display: grid;
		gap: var(--amb-space-300);
	}

	.pf-replay {
		justify-self: start;
		height: var(--amb-size-control-sm);
		padding-inline: var(--amb-space-400);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-action);
		background: var(--amb-color-bg-surface);
		color: inherit;
		font: inherit;
		font-weight: var(--amb-font-weight-semibold);
		cursor: pointer;
	}

	.pf-lane {
		display: grid;
		grid-template-columns: 150px 1fr;
		align-items: center;
		gap: var(--amb-space-300);
	}

	.pf-track {
		position: relative;
		height: 20px;
		border-radius: var(--amb-radius-full);
		background: var(--amb-color-bg-subtle);
		box-shadow: var(--amb-elevation-inset);
	}

	.pf-dot {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--amb-color-accent-bg);
		transition-property: left;
	}

	.pf-dot.played {
		left: calc(100% - 18px);
	}

	@media (prefers-reduced-motion: reduce) {
		.pf-dot {
			transition: none;
		}
	}
</style>
