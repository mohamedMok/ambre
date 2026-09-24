<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';
</script>

<ComponentPage
	id="breadcrumbs"
	heroCode={`<amb-breadcrumbs>
  <li><a href="/">Home</a></li>
  <li><a href="/components">Components</a></li>
  <li>Breadcrumbs</li>
</amb-breadcrumbs>`}
	usage={{
		do: [
			'Start at the top of the hierarchy, such as <strong>Home</strong>, and end with the current page.',
			'Use the same words as the page titles, so each crumb matches the heading it leads to.',
			'Place the trail above the page heading, before the main content.'
		],
		dont: [
			'Don’t link the last item. It is the page the person is on, and it gets <code>aria-current="page"</code>.',
			'Don’t use breadcrumbs for the steps of a flow, such as a checkout. Use a step indicator with progress.',
			'Don’t show a trail on a page with one level, such as the home page.'
		]
	}}
>
	{#snippet hero()}
		<amb-breadcrumbs>
			<li><a href="/">Home</a></li>
			<li><a href="/components">Components</a></li>
			<li>Breadcrumbs</li>
		</amb-breadcrumbs>
	{/snippet}

	<h2 id="in-a-page-header">In a page header</h2>
	<p>
		The trail sits directly above the heading. The last crumb and the heading say the same thing, so the page
		reads as one unit.
	</p>
	<Stage
		align="stretch"
		code={`<header>
  <amb-breadcrumbs>
    <li><a href="/">Home</a></li>
    <li><a href="/foundations">Foundations</a></li>
    <li>Color</li>
  </amb-breadcrumbs>
  <h1>Color</h1>
  <p>Semantic decisions for two themes.</p>
</header>`}
	>
		<div class="page-header">
			<amb-breadcrumbs>
				<li><a href="/">Home</a></li>
				<li><a href="/foundations">Foundations</a></li>
				<li>Color</li>
			</amb-breadcrumbs>
			<h3 class="page-title">Color</h3>
			<p class="page-lede">Semantic decisions for two themes. The palette stays in the token files.</p>
		</div>
	</Stage>

	<h2 id="depth">Depth</h2>
	<p>
		Show every level between the top and the current page. Two to five crumbs read well. A deeper product
		usually needs a flatter structure, not a longer trail.
	</p>
	<Stage
		align="start"
		code={`<amb-breadcrumbs>
  <li><a href="/">Home</a></li>
  <li>Get started</li>
</amb-breadcrumbs>

<amb-breadcrumbs>
  <li><a href="/">Home</a></li>
  <li><a href="/foundations">Foundations</a></li>
  <li><a href="/foundations/accessibility">Accessibility</a></li>
  <li>Contrast pairs</li>
</amb-breadcrumbs>`}
	>
		<div class="depths">
			<amb-breadcrumbs>
				<li><a href="/">Home</a></li>
				<li>Get started</li>
			</amb-breadcrumbs>
			<amb-breadcrumbs>
				<li><a href="/">Home</a></li>
				<li><a href="/foundations">Foundations</a></li>
				<li><a href="/foundations/accessibility">Accessibility</a></li>
				<li>Contrast pairs</li>
			</amb-breadcrumbs>
		</div>
	</Stage>
</ComponentPage>

<style>
	.page-header {
		display: grid;
		gap: var(--amb-space-300);
		padding: var(--amb-space-500);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-surface);
	}

	.page-title {
		margin: var(--amb-space-200) 0 0;
		color: var(--amb-color-fg-default);
		font-size: var(--amb-font-size-700);
		font-weight: var(--amb-font-weight-semibold);
		line-height: var(--amb-font-line-height-tight);
	}

	.page-lede {
		margin: 0;
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-400);
	}

	.depths {
		display: grid;
		gap: var(--amb-space-500);
	}
</style>
