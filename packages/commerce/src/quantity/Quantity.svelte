<svelte:options
	customElement={{
		tag: 'amb-quantity',
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
		value = 1,
		min = 1,
		max = 99,
		step = 1,
		disabled = false,
		attachedInternals
	}: Props = $props();

	let input = $state<HTMLInputElement>();
	const host = $host();
	const labelId = `amb-quantity-${Math.random().toString(36).slice(2, 8)}`;

	const atMin = $derived(disabled || Number(value) <= Number(min));
	const atMax = $derived(disabled || Number(value) >= Number(max));

	function currentStep() {
		const amount = Number(step);
		return Number.isFinite(amount) && amount > 0 ? amount : 1;
	}

	function clamp(next: number) {
		const amount = currentStep();
		const low = Number(min);
		const high = Number(max);
		const floor = Number.isFinite(low) ? low : 1;
		const ceiling = Number.isFinite(high) ? high : floor;
		const snapped = floor + Math.round((next - floor) / amount) * amount;
		const bounded = Math.min(Math.max(floor, ceiling), Math.max(floor, snapped));
		const places = (String(amount).split('.')[1] || '').length;
		const factor = 10 ** places;
		return Math.round(bounded * factor) / factor;
	}

	function publish(next: number) {
		attachedInternals?.setFormValue(disabled ? null : String(next));
	}

	function commit(next: number, notify: boolean) {
		const clamped = clamp(Number.isFinite(next) ? next : Number(min));
		const changed = clamped !== Number(host.value);
		host.value = clamped;
		if (input) input.value = String(clamped);
		publish(clamped);
		if (notify && changed) {
			host.dispatchEvent(
				new CustomEvent('change', {
					bubbles: true,
					composed: true,
					detail: { value: clamped }
				})
			);
		}
	}

	function bump(direction: number) {
		if (disabled) return;
		commit(Number(value) + direction * currentStep(), true);
	}

	function onInput() {
		if (!input || Number.isNaN(input.valueAsNumber)) return;
		host.value = input.valueAsNumber;
		publish(input.valueAsNumber);
	}

	function onCommit() {
		if (!input) return;
		commit(input.valueAsNumber, true);
	}

	$effect(() => {
		const next = clamp(Number(value));
		if (!input) return;
		if (document.activeElement !== input && input.value !== String(next)) input.value = String(next);
		publish(next);
	});
</script>

<div part="field">
	<span id={labelId} part="label"><slot /></span>
	<div part="stepper">
		<button part="decrease" type="button" disabled={atMin} onclick={() => bump(-1)}>Decrease</button>
		<input
			bind:this={input}
			part="value"
			type="number"
			aria-labelledby={labelId}
			{name}
			{min}
			{max}
			{step}
			{disabled}
			oninput={onInput}
			onchange={onCommit}
		/>
		<button part="increase" type="button" disabled={atMax} onclick={() => bump(1)}>Increase</button>
	</div>
</div>

<style>
	:host {
		display: inline-block;
		color: var(--amb-color-fg-default);
		font-family: var(--amb-font-family-sans);
		font-size: var(--amb-font-size-300);
		font-weight: var(--amb-font-weight-regular);
		line-height: var(--amb-font-line-height-body);
	}

	div[part='field'] {
		display: grid;
		gap: var(--amb-space-200);
	}

	span {
		font-weight: var(--amb-font-weight-semibold);
		line-height: var(--amb-font-line-height-tight);
	}

	div[part='stepper'] {
		display: inline-flex;
		align-items: stretch;
		min-height: var(--amb-size-control-md);
		overflow: hidden;
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-md);
		background: var(--amb-color-bg-surface);
	}

	button,
	input {
		box-sizing: border-box;
		margin: 0;
		border: 0;
		background: transparent;
		color: inherit;
		font: inherit;
	}

	button {
		padding-inline: var(--amb-space-300);
		cursor: pointer;
	}

	button:hover:not(:disabled) {
		background: var(--amb-color-bg-subtle);
	}

	button:focus,
	input:focus {
		outline: none;
	}

	button:focus-visible,
	input:focus-visible {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: calc(var(--amb-focus-ring-offset) * -1);
	}

	button:disabled {
		background: var(--amb-color-bg-disabled);
		color: var(--amb-color-fg-disabled);
		cursor: not-allowed;
	}

	input {
		width: calc(var(--amb-size-control-md) * 1.5);
		border-inline: var(--amb-border-width-default) solid var(--amb-color-border-default);
		text-align: center;
		appearance: textfield;
	}

	input::-webkit-inner-spin-button,
	input::-webkit-outer-spin-button {
		margin: 0;
		appearance: none;
	}

	:host([disabled]) {
		color: var(--amb-color-fg-disabled);
	}

	@media (forced-colors: active) {
		div[part='stepper'],
		button,
		input {
			border: var(--amb-border-width-default) solid ButtonText;
			background: Canvas;
			color: CanvasText;
		}
	}
</style>
