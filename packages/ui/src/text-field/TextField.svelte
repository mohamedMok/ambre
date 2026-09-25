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
					adopt(this.shadowRoot, styles);
				}
			};
		}
	}}
/>

<script module lang="ts">
	import { adopt } from '../styles/adopt';
	import { emit } from '../internal/events';
	import styles from '../styles/components/text-field.scss?inline';
</script>

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

	// `input` is composed and reaches the host on its own; `change` is re-dispatched on commit.
	function onChange() {
		if (!input) return;
		emit(host, 'change', { value: input.value });
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

<label part="field" class="c-text-field">
	<span part="label" class="c-text-field__label"><slot /></span>
	<input
		bind:this={input}
		part="control"
		class="c-text-field__control"
		{type}
		{name}
		{disabled}
		{required}
		readOnly={readOnly}
		placeholder={placeholder || undefined}
		oninput={onInput}
		onchange={onChange}
		oninvalid={onInvalid}
	/>
	{#if showMessage && message}
		<p part="message" class="c-text-field__message">{message}</p>
	{/if}
</label>
