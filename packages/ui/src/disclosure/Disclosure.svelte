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
	}

	button {
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
		color: inherit;
		font: inherit;
		text-align: start;
		cursor: pointer;
	}

	button::after {
		content: '';
		flex: none;
		width: var(--amb-space-200);
		height: var(--amb-space-200);
		border-right: var(--amb-border-width-strong) solid currentColor;
		border-bottom: var(--amb-border-width-strong) solid currentColor;
		transform: translateY(-2px) rotate(45deg);
	}

	:host([open]) button {
		border-radius: var(--amb-radius-md) var(--amb-radius-md) 0 0;
	}

	:host([open]) button::after {
		transform: translateY(2px) rotate(225deg);
	}

	button:hover:not(:disabled) {
		background: var(--amb-color-bg-subtle);
	}

	button:active:not(:disabled) {
		background: var(--amb-color-bg-muted);
	}

	button:focus {
		outline: none;
	}

	button:focus-visible {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
	}

	:host([disabled]) button,
	button:disabled {
		background: var(--amb-color-bg-disabled);
		color: var(--amb-color-fg-disabled);
		cursor: not-allowed;
	}

	div {
		padding: var(--amb-space-400) var(--amb-space-500) var(--amb-space-500);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-top: 0;
		border-radius: 0 0 var(--amb-radius-md) var(--amb-radius-md);
		background: var(--amb-color-bg-surface);
		font-weight: var(--amb-font-weight-regular);
		line-height: var(--amb-font-line-height-body);
	}

	@media (prefers-reduced-motion: reduce) {
		button {
			transition: none;
		}
	}

	@media (forced-colors: active) {
		button,
		div {
			border: var(--amb-border-width-strong) solid ButtonText;
			background: ButtonFace;
			color: ButtonText;
		}
	}
</style>
