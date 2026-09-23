<svelte:head>
	<title>Progress — Ambre</title>
	<meta name="description" content="amb-progress shows how much of a task is finished." />
</svelte:head>

<p class="eyebrow">Components</p>
<h1>Progress</h1>
<div class="stage-card">
	<p class="stage-label">amb-progress</p>
	<amb-progress value={64} max={100} label="Upload"></amb-progress>
</div>
<p class="lede">Name the task with <code>label</code>. The value is how far it has gone.</p>
<pre><code>&lt;amb-progress value="64" max="100" label="Upload"&gt;&lt;/amb-progress&gt;</code></pre>
<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Update the value as the task moves.</li>
		</ul>
	</section>
	<section class="note">
		<h2>Don't</h2>
		<ul>
			<li>Don't use progress when you cannot measure the task. Use a spinner.</li>
		</ul>
	</section>
</div>
