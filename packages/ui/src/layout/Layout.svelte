<svelte:options
	customElement={{
		tag: 'amb-layout',
		shadow: { mode: 'open' },
		props: {
			variant: { reflect: true, type: 'String', attribute: 'variant' },
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
	import { slotted } from '../internal/slots';
	import styles from '../styles/components/layout.scss?inline';
</script>

<script lang="ts">
	interface Props {
		variant?: 'sidebar' | 'split' | 'stacked';
		label?: string;
	}

	let { variant = 'sidebar', label = 'Primary' }: Props = $props();
	const host = $host();
	const has = {
		header: slotted(host, 'header'),
		nav: slotted(host, 'nav'),
		aside: slotted(host, 'aside'),
		footer: slotted(host, 'footer')
	};
</script>

<div
	class={[
		'c-layout',
		`c-layout--${variant}`,
		has.nav && 'has-nav',
		has.aside && 'has-aside'
	]}
>
	{#if has.header}
		<header part="header" class="c-layout__header"><slot name="header" /></header>
	{/if}
	{#if has.nav}
		<nav part="nav" class="c-layout__nav" aria-label={label}><slot name="nav" /></nav>
	{/if}
	<main part="main" class="c-layout__main"><slot /></main>
	{#if has.aside}
		<aside part="aside" class="c-layout__aside"><slot name="aside" /></aside>
	{/if}
	{#if has.footer}
		<footer part="footer" class="c-layout__footer"><slot name="footer" /></footer>
	{/if}
</div>
