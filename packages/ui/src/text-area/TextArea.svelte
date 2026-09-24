<svelte:options
	customElement={{
		tag: 'amb-text-area',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			name: { reflect: true, type: 'String', attribute: 'name' },
			value: { type: 'String' },
			placeholder: { reflect: true, type: 'String', attribute: 'placeholder' },
			rows: { reflect: true, type: 'Number', attribute: 'rows' },
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
		placeholder?: string;
		rows?: number;
		disabled?: boolean;
		required?: boolean;
		'readonly'?: boolean;
		attachedInternals?: ElementInternals;
	}

	let {
		name = '',
		value = '',
		placeholder = '',
		rows = 4,
		disabled = false,
		required = false,
		readonly: readOnly = false,
		attachedInternals
	}: Props = $props();

	let input = $state<HTMLTextAreaElement>();
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
	<textarea
		bind:this={input}
		part="control"
		{name}
		{rows}
		style:--_rows={rows}
		{disabled}
		{required}
		readOnly={readOnly}
		placeholder={placeholder || undefined}
		oninput={onInput}
		oninvalid={onInvalid}
	></textarea>
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

	textarea {
		box-sizing: border-box;
		width: 100%;
		min-height: var(--amb-size-control-md);
		margin: 0;
		padding: var(--amb-space-300);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-md);
		background: var(--amb-color-bg-surface);
		/* The same sunken well as the text field. */
		box-shadow: var(--amb-elevation-inset);
		color: inherit;
		font: inherit;
		resize: vertical;
		transition:
			border-color var(--amb-duration-fast) var(--amb-easing-standard),
			box-shadow var(--amb-duration-fast) var(--amb-easing-standard);
	}

	/* Auto-grow with the text where supported. `rows` still sets the resting height,
	   because field-sizing ignores the rows attribute. */
	@supports (field-sizing: content) {
		textarea {
			field-sizing: content;
			min-block-size: max(
				var(--amb-size-control-md),
				calc(
					var(--_rows, 4) * 1lh + var(--amb-space-300) * 2 + var(--amb-border-width-default) * 2
				)
			);
		}
	}

	textarea::placeholder {
		color: var(--amb-color-fg-muted);
	}

	@media (hover: hover) {
		textarea:hover:not(:disabled):not(:focus-visible) {
			border-color: var(--amb-color-border-strong);
		}
	}

	textarea:focus {
		outline: none;
	}

	textarea:focus-visible {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
		border-color: var(--amb-color-focus-ring);
		box-shadow:
			var(--amb-elevation-inset),
			0 0 0 calc(var(--amb-focus-ring-offset) + var(--amb-focus-ring-width) + var(--amb-focus-halo-width))
				var(--amb-color-focus-halo);
	}

	textarea:disabled {
		background: var(--amb-color-bg-disabled);
		border-color: var(--amb-color-border-disabled);
		box-shadow: none;
		color: var(--amb-color-fg-disabled);
		resize: none;
	}

	textarea:user-invalid {
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
		textarea,
		p {
			transition: none;
		}
	}

	@media (forced-colors: active) {
		textarea {
			border: var(--amb-border-width-default) solid ButtonText;
			background: Field;
			color: FieldText;
		}

		p {
			color: CanvasText;
		}
	}
</style>
