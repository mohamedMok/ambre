<svelte:head>
	<title>Badge — Ambre</title>
	<meta name="description" content="amb-badge is a small status label. It is not a control." />
</svelte:head>

<p class="eyebrow">Components</p>
<h1>Badge</h1>
<div class="stage-card">
	<p class="stage-label">amb-badge</p>
	<div class="row">
		<amb-badge>Draft</amb-badge>
		<amb-badge variant="accent">New</amb-badge>
		<amb-badge variant="success">Saved</amb-badge>
		<amb-badge variant="danger">Failed</amb-badge>
	</div>
</div>
<p class="lede">A badge names a status. It does not start an action.</p>
<pre><code>&lt;amb-badge variant="success"&gt;Saved&lt;/amb-badge&gt;</code></pre>
<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Write the status in the slot. That text is the name.</li>
			<li>Pair a danger badge with words, not color alone.</li>
		</ul>
	</section>
	<section class="note">
		<h2>Don't</h2>
		<ul>
			<li>Don't make a badge clickable. Put the action on a button.</li>
		</ul>
	</section>
</div>
