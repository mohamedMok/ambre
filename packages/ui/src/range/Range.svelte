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
		style:--_fill="{fill}%"
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

	/* The track is a sunken well filled with accent up to the value (--_fill, set from
	   script); the thumb is a raised bead. Vendor pseudo-elements need separate rules,
	   because one unknown selector in a list drops the whole rule. */
	input {
		--_track: var(--amb-space-200);
		--_thumb: var(--amb-size-icon-lg);
		--_thumb-depth: inset 0 1px 0 var(--amb-color-highlight), var(--amb-elevation-1);
		--_halo: 0 0 0
			calc(var(--amb-focus-ring-offset) + var(--amb-focus-ring-width) + var(--amb-focus-halo-width))
			var(--amb-color-focus-halo);
		--_fill-color: var(--amb-color-accent-bg);
		--_rail: var(--amb-color-bg-subtle);

		appearance: none;
		box-sizing: border-box;
		display: block;
		width: 100%;
		height: var(--_thumb);
		margin: 0;
		border-radius: var(--amb-radius-full);
		background: transparent;
		accent-color: var(--amb-color-accent-bg);
		cursor: pointer;
	}

	input::-webkit-slider-runnable-track {
		box-sizing: border-box;
		height: var(--_track);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-full);
		background: linear-gradient(
			to right,
			var(--_fill-color) 0 var(--_fill, 0%),
			var(--_rail) var(--_fill, 0%) 100%
		);
		box-shadow: var(--amb-elevation-inset);
		transition: border-color var(--amb-duration-fast) var(--amb-easing-standard);
	}

	input::-moz-range-track {
		box-sizing: border-box;
		height: var(--_track);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-full);
		background: var(--_rail);
		box-shadow: var(--amb-elevation-inset);
		transition: border-color var(--amb-duration-fast) var(--amb-easing-standard);
	}

	input::-moz-range-progress {
		height: var(--_track);
		border-radius: var(--amb-radius-full);
		background: var(--_fill-color);
	}

	input::-webkit-slider-thumb {
		appearance: none;
		box-sizing: border-box;
		width: var(--_thumb);
		height: var(--_thumb);
		margin-top: calc((var(--_track) - var(--_thumb)) / 2 - var(--amb-border-width-default));
		border: var(--amb-border-width-strong) solid var(--amb-color-accent-bg);
		border-radius: var(--amb-radius-full);
		background: var(--amb-color-bg-surface);
		box-shadow: var(--_thumb-depth);
		transition:
			background-color var(--amb-duration-fast) var(--amb-easing-standard),
			border-color var(--amb-duration-fast) var(--amb-easing-standard),
			box-shadow var(--amb-duration-fast) var(--amb-easing-standard),
			scale var(--amb-duration-moderate) var(--amb-easing-spring);
	}

	input::-moz-range-thumb {
		box-sizing: border-box;
		width: var(--_thumb);
		height: var(--_thumb);
		border: var(--amb-border-width-strong) solid var(--amb-color-accent-bg);
		border-radius: var(--amb-radius-full);
		background: var(--amb-color-bg-surface);
		box-shadow: var(--_thumb-depth);
		transition:
			background-color var(--amb-duration-fast) var(--amb-easing-standard),
			border-color var(--amb-duration-fast) var(--amb-easing-standard),
			box-shadow var(--amb-duration-fast) var(--amb-easing-standard),
			scale var(--amb-duration-moderate) var(--amb-easing-spring);
	}

	@media (hover: hover) {
		input:hover:not(:disabled) {
			--_thumb-depth: inset 0 1px 0 var(--amb-color-highlight), var(--amb-elevation-2);
			--_fill-color: var(--amb-color-accent-bg-hover);
		}

		input:hover:not(:disabled)::-webkit-slider-runnable-track {
			border-color: var(--amb-color-border-strong);
		}

		input:hover:not(:disabled)::-moz-range-track {
			border-color: var(--amb-color-border-strong);
		}

		input:hover:not(:disabled)::-webkit-slider-thumb {
			scale: 1.08;
		}

		input:hover:not(:disabled)::-moz-range-thumb {
			scale: 1.08;
		}
	}

	input:active:not(:disabled) {
		--_thumb-depth: var(--amb-elevation-inset);
	}

	input:active:not(:disabled)::-webkit-slider-thumb {
		scale: 0.96;
	}

	input:active:not(:disabled)::-moz-range-thumb {
		scale: 0.96;
	}

	input:focus {
		outline: none;
	}

	input:focus-visible {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
	}

	input:focus-visible::-webkit-slider-thumb {
		box-shadow: var(--_thumb-depth), var(--_halo);
	}

	input:focus-visible::-moz-range-thumb {
		box-shadow: var(--_thumb-depth), var(--_halo);
	}

	input:disabled {
		--_fill-color: var(--amb-color-fg-disabled);
		--_rail: var(--amb-color-bg-disabled);
		--_thumb-depth: 0 0 0 0 transparent;
		cursor: not-allowed;
	}

	input:disabled::-webkit-slider-runnable-track {
		border-color: var(--amb-color-border-disabled);
		box-shadow: none;
	}

	input:disabled::-moz-range-track {
		border-color: var(--amb-color-border-disabled);
		box-shadow: none;
	}

	input:disabled::-webkit-slider-thumb {
		border-color: var(--amb-color-border-disabled);
		background: var(--amb-color-bg-disabled);
	}

	input:disabled::-moz-range-thumb {
		border-color: var(--amb-color-border-disabled);
		background: var(--amb-color-bg-disabled);
	}

	:host([disabled]) {
		color: var(--amb-color-fg-disabled);
	}

	@media (prefers-reduced-motion: reduce) {
		input::-webkit-slider-runnable-track,
		input::-webkit-slider-thumb {
			transition: none;
			scale: 1;
		}

		input::-moz-range-track,
		input::-moz-range-thumb {
			transition: none;
			scale: 1;
		}

		input:hover:not(:disabled)::-webkit-slider-thumb,
		input:active:not(:disabled)::-webkit-slider-thumb {
			scale: 1;
		}

		input:hover:not(:disabled)::-moz-range-thumb,
		input:active:not(:disabled)::-moz-range-thumb {
			scale: 1;
		}
	}

	@media (forced-colors: active) {
		input {
			accent-color: auto;
			--_fill-color: Highlight;
			--_rail: Canvas;
		}

		input::-webkit-slider-runnable-track {
			border-color: ButtonText;
			box-shadow: none;
		}

		input::-moz-range-track {
			border-color: ButtonText;
			box-shadow: none;
		}

		input::-webkit-slider-thumb {
			border-color: ButtonText;
			background: ButtonFace;
			box-shadow: none;
		}

		input::-moz-range-thumb {
			border-color: ButtonText;
			background: ButtonFace;
			box-shadow: none;
		}

		input:disabled {
			--_fill-color: GrayText;
		}

		input:disabled::-webkit-slider-thumb {
			border-color: GrayText;
		}

		input:disabled::-moz-range-thumb {
			border-color: GrayText;
		}
	}
</style>
