<svelte:head>
	<title>Disclosure — Ambre</title>
	<meta name="description" content="amb-disclosure shows or hides a region. The button label is the accessible name." />
</svelte:head>

<p class="eyebrow">Components</p>
<h1>Disclosure</h1>
<div class="stage-card">
	<p class="stage-label">amb-disclosure</p>
	<amb-disclosure open>
		Shipping
		<p slot="panel">Arrives in two days. The panel stays in the HTML while it is closed.</p>
	</amb-disclosure>
	<div class="row" style:margin-top="var(--amb-space-400)">
		<amb-disclosure>
			Returns
			<p slot="panel">Send it back within thirty days.</p>
		</amb-disclosure>
		<amb-disclosure disabled>
			Unavailable
			<p slot="panel">This region cannot be opened.</p>
		</amb-disclosure>
	</div>
</div>
<p class="lede">Use a disclosure to show a region on demand. The button names the region.</p>

<pre><code>&lt;amb-disclosure&gt;
  Shipping
  &lt;p slot="panel"&gt;Arrives in two days.&lt;/p&gt;
&lt;/amb-disclosure&gt;</code></pre>

<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Name the button with the subject of the region.</li>
			<li>Put the extra content in the <code>panel</code> slot.</li>
			<li>Start closed unless the region is the point of the page.</li>
		</ul>
	</section>
	<section class="note">
		<h2>Don't</h2>
		<ul>
			<li>Don't hide the only copy of a required task inside a closed panel.</li>
			<li>Don't use it for navigation. A link goes somewhere.</li>
			<li>Don't put a second button in the label slot.</li>
		</ul>
	</section>
</div>
