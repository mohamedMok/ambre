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

	/* A tinted panel: the variant's text color washes the surface, rims it,
	   and a top-edge highlight gives it a lit, layered edge. */
	div {
		--_ink: var(--amb-color-fg-default);

		box-sizing: border-box;
		padding: var(--amb-space-300) var(--amb-space-400);
		border: var(--amb-border-width-default) solid color-mix(in oklab, var(--_ink) 28%, transparent);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-subtle);
		box-shadow: inset 0 1px 0 var(--amb-color-highlight);
		color: var(--_ink);
		transition:
			opacity var(--amb-duration-moderate) var(--amb-easing-enter),
			translate var(--amb-duration-moderate) var(--amb-easing-spring);
	}

	div[data-variant='success'] {
		--_ink: var(--amb-color-status-success-fg);
		background: color-mix(in oklab, var(--_ink) 12%, var(--amb-color-bg-surface));
	}

	div[data-variant='danger'] {
		--_ink: var(--amb-color-status-danger-fg);
		background: color-mix(in oklab, var(--_ink) 12%, var(--amb-color-bg-surface));
	}

	/* The banner arrives: it settles down into place from just above. */
	@starting-style {
		div {
			opacity: 0;
			translate: 0 calc(var(--amb-space-100) * -1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		div {
			transition: none;
			translate: 0 0;
		}
	}

	@media (forced-colors: active) {
		div {
			border: var(--amb-border-width-default) solid CanvasText;
			background: Canvas;
			color: CanvasText;
		}
	}
</style>
