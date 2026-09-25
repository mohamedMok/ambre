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
					adopt(this.shadowRoot, styles);
				}
			};
		}
	}}
/>

<script module lang="ts">
	import { adopt } from '../styles/adopt';
	import { emit } from '../internal/events';
	import styles from '../styles/components/range.scss?inline';
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
		value = 0,
		min = 0,
		max = 100,
		step = 1,
		disabled = false,
		attachedInternals
	}: Props = $props();

	let input = $state<HTMLInputElement>();
	const host = $host();

	/* Visual only: how far along the track the value sits, for the accent fill. */
	let fill = $derived(
		max > min ? Math.min(100, Math.max(0, ((Number(value) - min) / (max - min)) * 100)) : 0
	);

	function publish() {
		if (!input) return;
		attachedInternals?.setFormValue(input.value);
	}

	function onInput() {
		if (!input) return;
		host.value = input.valueAsNumber;
		publish();
	}

	// `input` is composed and reaches the host on its own; `change` is re-dispatched when the thumb is let go.
	function onChange() {
		if (!input) return;
		emit(host, 'change', { value: input.valueAsNumber });
	}

	$effect(() => {
		if (!input) return;
		if (input.valueAsNumber !== value) input.value = String(value);
		publish();
	});
</script>

<label part="field" class={['c-range', disabled && 'is-disabled']}>
	<span part="label" class="c-range__label"><slot /></span>
	<input
		bind:this={input}
		part="control"
		class="c-range__control"
		type="range"
		{name}
		{min}
		{max}
		{step}
		{disabled}
		style:--_fill="{fill}%"
		oninput={onInput}
		onchange={onChange}
	/>
</label>
