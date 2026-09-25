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
					adopt(this.shadowRoot, styles);
				}
			};
		}
	}}
/>

<script module lang="ts">
	import { adopt } from '../styles/adopt';
	import { emit } from '../internal/events';
	import styles from '../styles/components/text-area.scss?inline';
</script>

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
		publish();
		const onHostInvalid = () => {
			showMessage = true;
			message = input?.validationMessage ?? '';
		};
		host.addEventListener('invalid', onHostInvalid);
		return () => host.removeEventListener('invalid', onHostInvalid);
	});
</script>

<label part="field" class="c-text-area">
	<span part="label" class="c-text-area__label"><slot /></span>
	<textarea
		bind:this={input}
		part="control"
		class="c-text-area__control"
		{name}
		{rows}
		style:--_rows={rows}
		{disabled}
		{required}
		readOnly={readOnly}
		placeholder={placeholder || undefined}
		oninput={onInput}
		onchange={onChange}
		oninvalid={onInvalid}
	></textarea>
	{#if showMessage && message}
		<p part="message" class="c-text-area__message">{message}</p>
	{/if}
</label>
