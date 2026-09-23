<svelte:head>
	<title>Tooltip — Ambre</title>
	<meta name="description" content="amb-tooltip describes a control on hover and focus." />
</svelte:head>

<p class="eyebrow">Components</p>
<h1>Tooltip</h1>
<div class="stage-card">
	<p class="stage-label">amb-tooltip</p>
	<amb-tooltip text="Saves the draft on this page">
		<amb-button variant="secondary">Save</amb-button>
	</amb-tooltip>
</div>
<p class="lede">The tip appears on hover and on focus. Escape hides it. It does not contain an action.</p>
<pre><code>&lt;amb-tooltip text="Saves the draft on this page"&gt;
  &lt;amb-button variant="secondary"&gt;Save&lt;/amb-button&gt;
&lt;/amb-tooltip&gt;</code></pre>
<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Keep the text short. The control already has a visible name.</li>
		</ul>
	</section>
	<section class="note">
		<h2>Don't</h2>
		<ul>
			<li>Don't put essential instructions only in the tip.</li>
			<li>Don't put a button inside the tip. Use a dialog.</li>
		</ul>
	</section>
</div>
