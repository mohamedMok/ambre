<svelte:head>
	<title>Tabs — Ambre</title>
	<meta name="description" content="amb-tabs switches panels. Arrow keys move the selection." />
</svelte:head>

<p class="eyebrow">Components</p>
<h1>Tabs</h1>
<div class="stage-card">
	<p class="stage-label">amb-tabs</p>
	<amb-tabs>
		<button slot="tab" type="button">Tokens</button>
		<button slot="tab" type="button">Components</button>
		<button slot="tab" type="button" disabled>Packs</button>
		<div slot="panel"><p>A brand is one preset of the same tokens.</p></div>
		<div slot="panel"><p>The markup stays still when the brand changes.</p></div>
		<div slot="panel"><p>Domain packs wait for a second product.</p></div>
	</amb-tabs>
</div>
<p class="lede">Each tab is a button. Each panel is the matching region. Arrow keys move, and Home and End jump.</p>
<pre><code>&lt;amb-tabs&gt;
  &lt;button slot="tab" type="button"&gt;Tokens&lt;/button&gt;
  &lt;div slot="panel"&gt;A brand is one preset.&lt;/div&gt;
&lt;/amb-tabs&gt;</code></pre>
<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Keep the tab label short.</li>
			<li>Disable a tab that has no panel yet.</li>
		</ul>
	</section>
	<section class="note">
		<h2>Don't</h2>
		<ul>
			<li>Don't use tabs for a linear step. Use a button that continues.</li>
		</ul>
	</section>
</div>
