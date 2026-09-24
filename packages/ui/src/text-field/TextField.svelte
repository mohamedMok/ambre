<svelte:options
	customElement={{
		tag: 'amb-text-field',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			name: { reflect: true, type: 'String', attribute: 'name' },
			value: { type: 'String' },
			type: { reflect: true, type: 'String', attribute: 'type' },
			placeholder: { reflect: true, type: 'String', attribute: 'placeholder' },
			autocomplete: { reflect: true, type: 'String', attribute: 'autocomplete' },
			disabled: { reflect: true, type: 'Boolean', attribute: 'disabled' },
			required: { reflect: true, type: 'Boolean', attribute: 'required' },
			readonly: { reflect: true, type: 'Boolean', attribute: 'readonly' }
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
		type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
		placeholder?: string;
		autocomplete?: string;
		disabled?: boolean;
		required?: boolean;
		'readonly'?: boolean;
		attachedInternals?: ElementInternals;
	}

	let {
		name = '',
		value = '',
		type = 'text',
		placeholder = '',
		autocomplete = '',
		disabled = false,
		required = false,
		readonly: readOnly = false,
		attachedInternals
	}: Props = $props();

	let input = $state<HTMLInputElement>();
	let showMessage = $state(false);
	let message = $state('');
	const host = $host();

	function publish() {
		if (!input) return;
		attachedInternals?.setFormValue(input.value);
		attachedInternals?.setValidity(input.validity, input.validationMessage, input);
		message = input.validationMessage;
		if (input.validity.valid) showMessage = false;
	}

	function onInput() {
		if (!input) return;
		host.value = input.value;
		publish();
	}

	function onInvalid() {
		showMessage = true;
		publish();
	}

	$effect(() => {
		if (!input) return;
		if (input.value !== value) input.value = value;
		if (autocomplete) input.setAttribute('autocomplete', autocomplete);
		else input.removeAttribute('autocomplete');
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
	<span part="label"><slot /></span>
	<input
		bind:this={input}
		part="control"
		{type}
		{name}
		{disabled}
		{required}
		readOnly={readOnly}
		placeholder={placeholder || undefined}
		oninput={onInput}
		oninvalid={onInvalid}
	/>
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
		gap: var(--amb-space-200);
	}

	span {
		font-weight: var(--amb-font-weight-semibold);
		line-height: var(--amb-font-line-height-tight);
	}

	input {
		box-sizing: border-box;
		width: 100%;
		min-height: var(--amb-size-control-md);
		margin: 0;
		padding-inline: var(--amb-space-300);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-md);
		background: var(--amb-color-bg-surface);
		/* A sunken well: the field sits below the surface a button rises from. */
		box-shadow: var(--amb-elevation-inset);
		color: inherit;
		font: inherit;
		transition:
			border-color var(--amb-duration-fast) var(--amb-easing-standard),
			box-shadow var(--amb-duration-fast) var(--amb-easing-standard);
	}

	input::placeholder {
		color: var(--amb-color-fg-muted);
	}

	@media (hover: hover) {
		input:hover:not(:disabled):not(:focus-visible) {
			border-color: var(--amb-color-border-strong);
		}
	}

	input:focus {
		outline: none;
	}

	input:focus-visible {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
		border-color: var(--amb-color-focus-ring);
		box-shadow:
			var(--amb-elevation-inset),
			0 0 0 calc(var(--amb-focus-ring-offset) + var(--amb-focus-ring-width) + var(--amb-focus-halo-width))
				var(--amb-color-focus-halo);
	}

	input:disabled {
		background: var(--amb-color-bg-disabled);
		border-color: var(--amb-color-border-disabled);
		box-shadow: none;
		color: var(--amb-color-fg-disabled);
	}

	input:user-invalid {
		border-color: var(--amb-color-status-danger-fg);
	}

	p {
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
		p {
			transition: none;
		}
	}

	@media (forced-colors: active) {
		input {
			border: var(--amb-border-width-default) solid ButtonText;
			background: Field;
			color: FieldText;
		}

		p {
			color: CanvasText;
		}
	}
</style>
