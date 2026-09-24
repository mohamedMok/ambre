<svelte:options
	customElement={{
		tag: 'amb-badge',
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
	import styles from '../styles/components/badge.scss?inline';
</script>

<script lang="ts">
	interface Props {
		variant?: 'neutral' | 'accent' | 'success' | 'danger';
	}

	let { variant = 'neutral' }: Props = $props();
</script>

<span part="label" class={['c-badge', variant !== 'neutral' && `c-badge--${variant}`]}><slot /></span>
