<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	const invoices = [
		{ id: 'INV-1042', client: 'Harbor Studio', amount: '€1,200.00', status: 'Paid', variant: 'success' },
		{ id: 'INV-1043', client: 'North & Pine', amount: '€860.00', status: 'Overdue', variant: 'danger' },
		{ id: 'INV-1044', client: 'Atelier Brun', amount: '€2,450.00', status: 'Sent', variant: 'accent' },
		{ id: 'INV-1045', client: 'Mill Lane Bakery', amount: '€310.00', status: 'Draft', variant: 'neutral' }
	] as const;
</script>

<ComponentPage
	id="badge"
	heroCode={`<amb-badge>Draft</amb-badge>
<amb-badge variant="accent">Sent</amb-badge>
<amb-badge variant="success">Paid</amb-badge>
<amb-badge variant="danger">Overdue</amb-badge>`}
	usage={{
		do: [
			'Write the status as one or two words in the slot, such as <strong>Paid</strong> or <strong>Needs review</strong>. The text is the name.',
			'Map each variant to one meaning and keep it across the product: <code>success</code> for done, <code>danger</code> for a problem that needs action.',
			'Place the badge next to the object it describes, on the same line as its name.'
		],
		dont: [
			'Don’t make a badge clickable. Put the action on a button or a link beside it.',
			'Don’t rely on the color. <strong>Overdue</strong> in red and <strong>Paid</strong> in green must still read as words.',
			'Don’t use a badge for a topic or a category. Use a tag.'
		]
	}}
>
	{#snippet hero()}
		<amb-badge>Draft</amb-badge>
		<amb-badge variant="accent">Sent</amb-badge>
		<amb-badge variant="success">Paid</amb-badge>
		<amb-badge variant="danger">Overdue</amb-badge>
	{/snippet}

	<h2 id="variants">Variants</h2>
	<p>
		The variant sets the color. The words carry the meaning, so each badge reads the same in any brand, in
		dark mode, and in forced colors.
	</p>
	<div class="table-wrap">
		<table class="api">
			<thead>
				<tr><th scope="col">Variant</th><th scope="col">Use it for</th><th scope="col">Example</th></tr>
			</thead>
			<tbody>
				<tr>
					<th scope="row"><code>neutral</code></th>
					<td>A state with no judgment, such as a draft or an archived item.</td>
					<td><amb-badge>Draft</amb-badge></td>
				</tr>
				<tr>
					<th scope="row"><code>accent</code></th>
					<td>A state that is new or in progress.</td>
					<td><amb-badge variant="accent">Sent</amb-badge></td>
				</tr>
				<tr>
					<th scope="row"><code>success</code></th>
					<td>A task that is finished or a check that passed.</td>
					<td><amb-badge variant="success">Paid</amb-badge></td>
				</tr>
				<tr>
					<th scope="row"><code>danger</code></th>
					<td>A problem that needs someone to act.</td>
					<td><amb-badge variant="danger">Overdue</amb-badge></td>
				</tr>
			</tbody>
		</table>
	</div>

	<h2 id="in-a-list">In a list</h2>
	<p>
		A badge lets someone scan a list for the rows that need attention. Keep it in the same column on every row,
		and keep the action on the row itself.
	</p>
	<Stage
		align="stretch"
		code={`<ul class="invoices">
  <li>
    <span class="invoice-id">INV-1042</span>
    <span class="invoice-client">Harbor Studio</span>
    <span class="invoice-amount">€1,200.00</span>
    <amb-badge variant="success">Paid</amb-badge>
  </li>
  <li>
    <span class="invoice-id">INV-1043</span>
    <span class="invoice-client">North &amp; Pine</span>
    <span class="invoice-amount">€860.00</span>
    <amb-badge variant="danger">Overdue</amb-badge>
  </li>
  <!-- … -->
</ul>`}
	>
		<ul class="invoices" aria-label="Invoices">
			{#each invoices as invoice}
				<li>
					<span class="invoice-id">{invoice.id}</span>
					<span class="invoice-client">{invoice.client}</span>
					<span class="invoice-amount">{invoice.amount}</span>
					<span class="invoice-status"><amb-badge variant={invoice.variant}>{invoice.status}</amb-badge></span>
				</li>
			{/each}
		</ul>
	</Stage>

	<h2 id="with-a-title">Next to a title</h2>
	<p>
		Put the badge after the name it qualifies. Assistive technology reads it as part of the same line, such as
		“Quarterly report, Needs review”.
	</p>
	<Stage
		code={`<h3>Quarterly report <amb-badge variant="accent">Needs review</amb-badge></h3>
<p>Updated 2 hours ago by Lena Ortiz</p>`}
	>
		<div class="doc-card">
			<h3 class="doc-card-title">Quarterly report <amb-badge variant="accent">Needs review</amb-badge></h3>
			<p class="doc-card-meta">Updated 2 hours ago by Lena Ortiz</p>
		</div>
	</Stage>
</ComponentPage>

<style>
	.invoices {
		display: grid;
		width: 100%;
		margin: 0;
		padding: 0;
		overflow: hidden;
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-md);
		background: var(--amb-color-bg-surface);
		list-style: none;
	}

	.invoices li {
		display: grid;
		grid-template-columns: 6rem minmax(0, 1fr) auto 6.5rem;
		align-items: center;
		gap: var(--amb-space-400);
		margin: 0;
		padding: var(--amb-space-300) var(--amb-space-400);
		color: var(--amb-color-fg-default);
		font-size: var(--amb-font-size-200);
	}

	.invoices li + li {
		border-top: var(--amb-border-width-default) solid var(--amb-color-bg-muted);
	}

	.invoice-id {
		color: var(--amb-color-fg-subtle);
		font-family: var(--amb-font-family-mono);
	}

	.invoice-client {
		font-weight: var(--amb-font-weight-semibold);
	}

	.invoice-amount {
		font-variant-numeric: tabular-nums;
		text-align: end;
	}

	.invoice-status {
		justify-self: end;
	}

	@media (max-width: 560px) {
		.invoices li {
			grid-template-columns: minmax(0, 1fr) auto;
		}

		.invoice-id {
			grid-column: 1 / -1;
		}
	}

	.doc-card {
		width: min(100%, 24rem);
		padding: var(--amb-space-400) var(--amb-space-500);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-md);
		background: var(--amb-color-bg-surface);
	}

	.doc-card-title {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--amb-space-200);
		margin: 0;
		color: var(--amb-color-fg-default);
		font-size: var(--amb-font-size-400);
		font-weight: var(--amb-font-weight-semibold);
		line-height: var(--amb-font-line-height-tight);
	}

	.doc-card-meta {
		margin: var(--amb-space-200) 0 0;
		color: var(--amb-color-fg-subtle);
		font-size: var(--amb-font-size-200);
	}
</style>
