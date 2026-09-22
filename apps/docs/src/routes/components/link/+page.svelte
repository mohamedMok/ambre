<svelte:head>
	<title>Link — Ambre</title>
	<meta name="description" content="amb-link goes somewhere. Use a button to start an action." />
</svelte:head>

<p class="eyebrow">Components</p>
<h1>Link</h1>
<div class="stage-card">
	<p class="stage-label">amb-link</p>
	<p>
		Read the <amb-link href="/foundations/color">color decisions</amb-link>
		or take the <amb-link href="/get-started" variant="quiet">quiet path</amb-link>.
	</p>
	<p>
		<amb-link href="https://github.com/mohamedMok/ambre" external>Repository</amb-link>
	</p>
</div>
<p class="lede">Use a link to go somewhere. Use a button to start an action.</p>

<pre><code>&lt;amb-link href="/account"&gt;Account&lt;/amb-link&gt;
&lt;amb-link href="https://github.com/mohamedMok/ambre" external&gt;Repository&lt;/amb-link&gt;</code></pre>

<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Write the destination as the label. The slot is the accessible name.</li>
			<li>Set <code>href</code>. A link without one does not go anywhere.</li>
			<li>Use <code>external</code> when the destination leaves the product.</li>
		</ul>
	</section>
	<section class="note">
		<h2>Don't</h2>
		<ul>
			<li>Don't use a link to submit a form.</li>
			<li>Don't stretch an inline link up to a button height.</li>
			<li>Don't hide the only name in a tooltip.</li>
		</ul>
	</section>
</div>
