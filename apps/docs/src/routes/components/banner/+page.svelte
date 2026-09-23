<svelte:head>
	<title>Banner — Ambre</title>
	<meta name="description" content="amb-banner is a page-level status message." />
</svelte:head>

<p class="eyebrow">Components</p>
<h1>Banner</h1>
<div class="stage-card">
	<p class="stage-label">amb-banner</p>
	<amb-banner>The library is ready to install.</amb-banner>
	<amb-banner variant="success">Changes saved.</amb-banner>
	<amb-banner variant="danger">The save did not finish. Try again.</amb-banner>
</div>
<p class="lede">A banner announces itself. Do not also move focus to it.</p>
<pre><code>&lt;amb-banner variant="danger"&gt;The save did not finish. Try again.&lt;/amb-banner&gt;</code></pre>
<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Say what happened and what to do next.</li>
		</ul>
	</section>
	<section class="note">
		<h2>Don't</h2>
		<ul>
			<li>Don't use a banner for a field error. Keep that next to the field.</li>
		</ul>
	</section>
</div>
