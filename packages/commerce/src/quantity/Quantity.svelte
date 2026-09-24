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
					adopt(this.shadowRoot, styles);
				}
			};
		}
	}}
/>

<script module lang="ts">
	import { adopt } from '../../../ui/src/styles/adopt';
	import styles from '../styles/components/quantity.scss?inline';
</script>

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

<div part="field" class={['c-quantity', disabled && 'is-disabled']}>
	<span id={labelId} part="label" class="c-quantity__label"><slot /></span>
	<div part="stepper" class="c-quantity__stepper">
		<button part="decrease" type="button" class="c-quantity__step" disabled={atMin} onclick={() => bump(-1)}>Decrease</button>
		<input
			bind:this={input}
			part="value"
			class="c-quantity__value"
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
		<button part="increase" type="button" class="c-quantity__step" disabled={atMax} onclick={() => bump(1)}>Increase</button>
	</div>
</div>
