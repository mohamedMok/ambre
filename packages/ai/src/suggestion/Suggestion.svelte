<svelte:options
	customElement={{
		tag: 'amb-suggestion',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			disabled: { reflect: true, type: 'Boolean', attribute: 'disabled' }
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
	import { slotted } from '../../../ui/src/internal/slots';
	import styles from '../styles/components/suggestion.scss?inline';
</script>

<script lang="ts">
	interface Props {
		disabled?: boolean;
	}

	let { disabled = false }: Props = $props();
	const host = $host();
	const hasIcon = slotted(host, 'icon');
</script>

<button part="control" type="button" class="c-suggestion o-control o-control--sm" {disabled}>
	<span part="icon" class="c-suggestion__icon" aria-hidden="true">
		{#if hasIcon}
			<slot name="icon" />
		{:else}
			<svg class="c-suggestion__spark" viewBox="0 0 24 24" focusable="false">
				<path d="M12 3l1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9z" />
			</svg>
		{/if}
	</span>
	<span part="label" class="c-suggestion__label"><slot /></span>
</button>
