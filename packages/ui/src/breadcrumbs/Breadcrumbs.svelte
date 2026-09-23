<svelte:options
	customElement={{
		tag: 'amb-breadcrumbs',
		shadow: { mode: 'open' }
	}}
/>

<script lang="ts">
	const host = $host();

	function mark() {
		const slotEl = host.shadowRoot?.querySelector('slot');
		const items = [...(slotEl?.assignedElements() ?? [])].filter(
			(node): node is HTMLLIElement => node instanceof HTMLLIElement
		);
		items.forEach((item, index) => {
			item.querySelector('[data-amb-sep]')?.remove();
			if (index === items.length - 1) item.setAttribute('aria-current', 'page');
			else {
				item.removeAttribute('aria-current');
				const sep = document.createElement('span');
				sep.dataset.ambSep = '';
				sep.setAttribute('aria-hidden', 'true');
				sep.textContent = '/';
				sep.style.marginInlineStart = 'var(--amb-space-200)';
				sep.style.color = 'var(--amb-color-fg-muted)';
				item.append(sep);
			}
		});
	}

	$effect(() => {
		const slotEl = host.shadowRoot?.querySelector('slot');
		mark();
		slotEl?.addEventListener('slotchange', mark);
		return () => slotEl?.removeEventListener('slotchange', mark);
	});
</script>

<nav aria-label="Breadcrumbs">
	<ol part="list"><slot /></ol>
</nav>

<style>
	:host {
		display: block;
		font-family: var(--amb-font-family-sans);
		font-size: var(--amb-font-size-200);
		line-height: var(--amb-font-line-height-body);
		color: var(--amb-color-fg-muted);
	}

	ol {
		display: flex;
		flex-wrap: wrap;
		gap: var(--amb-space-200);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	:host ::slotted(li) {
		display: inline-flex;
		align-items: center;
	}
</style>
