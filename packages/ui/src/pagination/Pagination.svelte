<svelte:options
	customElement={{
		tag: 'amb-pagination',
		shadow: { mode: 'open' },
		props: {
			label: { reflect: true, type: 'String', attribute: 'label' }
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
	import styles from '../styles/components/pagination.scss?inline';
</script>

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

<nav class="c-pagination" aria-label={label}>
	<ol part="list" class="c-pagination__list"><slot /></ol>
</nav>
