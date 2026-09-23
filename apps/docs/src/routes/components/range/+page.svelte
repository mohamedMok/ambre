<svelte:head>
	<title>Range — Ambre</title>
	<meta name="description" content="amb-range chooses a number. The slotted text is the label." />
</svelte:head>

<p class="eyebrow">Components</p>
<h1>Range</h1>
<div class="stage-card">
	<p class="stage-label">amb-range</p>
	<amb-range name="volume" value={40} min={0} max={100}>Volume</amb-range>
</div>
<p class="lede">Use a range when the number is a position between two ends. Arrow keys step the value.</p>
<pre><code>&lt;amb-range name="volume" value="40" min="0" max="100"&gt;Volume&lt;/amb-range&gt;</code></pre>
<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Show the current number next to the label when the exact value matters.</li>
			<li>Keep the step large enough to hit the target.</li>
		</ul>
	</section>
	<section class="note">
		<h2>Don't</h2>
		<ul>
			<li>Don't use a range for a short list of named options. Use a select or radios.</li>
		</ul>
	</section>
</div>
