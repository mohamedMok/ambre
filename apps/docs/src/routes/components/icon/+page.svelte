<svelte:head>
	<title>Icon — Ambre</title>
	<meta name="description" content="amb-icon sizes a graphic. Leave the label empty when the icon is decorative." />
</svelte:head>

<p class="eyebrow">Components</p>
<h1>Icon</h1>
<div class="stage-card">
	<p class="stage-label">amb-icon</p>
	<div class="row">
		<amb-icon size="sm" label="Add">
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z" /></svg>
		</amb-icon>
		<amb-icon size="md" label="Add">
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z" /></svg>
		</amb-icon>
		<amb-icon size="lg" label="Add">
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z" /></svg>
		</amb-icon>
	</div>
</div>
<p class="lede">Size a graphic with the icon box. Ambre does not ship an icon set. You bring the SVG.</p>

<pre><code>&lt;amb-icon label="Add"&gt;
  &lt;svg viewBox="0 0 24 24" aria-hidden="true"&gt;...&lt;/svg&gt;
&lt;/amb-icon&gt;</code></pre>

<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Leave <code>label</code> empty when nearby text already names the action.</li>
			<li>Set <code>label</code> when the graphic is the only meaning.</li>
			<li>Use <code>currentColor</code> so the icon follows the text color.</li>
		</ul>
	</section>
	<section class="note">
		<h2>Don't</h2>
		<ul>
			<li>Don't make an icon the only content of a button.</li>
			<li>Don't use a 16px icon as its own hit target.</li>
			<li>Don't add a <code>&lt;title&gt;</code> in the SVG when <code>label</code> is set.</li>
		</ul>
	</section>
</div>
