<svelte:options
	customElement={{
		tag: 'amb-progress',
		shadow: { mode: 'open' },
		props: {
			value: { reflect: true, type: 'Number', attribute: 'value' },
			max: { reflect: true, type: 'Number', attribute: 'max' },
			label: { reflect: true, type: 'String', attribute: 'label' }
		},
		extend: (Base) => {
			return class extends Base {
				constructor() {
					super();
					adopt(this.shadowRoot, styles);
				}
			};
		}
	}}
/>

<script module lang="ts">
	import { adopt } from '../styles/adopt';
	import styles from '../styles/components/progress.scss?inline';
</script>

<script lang="ts">
	interface Props {
		value?: number;
		max?: number;
		label?: string;
	}

	let { value = 0, max = 100, label = 'Progress' }: Props = $props();

	const amount = $derived(max <= 0 ? 0 : Math.min(1, Math.max(0, value / max)));
</script>

<div
	part="track"
	class="c-progress"
	role="progressbar"
	aria-label={label}
	aria-valuemin={0}
	aria-valuemax={max}
	aria-valuenow={value}
>
	<div part="fill" class="c-progress__fill" style:width="{amount * 100}%"></div>
</div>
