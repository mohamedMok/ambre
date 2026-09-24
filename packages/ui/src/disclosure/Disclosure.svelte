<svelte:options
	customElement={{
		tag: 'amb-disclosure',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			open: { reflect: true, type: 'Boolean', attribute: 'open' },
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
	import { adopt } from '../styles/adopt';
	import styles from '../styles/components/disclosure.scss?inline';
</script>

<script lang="ts">
	interface Props {
		open?: boolean;
		disabled?: boolean;
	}

	let { open = false, disabled = false }: Props = $props();
	const host = $host();

	function toggle() {
		if (disabled) return;
		const next = !open;
		host.open = next;
		host.dispatchEvent(
			new CustomEvent('toggle', {
				bubbles: true,
				composed: true,
				detail: { open: next }
			})
		);
	}
</script>

<div class={['c-disclosure', open && 'is-open']}>
	<button
		part="control"
		type="button"
		class="c-disclosure__trigger"
		aria-expanded={open}
		aria-controls="panel"
		{disabled}
		onclick={toggle}
	>
		<slot />
	</button>
	<div id="panel" part="panel" class="c-disclosure__panel" hidden={!open}>
		<slot name="panel" />
	</div>
</div>
