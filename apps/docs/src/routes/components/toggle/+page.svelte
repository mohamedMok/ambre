<svelte:head>
	<title>Toggle — Ambre</title>
	<meta name="description" content="amb-toggle is a switch. The slotted text is the label." />
</svelte:head>

<p class="eyebrow">Components</p>
<h1>Toggle</h1>
<div class="stage-card">
	<p class="stage-label">amb-toggle</p>
	<amb-toggle name="alerts" checked>Email alerts</amb-toggle>
	<amb-toggle name="digest">Weekly digest</amb-toggle>
</div>
<p class="lede">Use a toggle for an immediate on or off state. Space changes it.</p>
<pre><code>&lt;amb-toggle name="alerts" checked&gt;Email alerts&lt;/amb-toggle&gt;</code></pre>
<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Name the thing that turns on, not the word on.</li>
			<li>Save the change when the switch moves, or place it in a form.</li>
		</ul>
	</section>
	<section class="note">
		<h2>Don't</h2>
		<ul>
			<li>Don't use a toggle for a choice that needs a submit to make sense. Use a checkbox.</li>
			<li>Don't rely on color alone. The thumb moves.</li>
		</ul>
	</section>
</div>
