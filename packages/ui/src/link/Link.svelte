<svelte:options
	customElement={{
		tag: 'amb-link',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			href: { reflect: true, type: 'String', attribute: 'href' },
			variant: { reflect: true, type: 'String', attribute: 'variant' },
			external: { reflect: true, type: 'Boolean', attribute: 'external' }
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
	import styles from '../styles/components/link.scss?inline';
</script>

<script lang="ts">
	interface Props {
		href?: string;
		variant?: 'text' | 'quiet';
		external?: boolean;
	}

	let { href = '', variant = 'text', external = false }: Props = $props();
</script>

<a
	part="control"
	class={['c-link', variant !== 'text' && `c-link--${variant}`]}
	href={href || undefined}
	target={external ? '_blank' : undefined}
	rel={external ? 'noreferrer' : undefined}
>
	<slot />
</a>
