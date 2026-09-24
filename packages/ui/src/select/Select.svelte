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
		/* The same sunken well as the text field. */
		box-shadow: var(--amb-elevation-inset);
		color: inherit;
		font: inherit;
		cursor: pointer;
		transition:
			border-color var(--amb-duration-fast) var(--amb-easing-standard),
			box-shadow var(--amb-duration-fast) var(--amb-easing-standard);
	}

	@media (hover: hover) {
		select:hover:not(:disabled):not(:focus-visible) {
			border-color: var(--amb-color-border-strong);
		}
	}

	select:focus {
		outline: none;
	}

	select:focus-visible {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
		border-color: var(--amb-color-focus-ring);
		box-shadow:
			var(--amb-elevation-inset),
			0 0 0 calc(var(--amb-focus-ring-offset) + var(--amb-focus-ring-width) + var(--amb-focus-halo-width))
				var(--amb-color-focus-halo);
	}

	select:disabled {
		background: var(--amb-color-bg-disabled);
		border-color: var(--amb-color-border-disabled);
		box-shadow: none;
		color: var(--amb-color-fg-disabled);
		cursor: not-allowed;
	}

	select:user-invalid {
		border-color: var(--amb-color-status-danger-fg);
	}

	/* Customizable select: the native element stays, and where the browser supports
	   base-select the picker becomes a floating Ambre surface. Other browsers keep
	   the native look above. Options are cloned in by script, hence :global. */
	@supports (appearance: base-select) {
		select,
		select::picker(select) {
			appearance: base-select;
		}

		select {
			display: flex;
			align-items: center;
			gap: var(--amb-space-200);
		}

		select::picker-icon {
			color: var(--amb-color-fg-muted);
			transition: rotate var(--amb-duration-moderate) var(--amb-easing-spring);
		}

		select:open::picker-icon {
			rotate: 180deg;
		}

		select:disabled::picker-icon {
			color: var(--amb-color-fg-disabled);
		}

		select::picker(select) {
			box-sizing: border-box;
			margin-block: var(--amb-space-100);
			padding: var(--amb-space-100);
			border: var(--amb-border-width-default) solid var(--amb-color-border-default);
			border-radius: var(--amb-radius-lg);
			background: var(--amb-color-bg-surface);
			box-shadow:
				inset 0 1px 0 var(--amb-color-highlight),
				var(--amb-elevation-2);
			color: var(--amb-color-fg-default);
			opacity: 0;
			scale: 0.96;
			transform-origin: top center;
			transition:
				opacity var(--amb-duration-moderate) var(--amb-easing-enter),
				scale var(--amb-duration-moderate) var(--amb-easing-spring),
				display var(--amb-duration-moderate) allow-discrete,
				overlay var(--amb-duration-moderate) allow-discrete;
		}

		select:open::picker(select) {
			opacity: 1;
			scale: 1;
		}

		select :global(option) {
			display: flex;
			align-items: center;
			gap: var(--amb-space-200);
			min-height: var(--amb-size-control-md);
			padding-inline: var(--amb-space-300);
			border-radius: var(--amb-radius-sm);
			background: transparent;
			color: var(--amb-color-fg-default);
			cursor: pointer;
			transition: background-color var(--amb-duration-fast) var(--amb-easing-standard);
		}

		select :global(option:hover),
		select :global(option:focus-visible) {
			background: var(--amb-color-bg-subtle);
		}

		select :global(option:focus-visible) {
			outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
			outline-offset: calc(var(--amb-focus-ring-width) * -1);
		}

		select :global(option:checked) {
			background: color-mix(in oklab, var(--amb-color-accent-fg) 12%, var(--amb-color-bg-surface));
			color: var(--amb-color-accent-fg);
			font-weight: var(--amb-font-weight-semibold);
		}

		select :global(option:disabled) {
			color: var(--amb-color-fg-disabled);
			cursor: not-allowed;
		}
	}

	/* The picker arrives: it scales up from its anchor with a small spring. */
	@starting-style {
		select:open::picker(select) {
			opacity: 0;
			scale: 0.96;
		}
	}

	:global(::slotted(option)),
	:global(::slotted(optgroup)) {
		display: none;
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
		select,
		select :global(option),
		p {
			transition: none;
		}

		/* Separate rules: an unsupported pseudo-element would drop the whole list. */
		select::picker-icon {
			transition: none;
		}

		select::picker(select) {
			transition: none;
			scale: 1;
		}
	}

	@media (forced-colors: active) {
		select {
			border: var(--amb-border-width-default) solid ButtonText;
			background: Field;
			color: FieldText;
		}

		select::picker(select) {
			border: var(--amb-border-width-default) solid CanvasText;
			background: Canvas;
			color: CanvasText;
		}

		select :global(option:checked) {
			background: Highlight;
			color: HighlightText;
			forced-color-adjust: none;
		}

		p {
			color: CanvasText;
		}
	}
</style>
