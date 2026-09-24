<svelte:options
	customElement={{
		tag: 'amb-icon',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			name: { reflect: true, type: 'String', attribute: 'name' },
			size: { reflect: true, type: 'String', attribute: 'size' },
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
	import styles from '../styles/components/icon.scss?inline';
</script>

<script lang="ts">
	interface Props {
		name?: string;
		size?: 'sm' | 'md' | 'lg';
		label?: string;
	}

	let { name = '', size = 'md', label = '' }: Props = $props();
</script>

<span
	part="graphic"
	class={['c-icon', size !== 'md' && `c-icon--${size}`]}
	role={label ? 'img' : undefined}
	aria-label={label || undefined}
	aria-hidden={label ? undefined : 'true'}
>
	{#if name}
		<span class="c-icon__symbol" aria-hidden="true">{name}</span>
	{:else}
		<slot />
	{/if}
</span>
