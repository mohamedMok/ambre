<svelte:options
	customElement={{
		tag: 'amb-spinner',
		shadow: { mode: 'open' },
		props: {
			label: { reflect: true, type: 'String', attribute: 'label' }
		}
	}}
/>

<script lang="ts">
	interface Props {
		label?: string;
	}

	let { label = 'Loading' }: Props = $props();
</script>

<span part="graphic" role="status" aria-label={label}></span>

<style>
	:host {
		display: inline-block;
		vertical-align: middle;
	}

	/* Fallback ring: a quiet track with an accent arc. */
	span {
		display: block;
		width: var(--amb-size-icon-lg);
		height: var(--amb-size-icon-lg);
		box-sizing: border-box;
		border: var(--amb-border-width-strong) solid var(--amb-color-border-default);
		border-top-color: var(--amb-color-accent-bg);
		border-radius: var(--amb-radius-full);
		animation: amb-spin var(--amb-duration-loop) var(--amb-easing-standard) infinite;
	}

	/* Smoother ring: a conic comet tail that fades from the track into the
	   accent head, masked down to a stroke. The mask color only supplies alpha. */
	@supports (mask-image: radial-gradient(transparent, transparent)) {
		span {
			--_stroke: var(--amb-border-width-strong);

			border: none;
			background:
				conic-gradient(
					from 0turn,
					transparent 0turn,
					var(--amb-color-accent-bg) 0.8turn,
					transparent 0.8turn
				),
				var(--amb-color-border-default);
			mask-image: radial-gradient(
				farthest-side,
				transparent calc(100% - var(--_stroke)),
				var(--amb-color-accent-bg) calc(100% - var(--_stroke) + 0.5px)
			);
		}
	}

	@keyframes amb-spin {
		to {
			rotate: 1turn;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		span {
			animation: none;
			rotate: 0turn;
		}
	}

	@media (forced-colors: active) {
		span {
			border: var(--amb-border-width-strong) solid CanvasText;
			border-top-color: Highlight;
			background: none;
			mask-image: none;
		}
	}
</style>
