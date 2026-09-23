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

	span {
		display: inline-flex;
		align-items: center;
		min-height: var(--amb-size-control-sm);
		padding-inline: var(--amb-space-300);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-full);
		background: var(--amb-color-bg-surface);
		color: var(--amb-color-fg-default);
	}

	span[data-variant='accent'] {
		border-color: transparent;
		background: var(--amb-color-accent-bg);
		color: var(--amb-color-fg-on-accent);
	}

	@media (forced-colors: active) {
		span {
			border: var(--amb-border-width-default) solid ButtonText;
			background: Canvas;
			color: CanvasText;
		}
	}
</style>
