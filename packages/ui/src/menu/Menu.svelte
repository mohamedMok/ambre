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

	function setOpen(next: boolean) {
		if (disabled) return;
		host.open = next;
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

	function onKeydown(event: KeyboardEvent) {
		const list = actions();
		const current = list.indexOf(document.activeElement as HTMLButtonElement);
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
				queueMicrotask(() => actions()[0]?.focus());
				return;
			}
			list[(current + 1) % list.length]?.focus();
		}
		if (event.key === 'ArrowUp' && open && list.length) {
			event.preventDefault();
			list[(current <= 0 ? list.length : current) - 1]?.focus();
		}
		if (event.key === 'Home' && open) {
			event.preventDefault();
			list[0]?.focus();
		}
		if (event.key === 'End' && open) {
			event.preventDefault();
			list[list.length - 1]?.focus();
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
		host.addEventListener('keydown', onKeydown);
		host.addEventListener('click', onClick);
		document.addEventListener('pointerdown', onPointer);
		return () => {
			host.removeEventListener('keydown', onKeydown);
			host.removeEventListener('click', onClick);
			document.removeEventListener('pointerdown', onPointer);
		};
	});
</script>

<button
	bind:this={trigger}
	part="control"
	type="button"
	aria-expanded={open}
	aria-controls="panel"
	{disabled}
	onclick={() => setOpen(!open)}
>
	<slot />
</button>
<div id="panel" part="panel" hidden={!open}>
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
