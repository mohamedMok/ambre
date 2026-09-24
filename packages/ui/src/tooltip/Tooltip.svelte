<svelte:options
	customElement={{
		tag: 'amb-tooltip',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			text: { reflect: true, type: 'String', attribute: 'text' }
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
	import styles from '../styles/components/tooltip.scss?inline';
</script>

<script lang="ts">
	interface Props {
		text?: string;
	}

	let { text = '' }: Props = $props();
	let open = $state(false);
	let placement = $state<'top' | 'bottom'>('top');
	let trigger = $state<HTMLElement>();
	const host = $host();

	function place() {
		const rect = host.getBoundingClientRect();
		const above = rect.top;
		const below = window.innerHeight - rect.bottom;
		placement = below > above ? 'bottom' : 'top';
	}

	function describe() {
		if (!trigger) return;
		if (open && text) trigger.setAttribute('aria-description', text);
		else trigger.removeAttribute('aria-description');
	}

	function show() {
		place();
		open = true;
		describe();
	}

	function hide() {
		open = false;
		describe();
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') hide();
	}

	function onSlot() {
		const slotEl = host.shadowRoot?.querySelector('slot');
		const assigned = slotEl?.assignedElements({ flatten: true })[0];
		trigger = assigned instanceof HTMLElement ? assigned : undefined;
		describe();
	}

	$effect(() => {
		text;
		open;
		const slotEl = host.shadowRoot?.querySelector('slot');
		onSlot();
		slotEl?.addEventListener('slotchange', onSlot);
		return () => slotEl?.removeEventListener('slotchange', onSlot);
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
	class={['c-tooltip', `c-tooltip--${placement}`]}
	onmouseenter={show}
	onmouseleave={hide}
	onfocusin={show}
	onfocusout={hide}
	onkeydown={onKeydown}
>
	<slot />
	<span part="tip" role="tooltip" class="c-tooltip__tip" data-placement={placement} hidden={!open}>{text}</span>
</span>
