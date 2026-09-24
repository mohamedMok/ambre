<svelte:options
	customElement={{
		tag: 'amb-radio',
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
	import styles from '../styles/components/radio.scss?inline';
</script>

<script lang="ts">
	interface RadioElement extends HTMLElement {
		checked: boolean;
		disabled: boolean;
		required: boolean;
		value: string;
		attachedInternals?: ElementInternals;
	}

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
		value = '',
		checked = false,
		disabled = false,
		required = false,
		attachedInternals
	}: Props = $props();

	let input = $state<HTMLInputElement>();
	let showMessage = $state(false);
	let message = $state('');
	const host = $host();

	function peers() {
		if (!name) return [host as RadioElement];
		const scope = attachedInternals?.form ?? host.getRootNode();
		if (!(scope instanceof Document || scope instanceof ShadowRoot || scope instanceof HTMLElement)) {
			return [host];
		}
		return [...scope.querySelectorAll('amb-radio')].filter(
			(element): element is RadioElement => element.name === name
		);
	}

	function publish() {
		const group = peers();
		if (checked) {
			for (const peer of group) {
				if (peer !== host && peer.checked) peer.checked = false;
			}
			attachedInternals?.setFormValue(value);
		} else {
			attachedInternals?.setFormValue(null);
		}

		const anyChecked = group.some((peer) => peer.checked);
		const enabled = group.filter((peer) => !peer.disabled);
		const tabTarget = enabled.find((peer) => peer.checked) ?? enabled[0];
		const probeForm = document.createElement('form');
		const probe = document.createElement('input');
		probe.type = 'radio';
		probe.name = 'amb-radio-probe';
		probe.required = true;
		probeForm.append(probe);
		for (const peer of group) {
			const control = peer.shadowRoot?.querySelector('input');
			if (control instanceof HTMLInputElement) {
				control.tabIndex = peer === tabTarget ? 0 : -1;
			}
			const needsSelection = peer.required && !anyChecked;
			const anchor = control instanceof HTMLInputElement ? control : undefined;
			if (needsSelection && probe.validationMessage) {
				peer.attachedInternals?.setValidity({ valueMissing: true }, probe.validationMessage, anchor);
			} else if (peer === host && input) {
				peer.attachedInternals?.setValidity(input.validity, input.validationMessage, input);
			} else {
				peer.attachedInternals?.setValidity({});
			}
		}

		message = attachedInternals?.validationMessage || '';
		if (anyChecked || !required) showMessage = false;
		host.getRootNode().dispatchEvent(
			new CustomEvent('amb-radio-group', { detail: { name, anyChecked } })
		);
	}

	function onChange() {
		if (!input) return;
		host.checked = input.checked;
	}

	function onInvalid() {
		showMessage = true;
		publish();
	}

	function onKeydown(event: KeyboardEvent) {
		const forward = event.key === 'ArrowDown' || event.key === 'ArrowRight';
		const backward = event.key === 'ArrowUp' || event.key === 'ArrowLeft';
		if (!forward && !backward) return;
		const enabled = peers().filter((peer) => !peer.disabled);
		if (enabled.length < 2) return;
		event.preventDefault();
		const index = enabled.indexOf(host);
		const next = enabled[(index + (forward ? 1 : -1) + enabled.length) % enabled.length];
		next.checked = true;
		const control = next.shadowRoot?.querySelector('input');
		if (control instanceof HTMLInputElement) {
			control.checked = true;
			control.focus();
		}
		next.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
	}

	$effect(() => {
		if (!input) return;
		const onHostInvalid = () => {
			const enabled = peers().filter((peer) => !peer.disabled);
			const tabTarget = enabled.find((peer) => peer.checked) ?? enabled[0];
			if (tabTarget === host) showMessage = true;
		};
		const onGroup = (event: Event) => {
			if (!(event instanceof CustomEvent) || event.detail?.name !== name) return;
			if (event.detail.anyChecked) showMessage = false;
		};
		const root = host.getRootNode();
		host.addEventListener('invalid', onHostInvalid);
		root.addEventListener('amb-radio-group', onGroup);
		input.checked = checked;
		publish();
		return () => {
			host.removeEventListener('invalid', onHostInvalid);
			root.removeEventListener('amb-radio-group', onGroup);
		};
	});
</script>

<label part="field" class={['c-radio', disabled && 'is-disabled']}>
	<input
		bind:this={input}
		part="control"
		class="c-radio__control"
		type="radio"
		{value}
		{disabled}
		onchange={onChange}
		oninvalid={onInvalid}
		onkeydown={onKeydown}
	/>
	<span part="label" class="c-radio__label"><slot /></span>
	{#if showMessage && message}
		<p part="message" class="c-radio__message">{message}</p>
	{/if}
</label>
