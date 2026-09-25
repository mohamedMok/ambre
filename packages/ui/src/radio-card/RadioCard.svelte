<svelte:options
	customElement={{
		tag: 'amb-radio-card',
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
	import { slotted } from '../internal/slots';
	import styles from '../styles/components/radio-card.scss?inline';
</script>

<script lang="ts">
	interface RadioCardElement extends HTMLElement {
		checked: boolean;
		disabled: boolean;
		required: boolean;
		name: string;
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
	const host = $host() as RadioCardElement;
	const id = `amb-radio-card-${Math.random().toString(36).slice(2, 8)}`;
	const has = { icon: slotted(host, 'icon'), description: slotted(host, 'description') };

	// The group is every amb-radio-card with the same name in the same form, or the same root.
	function peers(): RadioCardElement[] {
		if (!name) return [host];
		const scope = attachedInternals?.form ?? host.getRootNode();
		if (!(scope instanceof Document || scope instanceof ShadowRoot || scope instanceof HTMLElement)) {
			return [host];
		}
		return [...scope.querySelectorAll('amb-radio-card')].filter(
			(element): element is RadioCardElement => (element as RadioCardElement).name === name
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
		// A required native radio with nothing checked lends its localized message.
		const probe = document.createElement('input');
		probe.type = 'radio';
		probe.required = true;
		for (const peer of group) {
			const control = peer.shadowRoot?.querySelector('input');
			if (control instanceof HTMLInputElement) control.tabIndex = peer === tabTarget ? 0 : -1;
			const anchor = control instanceof HTMLInputElement ? control : undefined;
			if (peer.required && !anyChecked) {
				peer.attachedInternals?.setValidity({ valueMissing: true }, probe.validationMessage || 'Select an option.', anchor);
			} else {
				peer.attachedInternals?.setValidity({});
			}
		}

		message = attachedInternals?.validationMessage || '';
		if (anyChecked || !required) showMessage = false;
		host.getRootNode().dispatchEvent(new CustomEvent('amb-radio-card-group', { detail: { name, anyChecked } }));
	}

	function select(target: RadioCardElement) {
		target.checked = true;
		const control = target.shadowRoot?.querySelector('input');
		if (control instanceof HTMLInputElement) {
			control.checked = true;
			control.focus();
		}
		target.dispatchEvent(new Event('change', { bubbles: true }));
	}

	function onChange() {
		if (!input?.checked) return;
		host.checked = true;
		host.dispatchEvent(new Event('change', { bubbles: true }));
	}

	function onInvalid() {
		showMessage = true;
		publish();
	}

	// Arrow keys move the selection through the group, skipping disabled cards.
	function onKeydown(event: KeyboardEvent) {
		const forward = event.key === 'ArrowDown' || event.key === 'ArrowRight';
		const backward = event.key === 'ArrowUp' || event.key === 'ArrowLeft';
		if (!forward && !backward) return;
		const enabled = peers().filter((peer) => !peer.disabled);
		if (enabled.length < 2) return;
		event.preventDefault();
		const index = enabled.indexOf(host);
		select(enabled[(index + (forward ? 1 : -1) + enabled.length) % enabled.length]);
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
		root.addEventListener('amb-radio-card-group', onGroup);
		input.checked = checked;
		publish();
		return () => {
			host.removeEventListener('invalid', onHostInvalid);
			root.removeEventListener('amb-radio-card-group', onGroup);
		};
	});
</script>

<label part="field" class={['c-radio-card', checked && 'is-checked', disabled && 'is-disabled']}>
	{#if has.icon}
		<span part="icon" class="c-radio-card__icon"><slot name="icon" /></span>
	{/if}
	<span class="c-radio-card__text">
		<span id={`${id}-label`} part="label" class="c-radio-card__label"><slot /></span>
		{#if has.description}
			<span id={`${id}-description`} part="description" class="c-radio-card__description">
				<slot name="description" />
			</span>
		{/if}
	</span>
	<input
		bind:this={input}
		part="control"
		class="c-radio-card__control"
		type="radio"
		aria-labelledby={`${id}-label`}
		aria-describedby={has.description ? `${id}-description` : undefined}
		{value}
		{disabled}
		onchange={onChange}
		oninvalid={onInvalid}
		onkeydown={onKeydown}
	/>
	{#if showMessage && message}
		<p part="message" class="c-radio-card__message">{message}</p>
	{/if}
</label>
