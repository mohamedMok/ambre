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
					adopt(this.shadowRoot, styles);
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

<script module lang="ts">
	import { adopt } from '../styles/adopt';
	import { emit } from '../internal/events';
	import styles from '../styles/components/select.scss?inline';
</script>

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
		// The clones live in the shadow root, so they carry the BEM element of the sheet.
		for (const option of select.options) option.classList.add('c-select__option');
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
		emit(host, 'change', { value: select.value });
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

<label part="field" class="c-select">
	<span part="label" class="c-select__label"><slot /></span>
	<select
		bind:this={select}
		part="control"
		class="c-select__control"
		{name}
		{disabled}
		{required}
		onchange={onChange}
		oninvalid={onInvalid}
	></select>
	{#if showMessage && message}
		<p part="message" class="c-select__message">{message}</p>
	{/if}
</label>
