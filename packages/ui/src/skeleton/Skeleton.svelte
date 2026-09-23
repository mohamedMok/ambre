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

	div {
		min-height: var(--amb-size-control-sm);
		border-radius: var(--amb-radius-sm);
		background: var(--amb-color-bg-subtle);
		animation: amb-pulse var(--amb-duration-loop) var(--amb-easing-standard) infinite;
	}

	@keyframes amb-pulse {
		50% {
			opacity: 0.55;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		div {
			animation: none;
		}
	}
</style>
