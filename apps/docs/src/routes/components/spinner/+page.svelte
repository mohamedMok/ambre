<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	const orders = [
		{ id: '#4821', customer: 'Maya Chen', total: '€86.00' },
		{ id: '#4820', customer: 'Tomás Rivera', total: '€212.50' },
		{ id: '#4819', customer: 'Ines Laurent', total: '€39.90' }
	];

	let loading = $state(false);
	let reloadButton = $state<HTMLElement>();

	$effect(() => {
		const el = reloadButton;
		if (!el) return;
		const reload = () => {
			if (loading) return;
			loading = true;
		};
		el.addEventListener('click', reload);
		return () => el.removeEventListener('click', reload);
	});

	$effect(() => {
		if (!loading) return;
		const timer = setTimeout(() => (loading = false), 1600);
		return () => clearTimeout(timer);
	});
</script>

<ComponentPage
	id="spinner"
	heroCode={`<amb-spinner label="Loading orders"></amb-spinner>`}
	usage={{
		do: [
			'Name the wait in <code>label</code>, such as <strong>Loading orders</strong>. The default, <strong>Loading</strong>, says nothing about what is coming.',
			'Put the spinner where the content will appear, and mark that region <code>aria-busy="true"</code> while it waits.',
			'Remove the spinner as soon as the content arrives, and show a message if the load fails.'
		],
		dont: [
			'Don’t use a spinner for a task you can measure, such as an upload. Use progress.',
			'Don’t show a spinner for a wait under about a second. It flashes and reads as a glitch.',
			'Don’t cover the whole page with a spinner when only one region is loading.'
		]
	}}
>
	{#snippet hero()}
		<amb-spinner label="Loading orders"></amb-spinner>
	{/snippet}

	<h2 id="in-a-region">In a region</h2>
	<p>
		The spinner takes the place of the content that is loading. The region stays on the page, is marked busy,
		and keeps its heading so the layout does not jump.
	</p>
	<Stage
		align="stretch"
		code={`<section aria-labelledby="orders-title" aria-busy="true">
  <h3 id="orders-title">Recent orders</h3>
  <amb-spinner label="Loading recent orders"></amb-spinner>
</section>`}
	>
		<section class="panel" aria-labelledby="orders-title" aria-busy={loading}>
			<div class="panel-head">
				<h3 class="panel-title" id="orders-title">Recent orders</h3>
				<amb-button variant="secondary" size="sm" bind:this={reloadButton}>Reload</amb-button>
			</div>
			{#if loading}
				<div class="panel-wait">
					<amb-spinner label="Loading recent orders"></amb-spinner>
				</div>
			{:else}
				<ul class="orders">
					{#each orders as order}
						<li>
							<span class="order-id">{order.id}</span>
							<span class="order-customer">{order.customer}</span>
							<span class="order-total">{order.total}</span>
						</li>
					{/each}
				</ul>
			{/if}
		</section>
	</Stage>

	<h2 id="spinner-or-progress">Spinner or progress</h2>
	<p>
		Use a spinner when the length of the wait is unknown. When you can count the work, such as bytes or files,
		use <a href="/components/progress">progress</a> and show the amount.
	</p>
	<Stage
		code={`<amb-spinner label="Searching the archive"></amb-spinner>
<amb-progress value="40" max="100" label="Exporting 2,400 rows"></amb-progress>`}
	>
		<div class="compare">
			<div class="compare-item">
				<amb-spinner label="Searching the archive"></amb-spinner>
				<p class="compare-caption"><strong>Unknown length.</strong> Searching the archive.</p>
			</div>
			<div class="compare-item">
				<div class="compare-bar">
					<amb-progress value={40} max={100} label="Exporting 2,400 rows"></amb-progress>
				</div>
				<p class="compare-caption"><strong>Known length.</strong> 960 of 2,400 rows exported.</p>
			</div>
		</div>
	</Stage>
</ComponentPage>

<style>
	.panel {
		display: grid;
		gap: var(--amb-space-400);
		min-height: 14rem;
		padding: var(--amb-space-500);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-surface);
		align-content: start;
	}

	.panel-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--amb-space-300);
	}

	.panel-title {
		margin: 0;
		color: var(--amb-color-fg-default);
		font-size: var(--amb-font-size-500);
		font-weight: var(--amb-font-weight-semibold);
		line-height: var(--amb-font-line-height-tight);
	}

	.panel-wait {
		display: grid;
		place-items: center;
		min-height: 8rem;
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

	.compare {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: var(--amb-space-500);
		width: 100%;
	}

	.compare-item {
		display: grid;
		justify-items: center;
		align-content: center;
		gap: var(--amb-space-300);
		min-height: 8rem;
		padding: var(--amb-space-500);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-md);
		background: var(--amb-color-bg-surface);
	}

	.compare-bar {
		width: 100%;
	}

	.compare-caption {
		margin: 0;
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
		text-align: center;
	}

	.compare-caption strong {
		color: var(--amb-color-fg-default);
	}
</style>
