<svelte:options
	customElement={{
		tag: 'amb-progress',
		shadow: { mode: 'open' },
		props: {
			value: { reflect: true, type: 'Number', attribute: 'value' },
			max: { reflect: true, type: 'Number', attribute: 'max' },
			label: { reflect: true, type: 'String', attribute: 'label' }
		}
	}}
/>

<script lang="ts">
	interface Props {
		value?: number;
		max?: number;
		label?: string;
	}

	let { value = 0, max = 100, label = 'Progress' }: Props = $props();

	const amount = $derived(max <= 0 ? 0 : Math.min(1, Math.max(0, value / max)));
</script>

<div
	part="track"
	role="progressbar"
	aria-label={label}
	aria-valuemin={0}
	aria-valuemax={max}
	aria-valuenow={value}
>
	<div part="fill" style:width="{amount * 100}%"></div>
</div>

<style>
	:host {
		display: block;
	}

	/* A sunken groove with a raised, lit accent bar riding inside it. */
	div[part='track'] {
		box-sizing: border-box;
		height: var(--amb-size-icon-sm);
		overflow: hidden;
		border-radius: var(--amb-radius-full);
		background: var(--amb-color-bg-subtle);
		box-shadow: var(--amb-elevation-inset);
	}

	div[part='fill'] {
		height: 100%;
		border-radius: inherit;
		background: var(--amb-color-accent-bg);
		box-shadow: inset 0 1px 0 var(--amb-color-highlight), var(--amb-elevation-1);
		/* Width is layout, not a transform, so it takes the standard curve, not the spring. */
		transition:
			width var(--amb-duration-moderate) var(--amb-easing-standard),
			background-color var(--amb-duration-fast) var(--amb-easing-standard);
	}

	@media (prefers-reduced-motion: reduce) {
		div[part='fill'] {
			transition: none;
		}
	}

	@media (forced-colors: active) {
		div[part='track'] {
			border: var(--amb-border-width-default) solid CanvasText;
			background: Canvas;
		}

		div[part='fill'] {
			background: Highlight;
		}
	}
</style>
