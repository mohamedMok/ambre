<svelte:options
	customElement={{
		tag: 'amb-spinner',
		shadow: { mode: 'open' },
		props: {
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
	import styles from '../styles/components/spinner.scss?inline';
</script>

<script lang="ts">
	interface Props {
		label?: string;
	}

	let { label = 'Loading' }: Props = $props();
</script>

<span part="graphic" class="c-spinner" role="status" aria-label={label}></span>
