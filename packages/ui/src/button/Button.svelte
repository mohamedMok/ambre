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

	/* Tactile layers: a 1px top-edge highlight, a soft drop, and a darker rim.
	   --_depth is the resting shadow of each variant; focus adds the halo on top. */
	button {
		--_depth: inset 0 1px 0 var(--amb-color-highlight), var(--amb-elevation-1);
		--_halo: 0 0 0
			calc(var(--amb-focus-ring-offset) + var(--amb-focus-ring-width) + var(--amb-focus-halo-width))
			var(--amb-color-focus-halo);

		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--amb-space-100);
		min-height: var(--amb-size-control-md);
		margin: 0;
		padding-inline: var(--amb-space-400);
		border: var(--amb-border-width-default) solid
			color-mix(in oklab, var(--amb-color-accent-bg-active) 55%, var(--amb-color-accent-bg));
		border-radius: var(--amb-radius-action);
		background: var(--amb-color-accent-bg);
		box-shadow: var(--_depth);
		color: inherit;
		font: inherit;
		white-space: nowrap;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		transition:
			background-color var(--amb-duration-fast) var(--amb-easing-standard),
			box-shadow var(--amb-duration-fast) var(--amb-easing-standard),
			translate var(--amb-duration-moderate) var(--amb-easing-spring),
			scale var(--amb-duration-moderate) var(--amb-easing-spring);
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

	/* Lift only where a pointer can hover, so touch never sticks in the raised state. */
	@media (hover: hover) {
		button:hover:not(:disabled) {
			--_depth: inset 0 1px 0 var(--amb-color-highlight), var(--amb-elevation-2);
			background: var(--amb-color-accent-bg-hover);
			translate: 0 -1px;
		}
	}

	button:active:not(:disabled) {
		--_depth: var(--amb-elevation-inset);
		background: var(--amb-color-accent-bg-active);
		translate: 0 0;
		scale: 0.98;
	}

	:host([variant='secondary']) {
		color: var(--amb-color-fg-default);
	}

	:host([variant='secondary']) button {
		background: var(--amb-color-bg-surface);
		border-color: var(--amb-color-border-default);
	}

	@media (hover: hover) {
		:host([variant='secondary']) button:hover:not(:disabled) {
			background: var(--amb-color-bg-subtle);
		}
	}

	:host([variant='secondary']) button:active:not(:disabled) {
		background: var(--amb-color-bg-muted);
	}

	:host([variant='ghost']) {
		color: var(--amb-color-accent-fg);
	}

	:host([variant='ghost']) button,
	:host([variant='ghost']) button:hover:not(:disabled) {
		--_depth: 0 0 0 0 transparent;
		background: transparent;
		border-color: transparent;
		translate: 0 0;
	}

	@media (hover: hover) {
		:host([variant='ghost']) button:hover:not(:disabled) {
			background: var(--amb-color-bg-subtle);
		}
	}

	:host([variant='ghost']) button:active:not(:disabled) {
		background: var(--amb-color-bg-muted);
	}

	:host([disabled]) button,
	button:disabled {
		--_depth: 0 0 0 0 transparent;
		background: var(--amb-color-bg-disabled);
		color: var(--amb-color-fg-disabled);
		border-color: transparent;
		translate: 0 0;
		scale: 1;
		cursor: not-allowed;
	}

	button:focus {
		outline: none;
	}

	button:focus-visible {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
		box-shadow: var(--_depth), var(--_halo);
	}

	@media (prefers-reduced-motion: reduce) {
		button {
			transition: none;
		}

		button:hover:not(:disabled),
		button:active:not(:disabled) {
			translate: 0 0;
			scale: 1;
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
