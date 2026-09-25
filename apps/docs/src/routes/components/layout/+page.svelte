<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	const sections = ['Overview', 'Projects', 'Members', 'Billing', 'Settings'];
	const invoices = [
		{ id: '2026-114', client: 'Lumen', amount: '1,900 €' },
		{ id: '2026-113', client: 'Orbit', amount: '1,450 €' },
		{ id: '2026-112', client: 'Kiln', amount: '860 €' },
		{ id: '2026-111', client: 'Tessel', amount: '2,300 €' }
	];
</script>

{#snippet bar(title: string)}
	<div slot="header" class="bar">
		<span class="brand"><span class="mark" aria-hidden="true"></span>{title}</span>
		<span class="grow"></span>
		<amb-button size="sm" variant="secondary">Invite</amb-button>
	</div>
{/snippet}

<ComponentPage
	id="layout"
	heroAlign="stretch"
	heroCode={`<amb-layout variant="sidebar" label="Workspace">
  <div slot="header">…</div>
  <ul slot="nav">…</ul>
  <h1>Overview</h1>
  <p>Everything the workspace did this week.</p>
  <div slot="aside">…</div>
  <p slot="footer">© 2026 Northwind</p>
</amb-layout>`}
	usage={{
		do: [
			'Use one layout per page, as its outer frame. The default slot is the main landmark.',
			'Pick the variant from the work: <strong>sidebar</strong> for an app with many sections, <strong>split</strong> for a list and the item open beside it, <strong>stacked</strong> for reading.',
			'Name the navigation with <code>label</code> when the page has more than one.',
			'Let it answer its own width. It is a size container, so it also works inside a panel or a dialog.'
		],
		dont: [
			'Don’t nest layouts. Use a grid inside the main content.',
			'Don’t reorder the regions with CSS. The reading order is header, nav, main, aside, footer at every width.',
			'Don’t put the page title in the header slot. The header is the product bar; the title belongs to the main content.'
		]
	}}
>
	{#snippet hero()}
		<amb-layout class="demo" variant="sidebar" label="Workspace">
			{@render bar('Northwind')}
			<ul slot="nav" class="nav">
				{#each sections as item, index}
					<li><a href="#variants" aria-current={index === 0 ? 'page' : undefined}>{item}</a></li>
				{/each}
			</ul>
			<h3 class="title">Overview</h3>
			<ul class="stats">
				<li><amb-stat-tile trend="up" sentiment="positive">Revenue <span slot="value">48,210 €</span> <span slot="delta">12% up</span></amb-stat-tile></li>
				<li><amb-stat-tile>Open invoices <span slot="value">14</span> <span slot="description">3 overdue</span></amb-stat-tile></li>
			</ul>
			<div slot="aside" class="aside">
				<strong>Activity</strong>
				<p>Ada invited two people.</p>
				<p>Invoice 2026-114 was paid.</p>
			</div>
			<p slot="footer">© 2026 Northwind · Privacy · Terms</p>
		</amb-layout>
	{/snippet}

	<h2 id="variants">Three layouts</h2>

	<h3 id="split">Split</h3>
	<p>
		A list pane and a detail pane of real weight, for mail, tickets, invoices, or conversations. The list is the
		navigation, and the open item is the main content.
	</p>
	<Stage
		align="stretch"
		padding="none"
		code={`<amb-layout variant="split" label="Invoices">
  <div slot="header">…</div>
  <ul slot="nav">…</ul>
  <h1>Invoice 2026-114</h1>
  …
</amb-layout>`}
	>
		<amb-layout class="demo" variant="split" label="Invoices">
			{@render bar('Invoices')}
			<ul slot="nav" class="list">
				{#each invoices as invoice, index}
					<li>
						<a href="#split" aria-current={index === 0 ? 'page' : undefined}>
							<span>{invoice.id} · {invoice.client}</span>
							<span class="amount">{invoice.amount}</span>
						</a>
					</li>
				{/each}
			</ul>
			<h3 class="title">Invoice 2026-114</h3>
			<p class="muted">Lumen · Issued on 24 September · Due in 30 days</p>
			<div class="row">
				<amb-badge variant="success">Paid</amb-badge>
				<amb-button size="sm" variant="secondary">Download PDF</amb-button>
			</div>
		</amb-layout>
	</Stage>

	<h3 id="stacked">Stacked</h3>
	<p>
		One centered reading column under the header, with the navigation in a row. For guides, articles, a changelog,
		or a marketing page. The bars run full bleed and their content lines up with the text.
	</p>
	<Stage
		align="stretch"
		padding="none"
		code={`<amb-layout variant="stacked">
  <div slot="header">…</div>
  <div slot="nav">…</div>
  <h1>Ship the first brand</h1>
  <p>…</p>
  <p slot="footer">© 2026 Northwind</p>
</amb-layout>`}
	>
		<amb-layout class="demo" variant="stacked" label="Guides">
			{@render bar('Northwind guides')}
			<ul slot="nav" class="tabs">
				<li><a href="#stacked" aria-current="page">Guides</a></li>
				<li><a href="#stacked">Changelog</a></li>
				<li><a href="#stacked">Pricing</a></li>
			</ul>
			<h3 class="title large">Ship the first brand</h3>
			<p class="muted">A preset is one file. Load it, and every component follows: color, type, space, shape, and motion.</p>
			<p slot="footer">© 2026 Northwind</p>
		</amb-layout>
	</Stage>

	<h2 id="responsive">Narrow widths</h2>
	<p>
		Under 34rem of its own width, every variant becomes one column in the source order. From 60rem, the aside of the
		sidebar and split layouts opens as a third column. The sidebar and the aside stay in view while the page scrolls.
	</p>
</ComponentPage>

<style>
	.demo {
		min-height: 26rem;
		border-radius: var(--amb-radius-lg);
		overflow: hidden;
	}

	.bar {
		display: flex;
		align-items: center;
		gap: var(--amb-space-300);
		width: 100%;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: var(--amb-space-200);
		font-weight: var(--amb-font-weight-semibold);
	}

	.mark {
		width: 18px;
		height: 18px;
		border-radius: 6px;
		background: var(--amb-color-accent-bg);
	}

	.grow {
		flex: 1;
	}

	.nav,
	.list,
	.tabs,
	.stats {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.nav,
	.list {
		display: grid;
		gap: 2px;
	}

	.nav a,
	.list a,
	.tabs a {
		display: flex;
		justify-content: space-between;
		gap: var(--amb-space-300);
		padding: var(--amb-space-200) var(--amb-space-300);
		border-radius: var(--amb-radius-md);
		color: var(--amb-color-fg-default);
		text-decoration: none;
	}

	.nav a:hover,
	.list a:hover,
	.tabs a:hover {
		background: var(--amb-color-bg-subtle);
	}

	.nav a[aria-current],
	.list a[aria-current],
	.tabs a[aria-current] {
		background: color-mix(in oklab, var(--amb-color-accent-fg) 12%, var(--amb-color-bg-surface));
		color: var(--amb-color-accent-fg);
		font-weight: var(--amb-font-weight-semibold);
	}

	.amount {
		color: var(--amb-color-fg-muted);
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}

	.tabs {
		display: flex;
		flex-wrap: wrap;
		gap: var(--amb-space-100);
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
		gap: var(--amb-space-300);
	}

	.title {
		margin: 0 0 var(--amb-space-300);
		font-size: var(--amb-font-size-600);
		line-height: var(--amb-font-line-height-tight);
	}

	.title.large {
		font-size: var(--amb-font-size-700);
	}

	.muted,
	.aside p {
		margin: 0 0 var(--amb-space-300);
		color: var(--amb-color-fg-muted);
	}

	.aside strong {
		display: block;
		margin-bottom: var(--amb-space-200);
		color: var(--amb-color-fg-default);
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--amb-space-300);
	}

	[slot='footer'] {
		margin: 0;
	}
</style>
