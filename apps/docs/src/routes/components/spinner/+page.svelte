<svelte:head>
	<title>Spinner — Ambre</title>
	<meta name="description" content="amb-spinner shows that content is loading." />
</svelte:head>

<p class="eyebrow">Components</p>
<h1>Spinner</h1>
<div class="stage-card">
	<p class="stage-label">amb-spinner</p>
	<amb-spinner label="Loading articles"></amb-spinner>
</div>
<p class="lede">Name the wait. Reduced motion stops the spin and leaves the mark visible.</p>
<pre><code>&lt;amb-spinner label="Loading articles"&gt;&lt;/amb-spinner&gt;</code></pre>
<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Tell assistive technology what is loading.</li>
		</ul>
	</section>
	<section class="note">
		<h2>Don't</h2>
		<ul>
			<li>Don't leave a spinner in place after the content has arrived.</li>
		</ul>
	</section>
</div>
