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

	input {
		width: var(--amb-size-icon-lg);
		height: var(--amb-size-icon-lg);
		margin: 0;
		accent-color: var(--amb-color-accent-bg);
	}

	input:focus {
		outline: none;
	}

	input:focus-visible {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
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
	}

	@media (forced-colors: active) {
		input {
			accent-color: auto;
			outline: var(--amb-border-width-default) solid ButtonText;
		}

		p {
			color: CanvasText;
		}
	}
</style>
