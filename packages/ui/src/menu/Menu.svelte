<svelte:options
	customElement={{
		tag: 'amb-menu',
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
	import { emit } from '../internal/events';
	import styles from '../styles/components/menu.scss?inline';
</script>

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
		emit(host, 'toggle', { open: next });
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
		const item = actions().find((action) => path.includes(action));
		if (!item) return;
		setOpen(false);
		// One listener on the menu instead of one per item.
		emit(host, 'select', { item, value: item.value || item.textContent?.trim() || '' });
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

<div class={['c-menu', open && 'is-open']}>
	<button
		bind:this={trigger}
		id={triggerId}
		part="control"
		type="button"
		class="c-menu__trigger"
		aria-haspopup="menu"
		aria-expanded={open}
		aria-controls={panelId}
		{disabled}
		onclick={() => setOpen(!open)}
	>
		<slot />
	</button>
	<div
		id={panelId}
		part="panel"
		role="menu"
		class="c-menu__panel"
		aria-labelledby={triggerId}
		hidden={!open}
	>
		<slot name="panel" />
	</div>
</div>
