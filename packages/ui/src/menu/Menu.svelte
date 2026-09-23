<svelte:options
	customElement={{
		tag: 'amb-menu',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			open: { reflect: true, type: 'Boolean', attribute: 'open' },
			disabled: { reflect: true, type: 'Boolean', attribute: 'disabled' }
		}
	}}
/>

<script lang="ts">
	interface Props {
		open?: boolean;
		disabled?: boolean;
	}

	let { open = false, disabled = false }: Props = $props();
	let trigger = $state<HTMLButtonElement>();
	const host = $host();
	const triggerId = `amb-menu-${Math.random().toString(36).slice(2, 8)}`;
	const panelId = `${triggerId}-panel`;

	function setOpen(next: boolean) {
		if (disabled) return;
		host.open = next;
		markItems(next);
		host.dispatchEvent(
			new CustomEvent('toggle', {
				bubbles: true,
				composed: true,
				detail: { open: next }
			})
		);
	}

	function actions() {
		return [...host.querySelectorAll('button')].filter(
			(node) => node instanceof HTMLButtonElement && node !== trigger && !node.disabled
		);
	}

	function markItems(shown: boolean) {
		for (const button of actions()) {
			button.setAttribute('role', 'menuitem');
			if (!shown) button.tabIndex = -1;
		}
	}

	function focusAction(index: number) {
		const list = actions();
		if (!list.length) return;
		const next = ((index % list.length) + list.length) % list.length;
		list.forEach((button, i) => {
			button.tabIndex = i === next ? 0 : -1;
		});
		list[next].focus();
	}

	function onKeydown(event: KeyboardEvent) {
		const list = actions();
		const current = list.indexOf(document.activeElement as HTMLButtonElement);
		if (event.key === 'Tab' && open) {
			setOpen(false);
			return;
		}
		if (event.key === 'Escape' && open) {
			event.preventDefault();
			setOpen(false);
			trigger?.focus();
			return;
		}
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (!open) {
				setOpen(true);
				queueMicrotask(() => focusAction(0));
				return;
			}
			focusAction(current + 1);
		}
		if (event.key === 'ArrowUp' && open && list.length) {
			event.preventDefault();
			focusAction(current <= 0 ? list.length - 1 : current - 1);
		}
		if (event.key === 'Home' && open) {
			event.preventDefault();
			focusAction(0);
		}
		if (event.key === 'End' && open) {
			event.preventDefault();
			focusAction(list.length - 1);
		}
	}

	function onPointer(event: PointerEvent) {
		if (!open) return;
		if (!event.composedPath().includes(host)) setOpen(false);
	}

	function onClick(event: MouseEvent) {
		if (!open) return;
		const path = event.composedPath();
		if (trigger && path.includes(trigger)) return;
		if (actions().some((action) => path.includes(action))) setOpen(false);
	}

	$effect(() => {
		markItems(open);
		const panelSlot = host.shadowRoot?.querySelector('slot[name="panel"]');
		const sync = () => markItems(open);
		panelSlot?.addEventListener('slotchange', sync);
		host.addEventListener('keydown', onKeydown);
		host.addEventListener('click', onClick);
		document.addEventListener('pointerdown', onPointer);
		return () => {
			panelSlot?.removeEventListener('slotchange', sync);
			host.removeEventListener('keydown', onKeydown);
			host.removeEventListener('click', onClick);
			document.removeEventListener('pointerdown', onPointer);
		};
	});
</script>

<button
	bind:this={trigger}
	id={triggerId}
	part="control"
	type="button"
	aria-haspopup="menu"
	aria-expanded={open}
	aria-controls={panelId}
	{disabled}
	onclick={() => setOpen(!open)}
>
	<slot />
</button>
<div id={panelId} part="panel" role="menu" aria-labelledby={triggerId} hidden={!open}>
	<slot name="panel" />
</div>

<style>
	:host {
		position: relative;
		display: inline-block;
		color: var(--amb-color-fg-default);
		font-family: var(--amb-font-family-sans);
		font-size: var(--amb-font-size-300);
		font-weight: var(--amb-font-weight-semibold);
		line-height: var(--amb-font-line-height-tight);
	}

	button {
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		min-height: var(--amb-size-control-md);
		padding-inline: var(--amb-space-400);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-md);
		background: var(--amb-color-bg-surface);
		color: inherit;
		font: inherit;
		cursor: pointer;
	}

	button:hover:not(:disabled) {
		background: var(--amb-color-bg-subtle);
	}

	button:focus {
		outline: none;
	}

	button:focus-visible {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
	}

	button:disabled {
		background: var(--amb-color-bg-disabled);
		color: var(--amb-color-fg-disabled);
		cursor: not-allowed;
	}

	div {
		position: absolute;
		z-index: 2;
		top: calc(100% + var(--amb-space-100));
		left: 0;
		display: grid;
		min-width: 12rem;
		padding: var(--amb-space-100);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-md);
		background: var(--amb-color-bg-surface);
		box-shadow: var(--amb-elevation-2);
		animation: amb-arrive var(--amb-duration-fast) var(--amb-easing-enter) both;
	}

	div[hidden] {
		display: none;
	}

	:host ::slotted(button) {
		box-sizing: border-box;
		min-height: var(--amb-size-control-md);
		padding-inline: var(--amb-space-300);
		border: 0;
		border-radius: var(--amb-radius-md);
		background: transparent;
		color: inherit;
		font: inherit;
		font-weight: var(--amb-font-weight-regular);
		line-height: var(--amb-font-line-height-body);
		text-align: start;
		cursor: pointer;
	}

	:host ::slotted(button:hover) {
		background: var(--amb-color-bg-subtle);
	}

	:host ::slotted(button:focus) {
		outline: none;
	}

	:host ::slotted(button:focus-visible) {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
	}

	@keyframes amb-arrive {
		from {
			opacity: 0;
			translate: 0 calc(var(--amb-space-100) * -1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		div {
			animation: none;
		}
	}

	@media (forced-colors: active) {
		button,
		div,
		:host ::slotted(button) {
			border: var(--amb-border-width-default) solid ButtonText;
			background: Canvas;
			color: CanvasText;
		}
	}
</style>
