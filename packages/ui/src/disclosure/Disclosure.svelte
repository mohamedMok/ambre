<svelte:options
	customElement={{
		tag: 'amb-disclosure',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			open: { reflect: true, type: 'Boolean', attribute: 'open' },
			disabled: { reflect: true, type: 'Boolean', attribute: 'disabled' }
		}
	}}
/>

<script lang="ts">
	interface Props {
		open?: boolean;
		disabled?: boolean;
	}

	let { open = false, disabled = false }: Props = $props();
	const host = $host();

	function toggle() {
		if (disabled) return;
		const next = !open;
		host.open = next;
		host.dispatchEvent(
			new CustomEvent('toggle', {
				bubbles: true,
				composed: true,
				detail: { open: next }
			})
		);
	}
</script>

<button
	part="control"
	type="button"
	aria-expanded={open}
	aria-controls="panel"
	{disabled}
	onclick={toggle}
>
	<slot />
</button>
<div id="panel" part="panel" hidden={!open}>
	<slot name="panel" />
</div>

<style>
	:host {
		display: block;
		color: var(--amb-color-fg-default);
		font-family: var(--amb-font-family-sans);
		font-size: var(--amb-font-size-300);
		font-weight: var(--amb-font-weight-semibold);
		line-height: var(--amb-font-line-height-tight);
		/* Lets block-size transition to and from auto where supported. */
		interpolate-size: allow-keywords;
	}

	/* The header is a RAISED surface; --_depth is its resting shadow, focus adds the halo. */
	button {
		--_depth: inset 0 1px 0 var(--amb-color-highlight), var(--amb-elevation-1);
		--_halo: 0 0 0
			calc(var(--amb-focus-ring-offset) + var(--amb-focus-ring-width) + var(--amb-focus-halo-width))
			var(--amb-color-focus-halo);

		position: relative;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--amb-space-300);
		width: 100%;
		min-height: var(--amb-size-control-md);
		margin: 0;
		padding-inline: var(--amb-space-400);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-md);
		background: var(--amb-color-bg-surface);
		box-shadow: var(--_depth);
		color: inherit;
		font: inherit;
		text-align: start;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		transition:
			background-color var(--amb-duration-fast) var(--amb-easing-standard),
			border-color var(--amb-duration-fast) var(--amb-easing-standard),
			box-shadow var(--amb-duration-fast) var(--amb-easing-standard),
			border-radius var(--amb-duration-fast) var(--amb-easing-standard),
			translate var(--amb-duration-moderate) var(--amb-easing-spring),
			scale var(--amb-duration-moderate) var(--amb-easing-spring);
	}

	/* Chevron from two borders; it turns over with a spring as the panel opens. */
	button::after {
		content: '';
		flex: none;
		width: var(--amb-space-200);
		height: var(--amb-space-200);
		border-right: var(--amb-border-width-strong) solid currentColor;
		border-bottom: var(--amb-border-width-strong) solid currentColor;
		translate: 0 -2px;
		rotate: 45deg;
		transition:
			translate var(--amb-duration-moderate) var(--amb-easing-spring),
			rotate var(--amb-duration-moderate) var(--amb-easing-spring);
	}

	:host([open]) button {
		border-radius: var(--amb-radius-md) var(--amb-radius-md) 0 0;
	}

	:host([open]) button::after {
		translate: 0 2px;
		rotate: 225deg;
	}

	@media (hover: hover) {
		button:hover:not(:disabled) {
			background: var(--amb-color-bg-subtle);
			border-color: var(--amb-color-border-strong);
		}

		/* Lift only while closed, so an open header stays joined to its panel. */
		:host(:not([open])) button:hover:not(:disabled) {
			--_depth: inset 0 1px 0 var(--amb-color-highlight), var(--amb-elevation-2);
			translate: 0 -1px;
		}
	}

	button:active:not(:disabled) {
		--_depth: var(--amb-elevation-inset);
		background: var(--amb-color-bg-muted);
		translate: 0 0;
		scale: 0.98;
	}

	button:focus {
		outline: none;
	}

	button:focus-visible {
		z-index: 1;
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
		box-shadow: var(--_depth), var(--_halo);
	}

	:host([disabled]) button,
	button:disabled {
		--_depth: 0 0 0 0 transparent;
		background: var(--amb-color-bg-disabled);
		color: var(--amb-color-fg-disabled);
		border-color: var(--amb-color-border-disabled);
		translate: 0 0;
		scale: 1;
		cursor: not-allowed;
	}

	/* The panel unrolls: block-size eases between 0 and auto (interpolate-size), and display
	   flips discretely so the close is animated too. Browsers without support simply toggle. */
	div {
		box-sizing: border-box;
		overflow: clip;
		block-size: auto;
		padding: var(--amb-space-400) var(--amb-space-500) var(--amb-space-500);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-top: 0;
		border-radius: 0 0 var(--amb-radius-md) var(--amb-radius-md);
		background: var(--amb-color-bg-surface);
		box-shadow: var(--amb-elevation-1);
		font-weight: var(--amb-font-weight-regular);
		line-height: var(--amb-font-line-height-body);
		opacity: 1;
		transition:
			block-size var(--amb-duration-moderate) var(--amb-easing-standard),
			padding-block var(--amb-duration-moderate) var(--amb-easing-standard),
			opacity var(--amb-duration-moderate) var(--amb-easing-enter),
			display var(--amb-duration-moderate) allow-discrete;
	}

	div[hidden] {
		display: none;
		block-size: 0;
		padding-block: 0;
		opacity: 0;
		transition:
			block-size var(--amb-duration-fast) var(--amb-easing-exit),
			padding-block var(--amb-duration-fast) var(--amb-easing-exit),
			opacity var(--amb-duration-fast) var(--amb-easing-exit),
			display var(--amb-duration-fast) allow-discrete;
	}

	@starting-style {
		div:not([hidden]) {
			block-size: 0;
			padding-block: 0;
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		button,
		button::after,
		div,
		div[hidden] {
			transition: none;
		}

		button:hover:not(:disabled),
		button:active:not(:disabled) {
			translate: 0 0;
			scale: 1;
		}
	}

	@media (forced-colors: active) {
		button,
		div {
			border: var(--amb-border-width-strong) solid ButtonText;
			background: ButtonFace;
			color: ButtonText;
			box-shadow: none;
		}
	}
</style>
