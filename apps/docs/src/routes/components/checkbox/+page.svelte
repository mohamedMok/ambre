<script lang="ts">
	import { storybookUrl } from '$lib/site';
</script>

<svelte:head>
	<title>Checkbox — Ambre</title>
	<meta name="description" content="amb-checkbox selects a choice that can stand alone." />
</svelte:head>

<p class="eyebrow">Components</p>
<h1>Checkbox</h1>
<div class="stage-card">
	<p class="stage-label">amb-checkbox</p>
	<div class="form-stack">
		<amb-checkbox name="updates" checked>Send product updates</amb-checkbox>
		<amb-checkbox name="terms" required>I agree to the terms</amb-checkbox>
		<amb-checkbox name="saved" disabled>Saved to this device</amb-checkbox>
	</div>
</div>
<p class="lede">Select a choice that can stand alone. A checked box joins the nearest form with its value.</p>

<pre><code>&lt;amb-checkbox name="updates" value="on"&gt;Send product updates&lt;/amb-checkbox&gt;</code></pre>

<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Write the choice in the slot. The label wraps the box, so the text is part of the target.</li>
			<li>Leave the value at <code>on</code> unless the submitted token should say something else.</li>
			<li>Use a checkbox when the choice can be on or off by itself.</li>
		</ul>
	</section>
	<section class="note">
		<h2>Don't</h2>
		<ul>
			<li>Don't use a checkbox for a set of exclusive choices. Use a radio group.</li>
			<li>Don't hide the label and keep only the box.</li>
			<li>Don't rely on an unchecked box to submit a value. It stays out of the form data.</li>
		</ul>
	</section>
</div>
<p class="lede">
	<a href={storybookUrl} target="_blank" rel="external noreferrer">Open Storybook</a> to inspect checked, required, and disabled.
</p>
