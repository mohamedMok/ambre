<svelte:options
	customElement={{
		tag: 'amb-button',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			variant: { reflect: true, type: 'String', attribute: 'variant' },
			size: { reflect: true, type: 'String', attribute: 'size' },
			disabled: { reflect: true, type: 'Boolean', attribute: 'disabled' },
			type: { reflect: true, type: 'String', attribute: 'type' }
		},
		extend: (Base) => {
			return class extends Base {
				static formAssociated = true;

				constructor() {
					super();
					this.attachedInternals = this.attachInternals();
				}
			};
		}
	}}
/>

<script lang="ts">
	interface Props {
		variant?: 'primary' | 'secondary' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		attachedInternals?: ElementInternals;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		type = 'button',
		attachedInternals,
	}: Props = $props();

	function onClick() {
		const form = attachedInternals?.form;
		if (disabled || !form) return;
		if (type === 'submit') form.requestSubmit();
		if (type === 'reset') form.reset();
	}
</script>

<button part="control" type="button" data-variant={variant} data-size={size} {disabled} onclick={onClick}>
	<slot />
</button>

<style>
	:host {
		display: inline-block;
		vertical-align: middle;
		color: var(--amb-color-fg-on-accent);
		font-family: var(--amb-font-family-sans);
		font-size: var(--amb-font-size-300);
		font-weight: var(--amb-font-weight-semibold);
		line-height: var(--amb-font-line-height-tight);
	}

	button {
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--amb-space-100);
		min-height: var(--amb-size-control-md);
		margin: 0;
		padding-inline: var(--amb-space-400);
		border: var(--amb-border-width-default) solid transparent;
		border-radius: var(--amb-radius-action);
		background: var(--amb-color-accent-bg);
		color: inherit;
		font: inherit;
		cursor: pointer;
		transition: background-color var(--amb-duration-fast) var(--amb-easing-standard);
	}

	:host([size='sm']) {
		font-size: var(--amb-font-size-200);
	}

	:host([size='sm']) button {
		min-height: var(--amb-size-control-sm);
		padding-inline: var(--amb-space-300);
	}

	:host([size='lg']) {
		font-size: var(--amb-font-size-400);
	}

	:host([size='lg']) button {
		min-height: var(--amb-size-control-lg);
		padding-inline: var(--amb-space-500);
	}

	button:hover:not(:disabled) {
		background: var(--amb-color-accent-bg-hover);
	}

	button:active:not(:disabled) {
		background: var(--amb-color-accent-bg-active);
	}

	:host([variant='secondary']) {
		color: var(--amb-color-fg-default);
	}

	:host([variant='secondary']) button {
		background: var(--amb-color-bg-surface);
		border-color: var(--amb-color-border-default);
	}

	:host([variant='secondary']) button:hover:not(:disabled) {
		background: var(--amb-color-bg-subtle);
	}

	:host([variant='secondary']) button:active:not(:disabled) {
		background: var(--amb-color-bg-muted);
	}

	:host([variant='ghost']) {
		color: var(--amb-color-accent-fg);
	}

	:host([variant='ghost']) button {
		background: transparent;
	}

	:host([variant='ghost']) button:hover:not(:disabled) {
		background: var(--amb-color-bg-subtle);
	}

	:host([variant='ghost']) button:active:not(:disabled) {
		background: var(--amb-color-bg-muted);
	}

	:host([disabled]) button,
	button:disabled {
		background: var(--amb-color-bg-disabled);
		color: var(--amb-color-fg-disabled);
		border-color: transparent;
		cursor: not-allowed;
	}

	button:focus {
		outline: none;
	}

	button:focus-visible {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
	}

	@media (prefers-reduced-motion: reduce) {
		button {
			transition: none;
		}
	}

	@media (forced-colors: active) {
		button {
			border: 1px solid ButtonText;
			background: ButtonFace;
			color: ButtonText;
		}

		:host(:not([variant='secondary']):not([variant='ghost'])) button {
			background: ButtonText;
			color: ButtonFace;
		}
	}
</style>
