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

	/* The trigger is a RAISED secondary control; --_depth is its resting shadow, focus adds the halo. */
	button {
		--_depth: inset 0 1px 0 var(--amb-color-highlight), var(--amb-elevation-1);
		--_halo: 0 0 0
			calc(var(--amb-focus-ring-offset) + var(--amb-focus-ring-width) + var(--amb-focus-halo-width))
			var(--amb-color-focus-halo);

		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		gap: var(--amb-space-300);
		min-height: var(--amb-size-control-md);
		padding-inline: var(--amb-space-400);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-md);
		background: var(--amb-color-bg-surface);
		box-shadow: var(--_depth);
		color: inherit;
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

	/* A small chevron drawn from two borders; it flips with a spring when the list opens. */
	button::after {
		content: '';
		flex: none;
		width: var(--amb-space-200);
		height: var(--amb-space-200);
		border-right: var(--amb-border-width-strong) solid currentColor;
		border-bottom: var(--amb-border-width-strong) solid currentColor;
		translate: 0 -2px;
		rotate: 45deg;
		transition:
			translate var(--amb-duration-moderate) var(--amb-easing-spring),
			rotate var(--amb-duration-moderate) var(--amb-easing-spring);
	}

	:host([open]) button::after {
		translate: 0 2px;
		rotate: 225deg;
	}

	@media (hover: hover) {
		button:hover:not(:disabled) {
			--_depth: inset 0 1px 0 var(--amb-color-highlight), var(--amb-elevation-2);
			background: var(--amb-color-bg-subtle);
			border-color: var(--amb-color-border-strong);
			translate: 0 -1px;
		}
	}

	/* While the list is open the trigger stays pressed in. */
	:host([open]) button:not(:disabled) {
		--_depth: var(--amb-elevation-inset);
		background: var(--amb-color-bg-subtle);
		translate: 0 0;
	}

	button:active:not(:disabled) {
		--_depth: var(--amb-elevation-inset);
		background: var(--amb-color-bg-muted);
		translate: 0 0;
		scale: 0.98;
	}

	button:focus {
		outline: none;
	}

	button:focus-visible {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
		box-shadow: var(--_depth), var(--_halo);
	}

	button:disabled {
		--_depth: 0 0 0 0 transparent;
		background: var(--amb-color-bg-disabled);
		color: var(--amb-color-fg-disabled);
		border-color: transparent;
		translate: 0 0;
		scale: 1;
		cursor: not-allowed;
	}

	/* FLOATING SURFACE: large radius, elevation-2 and the top-edge highlight. It grows out of the
	   trigger's corner with a spring, and fades out with allow-discrete so the exit is seen too. */
	div {
		position: absolute;
		z-index: 2;
		top: calc(100% + var(--amb-space-200));
		left: 0;
		display: grid;
		gap: var(--amb-space-100);
		min-width: 12rem;
		padding: var(--amb-space-100);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-surface);
		box-shadow:
			inset 0 1px 0 var(--amb-color-highlight),
			var(--amb-elevation-2);
		transform-origin: top left;
		opacity: 1;
		translate: 0 0;
		scale: 1;
		transition:
			opacity var(--amb-duration-moderate) var(--amb-easing-enter),
			translate var(--amb-duration-moderate) var(--amb-easing-spring),
			scale var(--amb-duration-moderate) var(--amb-easing-spring),
			display var(--amb-duration-moderate) allow-discrete;
		transition-behavior: allow-discrete;
	}

	div[hidden] {
		display: none;
		opacity: 0;
		translate: 0 calc(var(--amb-space-100) * -1);
		scale: 0.96;
		transition:
			opacity var(--amb-duration-fast) var(--amb-easing-exit),
			translate var(--amb-duration-fast) var(--amb-easing-exit),
			scale var(--amb-duration-fast) var(--amb-easing-exit),
			display var(--amb-duration-fast) allow-discrete;
		transition-behavior: allow-discrete;
	}

	:host :global(::slotted(button)) {
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
		-webkit-tap-highlight-color: transparent;
		transition:
			background-color var(--amb-duration-fast) var(--amb-easing-standard),
			color var(--amb-duration-fast) var(--amb-easing-standard),
			box-shadow var(--amb-duration-fast) var(--amb-easing-standard);
	}

	/* Neutral tint on hover; the accent tint marks a checked or current item. */
	@media (hover: hover) {
		:host :global(::slotted(button:hover)) {
			background: var(--amb-color-bg-subtle);
			color: var(--amb-color-fg-default);
		}
	}

	:host :global(::slotted(button:active)) {
		background: var(--amb-color-bg-muted);
		color: var(--amb-color-fg-default);
	}

	:host :global(::slotted([aria-checked='true'])),
	:host :global(::slotted([aria-current]:not([aria-current='false']))) {
		background: color-mix(in oklab, var(--amb-color-accent-fg) 12%, var(--amb-color-bg-surface));
		color: var(--amb-color-accent-fg);
		font-weight: var(--amb-font-weight-semibold);
	}

	:host :global(::slotted(button:focus)) {
		outline: none;
	}

	:host :global(::slotted(button:focus-visible)) {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
		box-shadow: 0 0 0
			calc(var(--amb-focus-ring-offset) + var(--amb-focus-ring-width) + var(--amb-focus-halo-width))
			var(--amb-color-focus-halo);
	}

	@starting-style {
		div:not([hidden]) {
			opacity: 0;
			translate: 0 calc(var(--amb-space-100) * -1);
			scale: 0.96;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		button,
		button::after,
		div,
		div[hidden],
		:host :global(::slotted(button)) {
			transition: none;
		}

		button:hover:not(:disabled),
		button:active:not(:disabled),
		div,
		div[hidden] {
			translate: 0 0;
			scale: 1;
		}
	}

	@media (forced-colors: active) {
		button,
		div,
		:host :global(::slotted(button)) {
			border: var(--amb-border-width-default) solid ButtonText;
			background: Canvas;
			color: CanvasText;
			box-shadow: none;
		}

		:host :global(::slotted([aria-checked='true'])),
		:host :global(::slotted([aria-current]:not([aria-current='false']))) {
			background: Highlight;
			color: HighlightText;
		}
	}
</style>
