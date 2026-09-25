<svelte:options
	customElement={{
		tag: 'amb-checkbox-card',
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
					adopt(this.shadowRoot, styles);
				}
			};
		}
	}}
/>

<script module lang="ts">
	import { adopt } from '../styles/adopt';
	import { emit } from '../internal/events';
	import { slotted } from '../internal/slots';
	import styles from '../styles/components/checkbox-card.scss?inline';
</script>

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
	const id = `amb-checkbox-card-${Math.random().toString(36).slice(2, 8)}`;
	const has = { icon: slotted(host, 'icon'), description: slotted(host, 'description') };

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
		emit(host, 'change', { checked: input.checked, value });
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

<label part="field" class={['c-checkbox-card', checked && 'is-checked', disabled && 'is-disabled']}>
	{#if has.icon}
		<span part="icon" class="c-checkbox-card__icon"><slot name="icon" /></span>
	{/if}
	<span class="c-checkbox-card__text">
		<span id={`${id}-label`} part="label" class="c-checkbox-card__label"><slot /></span>
		{#if has.description}
			<span id={`${id}-description`} part="description" class="c-checkbox-card__description">
				<slot name="description" />
			</span>
		{/if}
	</span>
	<input
		bind:this={input}
		part="control"
		class="c-checkbox-card__control"
		type="checkbox"
		aria-labelledby={`${id}-label`}
		aria-describedby={has.description ? `${id}-description` : undefined}
		{name}
		{value}
		{disabled}
		{required}
		onchange={onChange}
		oninvalid={onInvalid}
	/>
	{#if showMessage && message}
		<p part="message" class="c-checkbox-card__message">{message}</p>
	{/if}
</label>
