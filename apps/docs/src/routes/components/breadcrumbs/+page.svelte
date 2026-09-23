<svelte:head>
	<title>Breadcrumbs — Ambre</title>
	<meta name="description" content="amb-breadcrumbs shows the path back. The last item is the current page." />
</svelte:head>

<p class="eyebrow">Components</p>
<h1>Breadcrumbs</h1>
<div class="stage-card">
	<p class="stage-label">amb-breadcrumbs</p>
	<amb-breadcrumbs>
		<li><a href="/">Home</a></li>
		<li><a href="/components">Components</a></li>
		<li>Breadcrumbs</li>
	</amb-breadcrumbs>
</div>
<p class="lede">Earlier items are links. The last item is the current page, and it is not a link.</p>
<pre><code>&lt;amb-breadcrumbs&gt;
  &lt;li&gt;&lt;a href="/"&gt;Home&lt;/a&gt;&lt;/li&gt;
  &lt;li&gt;Breadcrumbs&lt;/li&gt;
&lt;/amb-breadcrumbs&gt;</code></pre>
<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Start from the home of the product.</li>
		</ul>
	</section>
	<section class="note">
		<h2>Don't</h2>
		<ul>
			<li>Don't link the current page.</li>
		</ul>
	</section>
</div>
