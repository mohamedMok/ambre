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
</style>
