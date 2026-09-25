<svelte:options
	customElement={{
		tag: 'amb-stat-tile',
		shadow: { mode: 'open' },
		props: {
			trend: { reflect: true, type: 'String', attribute: 'trend' },
			sentiment: { reflect: true, type: 'String', attribute: 'sentiment' }
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
	import { slotted } from '../internal/slots';
	import styles from '../styles/components/stat-tile.scss?inline';
</script>

<script lang="ts">
	interface Props {
		trend?: 'none' | 'up' | 'down';
		sentiment?: 'neutral' | 'positive' | 'negative';
	}

	let { trend = 'none', sentiment = 'neutral' }: Props = $props();
	const host = $host();
	const has = { delta: slotted(host, 'delta'), description: slotted(host, 'description') };
</script>

<div part="surface" class={['c-stat-tile', `c-stat-tile--${sentiment}`]}>
	<span part="label" class="c-stat-tile__label"><slot /></span>
	<span part="value" class="c-stat-tile__value"><slot name="value" /></span>
	{#if has.delta}
		<span part="delta" class="c-stat-tile__delta">
			{#if trend !== 'none'}
				<svg class={['c-stat-tile__trend', `c-stat-tile__trend--${trend}`]} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
					<path d="M12 19V5M6 11l6-6 6 6" />
				</svg>
			{/if}
			<slot name="delta" />
		</span>
	{/if}
	{#if has.description}
		<span part="description" class="c-stat-tile__description"><slot name="description" /></span>
	{/if}
</div>
