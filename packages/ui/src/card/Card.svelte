<svelte:options
	customElement={{
		tag: 'amb-card',
		shadow: { mode: 'open' },
		props: {
			variant: { reflect: true, type: 'String', attribute: 'variant' },
			href: { reflect: true, type: 'String', attribute: 'href' }
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
	import styles from '../styles/components/card.scss?inline';
</script>

<script lang="ts">
	interface Props {
		variant?: 'raised' | 'outlined' | 'filled';
		href?: string;
	}

	let { variant = 'raised', href = '' }: Props = $props();
	const host = $host();
	const has = { media: slotted(host, 'media'), heading: slotted(host, 'heading'), footer: slotted(host, 'footer') };
</script>

<div part="surface" class={['c-card', `c-card--${variant}`, href && 'is-link']}>
	{#if has.media}
		<div part="media" class="c-card__media"><slot name="media" /></div>
	{/if}
	<div class="c-card__content">
		{#if has.heading}
			<div part="heading" class="c-card__heading">
				{#if href}
					<a class="c-card__link" {href}><slot name="heading" /></a>
				{:else}
					<slot name="heading" />
				{/if}
			</div>
		{/if}
		<div part="body" class="c-card__body"><slot /></div>
		{#if has.footer}
			<div part="footer" class="c-card__footer"><slot name="footer" /></div>
		{/if}
	</div>
</div>
