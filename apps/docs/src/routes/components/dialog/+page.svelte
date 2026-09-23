<script lang="ts">
	let dialog = $state<HTMLElement & { open: boolean }>();

	function show() {
		if (dialog) dialog.open = true;
	}
</script>

<svelte:head>
	<title>Dialog — Ambre</title>
	<meta name="description" content="amb-dialog is a modal conversation. Escape closes it." />
</svelte:head>

<p class="eyebrow">Components</p>
<h1>Dialog</h1>
<div class="stage-card">
	<p class="stage-label">amb-dialog</p>
	<button class="action" type="button" onclick={show}>Open dialog</button>
	<amb-dialog bind:this={dialog} label="Save the draft">
		<p>The draft stays on this page until you confirm.</p>
		<span slot="close">Close</span>
	</amb-dialog>
</div>
<p class="lede">Open it from a button. Escape, the backdrop, and the close button dismiss it and return focus.</p>
<pre><code>&lt;amb-dialog open label="Save the draft"&gt;
  &lt;p&gt;The draft stays on this page until you confirm.&lt;/p&gt;
  &lt;span slot="close"&gt;Close&lt;/span&gt;
&lt;/amb-dialog&gt;</code></pre>
<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Name the dialog with <code>label</code>.</li>
			<li>Write the close control in the close slot.</li>
		</ul>
	</section>
	<section class="note">
		<h2>Don't</h2>
		<ul>
			<li>Don't open a dialog on page load.</li>
		</ul>
	</section>
</div>
