<svelte:options
	customElement={{
		tag: 'amb-select',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			name: { reflect: true, type: 'String', attribute: 'name' },
			value: { type: 'String' },
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

				connectedCallback() {
					for (const node of this.children) {
						if (
							(node instanceof HTMLOptionElement || node instanceof HTMLOptGroupElement) &&
							node.getAttribute('slot') !== 'option'
						) {
							node.setAttribute('slot', 'option');
						}
					}
					super.connectedCallback();
				}
			};
		}
	}}
/>

<script lang="ts">
	interface Props {
		name?: string;
		value?: string;
		disabled?: boolean;
		required?: boolean;
		attachedInternals?: ElementInternals;
	}

	let {
		name = '',
		value = '',
		disabled = false,
		required = false,
		attachedInternals
	}: Props = $props();

	let select = $state<HTMLSelectElement>();
	let showMessage = $state(false);
	let message = $state('');
	const host = $host();

	function optionNodes() {
		return [...host.children].filter(
			(node): node is HTMLOptionElement | HTMLOptGroupElement =>
				node instanceof HTMLOptionElement || node instanceof HTMLOptGroupElement
		);
	}

	function syncOptions() {
		if (!select) return;
		for (const node of optionNodes()) {
			if (node.getAttribute('slot') !== 'option') node.setAttribute('slot', 'option');
		}
		select.replaceChildren(...optionNodes().map((node) => node.cloneNode(true)));
		if ([...select.options].some((option) => option.value === value)) select.value = value;
		publish();
	}

	function publish() {
		if (!select) return;
		attachedInternals?.setFormValue(select.value);
		attachedInternals?.setValidity(select.validity, select.validationMessage, select);
		message = select.validationMessage;
		if (select.validity.valid) showMessage = false;
	}

	function onChange() {
		if (!select) return;
		host.value = select.value;
		publish();
	}

	function onInvalid() {
		showMessage = true;
		publish();
	}

	$effect(() => {
		if (!select) return;
		syncOptions();
		const observer = new MutationObserver(() => syncOptions());
		observer.observe(host, { childList: true, subtree: true, characterData: true });
		const onHostInvalid = () => {
			showMessage = true;
			message = select?.validationMessage ?? '';
		};
		host.addEventListener('invalid', onHostInvalid);
		return () => {
			observer.disconnect();
			host.removeEventListener('invalid', onHostInvalid);
		};
	});
</script>

<label part="field">
	<span part="label"><slot /></span>
	<select
		bind:this={select}
		part="control"
		{name}
		{disabled}
		{required}
		onchange={onChange}
		oninvalid={onInvalid}
	></select>
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

	select {
		box-sizing: border-box;
		width: 100%;
		min-height: var(--amb-size-control-md);
		margin: 0;
		padding-inline: var(--amb-space-300);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-md);
		background: var(--amb-color-bg-surface);
		color: inherit;
		font: inherit;
	}

	select:focus {
		outline: none;
	}

	select:focus-visible {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
	}

	select:disabled {
		background: var(--amb-color-bg-disabled);
		color: var(--amb-color-fg-disabled);
	}

	select:user-invalid {
		border-color: var(--amb-color-status-danger-fg);
	}

	::slotted(option),
	::slotted(optgroup) {
		display: none;
	}

	p {
		margin: 0;
		color: var(--amb-color-status-danger-fg);
		font-size: var(--amb-font-size-200);
	}

	@media (forced-colors: active) {
		select {
			border: var(--amb-border-width-default) solid ButtonText;
			background: Field;
			color: FieldText;
		}

		p {
			color: CanvasText;
		}
	}
</style>
