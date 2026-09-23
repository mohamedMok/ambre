<svelte:options
	customElement={{
		tag: 'amb-range',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			name: { reflect: true, type: 'String', attribute: 'name' },
			value: { reflect: true, type: 'Number', attribute: 'value' },
			min: { reflect: true, type: 'Number', attribute: 'min' },
			max: { reflect: true, type: 'Number', attribute: 'max' },
			step: { reflect: true, type: 'Number', attribute: 'step' },
			disabled: { reflect: true, type: 'Boolean', attribute: 'disabled' }
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
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		disabled?: boolean;
		attachedInternals?: ElementInternals;
	}

	let {
		name = '',
		value = 0,
		min = 0,
		max = 100,
		step = 1,
		disabled = false,
		attachedInternals
	}: Props = $props();

	let input = $state<HTMLInputElement>();
	const host = $host();

	function publish() {
		if (!input) return;
		attachedInternals?.setFormValue(input.value);
	}

	function onInput() {
		if (!input) return;
		host.value = input.valueAsNumber;
		publish();
	}

	$effect(() => {
		if (!input) return;
		if (input.valueAsNumber !== value) input.value = String(value);
		publish();
	});
</script>

<label part="field">
	<span part="label"><slot /></span>
	<input
		bind:this={input}
		part="control"
		type="range"
		{name}
		{min}
		{max}
		{step}
		{disabled}
		oninput={onInput}
	/>
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
		min-height: var(--amb-size-control-md);
	}

	span {
		font-weight: var(--amb-font-weight-semibold);
		line-height: var(--amb-font-line-height-tight);
	}

	input {
		width: 100%;
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
	}

	@media (forced-colors: active) {
		input {
			accent-color: auto;
		}
	}
</style>
