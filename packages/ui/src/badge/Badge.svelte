<svelte:options
	customElement={{
		tag: 'amb-badge',
		shadow: { mode: 'open' },
		props: {
			variant: { reflect: true, type: 'String', attribute: 'variant' }
		}
	}}
/>

<script lang="ts">
	interface Props {
		variant?: 'neutral' | 'accent' | 'success' | 'danger';
	}

	let { variant = 'neutral' }: Props = $props();
</script>

<span part="label" data-variant={variant}><slot /></span>

<style>
	:host {
		display: inline-block;
		vertical-align: middle;
		font-family: var(--amb-font-family-sans);
		font-size: var(--amb-font-size-100);
		font-weight: var(--amb-font-weight-semibold);
		line-height: var(--amb-font-line-height-tight);
	}

	span {
		display: inline-flex;
		align-items: center;
		padding: var(--amb-space-100) var(--amb-space-200);
		border-radius: var(--amb-radius-sm);
		background: var(--amb-color-bg-subtle);
		color: var(--amb-color-fg-default);
	}

	span[data-variant='accent'] {
		background: var(--amb-color-accent-bg);
		color: var(--amb-color-fg-on-accent);
	}

	span[data-variant='success'] {
		background: var(--amb-color-status-success-bg);
		color: var(--amb-color-status-success-on);
	}

	span[data-variant='danger'] {
		background: var(--amb-color-status-danger-bg);
		color: var(--amb-color-status-danger-on);
	}

	@media (forced-colors: active) {
		span {
			border: var(--amb-border-width-default) solid ButtonText;
			background: Canvas;
			color: CanvasText;
		}
	}
</style>
