<script lang="ts">
	import { storybookUrl } from '$lib/site';
</script>

<svelte:head>
	<title>Radio — Ambre</title>
	<meta name="description" content="amb-radio selects one choice in a named group." />
</svelte:head>

<p class="eyebrow">Components</p>
<h1>Radio</h1>
<div class="stage-card">
	<p class="stage-label">amb-radio</p>
	<fieldset class="choice-group">
		<legend>Plan</legend>
		<amb-radio name="plan" value="annual" checked required>Annual</amb-radio>
		<amb-radio name="plan" value="monthly" required>Monthly</amb-radio>
		<amb-radio name="plan" value="weekly" disabled>Weekly</amb-radio>
	</fieldset>
</div>
<p class="lede">Select one choice in a named group. Arrow keys move the selection. Tab enters and leaves the group.</p>

<pre><code>&lt;fieldset&gt;
  &lt;legend&gt;Plan&lt;/legend&gt;
  &lt;amb-radio name="plan" value="annual"&gt;Annual&lt;/amb-radio&gt;
  &lt;amb-radio name="plan" value="monthly"&gt;Monthly&lt;/amb-radio&gt;
&lt;/fieldset&gt;</code></pre>

<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Group the radios in a fieldset with a legend.</li>
			<li>Give every radio in the group the same <code>name</code> and its own <code>value</code>.</li>
			<li>Keep one radio in the tab order. Arrow keys move through the rest.</li>
		</ul>
	</section>
	<section class="note">
		<h2>Don't</h2>
		<ul>
			<li>Don't put each radio in its own fieldset.</li>
			<li>Don't mark a single radio <code>required</code> and leave its peers optional.</li>
			<li>Don't use radios when more than one choice can be selected.</li>
		</ul>
	</section>
</div>
<p class="lede">
	<a href={storybookUrl} target="_blank" rel="noreferrer">Open Storybook</a> to inspect a group, a selection, and a disabled choice.
</p>
