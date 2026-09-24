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
				}
			};
		}
	}}
/>

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

<label part="field">
	<input
		bind:this={input}
		part="control"
		type="radio"
		{value}
		{disabled}
		onchange={onChange}
		oninvalid={onInvalid}
		onkeydown={onKeydown}
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

	/* The native input stays (semantics, arrow keys, forms); only its skin changes.
	   Unchecked it is a round sunken well; checked it fills with accent and the dot pops in.
	   --_depth is the resting shadow; focus adds the halo on top. */
	input {
		--_depth: var(--amb-elevation-inset);
		--_halo: 0 0 0
			calc(var(--amb-focus-ring-offset) + var(--amb-focus-ring-width) + var(--amb-focus-halo-width))
			var(--amb-color-focus-halo);

		appearance: none;
		box-sizing: border-box;
		display: grid;
		place-content: center;
		width: var(--amb-size-icon-lg);
		height: var(--amb-size-icon-lg);
		margin: 0;
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-full);
		background: var(--amb-color-bg-surface);
		box-shadow: var(--_depth);
		accent-color: var(--amb-color-accent-bg);
		cursor: inherit;
		transition:
			background-color var(--amb-duration-fast) var(--amb-easing-standard),
			border-color var(--amb-duration-fast) var(--amb-easing-standard),
			box-shadow var(--amb-duration-fast) var(--amb-easing-standard),
			scale var(--amb-duration-moderate) var(--amb-easing-spring);
	}

	/* The dot: an on-accent disc, hidden until checked. */
	input::before {
		content: '';
		width: calc(var(--amb-size-icon-lg) * 0.4);
		height: calc(var(--amb-size-icon-lg) * 0.4);
		border-radius: var(--amb-radius-full);
		background: var(--amb-color-fg-on-accent);
		scale: 0;
		transition: scale var(--amb-duration-moderate) var(--amb-easing-spring);
	}

	input:checked {
		--_depth: inset 0 1px 0 var(--amb-color-highlight), var(--amb-elevation-1);
		border-color: color-mix(in oklab, var(--amb-color-accent-bg-active) 55%, var(--amb-color-accent-bg));
		background: var(--amb-color-accent-bg);
	}

	input:checked::before {
		scale: 1;
	}

	@media (hover: hover) {
		label:hover input:not(:disabled):not(:checked) {
			border-color: var(--amb-color-border-strong);
		}

		label:hover input:checked:not(:disabled) {
			background: var(--amb-color-accent-bg-hover);
		}
	}

	label:active input:not(:disabled) {
		scale: 0.92;
	}

	input:focus {
		outline: none;
	}

	input:focus-visible {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
		box-shadow: var(--_depth), var(--_halo);
	}

	input:disabled,
	input:disabled:checked {
		--_depth: 0 0 0 0 transparent;
		background: var(--amb-color-bg-disabled);
		border-color: var(--amb-color-border-disabled);
	}

	input:disabled::before {
		background: var(--amb-color-fg-disabled);
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
		input::before,
		p {
			transition: none;
		}

		label:active input:not(:disabled) {
			scale: 1;
		}
	}

	@media (forced-colors: active) {
		/* Hand the circle back to the system so it draws with system colors. */
		input {
			appearance: auto;
			accent-color: auto;
			border: none;
			box-shadow: none;
			outline: var(--amb-border-width-default) solid ButtonText;
		}

		input::before {
			content: none;
		}

		input:focus-visible {
			outline: var(--amb-focus-ring-width) solid Highlight;
		}

		p {
			color: CanvasText;
		}
	}
</style>
