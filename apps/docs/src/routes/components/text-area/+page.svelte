<svelte:head>
	<title>Text area — Ambre</title>
	<meta name="description" content="amb-text-area collects several lines. The slotted text is the label." />
</svelte:head>

<p class="eyebrow">Components</p>
<h1>Text area</h1>
<div class="stage-card">
	<p class="stage-label">amb-text-area</p>
	<amb-text-area name="note" rows={4} placeholder="What changed?">Note</amb-text-area>
</div>
<p class="lede">Use a text area when the answer needs more than one line. The slot is the label.</p>
<pre><code>&lt;amb-text-area name="note" rows="4"&gt;Note&lt;/amb-text-area&gt;</code></pre>
<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Keep the label visible. A placeholder is not a name.</li>
			<li>Let the person resize the field.</li>
		</ul>
	</section>
	<section class="note">
		<h2>Don't</h2>
		<ul>
			<li>Don't use it for a single short value. Use a text field.</li>
			<li>Don't hide the validation message until submit fails.</li>
		</ul>
	</section>
</div>
