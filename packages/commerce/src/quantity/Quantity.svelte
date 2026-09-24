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

	/* One sunken well holds the number; the two steppers rise out of it. */
	div[part='stepper'] {
		--_halo: 0 0 0
			calc(var(--amb-focus-ring-offset) + var(--amb-focus-ring-width) + var(--amb-focus-halo-width))
			var(--amb-color-focus-halo);

		box-sizing: border-box;
		display: inline-flex;
		align-items: stretch;
		gap: var(--amb-space-100);
		min-height: var(--amb-size-control-md);
		padding: var(--amb-space-100);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-md);
		background: var(--amb-color-bg-subtle);
		box-shadow: var(--amb-elevation-inset);
		transition:
			border-color var(--amb-duration-fast) var(--amb-easing-standard),
			box-shadow var(--amb-duration-fast) var(--amb-easing-standard);
	}

	@media (hover: hover) {
		:host(:not([disabled])) div[part='stepper']:hover:not(:has(input:focus-visible)) {
			border-color: var(--amb-color-border-strong);
		}
	}

	/* Typing in the number focuses the whole well, like a text field. */
	div[part='stepper']:has(input:focus-visible) {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
		border-color: var(--amb-color-focus-ring);
		box-shadow: var(--amb-elevation-inset), var(--_halo);
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
		--_depth: inset 0 1px 0 var(--amb-color-highlight), var(--amb-elevation-1);

		padding-inline: var(--amb-space-300);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-sm);
		background: var(--amb-color-bg-surface);
		box-shadow: var(--_depth);
		font-weight: var(--amb-font-weight-semibold);
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		transition:
			background-color var(--amb-duration-fast) var(--amb-easing-standard),
			box-shadow var(--amb-duration-fast) var(--amb-easing-standard),
			translate var(--amb-duration-moderate) var(--amb-easing-spring),
			scale var(--amb-duration-moderate) var(--amb-easing-spring);
	}

	@media (hover: hover) {
		button:hover:not(:disabled) {
			--_depth: inset 0 1px 0 var(--amb-color-highlight), var(--amb-elevation-2);
			translate: 0 -1px;
		}
	}

	button:active:not(:disabled) {
		--_depth: var(--amb-elevation-inset);
		background: var(--amb-color-bg-muted);
		translate: 0 0;
		scale: 0.96;
	}

	button:focus,
	input:focus {
		outline: none;
	}

	button:focus-visible {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
		box-shadow: var(--_depth), var(--_halo);
	}

	button:disabled {
		--_depth: 0 0 0 0 transparent;
		border-color: transparent;
		background: var(--amb-color-bg-disabled);
		color: var(--amb-color-fg-disabled);
		translate: 0 0;
		scale: 1;
		cursor: not-allowed;
	}

	input {
		width: calc(var(--amb-size-control-md) * 1.5);
		font-weight: var(--amb-font-weight-semibold);
		font-variant-numeric: tabular-nums;
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

	:host([disabled]) div[part='stepper'] {
		border-color: var(--amb-color-border-disabled);
		background: var(--amb-color-bg-disabled);
		box-shadow: none;
	}

	@media (prefers-reduced-motion: reduce) {
		div[part='stepper'],
		button {
			transition: none;
		}

		button:hover:not(:disabled),
		button:active:not(:disabled) {
			translate: 0 0;
			scale: 1;
		}
	}

	@media (forced-colors: active) {
		div[part='stepper'] {
			border: var(--amb-border-width-default) solid ButtonText;
			background: Canvas;
			color: CanvasText;
		}

		button {
			border: var(--amb-border-width-default) solid ButtonText;
			background: ButtonFace;
			color: ButtonText;
		}

		button:disabled {
			border-color: GrayText;
			color: GrayText;
		}

		input {
			background: Field;
			color: FieldText;
		}
	}
</style>
