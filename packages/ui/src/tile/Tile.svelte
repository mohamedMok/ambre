<svelte:options
	customElement={{
		tag: 'amb-tile',
		shadow: { mode: 'open' },
		props: {
			href: { reflect: true, type: 'String', attribute: 'href' },
			tone: { reflect: true, type: 'String', attribute: 'tone' }
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
	import styles from '../styles/components/tile.scss?inline';
</script>

<script lang="ts">
	interface Props {
		href?: string;
		tone?: 'neutral' | 'accent';
	}

	let { href = '', tone = 'neutral' }: Props = $props();
	const host = $host();
	const has = {
		icon: slotted(host, 'icon'),
		description: slotted(host, 'description'),
		meta: slotted(host, 'meta')
	};
</script>

<div part="surface" class={['c-tile', `c-tile--${tone}`, href && 'is-link']}>
	{#if has.icon || has.meta}
		<div class="c-tile__top">
			{#if has.icon}<span part="icon" class="c-tile__icon"><slot name="icon" /></span>{/if}
			{#if has.meta}<span part="meta" class="c-tile__meta"><slot name="meta" /></span>{/if}
		</div>
	{/if}
	<span part="title" class="c-tile__title">
		{#if href}
			<a class="c-tile__link" {href}><slot /></a>
		{:else}
			<slot />
		{/if}
	</span>
	{#if has.description}
		<span part="description" class="c-tile__description"><slot name="description" /></span>
	{/if}
	{#if href}
		<svg class="c-tile__arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
			<path d="M5 12h14M13 6l6 6-6 6" />
		</svg>
	{/if}
</div>
