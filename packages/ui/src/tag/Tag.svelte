<svelte:options
	customElement={{
		tag: 'amb-tag',
		shadow: { mode: 'open' },
		props: {
			variant: { reflect: true, type: 'String', attribute: 'variant' }
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
	import styles from '../styles/components/tag.scss?inline';
</script>

<script lang="ts">
	interface Props {
		variant?: 'neutral' | 'accent';
	}

	let { variant = 'neutral' }: Props = $props();
</script>

<span part="label" class={['c-tag', variant !== 'neutral' && `c-tag--${variant}`]}><slot /></span>
