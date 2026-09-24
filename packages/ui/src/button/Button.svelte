<svelte:options
	customElement={{
		tag: 'amb-button',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			variant: { reflect: true, type: 'String', attribute: 'variant' },
			size: { reflect: true, type: 'String', attribute: 'size' },
			disabled: { reflect: true, type: 'Boolean', attribute: 'disabled' },
			type: { reflect: true, type: 'String', attribute: 'type' }
		},
		extend: (Base) => {
			return class extends Base {
				static formAssociated = true;

				constructor() {
					super();
					this.attachedInternals = this.attachInternals();
					adopt(this.shadowRoot, styles);
				}
			};
		}
	}}
/>

<script module lang="ts">
	import { adopt } from '../styles/adopt';
	import styles from '../styles/components/button.scss?inline';
</script>

<script lang="ts">
	interface Props {
		variant?: 'primary' | 'secondary' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		attachedInternals?: ElementInternals;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		type = 'button',
		attachedInternals,
	}: Props = $props();

	function onClick() {
		const form = attachedInternals?.form;
		if (disabled || !form) return;
		if (type === 'submit') form.requestSubmit();
		if (type === 'reset') form.reset();
	}
</script>

<button
	part="control"
	type="button"
	class={[
		'o-control',
		size !== 'md' && `o-control--${size}`,
		'c-button',
		variant !== 'primary' && `c-button--${variant}`
	]}
	{disabled}
	onclick={onClick}
>
	<slot />
</button>
