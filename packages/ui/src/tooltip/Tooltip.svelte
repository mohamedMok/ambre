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

	/* An inverse floating chip. It sizes to its text (so it never collapses to one word per line
	   inside the narrow host) and wraps only past 16rem. --_rise is the small approach distance. */
	span[part='tip'] {
		--_rise: var(--amb-space-100);

		box-sizing: border-box;
		position: absolute;
		z-index: 1;
		left: 50%;
		display: block;
		width: max-content;
		max-inline-size: 16rem;
		padding: var(--amb-space-200) var(--amb-space-300);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-inverse);
		color: var(--amb-color-fg-inverse);
		font-size: var(--amb-font-size-200);
		font-weight: var(--amb-font-weight-regular);
		line-height: var(--amb-font-line-height-body);
		text-align: start;
		text-wrap: pretty;
		white-space: normal;
		overflow-wrap: break-word;
		box-shadow:
			inset 0 1px 0 var(--amb-color-highlight),
			var(--amb-elevation-2);
		opacity: 1;
		translate: -50% 0;
		scale: 1;
		transition:
			opacity var(--amb-duration-moderate) var(--amb-easing-enter),
			translate var(--amb-duration-moderate) var(--amb-easing-spring),
			scale var(--amb-duration-moderate) var(--amb-easing-spring),
			display var(--amb-duration-moderate) allow-discrete;
	}

	span[part='tip'][data-placement='top'] {
		bottom: calc(100% + var(--amb-space-200));
		transform-origin: bottom center;
	}

	span[part='tip'][data-placement='bottom'] {
		top: calc(100% + var(--amb-space-200));
		transform-origin: top center;
		--_rise: calc(var(--amb-space-100) * -1);
	}

	span[hidden] {
		display: none;
	}

	span[part='tip'][hidden] {
		opacity: 0;
		scale: 0.96;
		transition:
			opacity var(--amb-duration-fast) var(--amb-easing-exit),
			scale var(--amb-duration-fast) var(--amb-easing-exit),
			display var(--amb-duration-fast) allow-discrete;
	}

	/* Arrival: the chip rises toward the control from its placement side and springs to size. */
	@starting-style {
		span[part='tip']:not([hidden]) {
			opacity: 0;
			translate: -50% var(--_rise);
			scale: 0.96;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		span[part='tip'],
		span[part='tip'][hidden] {
			transition: none;
			translate: -50% 0;
			scale: 1;
		}
	}

	@media (forced-colors: active) {
		span[part='tip'] {
			border: var(--amb-border-width-default) solid CanvasText;
			background: Canvas;
			color: CanvasText;
			box-shadow: none;
		}
	}
</style>
