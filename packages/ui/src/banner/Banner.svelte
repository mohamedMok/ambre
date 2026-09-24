<svelte:options
	customElement={{
		tag: 'amb-banner',
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
	import styles from '../styles/components/banner.scss?inline';
</script>

<script lang="ts">
	interface Props {
		variant?: 'neutral' | 'success' | 'danger';
	}

	let { variant = 'neutral' }: Props = $props();
</script>

<div part="message" role="status" class={['c-banner', variant !== 'neutral' && `c-banner--${variant}`]}><slot /></div>
