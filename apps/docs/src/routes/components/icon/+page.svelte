<svelte:head>
	<title>Icon — Ambre</title>
	<meta name="description" content="amb-icon sizes a graphic. Leave the label empty when the icon is decorative." />
</svelte:head>

<p class="eyebrow">Components</p>
<h1>Icon</h1>
<div class="stage-card">
	<p class="stage-label">amb-icon</p>
	<div class="row">
		<amb-icon name="favorite" label="Favorite"></amb-icon>
		<amb-icon name="search" label="Search"></amb-icon>
		<amb-icon name="settings" size="lg" label="Settings"></amb-icon>
	</div>
</div>
<p class="lede">
	Set <code>name</code> to any Material Symbols Outlined ligature. Load the font in the product.
	Leave <code>name</code> empty and slot an SVG when you need a different drawing.
</p>

<pre><code>&lt;amb-icon name="favorite" label="Favorite"&gt;&lt;/amb-icon&gt;</code></pre>

<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Leave <code>label</code> empty when nearby text already names the action.</li>
			<li>Set <code>label</code> when the graphic is the only meaning.</li>
			<li>Use a ligature name from Material Symbols Outlined, such as <code>favorite</code>.</li>
			<li>Use <code>currentColor</code> on a slotted SVG so it follows the text color.</li>
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
