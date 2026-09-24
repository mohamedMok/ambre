<svelte:options
	customElement={{
		tag: 'amb-tag',
		shadow: { mode: 'open' },
		props: {
			variant: { reflect: true, type: 'String', attribute: 'variant' }
		}
	}}
/>

<script lang="ts">
	interface Props {
		variant?: 'neutral' | 'accent';
	}

	let { variant = 'neutral' }: Props = $props();
</script>

<span part="label" data-variant={variant}><slot /></span>

<style>
	:host {
		display: inline-block;
		vertical-align: middle;
		font-family: var(--amb-font-family-sans);
		font-size: var(--amb-font-size-200);
		font-weight: var(--amb-font-weight-semibold);
		line-height: var(--amb-font-line-height-tight);
	}

	/* A quiet chip: surface pill with a top-edge highlight so it reads as a
	   physical label, without the drop shadow that would make it look pressable. */
	span {
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		gap: var(--amb-space-100);
		min-height: var(--amb-size-control-sm);
		padding-inline: var(--amb-space-300);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-full);
		background: var(--amb-color-bg-surface);
		box-shadow: inset 0 1px 0 var(--amb-color-highlight);
		color: var(--amb-color-fg-default);
		white-space: nowrap;
	}

	/* Accent is a tint of the accent text color, not a solid fill. */
	span[data-variant='accent'] {
		border-color: color-mix(in oklab, var(--amb-color-accent-fg) 28%, transparent);
		background: color-mix(in oklab, var(--amb-color-accent-fg) 12%, var(--amb-color-bg-surface));
		color: var(--amb-color-accent-fg);
	}

	@media (forced-colors: active) {
		span {
			border: var(--amb-border-width-default) solid ButtonText;
			background: Canvas;
			color: CanvasText;
		}
	}
</style>
