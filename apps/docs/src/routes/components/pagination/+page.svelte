<svelte:head>
	<title>Pagination — Ambre</title>
	<meta name="description" content="amb-pagination moves between pages of a list." />
</svelte:head>

<p class="eyebrow">Components</p>
<h1>Pagination</h1>
<div class="stage-card">
	<p class="stage-label">amb-pagination</p>
	<amb-pagination label="Article pages">
		<li><a href="/components/pagination">Previous</a></li>
		<li><a href="/components/pagination" aria-current="page">1</a></li>
		<li><a href="/components/pagination">2</a></li>
		<li><a href="/components/pagination">Next</a></li>
	</amb-pagination>
</div>
<p class="lede">Mark the current page with <code>aria-current="page"</code>.</p>
<pre><code>&lt;amb-pagination label="Article pages"&gt;
  &lt;li&gt;&lt;a href="/page/1" aria-current="page"&gt;1&lt;/a&gt;&lt;/li&gt;
&lt;/amb-pagination&gt;</code></pre>
<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Name the navigation when the page has more than one.</li>
		</ul>
	</section>
	<section class="note">
		<h2>Don't</h2>
		<ul>
			<li>Don't use pagination for a short set of peer views. Use tabs.</li>
		</ul>
	</section>
</div>
