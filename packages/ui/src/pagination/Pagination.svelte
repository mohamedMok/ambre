<svelte:options
	customElement={{
		tag: 'amb-pagination',
		shadow: { mode: 'open' },
		props: {
			label: { reflect: true, type: 'String', attribute: 'label' }
		}
	}}
/>

<script lang="ts">
	interface Props {
		label?: string;
	}

	let { label = 'Pagination' }: Props = $props();
	const host = $host();

	/* aria-current may sit on the li or on the link inside it. Shadow CSS can only reach the li,
	   so mirror the current page onto it as a styling hook. */
	function mark() {
		const slotEl = host.shadowRoot?.querySelector('slot');
		for (const node of slotEl?.assignedElements() ?? []) {
			if (!(node instanceof HTMLLIElement)) continue;
			const current =
				node.getAttribute('aria-current') === 'page' || !!node.querySelector('[aria-current="page"]');
			node.toggleAttribute('data-amb-current', current);
		}
	}

	$effect(() => {
		const slotEl = host.shadowRoot?.querySelector('slot');
		mark();
		slotEl?.addEventListener('slotchange', mark);
		const observer = new MutationObserver(mark);
		observer.observe(host, { subtree: true, attributes: true, attributeFilter: ['aria-current'] });
		return () => {
			slotEl?.removeEventListener('slotchange', mark);
			observer.disconnect();
		};
	});
</script>

<nav aria-label={label}>
	<ol part="list"><slot /></ol>
</nav>

<style>
	:host {
		display: block;
		font-family: var(--amb-font-family-sans);
		font-size: var(--amb-font-size-300);
		line-height: var(--amb-font-line-height-body);
		color: var(--amb-color-fg-default);
	}

	ol {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--amb-space-200);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* Each page is a quiet button: no chrome at rest, a soft fill under the pointer,
	   a springy press. The current page rises off the row as a RAISED control. */
	:host :global(::slotted(li)) {
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-inline-size: var(--amb-size-control-md);
		min-block-size: var(--amb-size-control-md);
		padding-inline: var(--amb-space-200);
		border: var(--amb-border-width-default) solid transparent;
		border-radius: var(--amb-radius-action);
		background: transparent;
		font-variant-numeric: tabular-nums;
		transition:
			background-color var(--amb-duration-fast) var(--amb-easing-standard),
			border-color var(--amb-duration-fast) var(--amb-easing-standard),
			box-shadow var(--amb-duration-fast) var(--amb-easing-standard),
			translate var(--amb-duration-moderate) var(--amb-easing-spring),
			scale var(--amb-duration-moderate) var(--amb-easing-spring);
	}

	@media (hover: hover) {
		:host :global(::slotted(li:not([data-amb-current]):hover)) {
			background: var(--amb-color-bg-subtle);
		}
	}

	:host :global(::slotted(li:not([data-amb-current]):active)) {
		background: var(--amb-color-bg-muted);
		scale: 0.96;
	}

	:host :global(::slotted(li[data-amb-current])) {
		border-color: var(--amb-color-border-default);
		background: var(--amb-color-bg-surface);
		box-shadow:
			inset 0 1px 0 var(--amb-color-highlight),
			var(--amb-elevation-1);
		color: var(--amb-color-fg-default);
		font-weight: var(--amb-font-weight-semibold);
	}

	@media (prefers-reduced-motion: reduce) {
		:host :global(::slotted(li)) {
			transition: none;
		}

		:host :global(::slotted(li:not([data-amb-current]):active)) {
			scale: 1;
		}
	}

	@media (forced-colors: active) {
		:host :global(::slotted(li[data-amb-current])) {
			border-color: CanvasText;
			background: Canvas;
			color: CanvasText;
		}
	}
</style>
