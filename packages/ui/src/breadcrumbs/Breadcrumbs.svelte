<svelte:options
	customElement={{
		tag: 'amb-breadcrumbs',
		shadow: { mode: 'open' },
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
	import styles from '../styles/components/breadcrumbs.scss?inline';
</script>

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

<nav class="c-breadcrumbs" aria-label="Breadcrumbs">
	<ol part="list" class="c-breadcrumbs__list"><slot /></ol>
</nav>
