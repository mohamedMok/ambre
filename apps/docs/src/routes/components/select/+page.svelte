<script lang="ts">
	import { storybookUrl } from '$lib/site';
</script>

<svelte:head>
	<title>Select — Ambre</title>
	<meta name="description" content="amb-select chooses one option. The slotted text is the label." />
</svelte:head>

<p class="eyebrow">Components</p>
<h1>Select</h1>
<div class="stage-card">
	<p class="stage-label">amb-select</p>
	<div class="form-stack">
		<amb-select name="country" required>
			Country
			<option value="">Choose a country</option>
			<option value="fr">France</option>
			<option value="jp">Japan</option>
		</amb-select>
		<amb-select name="language" disabled>
			Language
			<option value="en">English</option>
			<option value="fr">French</option>
		</amb-select>
	</div>
</div>
<p class="lede">Choose one option. The slotted text is the label. Child option elements are the choices.</p>

<pre><code>&lt;amb-select name="country" required&gt;
  Country
  &lt;option value=""&gt;Choose a country&lt;/option&gt;
  &lt;option value="fr"&gt;France&lt;/option&gt;
&lt;/amb-select&gt;</code></pre>

<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Write the label as text in the element. Keep each choice in an <code>option</code>.</li>
			<li>Start a required select with an empty option so the form can fail honestly.</li>
			<li>Use a select when the list is long enough that radios would crowd the page.</li>
		</ul>
	</section>
	<section class="note">
		<h2>Don't</h2>
		<ul>
			<li>Don't put the choices in the label text.</li>
			<li>Don't use a select for two or three exclusive choices. Use radios.</li>
			<li>Don't omit the label because the first option explains the field.</li>
		</ul>
	</section>
</div>
<p class="lede">
	<a href={storybookUrl} target="_blank" rel="noreferrer">Open Storybook</a> to inspect the list, a required field, and disabled.
</p>
