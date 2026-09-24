<svelte:options
	customElement={{
		tag: 'amb-skeleton',
		shadow: { mode: 'open' }
	}}
/>

<div part="block" aria-hidden="true"><slot /></div>

<style>
	:host {
		display: block;
	}

	/* Warm shimmer: a soft band of the muted tone sweeps across the subtle base,
	   like light moving over paper. The base color stays underneath as fallback. */
	div {
		min-height: var(--amb-size-control-sm);
		border-radius: var(--amb-radius-sm);
		background-color: var(--amb-color-bg-subtle);
		background-image: linear-gradient(
			100deg,
			var(--amb-color-bg-subtle) 20%,
			var(--amb-color-bg-muted) 50%,
			var(--amb-color-bg-subtle) 80%
		);
		background-size: 300% 100%;
		background-repeat: no-repeat;
		background-position: 100% 0;
		animation: amb-shimmer var(--amb-duration-loop) var(--amb-easing-standard) infinite;
	}

	@keyframes amb-shimmer {
		from {
			background-position: 100% 0;
		}

		to {
			background-position: 0% 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		div {
			animation: none;
			background-image: none;
		}
	}

	@media (forced-colors: active) {
		div {
			border: var(--amb-border-width-default) solid CanvasText;
			background: Canvas;
			animation: none;
		}
	}
</style>
