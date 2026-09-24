<svelte:options
	customElement={{
		tag: 'amb-skeleton',
		shadow: { mode: 'open' },
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
	import styles from '../styles/components/skeleton.scss?inline';
</script>

<div part="block" class="c-skeleton" aria-hidden="true"><slot /></div>
