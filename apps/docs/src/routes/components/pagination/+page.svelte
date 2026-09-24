<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	const perPage = 4;
	const total = 18;
	const pages = Math.ceil(total / perPage);
	const customers = ['Maya Chen', 'Tomás Rivera', 'Ines Laurent', 'Sam Okafor', 'Lena Ortiz', 'Arjun Mehta'];
	const orders = Array.from({ length: total }, (_, i) => ({
		id: `#${4821 - i}`,
		customer: customers[i % customers.length],
		total: `€${(24 + ((i * 37) % 180)).toFixed(2)}`
	}));

	let current = $state(1);
	const first = $derived((current - 1) * perPage);
	const visible = $derived(orders.slice(first, first + perPage));
	const range = $derived(`${first + 1}–${Math.min(first + perPage, total)} of ${total}`);

	function go(page: number) {
		current = Math.min(pages, Math.max(1, page));
	}
</script>

<ComponentPage
	id="pagination"
	heroCode={`<amb-pagination label="Search results pages">
  <li><a href="?page=1">Previous</a></li>
  <li><a href="?page=1">1</a></li>
  <li><a href="?page=2" aria-current="page">2</a></li>
  <li><a href="?page=3">3</a></li>
  <li><a href="?page=4">4</a></li>
  <li><a href="?page=3">Next</a></li>
</amb-pagination>`}
	usage={{
		do: [
			'Use links when each page has its own address, so people can share it and the back button works.',
			'Set <code>aria-current="page"</code> on the current page, and keep <strong>Previous</strong> and <strong>Next</strong> at the ends.',
			'Name the navigation with <code>label</code>, such as <strong>Search results pages</strong>, when the page has another navigation landmark.'
		],
		dont: [
			'Don’t use pagination for a few peer views of the same object. Use tabs.',
			'Don’t hide the current page number. People use it to find their place again.',
			'Don’t move focus to the top of the page after an in-page change. Update the list and say what changed.'
		]
	}}
>
	{#snippet hero()}
		<amb-pagination label="Search results pages">
			<li><a href="?page=1">Previous</a></li>
			<li><a href="?page=1">1</a></li>
			<li><a href="?page=2" aria-current="page">2</a></li>
			<li><a href="?page=3">3</a></li>
			<li><a href="?page=4">4</a></li>
			<li><a href="?page=3">Next</a></li>
		</amb-pagination>
	{/snippet}

	<h2 id="below-a-list">Below a list</h2>
	<p>
		When the list changes in place, use buttons instead of links. Show the range above the list, and announce
		it when the page changes. At the first and the last page, disable the button that has nowhere to go.
	</p>
	<Stage
		align="stretch"
		code={`<p aria-live="polite">Showing 1–4 of 18 orders</p>
<ul>…</ul>
<amb-pagination label="Order pages">
  <li><button type="button" disabled>Previous</button></li>
  <li><button type="button" aria-current="page">1</button></li>
  <li><button type="button">2</button></li>
  <li><button type="button">3</button></li>
  <li><button type="button">4</button></li>
  <li><button type="button">5</button></li>
  <li><button type="button">Next</button></li>
</amb-pagination>`}
	>
		<section class="panel" aria-labelledby="orders-title">
			<div class="panel-head">
				<h3 class="panel-title" id="orders-title">Orders</h3>
				<p class="panel-range" aria-live="polite">Showing {range} orders</p>
			</div>
			<ul class="orders">
				{#each visible as order (order.id)}
					<li>
						<span class="order-id">{order.id}</span>
						<span class="order-customer">{order.customer}</span>
						<span class="order-total">{order.total}</span>
					</li>
				{/each}
			</ul>
			<amb-pagination label="Order pages">
				<li>
					<button class="page-button" type="button" disabled={current === 1} onclick={() => go(current - 1)}>Previous</button>
				</li>
				{#each Array.from({ length: pages }, (_, i) => i + 1) as page (page)}
					<li>
						<button
							class="page-button"
							type="button"
							aria-current={page === current ? 'page' : undefined}
							onclick={() => go(page)}
						>
							{page}
						</button>
					</li>
				{/each}
				<li>
					<button class="page-button" type="button" disabled={current === pages} onclick={() => go(current + 1)}>Next</button>
				</li>
			</amb-pagination>
		</section>
	</Stage>

	<h2 id="long-ranges">Long ranges</h2>
	<p>
		With many pages, keep the first, the last, and the pages next to the current one. Put an ellipsis in the gaps
		as plain text, so it is not a control.
	</p>
	<Stage
		code={`<amb-pagination label="Article pages">
  <li><a href="?page=6">Previous</a></li>
  <li><a href="?page=1">1</a></li>
  <li aria-hidden="true">…</li>
  <li><a href="?page=6">6</a></li>
  <li><a href="?page=7" aria-current="page">7</a></li>
  <li><a href="?page=8">8</a></li>
  <li aria-hidden="true">…</li>
  <li><a href="?page=24">24</a></li>
  <li><a href="?page=8">Next</a></li>
</amb-pagination>`}
	>
		<amb-pagination label="Article pages">
			<li><a href="?page=6">Previous</a></li>
			<li><a href="?page=1">1</a></li>
			<li aria-hidden="true">…</li>
			<li><a href="?page=6">6</a></li>
			<li><a href="?page=7" aria-current="page">7</a></li>
			<li><a href="?page=8">8</a></li>
			<li aria-hidden="true">…</li>
			<li><a href="?page=24">24</a></li>
			<li><a href="?page=8">Next</a></li>
		</amb-pagination>
	</Stage>
</ComponentPage>

<style>
	.panel {
		display: grid;
		gap: var(--amb-space-400);
		padding: var(--amb-space-500);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-surface);
	}

	.panel-head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--amb-space-200);
	}

	.panel-title {
		margin: 0;
		color: var(--amb-color-fg-default);
		font-size: var(--amb-font-size-500);
		font-weight: var(--amb-font-weight-semibold);
		line-height: var(--amb-font-line-height-tight);
	}

	.panel-range {
		margin: 0;
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
		font-variant-numeric: tabular-nums;
	}

	.orders {
		display: grid;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.orders li {
		display: grid;
		grid-template-columns: 4rem minmax(0, 1fr) auto;
		gap: var(--amb-space-400);
		margin: 0;
		padding: var(--amb-space-300) 0;
		color: var(--amb-color-fg-default);
		font-size: var(--amb-font-size-200);
	}

	.orders li + li {
		border-top: var(--amb-border-width-default) solid var(--amb-color-bg-muted);
	}

	.order-id {
		color: var(--amb-color-fg-subtle);
		font-family: var(--amb-font-family-mono);
	}

	.order-total {
		font-variant-numeric: tabular-nums;
	}

	/* The element styles each list item. A native button inside it keeps no chrome of its own. */
	.page-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-block-size: var(--amb-size-control-md);
		min-inline-size: var(--amb-size-control-md);
		margin-inline: calc(var(--amb-space-200) * -1);
		padding: 0 var(--amb-space-200);
		border: 0;
		background: none;
		color: inherit;
		font: inherit;
		cursor: pointer;
	}

	.page-button:disabled {
		color: var(--amb-color-fg-disabled);
		cursor: not-allowed;
	}
</style>
