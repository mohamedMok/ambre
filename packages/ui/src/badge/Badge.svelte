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

	/* Tinted pill: the text color drives a faint wash and a fine rim.
	   --_ink is the -fg color of the variant; the fill never exceeds 12% of it. */
	span {
		--_ink: var(--amb-color-fg-default);

		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		gap: var(--amb-space-100);
		padding: var(--amb-space-100) var(--amb-space-200);
		border: var(--amb-border-width-default) solid color-mix(in oklab, var(--_ink) 28%, transparent);
		border-radius: var(--amb-radius-full);
		background: var(--amb-color-bg-subtle);
		color: var(--_ink);
		white-space: nowrap;
	}

	span[data-variant='accent'] {
		--_ink: var(--amb-color-accent-fg);
		background: color-mix(in oklab, var(--_ink) 12%, var(--amb-color-bg-surface));
	}

	span[data-variant='success'] {
		--_ink: var(--amb-color-status-success-fg);
		background: color-mix(in oklab, var(--_ink) 12%, var(--amb-color-bg-surface));
	}

	span[data-variant='danger'] {
		--_ink: var(--amb-color-status-danger-fg);
		background: color-mix(in oklab, var(--_ink) 12%, var(--amb-color-bg-surface));
	}

	@media (forced-colors: active) {
		span {
			border: var(--amb-border-width-default) solid ButtonText;
			background: Canvas;
			color: CanvasText;
		}
	}
</style>
