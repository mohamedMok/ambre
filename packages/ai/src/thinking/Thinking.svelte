<svelte:options
	customElement={{
		tag: 'amb-thinking',
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
	import { adopt } from '../../../ui/src/styles/adopt';
	import styles from '../styles/components/thinking.scss?inline';
</script>

<script lang="ts">
	interface Props {
		label?: string;
	}

	let { label = 'Thinking' }: Props = $props();
</script>

<span part="status" class="c-thinking" role="status">
	<span part="orb" class="c-thinking__orb" aria-hidden="true">
		<span class="c-thinking__dot"></span>
		<span class="c-thinking__dot"></span>
		<span class="c-thinking__dot"></span>
	</span>
	<span part="label" class="c-thinking__label">{label}</span>
</span>
