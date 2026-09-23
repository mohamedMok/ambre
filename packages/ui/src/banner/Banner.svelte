<svelte:options
	customElement={{
		tag: 'amb-banner',
		shadow: { mode: 'open' },
		props: {
			variant: { reflect: true, type: 'String', attribute: 'variant' }
		}
	}}
/>

<script lang="ts">
	interface Props {
		variant?: 'neutral' | 'success' | 'danger';
	}

	let { variant = 'neutral' }: Props = $props();
</script>

<div part="message" role="status" data-variant={variant}><slot /></div>

<style>
	:host {
		display: block;
		font-family: var(--amb-font-family-sans);
		font-size: var(--amb-font-size-300);
		line-height: var(--amb-font-line-height-body);
	}

	div {
		padding: var(--amb-space-300) var(--amb-space-400);
		border-radius: var(--amb-radius-md);
		background: var(--amb-color-bg-subtle);
		color: var(--amb-color-fg-default);
	}

	div[data-variant='success'] {
		background: var(--amb-color-status-success-bg);
		color: var(--amb-color-status-success-on);
	}

	div[data-variant='danger'] {
		background: var(--amb-color-status-danger-bg);
		color: var(--amb-color-status-danger-on);
	}

	@media (forced-colors: active) {
		div {
			border: var(--amb-border-width-default) solid CanvasText;
			background: Canvas;
			color: CanvasText;
		}
	}
</style>
