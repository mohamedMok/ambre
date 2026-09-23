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

	@keyframes amb-spin {
		to {
			transform: rotate(1turn);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		span {
			animation: none;
		}
	}

	@media (forced-colors: active) {
		span {
			border-color: CanvasText;
			border-top-color: Highlight;
		}
	}
</style>
