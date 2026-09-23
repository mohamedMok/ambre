<svelte:options
	customElement={{
		tag: 'amb-tabs',
		shadow: { mode: 'open', delegatesFocus: true }
	}}
/>

<script lang="ts">
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
		const sync = () => read(tabSlot, panelSlot);
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

	div {
		display: flex;
		flex-wrap: wrap;
		gap: var(--amb-space-100);
		border-bottom: var(--amb-border-width-default) solid var(--amb-color-border-default);
	}

	:host ::slotted(button) {
		box-sizing: border-box;
		min-height: var(--amb-size-control-md);
		margin: 0;
		padding-inline: var(--amb-space-400);
		border: 0;
		border-bottom: var(--amb-border-width-strong) solid transparent;
		background: transparent;
		color: var(--amb-color-fg-muted);
		font: inherit;
		cursor: pointer;
	}

	:host ::slotted(button:hover:not(:disabled)) {
		color: var(--amb-color-fg-default);
	}

	:host ::slotted([aria-selected='true']) {
		color: var(--amb-color-fg-default);
		border-bottom-color: var(--amb-color-accent-bg);
	}

	:host ::slotted(button:focus) {
		outline: none;
	}

	:host ::slotted(button:focus-visible) {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
	}

	:host ::slotted(button:disabled) {
		color: var(--amb-color-fg-disabled);
		cursor: not-allowed;
	}

	:host ::slotted([role='tabpanel']) {
		padding-block: var(--amb-space-400);
		font-weight: var(--amb-font-weight-regular);
		line-height: var(--amb-font-line-height-body);
	}
</style>
