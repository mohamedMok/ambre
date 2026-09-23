<svelte:options
	customElement={{
		tag: 'amb-tooltip',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			text: { reflect: true, type: 'String', attribute: 'text' }
		}
	}}
/>

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
<span class="wrap" onmouseenter={show} onmouseleave={hide} onfocusin={show} onfocusout={hide} onkeydown={onKeydown}>
	<slot />
	<span part="tip" role="tooltip" data-placement={placement} hidden={!open}>{text}</span>
</span>

<style>
	:host {
		display: inline-block;
		position: relative;
		font-family: var(--amb-font-family-sans);
	}

	.wrap {
		display: inline-block;
	}

	span[part='tip'] {
		position: absolute;
		z-index: 1;
		left: 50%;
		translate: -50% 0;
		max-width: 16rem;
		padding: var(--amb-space-200) var(--amb-space-300);
		border-radius: var(--amb-radius-sm);
		background: var(--amb-color-accent-bg);
		color: var(--amb-color-fg-on-accent);
		font-size: var(--amb-font-size-200);
		line-height: var(--amb-font-line-height-body);
		box-shadow: var(--amb-elevation-2);
		animation: amb-arrive var(--amb-duration-fast) var(--amb-easing-enter) both;
	}

	span[part='tip'][data-placement='top'] {
		bottom: calc(100% + var(--amb-space-200));
	}

	span[part='tip'][data-placement='bottom'] {
		top: calc(100% + var(--amb-space-200));
	}

	span[hidden] {
		display: none;
	}

	@keyframes amb-arrive {
		from {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		span[part='tip'] {
			animation: none;
		}
	}

	@media (forced-colors: active) {
		span[part='tip'] {
			border: var(--amb-border-width-default) solid CanvasText;
			background: Canvas;
			color: CanvasText;
		}
	}
</style>
