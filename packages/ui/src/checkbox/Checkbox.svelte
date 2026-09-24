<svelte:options
	customElement={{
		tag: 'amb-checkbox',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			name: { reflect: true, type: 'String', attribute: 'name' },
			value: { reflect: true, type: 'String', attribute: 'value' },
			checked: { reflect: true, type: 'Boolean', attribute: 'checked' },
			disabled: { reflect: true, type: 'Boolean', attribute: 'disabled' },
			required: { reflect: true, type: 'Boolean', attribute: 'required' }
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
		name?: string;
		value?: string;
		checked?: boolean;
		disabled?: boolean;
		required?: boolean;
		attachedInternals?: ElementInternals;
	}

	let {
		name = '',
		value = 'on',
		checked = false,
		disabled = false,
		required = false,
		attachedInternals
	}: Props = $props();

	let input = $state<HTMLInputElement>();
	let showMessage = $state(false);
	let message = $state('');
	const host = $host();

	function publish() {
		if (!input) return;
		attachedInternals?.setFormValue(checked ? value : null);
		attachedInternals?.setValidity(input.validity, input.validationMessage, input);
		message = input.validationMessage;
		if (input.validity.valid) showMessage = false;
	}

	function onChange() {
		if (!input) return;
		host.checked = input.checked;
		publish();
	}

	function onInvalid() {
		showMessage = true;
		publish();
	}

	$effect(() => {
		if (!input) return;
		input.checked = checked;
		publish();
		const onHostInvalid = () => {
			showMessage = true;
			message = input?.validationMessage ?? '';
		};
		host.addEventListener('invalid', onHostInvalid);
		return () => host.removeEventListener('invalid', onHostInvalid);
	});
</script>

<label part="field">
	<input
		bind:this={input}
		part="control"
		type="checkbox"
		{name}
		{value}
		{disabled}
		{required}
		onchange={onChange}
		oninvalid={onInvalid}
	/>
	<span part="label"><slot /></span>
	{#if showMessage && message}
		<p part="message">{message}</p>
	{/if}
</label>

<style>
	:host {
		display: block;
		color: var(--amb-color-fg-default);
		font-family: var(--amb-font-family-sans);
		font-size: var(--amb-font-size-300);
		font-weight: var(--amb-font-weight-regular);
		line-height: var(--amb-font-line-height-body);
	}

	label {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		column-gap: var(--amb-space-300);
		row-gap: var(--amb-space-100);
		min-height: var(--amb-size-control-md);
		cursor: pointer;
	}

	/* The native input stays (semantics, keyboard, forms); only its skin changes.
	   Unchecked it is a sunken well; checked it fills with accent and the mark pops in.
	   --_depth is the resting shadow; focus adds the halo on top. */
	input {
		--_depth: var(--amb-elevation-inset);
		--_halo: 0 0 0
			calc(var(--amb-focus-ring-offset) + var(--amb-focus-ring-width) + var(--amb-focus-halo-width))
			var(--amb-color-focus-halo);

		appearance: none;
		box-sizing: border-box;
		position: relative;
		display: grid;
		place-content: center;
		width: var(--amb-size-icon-lg);
		height: var(--amb-size-icon-lg);
		margin: 0;
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-sm);
		background: var(--amb-color-bg-surface);
		box-shadow: var(--_depth);
		accent-color: var(--amb-color-accent-bg);
		cursor: inherit;
		transition:
			background-color var(--amb-duration-fast) var(--amb-easing-standard),
			border-color var(--amb-duration-fast) var(--amb-easing-standard),
			box-shadow var(--amb-duration-fast) var(--amb-easing-standard),
			scale var(--amb-duration-moderate) var(--amb-easing-spring);
	}

	/* The check: a clipped glyph in the on-accent color, hidden until checked. */
	input::before {
		content: '';
		position: absolute;
		inset: 19%;
		background: var(--amb-color-fg-on-accent);
		clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0, 43% 62%);
		scale: 0;
		transition: scale var(--amb-duration-moderate) var(--amb-easing-spring);
	}

	input:checked {
		--_depth: inset 0 1px 0 var(--amb-color-highlight), var(--amb-elevation-1);
		border-color: color-mix(in oklab, var(--amb-color-accent-bg-active) 55%, var(--amb-color-accent-bg));
		background: var(--amb-color-accent-bg);
	}

	input:checked::before {
		scale: 1;
	}

	@media (hover: hover) {
		label:hover input:not(:disabled):not(:checked) {
			border-color: var(--amb-color-border-strong);
		}

		label:hover input:checked:not(:disabled) {
			background: var(--amb-color-accent-bg-hover);
		}
	}

	label:active input:not(:disabled) {
		scale: 0.92;
	}

	input:focus {
		outline: none;
	}

	input:focus-visible {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
		box-shadow: var(--_depth), var(--_halo);
	}

	input:user-invalid:not(:checked) {
		border-color: var(--amb-color-status-danger-fg);
	}

	input:disabled,
	input:disabled:checked {
		--_depth: 0 0 0 0 transparent;
		background: var(--amb-color-bg-disabled);
		border-color: var(--amb-color-border-disabled);
	}

	input:disabled::before {
		background: var(--amb-color-fg-disabled);
	}

	:host([disabled]) {
		color: var(--amb-color-fg-disabled);
		cursor: not-allowed;
	}

	p {
		grid-column: 1 / -1;
		margin: 0;
		color: var(--amb-color-status-danger-fg);
		font-size: var(--amb-font-size-200);
		transition:
			opacity var(--amb-duration-moderate) var(--amb-easing-enter),
			translate var(--amb-duration-moderate) var(--amb-easing-spring);
	}

	/* The message arrives: it settles down into place from just above. */
	@starting-style {
		p {
			opacity: 0;
			translate: 0 calc(var(--amb-space-100) * -1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		input,
		input::before,
		p {
			transition: none;
		}

		label:active input:not(:disabled) {
			scale: 1;
		}
	}

	@media (forced-colors: active) {
		/* Hand the box back to the system so it draws with system colors. */
		input {
			appearance: auto;
			accent-color: auto;
			border: none;
			box-shadow: none;
			outline: var(--amb-border-width-default) solid ButtonText;
		}

		input::before {
			content: none;
		}

		input:focus-visible {
			outline: var(--amb-focus-ring-width) solid Highlight;
		}

		p {
			color: CanvasText;
		}
	}
</style>
