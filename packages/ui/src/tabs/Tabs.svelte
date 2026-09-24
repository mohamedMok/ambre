<svelte:options
	customElement={{
		tag: 'amb-tabs',
		shadow: { mode: 'open', delegatesFocus: true }
	}}
/>

<script lang="ts">
	import { untrack } from 'svelte';

	let tabs = $state<HTMLButtonElement[]>([]);
	let panels = $state<HTMLElement[]>([]);
	let selected = $state(0);
	const host = $host();

	function wire() {
		tabs.forEach((tab, index) => {
			const on = index === selected && !tab.disabled;
			tab.setAttribute('role', 'tab');
			tab.setAttribute('aria-selected', String(on));
			tab.tabIndex = on ? 0 : -1;
			if (!tab.id) tab.id = `amb-tab-${index}`;
			const panel = panels[index];
			if (panel) {
				if (!panel.id) panel.id = `amb-panel-${index}`;
				tab.setAttribute('aria-controls', panel.id);
				panel.setAttribute('role', 'tabpanel');
				panel.setAttribute('aria-labelledby', tab.id);
				panel.toggleAttribute('hidden', !on);
			}
			tab.onclick = () => {
				if (!tab.disabled) choose(index);
			};
		});
		panels.forEach((panel, index) => {
			if (index >= tabs.length) panel.toggleAttribute('hidden', true);
		});
	}

	function choose(index: number) {
		selected = index;
		wire();
		host.dispatchEvent(
			new CustomEvent('change', {
				bubbles: true,
				composed: true,
				detail: { index }
			})
		);
	}

	function enabled(from: number, step: number) {
		if (!tabs.length) return from;
		for (let hop = 1; hop <= tabs.length; hop += 1) {
			const index = (from + step * hop + tabs.length) % tabs.length;
			if (!tabs[index]?.disabled) return index;
		}
		return from;
	}

	function read(tabSlot: HTMLSlotElement | null, panelSlot: HTMLSlotElement | null) {
		tabs = [...(tabSlot?.assignedElements({ flatten: true }) ?? [])].filter(
			(node): node is HTMLButtonElement => node instanceof HTMLButtonElement
		);
		panels = [...(panelSlot?.assignedElements({ flatten: true }) ?? [])].filter(
			(node): node is HTMLElement => node instanceof HTMLElement
		);
		if (tabs[selected]?.disabled) selected = enabled(selected, 1);
		wire();
	}

	$effect(() => {
		const root = host.shadowRoot;
		const tabSlot = root?.querySelector('slot[name="tab"]') ?? null;
		const panelSlot = root?.querySelector('slot[name="panel"]') ?? null;
		// read() writes tabs, panels and selected; untrack keeps the effect from re-running on its own writes.
		const sync = () => untrack(() => read(tabSlot, panelSlot));
		sync();
		tabSlot?.addEventListener('slotchange', sync);
		panelSlot?.addEventListener('slotchange', sync);
		return () => {
			tabSlot?.removeEventListener('slotchange', sync);
			panelSlot?.removeEventListener('slotchange', sync);
		};
	});

	function onKeydown(event: KeyboardEvent) {
		const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
		if (current < 0) return;
		const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
		if (event.key === 'Home' || event.key === 'End' || step) {
			event.preventDefault();
			const next = event.key === 'Home' ? enabled(-1, 1) : event.key === 'End' ? enabled(0, -1) : enabled(current, step);
			choose(next);
			tabs[next]?.focus();
		}
	}
</script>

<!-- The selected tab is in the tab order. The tablist itself is not. -->
<!-- svelte-ignore a11y_interactive_supports_focus -->
<div part="list" role="tablist" aria-orientation="horizontal" onkeydown={onKeydown}>
	<slot name="tab" />
</div>
<slot name="panel" />

<style>
	:host {
		display: block;
		color: var(--amb-color-fg-default);
		font-family: var(--amb-font-family-sans);
		font-size: var(--amb-font-size-300);
		font-weight: var(--amb-font-weight-semibold);
		line-height: var(--amb-font-line-height-tight);
	}

	/* SUNKEN TRACK: the tab list is a well on the subtle fill; the selected tab rises out of it.
	   Outer radius = tab radius + track padding, so the corners stay concentric. */
	div {
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		gap: var(--amb-space-100);
		inline-size: fit-content;
		max-inline-size: 100%;
		padding: var(--amb-space-100);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-md);
		background: var(--amb-color-bg-subtle);
		box-shadow: var(--amb-elevation-inset);
	}

	/* Tab text is fg-default everywhere on the track (the checked pair on the subtle fill);
	   selection reads through the raised surface, not a dimmer label. */
	:host :global(::slotted(button)) {
		--_depth: 0 0 0 0 transparent;
		--_halo: 0 0 0
			calc(var(--amb-focus-ring-offset) + var(--amb-focus-ring-width) + var(--amb-focus-halo-width))
			var(--amb-color-focus-halo);

		box-sizing: border-box;
		min-height: var(--amb-size-control-md);
		margin: 0;
		padding-inline: var(--amb-space-400);
		border: var(--amb-border-width-default) solid transparent;
		border-radius: var(--amb-radius-sm);
		background: transparent;
		box-shadow: var(--_depth);
		color: var(--amb-color-fg-default);
		font: inherit;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		transition:
			background-color var(--amb-duration-fast) var(--amb-easing-standard),
			border-color var(--amb-duration-fast) var(--amb-easing-standard),
			box-shadow var(--amb-duration-fast) var(--amb-easing-standard),
			translate var(--amb-duration-moderate) var(--amb-easing-spring),
			scale var(--amb-duration-moderate) var(--amb-easing-spring);
	}

	@media (hover: hover) {
		:host :global(::slotted(button:hover:not(:disabled):not([aria-selected='true']))) {
			background: color-mix(in oklab, var(--amb-color-bg-surface) 55%, var(--amb-color-bg-subtle));
			border-color: var(--amb-color-border-default);
		}
	}

	/* RAISED segment: surface fill, top-edge highlight, elevation-1. */
	:host :global(::slotted([aria-selected='true'])) {
		--_depth: inset 0 1px 0 var(--amb-color-highlight), var(--amb-elevation-1);
		background: var(--amb-color-bg-surface);
		border-color: var(--amb-color-border-default);
		color: var(--amb-color-fg-default);
	}

	:host :global(::slotted(button:active:not(:disabled))) {
		scale: 0.98;
	}

	:host :global(::slotted(button:focus)) {
		outline: none;
	}

	:host :global(::slotted(button:focus-visible)) {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
		box-shadow: var(--_depth), var(--_halo);
	}

	/* A disabled tab sits on its own disabled fill, the checked pair for disabled text. */
	:host :global(::slotted(button:disabled)) {
		--_depth: 0 0 0 0 transparent;
		background: var(--amb-color-bg-disabled);
		border-color: transparent;
		color: var(--amb-color-fg-disabled);
		scale: 1;
		cursor: not-allowed;
	}

	:host :global(::slotted([role='tabpanel'])) {
		padding-block: var(--amb-space-400);
		font-weight: var(--amb-font-weight-regular);
		line-height: var(--amb-font-line-height-body);
	}

	@media (prefers-reduced-motion: reduce) {
		:host :global(::slotted(button)) {
			transition: none;
		}

		:host :global(::slotted(button:active:not(:disabled))) {
			scale: 1;
		}
	}

	/* Shadows and fills vanish in forced colors, so the selected tab takes the system highlight. */
	@media (forced-colors: active) {
		div {
			border: var(--amb-border-width-default) solid CanvasText;
			background: Canvas;
			box-shadow: none;
		}

		:host :global(::slotted(button)) {
			border: var(--amb-border-width-default) solid transparent;
			background: ButtonFace;
			box-shadow: none;
			color: ButtonText;
		}

		:host :global(::slotted([aria-selected='true'])) {
			border-color: Highlight;
			background: Highlight;
			color: HighlightText;
		}

		:host :global(::slotted(button:disabled)) {
			color: GrayText;
		}
	}
</style>
